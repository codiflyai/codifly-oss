const DEFAULT_URL = "https://codifly.co/data/ai-models.json";

/**
 * Fetches Codifly's open dataset of standard LLM API prices (USD per million tokens).
 * The data is CC BY 4.0: keep the attribution that comes with it (`prices.attribution`).
 */
export async function getPrices({ fetch: f = globalThis.fetch, url = DEFAULT_URL, timeoutMs = 10_000 } = {}) {
  const response = await f(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`codifly.co answered ${response.status}`);
  const body = await response.json();
  return {
    name: body.name,
    reviewedAt: body.reviewed_at,
    license: body.license,
    attribution: body.attribution,
    models: body.models.map(m => ({
      id: m.id, name: m.name, provider: m.provider,
      inputUsdPerMTok: m.input_usd_per_mtok, outputUsdPerMTok: m.output_usd_per_mtok, blendedUsdPerMTok: m.blended_usd_per_mtok,
      contextTokens: m.context_tokens, maxOutputTokens: m.max_output_tokens, url: m.url, sources: m.sources,
    })),
  };
}

/** Case-insensitive search by id, name or provider. */
export function find(prices, text) {
  const q = String(text).trim().toLowerCase();
  return prices.models.filter(m => [m.id, m.name, m.provider].some(v => v.toLowerCase().includes(q)));
}

/** Cost in USD of a workload with a model (rounded to 6 decimals). Prices exclude caching and batch discounts. */
export function cost(model, { inputTokens = 0, outputTokens = 0 } = {}) {
  const usd = (inputTokens * model.inputUsdPerMTok + outputTokens * model.outputUsdPerMTok) / 1_000_000;
  return Math.round(usd * 1e6) / 1e6;
}

/** Models sorted from cheapest to most expensive for a workload; optionally require a minimum context window. */
export function cheapest(prices, { inputTokens, outputTokens, minContextTokens = 0, limit } = {}) {
  const ranked = prices.models
    .filter(m => m.contextTokens >= minContextTokens)
    .map(m => ({ model: m, usd: cost(m, { inputTokens, outputTokens }) }))
    .sort((a, b) => a.usd - b.usd || a.model.id.localeCompare(b.model.id));
  return limit ? ranked.slice(0, limit) : ranked;
}
