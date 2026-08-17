// utils/emulators/python/operators/bitwise-or.js
//
// Emulator for Python a | b over ints.

export default function bitwiseOr(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("unsupported operand type(s) for |: 'float' and 'float'");
  }
  return Number(BigInt(a) | BigInt(b));
}
