// Emulator for Python int.bit_length() — bit width of the MAGNITUDE.
// Sign is discarded, and 0 has no set bit, so it returns 0.
export default function intBitLength(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('bit_length() demo argument must be int');
  }
  if (n === 0) return 0;
  return Math.abs(n).toString(2).length;
}
