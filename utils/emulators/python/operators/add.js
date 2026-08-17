// utils/emulators/python/operators/add.js
//
// Emulator for Python a + b over numbers.

export default function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("unsupported operand type(s) for +");
  }
  return a + b;
}
