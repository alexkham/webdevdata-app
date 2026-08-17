// utils/emulators/python/operators/and.js
//
// Emulator for Python `a and b`. Returns an OPERAND, not a bool:
// a when a is falsy, otherwise b. Empty string is falsy — with the demo's
// text inputs this reproduces Python's truthiness exactly.

const falsy = (v) =>
  v === '' || v === 0 || v === false || v === null || v === undefined ||
  (Array.isArray(v) && v.length === 0);

export default function pyAnd(a, b) {
  return falsy(a) ? a : b;
}
