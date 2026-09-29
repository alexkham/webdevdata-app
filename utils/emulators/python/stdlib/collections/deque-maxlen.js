// utils/emulators/python/stdlib/collections/deque-maxlen.js
//
// Emulator for the deque maxlen (sliding window) demo tabs.

import { Deque, asPy, pySplit, tuple } from './_pycollections.js';

export default {
  // window = deque(maxlen=size); seen = []
  // for x in items: window.append(x); seen.append(''.join(window))
  window: (items, size) => {
    const w = new Deque([], BigInt(size));
    const seen = [];
    for (const x of items) {
      w.append(x);
      seen.push(w.items.join(''));
    }
    return asPy(seen);
  },

  // last = deque(text.split(), maxlen=n); (last, last.maxlen)
  tail: (text, n) => {
    const last = new Deque(pySplit(text), BigInt(n));
    return asPy(tuple(last, BigInt(last.maxlen)));
  },
};
