// utils/emulators/python/stdlib/collections/counter.js
//
// Emulator for the collections.Counter demo tabs, on _pycollections.js.

import { Counter, asPy, tuple } from './_pycollections.js';

export default {
  // Counter(text)
  count: (text) => asPy(new Counter(text)),

  // a = Counter(a); b = Counter(b); [a + b, a - b, a & b, a | b]
  arith: (a, b) => {
    const x = new Counter(a);
    const y = new Counter(b);
    return asPy([x.plus(y), x.minus(y), x.and(y), x.or(y)]);
  },

  // c = Counter(text); (c[key], key in c, len(c))
  missing: (text, key) => {
    const c = new Counter(text);
    return asPy(tuple(c.getItem(key), c.has(key), BigInt(c.size)));
  },
};
