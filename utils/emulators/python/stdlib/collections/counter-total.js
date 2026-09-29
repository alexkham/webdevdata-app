// utils/emulators/python/stdlib/collections/counter-total.js
//
// Emulator for the Counter.total demo tabs.

import { Counter, asPy, tuple } from './_pycollections.js';

export default {
  // c = Counter(text); (c.total(), len(c))
  total: (text) => {
    const c = new Counter(text);
    return asPy(tuple(c.total(), BigInt(c.size)));
  },

  // c = Counter(a); c.subtract(b); (c.total(), (+c).total())
  signed: (a, b) => {
    const c = new Counter(a);
    c.subtract(b);
    return asPy(tuple(c.total(), c.pos().total()));
  },
};
