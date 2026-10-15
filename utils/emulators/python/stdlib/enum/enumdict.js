// utils/emulators/python/stdlib/enum/enumdict.js
//
// Emulator for the enum.EnumDict demo tabs, on the EnumDict.__setitem__ /
// update port in _pyenum.js.

import { EnumDict, pySplit, repr, pyTuple } from './_pyenum.js';

// dict(d): insertion order, keys as stored (__order__ is stored as _order_)
const dictRepr = (d) => ({ __pyRaw: '{' + [...d.entries.entries()].map(([k, v]) => `${repr(k)}: ${repr(v)}`).join(', ') + '}' });

export default {
  // d = EnumDict('Color'); d['RED'] = 1; d[key] = 2; (d.member_names, dict(d))
  setitem: (key) => {
    const d = new EnumDict('Color');
    d.setitem('RED', 1n);
    d.setitem(key, 2n);
    return pyTuple(d.member_names, dictRepr(d));
  },

  // d.update([(name, i) for i, name in enumerate(names.split(), 1)]); d.member_names
  update: (names) => {
    const d = new EnumDict('Color');
    d.update(pySplit(names).map((name, i) => [name, BigInt(i + 1)]));
    return d.member_names;
  },
};
