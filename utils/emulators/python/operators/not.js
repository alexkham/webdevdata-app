// utils/emulators/python/operators/not.js
//
// Emulator for Python `not a`. Unlike and/or, not ALWAYS returns a bool.

const falsy = (v) =>
  v === '' || v === 0 || v === false || v === null || v === undefined ||
  (Array.isArray(v) && v.length === 0);

export default function pyNot(a) {
  return falsy(a);
}
