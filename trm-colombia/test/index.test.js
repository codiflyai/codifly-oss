import test from "node:test";
import assert from "node:assert/strict";
import { trmDelDia, ultimaTRM, aPesos, aDolares, SinTRMError } from "../src/index.js";

const respuesta = filas => async url => { respuesta.ultima = String(url); return { ok: true, status: 200, json: async () => filas }; };

test("consulta la TRM de una fecha y la devuelve tipada", async () => {
  const f = respuesta([{ valor: "3181.74", unidad: "COP", vigenciadesde: "2026-10-14T00:00:00.000", vigenciahasta: "2026-10-14T00:00:00.000" }]);
  const trm = await trmDelDia("2026-10-14", { fetch: f });
  assert.deepEqual(trm, { valor: 3181.74, valorTexto: "3181.74", unidad: "COP", desde: "2026-10-14", hasta: "2026-10-14", fecha: "2026-10-14" });
  assert.match(decodeURIComponent(respuesta.ultima.replace(/\+/g, " ")), /vigenciadesde <= '2026-10-14T00:00:00.000'/);
});

test("un mismo valor puede regir varios días", async () => {
  const f = respuesta([{ valor: "3174.67", unidad: "COP", vigenciadesde: "2026-10-17T00:00:00.000", vigenciahasta: "2026-10-19T00:00:00.000" }]);
  const trm = await trmDelDia("2026-10-18", { fetch: f });
  assert.equal(trm.desde, "2026-10-17");
  assert.equal(trm.hasta, "2026-10-19");
});

test("acepta un Date y usa la fecha de Colombia", async () => {
  const f = respuesta([{ valor: "1", vigenciadesde: "2026-10-14T00:00:00.000", vigenciahasta: "2026-10-14T00:00:00.000" }]);
  // 2026-10-15 03:00 UTC sigue siendo el 14 de octubre en Colombia (UTC-5)
  await trmDelDia(new Date("2026-10-15T03:00:00Z"), { fetch: f });
  assert.match(decodeURIComponent(respuesta.ultima.replace(/\+/g, " ")), /'2026-10-14T00:00:00.000'/);
});

test("lanza SinTRMError si no hay registro", async () => {
  await assert.rejects(trmDelDia("2099-01-01", { fetch: respuesta([]) }), e => e instanceof SinTRMError && e.fecha === "2099-01-01");
});

test("lanza si la API responde con error o la fecha es inválida", async () => {
  await assert.rejects(trmDelDia("2026-10-14", { fetch: async () => ({ ok: false, status: 503 }) }), /503/);
  await assert.rejects(trmDelDia("14/10/2026"), TypeError);
});

test("la última TRM no filtra por fecha", async () => {
  const f = respuesta([{ valor: "3170.46", vigenciadesde: "2026-10-16T00:00:00.000", vigenciahasta: "2026-10-16T00:00:00.000" }]);
  assert.equal((await ultimaTRM({ fetch: f })).valor, 3170.46);
  assert.doesNotMatch(respuesta.ultima, /where/i);
});

test("convierte con redondeo", () => {
  assert.equal(aPesos(25, 3181.74), 79543.5);
  assert.equal(aPesos(0.1, 3174.67, { decimales: 0 }), 317);
  assert.equal(aDolares(79543.5, 3181.74), 25);
});

test("contra la API real (solo con LIVE=1)", { skip: !process.env.LIVE }, async () => {
  const trm = await trmDelDia("2026-10-14");
  assert.equal(trm.valorTexto, "3181.74");
});
