// utils/emulators/python/hex.js
//
// Emulator for Python hex(x). Returns a string with "0x" prefix,
// lowercase digits, and a leading "-" for negatives (matching Python's
// sign-magnitude text form, not two's complement).
//
// Non-integer input raises TypeError, matching CPython. In the demo,
// values arrive from the number-input parser as JS numbers; anything
// non-integer or non-finite is rejected the way Python would reject a
// float.

export default function pyHex(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (!Number.isInteger(n)) {
    throw new TypeError("'float' object cannot be interpreted as an integer");
  }
  if (n === 0) return '0x0';
  const neg = n < 0;
  const abs = Math.abs(n);
  return (neg ? '-0x' : '0x') + abs.toString(16);
}