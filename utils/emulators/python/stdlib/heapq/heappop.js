// utils/emulators/python/stdlib/heapq/heappop.js
//
// Emulator for the heapq.heappop demo tabs, on _pyheapq.js.

import { heappop, heapify, nums, snap, asPy, tuple } from './_pyheapq.js';

export default {
  // heapify, then pop until empty, recording (smallest, heap.copy())
  drain: (xs) => {
    const heap = nums(xs);
    heapify(heap);
    const steps = [];
    while (heap.length) {
      const smallest = heappop(heap);
      steps.push(tuple(smallest, snap(heap)));
    }
    return asPy(steps);
  },

  // (heapq.heappop(heap), heap) — the pop runs before heap is shown
  once: (xs) => {
    const heap = nums(xs);
    heapify(heap);
    const smallest = heappop(heap);
    return asPy(tuple(smallest, heap));
  },
};
