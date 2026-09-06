// utils/emulators/python/operators/pos.js
//
// Emulator for Python +a (unary plus) over numbers. Numerically a no-op,
// but it still invokes __pos__, which is why it is not simply dead code.

export default function pos(a) {
  if (typeof a !== 'number') {
    throw new TypeError("bad operand type for unary +");
  }
  return +a;
}
