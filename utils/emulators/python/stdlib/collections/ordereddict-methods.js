// utils/emulators/python/stdlib/collections/ordereddict-methods.js
//
// Emulator for the OrderedDict dict-method demo tabs (update, setdefault,
// pop + reversed views).

import { asPy, dictFromkeys, odFromkeys, tuple } from './_pycollections.js';

export default {
  // od = OrderedDict.fromkeys(keys, 0); od.update(dict.fromkeys(more, 1)); od
  update: (keys, more) => {
    const od = odFromkeys(keys, 0n);
    od.update(dictFromkeys(more, 1n));
    return asPy(od);
  },

  // od = OrderedDict.fromkeys(keys, 0); (od.setdefault(key, 1), od)
  setdefault: (keys, key) => {
    const od = odFromkeys(keys, 0n);
    const v = od.setdefault(key, 1n);
    return asPy(tuple(v, od));
  },

  // od = OrderedDict.fromkeys(keys, 0); od.pop(key); list(reversed(od.items()))
  reversed: (keys, key) => {
    const od = odFromkeys(keys, 0n);
    od.pop(key);
    return asPy(od.items().reverse().map(([k, v]) => tuple(k, v)));
  },
};
