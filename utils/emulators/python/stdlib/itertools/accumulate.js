// utils/emulators/python/stdlib/itertools/accumulate.js
//
// Emulator for the itertools.accumulate demo tabs, on _pyitertools.js.

import { accumulate, list, asPy, pyNum, max2 } from './_pyitertools.js';

const nums = (xs) => xs.map(pyNum);

export default {
  // list(accumulate(nums))
  sum: (xs) => asPy(list(accumulate(nums(xs)))),

  // list(accumulate(nums, max))
  max: (xs) => asPy(list(accumulate(nums(xs), max2))),

  // list(accumulate(nums, initial=start))
  initial: (xs, start) => asPy(list(accumulate(nums(xs), null, pyNum(start)))),
};
