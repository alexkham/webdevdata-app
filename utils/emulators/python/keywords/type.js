// utils/emulators/python/keywords/type.js
//
// Emulator for the type-statement demo tabs. The typed value appears in
// the code as its Python literal (utils/py-num.js for numbers, pyRepr for
// text); inf is not a literal, so it is a NameError — raised lazily, at
// the first __value__ access (lazy tab) or at the subscription (generic).

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { fromLiteral, toPy } from '../../../py-num.js';

// The Python value of an 'auto' input, ready for pyRepr.
function literal(v) {
  return typeof v === 'number' ? toPy(fromLiteral(v)) : v;
}

// (before, log, Alias.__value__) — evaluated once, on first access
function lazy(value) {
  const v = literal(value);
  return { __pyTuple: [[], ['evaluated'], v] };
}

// (Pair[arg], (arg,), (T,))
function generic(arg) {
  const v = literal(arg);
  return { __pyTuple: [
    { __pyRaw: `Pair[${pyRepr(v)}]` },
    { __pyTuple: [v] },
    { __pyTuple: [{ __pyRaw: 'T' }] },
  ] };
}

export default { lazy, generic };
