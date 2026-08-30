// Emulator for Python int.conjugate() — the identity on int.
// A real number has no imaginary part to negate, so the conjugate is
// the number itself. The method exists only to satisfy the numbers.Complex
// interface that int is registered against.
export default function intConjugate(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('conjugate() demo argument must be int');
  }
  return n;
}
