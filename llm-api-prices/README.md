# llm-api-prices

Official **LLM API prices** (USD per million tokens) as typed data, plus helpers to compute the cost of a workload and find the cheapest model. The data is Codifly's open dataset, reviewed against each provider's official pages and published under **CC BY 4.0**. Zero dependencies, Node.js 18+.

```bash
npm install llm-api-prices
```

```js
import { getPrices, find, cost, cheapest } from "llm-api-prices";

const prices = await getPrices();                 // fetches https://codifly.co/data/ai-models.json
console.log(prices.reviewedAt, prices.attribution);

const [model] = find(prices, "gemini");
cost(model, { inputTokens: 150_000_000, outputTokens: 30_000_000 });   // USD for the month

cheapest(prices, { inputTokens: 1e6, outputTokens: 1e5, minContextTokens: 500_000, limit: 3 });
```

## Notes

- **Prices are standard list prices**, without caching, batch or flex discounts, and exclude taxes. They change often: check `prices.reviewedAt` and the model's `sources` before budgeting.
- **License:** the data is CC BY 4.0. If you republish it or build on it, keep the attribution in `prices.attribution` ("Codifly (https://codifly.co/rankings/ia)"). The code in this package is MIT.
- Browse the same data with charts and sources at [codifly.co/rankings/ia](https://codifly.co/rankings/ia). JSON and CSV: [ai-models.json](https://codifly.co/data/ai-models.json), [ai-models.csv](https://codifly.co/data/ai-models.csv).
- To see the cost in Colombian pesos with the official TRM, combine it with [`trm-colombia`](https://www.npmjs.com/package/trm-colombia).

## Español

Precios oficiales de las APIs de modelos de IA (USD por millón de tokens) con funciones para calcular el costo de una carga de trabajo y encontrar el modelo más barato. Los datos son abiertos (CC BY 4.0): conserva la atribución. Más contexto y una guía del costo en pesos en [codifly.co](https://codifly.co/articulos/costo-api-ia-en-pesos-reales-y-soles).

## Development

```bash
npm test
npm run test:live   # also queries the real dataset
```

MIT © Codifly
