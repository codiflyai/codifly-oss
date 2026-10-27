# Codifly · open source

Small, dependency-free libraries from [Codifly](https://codifly.co) for developers in Colombia and Latin America. Each one is tested and has its own README.

| Package | What it does | Guide |
|---|---|---|
| [`nit-colombia`](./nit-colombia) | Calculates and validates the check digit (DV) of the Colombian NIT (modulo 11) | [Cómo calcular y validar el dígito de verificación del NIT](https://codifly.co/articulos/calcular-digito-verificacion-nit-colombia-codigo) |
| [`trm-colombia`](./trm-colombia) | Queries the official TRM (pesos per dollar) from Colombia's open data | [API de la TRM de Colombia](https://codifly.co/articulos/api-trm-colombia-datos-abiertos-python-javascript) |
| [`llm-api-prices`](./llm-api-prices) | Official LLM API prices as typed data, with cost and cheapest-model helpers | [Precios de modelos de IA](https://codifly.co/rankings/ia) |

```bash
npm install nit-colombia trm-colombia llm-api-prices
```

Code is MIT. The price dataset used by `llm-api-prices` is CC BY 4.0: keep the attribution.

Found a wrong price or a missing model? Open an issue with the provider's official page as the source.
