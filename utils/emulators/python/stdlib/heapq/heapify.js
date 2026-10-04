// utils/emulators/python/stdlib/heapq/heapify.js
//
// Emulator for the heapq.heapify demo tabs, on _pyheapq.js.

import { heapify, nums, asPy } from './_pyheapq.js';

export default {
  // data = nums; heapq.heapify(data); data
  heapify: (xs) => {
    const data = nums(xs);
    heapify(data);
    return asPy(data);
  },

  // the heap list cut into tree levels: data[2**k - 1 : 2**(k+1) - 1]
  levels: (xs) => {
    const data = nums(xs);
    heapify(data);
    const levels = [];
    const depth = data.length === 0 ? 0 : Math.floor(Math.log2(data.length)) + 1; // len(data).bit_length()
    for (let k = 0; k < depth; k++) levels.push(data.slice(2 ** k - 1, 2 ** (k + 1) - 1));
    return asPy(levels);
  },
};
