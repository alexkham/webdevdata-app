// utils/emulators/python/stdlib/heapq/index.js
//
// Emulator for the heapq module hub demo, on the CPython port in _pyheapq.js.

import { heappush, heappop, nsmallest, nlargest, nums, snap, asPy, tuple } from './_pyheapq.js';

export default {
  // push every number, snapshot the heap list, then pop everything
  heapsort: (xs) => {
    const heap = [];
    for (const x of nums(xs)) heappush(heap, x);
    const asStored = snap(heap);
    const popped = [];
    for (let i = 0, n = heap.length; i < n; i++) popped.push(heappop(heap));
    return asPy(tuple(asStored, popped));
  },

  // (heapq.nsmallest(n, nums), heapq.nlargest(n, nums))
  topk: (xs, n) => {
    const data = nums(xs);
    const k = nums([n])[0];
    return asPy(tuple(nsmallest(k, data), nlargest(k, data)));
  },
};
