// utils/emulators/python/operators/lshift.js
//
// Emulator for Python a << b over ints. BigInt internally — 1 << 40 must
// give 1099511627776, not the 32-bit-truncated JS result. Very large
// results come back as BigInt (renders identically).

class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

export default function lshift(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError("unsupported operand type(s) for <<: 'float' and 'float'");
  }
  if (b < 0) throw new ValueErrorLike('negative shift count');
  const r = BigInt(a) << BigInt(b);
  return r >= BigInt(Number.MIN_SAFE_INTEGER) && r <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(r) : r;
}
