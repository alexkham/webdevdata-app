// utils/emulators/python/operators/pow.js
//
// Emulator for Python a ** b. Negative exponents give floats
// (2 ** -1 == 0.5); 0 to a negative power raises like Python.

class ZeroDivisionErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ZeroDivisionError';
  }
}

export default function pyPow(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("unsupported operand type(s) for **");
  }
  if (a === 0 && b < 0) {
    throw new ZeroDivisionErrorLike('0.0 cannot be raised to a negative power');
  }
  const r = Math.pow(a, b);
  // float operands or negative/fractional exponents give floats in Python
  const isFloat = !Number.isInteger(a) || !Number.isInteger(b) || b < 0;
  if (isFloat && Number.isInteger(r) && Math.abs(r) < 1e16) return { __pyRaw: r + '.0' };
  return r;
}
