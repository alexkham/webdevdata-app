// utils/emulators/python/operators/invert.js
//
// Emulator for Python ~a over ints: two's-complement NOT, always -a - 1.

export default function invert(a) {
  if (!Number.isInteger(a)) {
    throw new TypeError("bad operand type for unary ~: 'float'");
  }
  return -a - 1;
}
