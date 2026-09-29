// utils/emulators/python/stdlib/collections/deque-rotate.js
//
// Emulator for the deque rotate / reverse demo tabs.

import { Deque, asPy } from './_pycollections.js';

export default {
  // d = deque(items); d.rotate(n); d
  rotate: (items, n) => {
    const d = new Deque(items);
    d.rotate(BigInt(n));
    return asPy(d);
  },

  // d = deque(items); d.reverse(); d
  reverse: (items) => {
    const d = new Deque(items);
    d.reverse();
    return asPy(d);
  },
};
