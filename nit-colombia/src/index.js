// Pesos primos del método módulo 11 (de derecha a izquierda), hasta 15 dígitos.
const PESOS = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

const soloDigitos = valor => String(valor ?? "").replace(/\D/g, "");

/** Quita puntos, espacios y guiones: "890.903.938-8" -> "8909039388". */
export function normalizar(valor) {
  return soloDigitos(valor);
}

/**
 * Dígito de verificación de un NIT SIN su dígito final.
 * @param {string|number} nit Entre 1 y 15 dígitos; ignora puntos, espacios y guiones.
 * @returns {number} 0 a 9
 */
export function digitoVerificacion(nit) {
  const digitos = soloDigitos(nit);
  if (digitos.length === 0 || digitos.length > PESOS.length) {
    throw new RangeError("El NIT debe tener entre 1 y 15 dígitos");
  }
  let suma = 0;
  for (let i = 0; i < digitos.length; i++) {
    suma += Number(digitos[digitos.length - 1 - i]) * PESOS[i];
  }
  const residuo = suma % 11;
  return residuo < 2 ? residuo : 11 - residuo;
}

/**
 * Valida un NIT CON su dígito final, por ejemplo "890.903.938-8" o "8909039388".
 * Solo comprueba que el dígito sea coherente; no confirma que el contribuyente exista (para eso, el RUT de la DIAN).
 */
export function esValido(nitCompleto) {
  const digitos = soloDigitos(nitCompleto);
  if (digitos.length < 2 || digitos.length - 1 > PESOS.length) return false;
  return digitoVerificacion(digitos.slice(0, -1)) === Number(digitos.at(-1));
}

/** Da formato a un NIT sin dígito final: "890903938" -> "890.903.938-8". */
export function formatear(nit) {
  const digitos = soloDigitos(nit);
  const dv = digitoVerificacion(digitos);
  return `${digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
}
