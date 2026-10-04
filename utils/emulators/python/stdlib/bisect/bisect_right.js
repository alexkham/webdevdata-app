// utils/emulators/python/stdlib/bisect/bisect_right.js
//
// Emulator for the bisect.bisect_right / bisect.bisect demo tabs, on _pybisect.js.

import { bisectLeft, bisectRight, nums, num, asPy } from './_pybisect.js';

export default {
  // bisect.bisect_right(a, x)
  position: (a, x) => asPy(bisectRight(nums(a), num(x))),

  // bisect_right(a, x) - bisect_left(a, x): how many items equal x
  count: (a, x) => {
    const list = nums(a);
    const v = num(x);
    return asPy(bisectRight(list, v) - bisectLeft(list, v));
  },

  // [bisect.bisect(breaks, x) for x in values] — bucket numbers
  buckets: (breaks, values) => {
    const b = nums(breaks);
    return asPy(nums(values).map((x) => bisectRight(b, x)));
  },
};
