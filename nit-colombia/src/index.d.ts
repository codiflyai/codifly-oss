export function normalizar(valor: string | number): string;
/** Dígito de verificación (0-9) de un NIT sin su dígito final. Lanza RangeError si no hay entre 1 y 15 dígitos. */
export function digitoVerificacion(nit: string | number): number;
/** true si el dígito final es coherente con el resto del NIT. No confirma que el contribuyente exista. */
export function esValido(nitCompleto: string | number): boolean;
/** "890903938" -> "890.903.938-8" */
export function formatear(nit: string | number): string;
