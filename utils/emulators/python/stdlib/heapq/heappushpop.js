// utils/emulators/python/stdlib/heapq/heappushpop.js
//
// Emulator for the heapq.heappushpop demo tabs, on _pyheapq.js.

import { heapify, heappushpop, heapreplace, nums, snap, asPy, tuple } from './_pyheapq.js';

export default {
  // (heapq.heappushpop(heap, item), heap)
  pushpop: (xs, item) => {
    const heap = nums(xs);
    heapify(heap);
    const out = heappushpop(heap, nums([item])[0]);
    return asPy(tuple(out, heap));
  },

  // the same item through heappushpop and heapreplace, on two copies
  compare: (xs, item) => {
    const a = nums(xs);
    heapify(a);
    const b = snap(a);
    const x = nums([item])[0];
    const r1 = tuple('heappushpop', heappushpop(a, x), a);
    const r2 = tuple('heapreplace', heapreplace(b, x), b);
    return asPy([r1, r2]);
  },
};
