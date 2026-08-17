// utils/emulators/python/operators/bitwise-and.js
//
// Emulator for Python a & b over ints. BigInt internally — JS's native
// bitwise operators truncate to 32 bits, Python's do not.

export default function bitwiseAnd(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("unsupported operand type(s) for &: 'float' and 'float'");
  }
  return Number(BigInt(a) & BigInt(b));
}
