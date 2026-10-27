const URL_TRM = "https://www.datos.gov.co/resource/32sa-8pi3.json";
const ZONA = "America/Bogota";

export class SinTRMError extends Error {
  constructor(fecha) {
    super(`No hay TRM para ${fecha}`);
    this.name = "SinTRMError";
    this.fecha = fecha;
  }
}

/** "YYYY-MM-DD" en hora de Colombia a partir de un Date o de un texto ya en ese formato. */
function aFecha(fecha) {
  if (typeof fecha === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new TypeError("La fecha debe ser AAAA-MM-DD o un Date");
    return fecha;
  }
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" }).format(fecha);
}

async function consultar(params, { fetch: f = globalThis.fetch, timeoutMs = 10_000 } = {}) {
  const respuesta = await f(`${URL_TRM}?${new URLSearchParams(params)}`, { signal: AbortSignal.timeout(timeoutMs) });
  if (!respuesta.ok) throw new Error(`datos.gov.co respondió ${respuesta.status}`);
  return respuesta.json();
}

function aTRM(fila) {
  return {
    valor: Number(fila.valor),
    valorTexto: fila.valor,
    unidad: fila.unidad ?? "COP",
    desde: fila.vigenciadesde.slice(0, 10),
    hasta: fila.vigenciahasta.slice(0, 10),
  };
}

/**
 * TRM vigente en una fecha. Un mismo valor puede regir varios días (fines de semana y festivos).
 * @param {string|Date} [fecha] AAAA-MM-DD o Date; por defecto, hoy en hora de Colombia.
 */
export async function trmDelDia(fecha = new Date(), opciones = {}) {
  const dia = aFecha(fecha);
  const filas = await consultar({
    $where: `vigenciadesde <= '${dia}T00:00:00.000' AND vigenciahasta >= '${dia}T00:00:00.000'`,
    $order: "vigenciadesde DESC",
    $limit: "1",
  }, opciones);
  if (filas.length === 0) throw new SinTRMError(dia);
  return { ...aTRM(filas[0]), fecha: dia };
}

/** La TRM más reciente publicada, aunque aún no rija hoy. */
export async function ultimaTRM(opciones = {}) {
  const filas = await consultar({ $order: "vigenciadesde DESC", $limit: "1" }, opciones);
  if (filas.length === 0) throw new SinTRMError("última");
  return aTRM(filas[0]);
}

/** Convierte dólares a pesos con una TRM dada. Redondea a `decimales` (2 por defecto). */
export function aPesos(usd, trm, { decimales = 2 } = {}) {
  const factor = 10 ** decimales;
  return Math.round(usd * trm * factor) / factor;
}

/** Convierte pesos a dólares con una TRM dada. */
export function aDolares(cop, trm, { decimales = 2 } = {}) {
  const factor = 10 ** decimales;
  return Math.round((cop / trm) * factor) / factor;
}
