// utils/emulators/python/operators/mod.js
//
// Emulator for Python a % b. The result's sign follows the DIVISOR,
// unlike C/JS where it follows the dividend: -7 % 3 == 2 in Python
// (JS gives -1). Implemented as a - b*floor(a/b), which is Python's
// definition.

class ZeroDivisionErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ZeroDivisionError';
  }
}

export default function mod(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("unsupported operand type(s) for %");
  }
  if (b === 0) throw new ZeroDivisionErrorLike('integer division or modulo by zero');
  return a - b * Math.floor(a / b);
}
