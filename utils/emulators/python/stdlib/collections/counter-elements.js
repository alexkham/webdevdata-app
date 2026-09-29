// utils/emulators/python/stdlib/collections/counter-elements.js
//
// Emulator for the Counter.elements demo tabs.

import { Counter, PyDict, asPy, pyNumber, zipPairs } from './_pycollections.js';

export default {
  // list(Counter(text).elements())
  expand: (text) => asPy(new Counter(text).elements()),

  // c = Counter(dict(zip(keys, counts))); list(c.elements())
  counts: (keys, counts) => {
    const nums = counts.map((n) => pyNumber(n)); // the list literal is evaluated first
    const c = new Counter(new PyDict(zipPairs(keys, nums)));
    return asPy(c.elements());
  },
};
