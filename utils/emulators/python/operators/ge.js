// utils/emulators/python/operators/ge.js
//
// Emulator for Python a >= b over numbers.

export default function ge(a, b) {
  if (typeof a !== typeof b) {
    throw new TypeError("'>=' not supported between mixed types");
  }
  return a >= b;
}
