export interface ModelPrice {
  id: string; name: string; provider: string;
  inputUsdPerMTok: number; outputUsdPerMTok: number; blendedUsdPerMTok: number;
  contextTokens: number; maxOutputTokens: number;
  url: string; sources: string[];
}
export interface Prices {
  name: string; reviewedAt: string;
  license: { name: string; url: string };
  /** Required by the CC BY 4.0 license */
  attribution: string;
  models: ModelPrice[];
}
export interface Workload { inputTokens?: number; outputTokens?: number }
export function getPrices(options?: { fetch?: typeof fetch; url?: string; timeoutMs?: number }): Promise<Prices>;
export function find(prices: Prices, text: string): ModelPrice[];
export function cost(model: ModelPrice, workload?: Workload): number;
export function cheapest(prices: Prices, options?: Workload & { minContextTokens?: number; limit?: number }): { model: ModelPrice; usd: number }[];
