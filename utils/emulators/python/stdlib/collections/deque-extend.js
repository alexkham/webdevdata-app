// utils/emulators/python/stdlib/collections/deque-extend.js
//
// Emulator for the deque extend / extendleft demo tabs.

import { Deque, asPy } from './_pycollections.js';

export default {
  // d = deque(items); d.extend(more); d
  extend: (items, more) => {
    const d = new Deque(items);
    d.extend(more);
    return asPy(d);
  },

  // d = deque(items); d.extendleft(more); d
  extendleft: (items, more) => {
    const d = new Deque(items);
    d.extendleft(more);
    return asPy(d);
  },

  // d = deque(items, maxlen=maxlen); d.extend(more); d
  bounded: (items, maxlen, more) => {
    const d = new Deque(items, BigInt(maxlen));
    d.extend(more);
    return asPy(d);
  },
};
