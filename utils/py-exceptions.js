// utils/py-exceptions.js
//
// Helpers for Python exception emulators. An emulated Python exception is
// a JS Error whose `name` is the Python class name and whose `message` is
// exactly what str(exc) — i.e. the traceback's last line — shows after
// "Name: ". Empty message → the demo shows the bare class name.

import { pyReprExact as pyRepr } from './demo-coerce.js';

export class PyException extends Error {
  constructor(type, message = '') {
    super(message);
    this.name = type;
  }
}

export function raise(type, message = '') {
  throw new PyException(type, message);
}

// str(exc) for an exception built from positional args, mirroring
// BaseException.__str__: no args → '', one arg → str(arg), several →
// repr(args). KeyError overrides the one-arg case with repr(key).
export function excStr(args, { keyError = false } = {}) {
  if (args.length === 0) return '';
  if (args.length === 1) {
    const a = args[0];
    if (keyError) return pyRepr(a);
    return typeof a === 'string' ? a : pyRepr(a);
  }
  return pyRepr({ __pyTuple: args });
}

// Python int() parse of a string — the rules the ValueError demos rely on.
// Returns the number or throws ValueError with CPython's message.
export function pyInt(s) {
  if (typeof s === 'number') return Math.trunc(s);
  const t = String(s).trim().replace(/_/g, (m, i, str) => (/\d/.test(str[i - 1] || '') && /\d/.test(str[i + 1] || '') ? '' : m));
  if (!/^[+-]?\d+$/.test(t)) {
    raise('ValueError', `invalid literal for int() with base 10: ${pyRepr(String(s))}`);
  }
  const n = parseInt(t, 10);
  // beyond 2**53 a JS number would print wrong digits; BigInt reprs exactly
  return Number.isSafeInteger(n) ? n : BigInt(t.replace(/^\+/, ''));
}
