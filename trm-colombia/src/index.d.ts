export interface TRM {
  /** Pesos por dólar */
  valor: number;
  /** Tal como lo devuelve la API, por ejemplo "3181.74" */
  valorTexto: string;
  unidad: string;
  /** Primer día en que rige, AAAA-MM-DD */
  desde: string;
  /** Último día en que rige, AAAA-MM-DD */
  hasta: string;
}
export interface TRMDelDia extends TRM { fecha: string }
export interface Opciones { fetch?: typeof fetch; timeoutMs?: number }

export class SinTRMError extends Error { fecha: string }
export function trmDelDia(fecha?: string | Date, opciones?: Opciones): Promise<TRMDelDia>;
export function ultimaTRM(opciones?: Opciones): Promise<TRM>;
export function aPesos(usd: number, trm: number, opciones?: { decimales?: number }): number;
export function aDolares(cop: number, trm: number, opciones?: { decimales?: number }): number;
