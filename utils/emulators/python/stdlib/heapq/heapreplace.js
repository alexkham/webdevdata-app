// utils/emulators/python/stdlib/heapq/heapreplace.js
//
// Emulator for the heapq.heapreplace demo tabs, on _pyheapq.js.

import { heapify, heapreplace, sorted, pyGt, first, sliceIndex, nums, asPy, tuple } from './_pyheapq.js';

export default {
  // (heapq.heapreplace(heap, item), heap)
  replace: (xs, item) => {
    const heap = nums(xs);
    heapify(heap);
    const out = heapreplace(heap, nums([item])[0]);
    return asPy(tuple(out, heap));
  },

  // keep the k largest of a stream in a fixed-size min-heap
  topk: (xs, kIn) => {
    const stream = nums(xs);
    const k = nums([kIn])[0];
    const cut = sliceIndex(k, stream.length);
    const top = stream.slice(0, cut);
    heapify(top);
    for (const x of stream.slice(cut)) {
      if (pyGt(x, first(top))) heapreplace(top, x);
    }
    return asPy(sorted(top, null, true));
  },
};
