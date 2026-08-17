// utils/emulators/python/operators/or.js
//
// Emulator for Python `a or b`. Returns an OPERAND, not a bool:
// a when a is truthy, otherwise b.

const falsy = (v) =>
  v === '' || v === 0 || v === false || v === null || v === undefined ||
  (Array.isArray(v) && v.length === 0);

export default function pyOr(a, b) {
  return falsy(a) ? b : a;
}
