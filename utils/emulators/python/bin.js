// utils/emulators/python/bin.js
//
// Emulator for Python bin(x). Returns a string with "0b" prefix, digits
// 0 and 1, and a leading "-" for negatives (matching Python's
// sign-magnitude text form, not two's complement).
//
// Non-integer input raises TypeError, matching CPython.

export default function pyBin(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (!Number.isInteger(n)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (n === 0) return '0b0';
  const neg = n < 0;
  const abs = Math.abs(n);
  return (neg ? '-0b' : '0b') + abs.toString(2);
}