// utils/emulators/python/abs.js
//
// Emulator for Python abs(x) for real numbers.

export default function pyAbs(x) {
  if (typeof x !== 'number' || Number.isNaN(x)) {
    throw new TypeError("bad operand type for abs()");
  }
  return Math.abs(x);
}
