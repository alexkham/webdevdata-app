// utils/emulators/python/stdlib/collections/counter-update.js
//
// Emulator for the Counter.update / Counter.subtract demo tabs.

import { Counter, asPy } from './_pycollections.js';

export default {
  // c = Counter(a); c.update(b); c
  update: (a, b) => {
    const c = new Counter(a);
    c.update(b);
    return asPy(c);
  },

  // c = Counter(a); c.subtract(b); c
  subtract: (a, b) => {
    const c = new Counter(a);
    c.subtract(b);
    return asPy(c);
  },

  // Counter(a) - Counter(b)
  minus: (a, b) => asPy(new Counter(a).minus(new Counter(b))),
};
