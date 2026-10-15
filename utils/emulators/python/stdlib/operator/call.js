// utils/emulators/python/stdlib/operator/call.js
//
// Emulator for the operator.call page (3.11+): call(int, text, base=…)
// with CPython's int() parser (the functools port, imported unchanged), and
// a name → function dispatch table, via _pyoperator.js.

import { pyIntFromStr } from '../functools/_pyint.js';
import { num, out, raise, callStrMethod, sorted, typeName } from './_pyoperator.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

const HANDLERS = {
  len: (s) => BigInt([...s].length),
  upper: (s) => callStrMethod(s, 'upper', []),
  split: (s) => callStrMethod(s, 'split', []),
  sorted: (s) => sorted([...s]),
};

export default {
  // call(int, text, base=base)
  int: (text, base) => {
    const b = num(base);
    if (typeof b !== 'bigint') raise('TypeError', `'${typeName(b)}' object cannot be interpreted as an integer`);
    return out(pyIntFromStr(text, b));
  },

  // handlers = {'len': len, 'upper': str.upper, 'split': str.split, 'sorted': sorted}
  // call(handlers[name], text)
  dispatch: (name, text) => {
    if (!Object.prototype.hasOwnProperty.call(HANDLERS, name)) raise('KeyError', pyStrRepr(name));
    return out(HANDLERS[name](text));
  },
};
