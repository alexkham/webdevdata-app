// utils/emulators/python/operators/le.js
//
// Emulator for Python a <= b over numbers.

export default function le(a, b) {
  if (typeof a !== typeof b) {
    throw new TypeError("'<=' not supported between mixed types");
  }
  return a <= b;
}
