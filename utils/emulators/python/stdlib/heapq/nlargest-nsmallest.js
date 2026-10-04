// utils/emulators/python/stdlib/heapq/nlargest-nsmallest.js
//
// Emulator for the heapq.nlargest / heapq.nsmallest demo tabs, on _pyheapq.js.

import { nlargest, nsmallest, pyAbs, nums, asPy, tuple } from './_pyheapq.js';

export default {
  // (heapq.nsmallest(n, nums), heapq.nlargest(n, nums))
  both: (xs, n) => {
    const data = nums(xs);
    const k = nums([n])[0];
    return asPy(tuple(nsmallest(k, data), nlargest(k, data)));
  },

  // heapq.nlargest(n, nums, key=abs)
  key: (xs, n) => asPy(nlargest(nums([n])[0], nums(xs), pyAbs)),
};
