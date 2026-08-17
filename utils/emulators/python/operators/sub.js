// utils/emulators/python/operators/sub.js
//
// Emulator for Python a - b over numbers.

export default function sub(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("unsupported operand type(s) for -");
  }
  return a - b;
}
