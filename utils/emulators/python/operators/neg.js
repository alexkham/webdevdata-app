// utils/emulators/python/operators/neg.js
//
// Emulator for Python -a (unary minus) over numbers.

export default function neg(a) {
  if (typeof a !== 'number') {
    throw new TypeError("bad operand type for unary -");
  }
  return -a;
}
