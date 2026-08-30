// utils/emulators/python/operators/truediv.js
//
// Emulator for Python a / b — ALWAYS true division: 7 / 2 is 3.5, ints
// included. Division by zero raises like Python.

class ZeroDivisionErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ZeroDivisionError';
  }
}

export default function truediv(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("unsupported operand type(s) for /");
  }
  if (b === 0) throw new ZeroDivisionErrorLike('division by zero');
  const r = a / b;
  // Python / always yields a float — show 4.0, not 4
  if (Number.isInteger(r) && Math.abs(r) < 1e16) return { __pyRaw: r + '.0' };
  return r;
}
