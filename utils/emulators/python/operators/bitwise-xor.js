// utils/emulators/python/operators/bitwise-xor.js
//
// Emulator for Python a ^ b over ints. NOT exponentiation — that is **,
// and confusing the two is this page's headline pitfall.

export default function bitwiseXor(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("unsupported operand type(s) for ^: 'float' and 'float'");
  }
  return Number(BigInt(a) ^ BigInt(b));
}
