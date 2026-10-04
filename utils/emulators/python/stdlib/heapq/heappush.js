// utils/emulators/python/stdlib/heapq/heappush.js
//
// Emulator for the heapq.heappush demo tabs, on _pyheapq.js.

import { heappush, heapify, nums, snap, asPy, tuple } from './_pyheapq.js';

export default {
  // push one at a time, recording heap.copy() after each push
  trace: (xs) => {
    const heap = [];
    const trace = [];
    for (const x of nums(xs)) {
      heappush(heap, x);
      trace.push(snap(heap));
    }
    return asPy(trace);
  },

  // heapify(heap); before = heap.copy(); heappush(heap, item); (before, heap)
  onto: (xs, item) => {
    const heap = nums(xs);
    heapify(heap);
    const before = snap(heap);
    heappush(heap, nums([item])[0]);
    return asPy(tuple(before, heap));
  },
};
