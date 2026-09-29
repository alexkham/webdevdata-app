// utils/py-num.js
//
// Python numbers for snippet-demo emulators. A number typed into a demo is
// shown in the code as pyRepr(n) — JS number text — and CPython reads that
// TEXT as a literal. So the value Python works with is decided by the text:
//   '16', '10000000000000000'   → int (exact, BigInt here)
//   '2.5', '1e+21', '1e-7'      → float
//   'inf' / '-inf'              → not a literal: NameError (1e400 overflows)
// Values are { int: bigint } or { float: number }.

import { pyRepr } from './code-highlight.js';
import { pyFloatRepr } from './demo-coerce.js';
import { raise } from './py-exceptions.js';

// The Python value of a JS number as it appears in the demo code.
// `suggest` is appended to the NameError for inf, e.g. "Did you mean: 'int'?"
// (it depends on the names in scope, so the caller verifies it).
export function fromLiteral(n, suggest = "Did you mean: 'int'?") {
  const text = pyRepr(n);
  if (text === 'inf' || text === '-inf') {
    raise('NameError', `name 'inf' is not defined${suggest ? `. ${suggest}` : ''}`);
  }
  if (/[.eE]/.test(text)) return { float: n };
  return { int: BigInt(text) };
}

export const isInt = (v) => v.int !== undefined;
// int → float the way CPython does it (correctly rounded)
export const toFloat = (v) => (isInt(v) ? Number(v.int) : v.float);

export function add(a, b) {
  if (isInt(a) && isInt(b)) return { int: a.int + b.int };
  return { float: toFloat(a) + toFloat(b) };
}
export function sub(a, b) {
  if (isInt(a) && isInt(b)) return { int: a.int - b.int };
  return { float: toFloat(a) - toFloat(b) };
}
export function mul(a, b) {
  if (isInt(a) && isInt(b)) return { int: a.int * b.int };
  return { float: toFloat(a) * toFloat(b) };
}

// Exact comparison, as CPython does it: an int is never rounded to float to
// compare with a float. Returns -1, 0 or 1 (NaN is not produced by demos).
export function cmp(a, b) {
  if (isInt(a) && isInt(b)) return a.int < b.int ? -1 : a.int > b.int ? 1 : 0;
  if (!isInt(a) && !isInt(b)) return a.float < b.float ? -1 : a.float > b.float ? 1 : 0;
  const flip = !isInt(a);
  const i = flip ? b.int : a.int;
  const f = flip ? a.float : b.float;
  let r;
  if (f === Infinity) r = -1;
  else if (f === -Infinity) r = 1;
  else {
    const fl = BigInt(Math.floor(f));
    if (i < fl) r = -1;
    else if (i > fl) r = 1;
    else r = Number.isInteger(f) ? 0 : -1; // i == floor(f) < f
  }
  return flip ? -r : r;
}

// The value to hand to pyRepr: bigint for ints, a raw Python float repr
// for floats (pyRepr alone would print JS-style 1e-7 / 1e21).
export const toPy = (v) => (isInt(v) ? v.int : { __pyRaw: pyFloatRepr(v.float) });
export const reprOf = (v) => (isInt(v) ? String(v.int) : pyFloatRepr(v.float));
