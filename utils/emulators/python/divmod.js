// utils/emulators/python/divmod.js
//
// Emulator for Python divmod(a, b). Returns [quotient, remainder] (an array
// standing in for a tuple in the demo). Uses FLOOR division so the remainder
// takes the sign of the divisor — matching Python, not C/JS.
//
// Zero divisor raises ZeroDivisionError-shaped error.

class ZeroDivisionErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ZeroDivisionError';
  }
}

export default function pyDivmod(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isFinite(na) || !Number.isFinite(nb)) {
    throw new TypeError('unsupported operand type(s) for divmod()');
  }
  if (nb === 0) {
    throw new ZeroDivisionErrorLike('integer division or modulo by zero');
  }
  // Python floor division / modulo
  const q = Math.floor(na / nb);
  const r = na - q * nb;
  return [q, r];
}