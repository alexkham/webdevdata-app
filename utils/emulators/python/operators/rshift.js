// utils/emulators/python/operators/rshift.js
//
// Emulator for Python a >> b over ints — arithmetic (sign-preserving)
// shift, floor semantics for negatives: -7 >> 1 == -4.

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function rshift(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("unsupported operand type(s) for >>: 'float' and 'float'");
  }
  if (b < 0) throw new ValueErrorLike('negative shift count');
  return Number(BigInt(a) >> BigInt(b));
}
