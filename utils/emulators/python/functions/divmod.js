// Emulator for Python divmod(a, b) — the (a // b, a % b) pair, with
// Python's floor/divisor-sign semantics.
class ZeroDivisionErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ZeroDivisionError'; }
}
export default function pyDivmod(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('divmod() arguments must be numbers');
  }
  if (b === 0) throw new ZeroDivisionErrorLike('integer division or modulo by zero');
  const q = Math.floor(a / b);
  const r = a - b * q;
  const forceFloat = !Number.isInteger(a) || !Number.isInteger(b);
  const f = (n) => (forceFloat && Number.isInteger(n) ? n + '.0' : String(n));
  return { __pyRaw: '(' + f(q) + ', ' + f(r) + ')' };
}
