// utils/emulators/python/oct.js
//
// Emulator for Python oct(x). Returns a string with "0o" prefix, digits
// 0..7, and a leading "-" for negatives (matching Python's sign-magnitude
// text form, not two's complement).
//
// Non-integer input raises TypeError, matching CPython.

export default function pyOct(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (!Number.isInteger(n)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (n === 0) return '0o0';
  const neg = n < 0;
  const abs = Math.abs(n);
  return (neg ? '-0o' : '0o') + abs.toString(8);
}