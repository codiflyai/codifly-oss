import test from "node:test";
import assert from "node:assert/strict";
import { digitoVerificacion, esValido, formatear, normalizar } from "../src/index.js";

test("calcula el dígito de verificación de NIT de ejemplo", () => {
  assert.equal(digitoVerificacion("890903938"), 8);
  assert.equal(digitoVerificacion("800197268"), 4);
  assert.equal(digitoVerificacion("899999068"), 1);
  assert.equal(digitoVerificacion("900123456"), 8);
});

test("acepta puntos, guiones y espacios", () => {
  assert.equal(digitoVerificacion("890.903.938"), 8);
  assert.equal(esValido("890.903.938-8"), true);
  assert.equal(esValido(" 890 903 938 - 8 "), true);
  assert.equal(normalizar("890.903.938-8"), "8909039388");
});

test("rechaza un dígito mal digitado", () => {
  assert.equal(esValido("890.903.938-7"), false);
  assert.equal(esValido("8"), false);
  assert.equal(esValido(""), false);
});

test("da formato con puntos y guion", () => {
  assert.equal(formatear("890903938"), "890.903.938-8");
  assert.equal(formatear(900123456), "900.123.456-8");
});

test("lanza si el NIT no tiene entre 1 y 15 dígitos", () => {
  assert.throws(() => digitoVerificacion(""), RangeError);
  assert.throws(() => digitoVerificacion("1".repeat(16)), RangeError);
});

test("el residuo 0 y 1 devuelve el propio residuo", () => {
  // Busca un NIT por fuerza bruta para cada caso, para no depender de datos externos.
  const vistos = new Set();
  for (let n = 1; n < 5000 && vistos.size < 2; n++) {
    const suma = [...String(n)].reverse().reduce((a, d, i) => a + Number(d) * [3, 7, 13, 17][i], 0);
    if (suma % 11 < 2) vistos.add(suma % 11 + ":" + digitoVerificacion(String(n)));
  }
  for (const caso of vistos) { const [residuo, dv] = caso.split(":"); assert.equal(Number(dv), Number(residuo)); }
  assert.ok(vistos.size >= 1);
});
