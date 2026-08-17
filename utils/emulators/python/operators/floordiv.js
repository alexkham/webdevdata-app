// utils/emulators/python/operators/floordiv.js
//
// Emulator for Python a // b — floor division. Rounds toward NEGATIVE
// infinity, not toward zero: -7 // 2 == -4. That is the trap this page
// teaches, so the semantics must be exact.

class ZeroDivisionErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ZeroDivisionError';
  }
}

export default function floordiv(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("unsupported operand type(s) for //");
  }
  if (b === 0) throw new ZeroDivisionErrorLike('integer division or modulo by zero');
  return Math.floor(a / b);
}
