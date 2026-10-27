# nit-colombia

Calcula y valida el **dígito de verificación (DV) del NIT colombiano** con el método módulo 11 y pesos primos. Sin dependencias, con tipos TypeScript.

```bash
npm install nit-colombia
```

```js
import { digitoVerificacion, esValido, formatear } from "nit-colombia";

digitoVerificacion("890903938");   // 8
esValido("890.903.938-8");         // true
esValido("890.903.938-7");         // false
formatear("890903938");            // "890.903.938-8"
```

## Qué hace y qué no

- Acepta el NIT con puntos, guiones o espacios.
- Lanza `RangeError` si el NIT no tiene entre 1 y 15 dígitos (la longitud de la serie de pesos).
- **Solo valida que el dígito sea coherente con el resto del número.** Un NIT con DV correcto puede no pertenecer a ningún contribuyente: para confirmar que existe hay que consultar el RUT de la DIAN.

## Cómo funciona

Se toman los dígitos del NIT sin el DV, de derecha a izquierda, y se multiplica cada uno por su peso de la serie 3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67 y 71. Se suman los productos y se calcula el residuo de dividir entre 11: si es 0 o 1 ese es el DV; si es mayor, el DV es 11 menos el residuo.

La explicación paso a paso, con un ejemplo calculado a mano y el mismo código en Python, está en
[Cómo calcular y validar el dígito de verificación del NIT en Colombia](https://codifly.co/articulos/calcular-digito-verificacion-nit-colombia-codigo).

## Desarrollo

```bash
npm test
```

## Licencia

MIT © Codifly
