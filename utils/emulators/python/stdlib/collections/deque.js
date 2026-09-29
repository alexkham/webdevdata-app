// utils/emulators/python/stdlib/collections/deque.js
//
// Emulator for the collections.deque demo tabs, on _pycollections.js.

import { Deque, asPy, tuple } from './_pycollections.js';

const big = (n) => (n === null ? null : BigInt(n));

export default {
  // deque(items, maxlen=maxlen)
  build: (items, maxlen) => asPy(new Deque(items, big(maxlen))),

  // q = deque(items); q.append(item); (q.popleft(), q)
  queue: (items, item) => {
    const q = new Deque(items);
    q.append(item);
    return asPy(tuple(q.popleft(), q));
  },

  // d = deque(items); (d[0], d[-1], d[i])
  index: (items, i) => {
    const d = new Deque(items);
    return asPy(tuple(d.getItem(0n), d.getItem(-1n), d.getItem(BigInt(i))));
  },
};
