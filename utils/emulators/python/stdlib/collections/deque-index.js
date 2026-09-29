// utils/emulators/python/stdlib/collections/deque-index.js
//
// Emulator for the deque index / count / insert / remove demo tabs.

import { Deque, asPy, tuple } from './_pycollections.js';

export default {
  // d = deque(items); (d.count(x), d.index(x))
  find: (items, x) => {
    const d = new Deque(items);
    const n = d.count(x); // evaluated first: count never raises
    return asPy(tuple(n, d.index(x)));
  },

  // d = deque(items, maxlen=maxlen); d.insert(i, x); d
  insert: (items, maxlen, i, x) => {
    const d = new Deque(items, maxlen === null ? null : BigInt(maxlen));
    d.insert(BigInt(i), x);
    return asPy(d);
  },

  // d = deque(items); d.remove(x); d
  remove: (items, x) => {
    const d = new Deque(items);
    d.remove(x);
    return asPy(d);
  },
};
