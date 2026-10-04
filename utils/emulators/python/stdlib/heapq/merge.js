// utils/emulators/python/stdlib/heapq/merge.js
//
// Emulator for the heapq.merge demo tabs, on _pyheapq.js.

import { merge, pyAbs, nums, asPy } from './_pyheapq.js';

export default {
  // list(heapq.merge(a, b))
  merge: (a, b) => asPy([...merge([nums(a), nums(b)])]),

  // list(heapq.merge(a, b, reverse=True))
  reverse: (a, b) => asPy([...merge([nums(a), nums(b)], null, true)]),

  // list(heapq.merge(a, b, key=abs))
  key: (a, b) => asPy([...merge([nums(a), nums(b)], pyAbs)]),
};
