import test from "node:test";
import assert from "node:assert/strict";
import { getPrices, find, cost, cheapest } from "../src/index.js";

const body = {
  name: "Codifly — AI model API prices", reviewed_at: "2026-10-17", license: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
  attribution: "Codifly (https://codifly.co/rankings/ia)",
  models: [
    { id: "a", name: "Model A", provider: "Acme", input_usd_per_mtok: 10, output_usd_per_mtok: 50, blended_usd_per_mtok: 20, context_tokens: 1_000_000, max_output_tokens: 100_000, url: "u", sources: ["s"] },
    { id: "b", name: "Model B", provider: "Beta", input_usd_per_mtok: 0.1, output_usd_per_mtok: 0.5, blended_usd_per_mtok: 0.2, context_tokens: 128_000, max_output_tokens: 8_000, url: "u", sources: ["s"] },
    { id: "c", name: "Model C", provider: "Acme", input_usd_per_mtok: 2, output_usd_per_mtok: 10, blended_usd_per_mtok: 4, context_tokens: 1_000_000, max_output_tokens: 65_536, url: "u", sources: ["s"] },
  ],
};
const fake = async () => ({ ok: true, status: 200, json: async () => body });

test("maps the dataset and keeps the CC BY attribution", async () => {
  const prices = await getPrices({ fetch: fake });
  assert.equal(prices.attribution, "Codifly (https://codifly.co/rankings/ia)");
  assert.equal(prices.license.name, "CC BY 4.0");
  assert.equal(prices.models[0].inputUsdPerMTok, 10);
  assert.equal(prices.models.length, 3);
});

test("throws on a failed response", async () => {
  await assert.rejects(getPrices({ fetch: async () => ({ ok: false, status: 503 }) }), /503/);
});

test("finds by id, name or provider", async () => {
  const prices = await getPrices({ fetch: fake });
  assert.deepEqual(find(prices, "acme").map(m => m.id), ["a", "c"]);
  assert.deepEqual(find(prices, "MODEL B").map(m => m.id), ["b"]);
});

test("computes the cost of a workload", async () => {
  const [a] = (await getPrices({ fetch: fake })).models;
  // 150 M input + 30 M output: 150*10 + 30*50
  assert.equal(cost(a, { inputTokens: 150_000_000, outputTokens: 30_000_000 }), 3000);
  assert.equal(cost(a), 0);
});

test("ranks the cheapest and filters by context window", async () => {
  const prices = await getPrices({ fetch: fake });
  const w = { inputTokens: 1_000_000, outputTokens: 1_000_000 };
  assert.deepEqual(cheapest(prices, w).map(r => r.model.id), ["b", "c", "a"]);
  assert.deepEqual(cheapest(prices, { ...w, minContextTokens: 500_000 }).map(r => r.model.id), ["c", "a"]);
  assert.equal(cheapest(prices, { ...w, limit: 1 }).length, 1);
});

test("against the real dataset (LIVE=1 only)", { skip: !process.env.LIVE }, async () => {
  const prices = await getPrices();
  assert.ok(prices.models.length > 10);
  assert.match(prices.attribution, /Codifly/);
  assert.ok(cheapest(prices, { inputTokens: 1e6, outputTokens: 1e5 })[0].usd > 0);
});
