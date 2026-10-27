# trm-colombia

Consulta la **TRM oficial de Colombia** (pesos por dólar) desde los datos abiertos de la Superintendencia Financiera en [datos.gov.co](https://www.datos.gov.co/Econom-a-y-Finanzas/Tasa-de-Cambio-Representativa-del-Mercado-TRM/32sa-8pi3). Sin dependencias, sin cuenta ni clave, con tipos TypeScript. Requiere Node.js 18 o superior (usa `fetch`).

```bash
npm install trm-colombia
```

```js
import { trmDelDia, ultimaTRM, aPesos } from "trm-colombia";

const trm = await trmDelDia("2026-10-14");
// { valor: 3181.74, valorTexto: "3181.74", unidad: "COP", desde: "2026-10-14", hasta: "2026-10-14", fecha: "2026-10-14" }

aPesos(25, trm.valor);          // 79543.5  (un plan de 25 USD al mes)
await ultimaTRM();              // la más reciente publicada
await trmDelDia();              // la de hoy, en hora de Colombia
```

## Cosas que conviene saber

- **Un mismo valor puede regir varios días.** En fines de semana y festivos el registro cubre un rango: usa `desde` y `hasta`.
- **Si no hay registro para la fecha** (por ejemplo, una fecha futura) lanza `SinTRMError`.
- **Cachea el resultado del día** y no llames a la API en cada petición de tus usuarios.
- **Guarda la fecha junto al valor** y muéstrala: un precio en pesos sin fecha de TRM no es verificable.
- La TRM es una referencia oficial colombiana, no el tipo de cambio que cobrará tu banco o tu tarjeta.

La guía completa, con el mismo cálculo en Python y buenas prácticas, está en
[API de la TRM de Colombia: cómo consultar el dólar oficial en Python y JavaScript](https://codifly.co/articulos/api-trm-colombia-datos-abiertos-python-javascript).

## Desarrollo

```bash
npm test          # pruebas con respuestas simuladas
npm run test:live # además, una consulta real a datos.gov.co
```

## Licencia

MIT © Codifly. Los datos son de la Superintendencia Financiera de Colombia, publicados en datos.gov.co.
