// utils/emulators/python/stdlib/itertools/pairwise.js
//
// Emulator for the itertools.pairwise demo tabs, on _pyitertools.js.

import { pairwise, list, asPy, pyNum, sub, lt } from './_pyitertools.js';

export default {
  // list(pairwise(items))
  pairs: (items) => asPy(list(pairwise(items))),

  // [b - a for a, b in pairwise(nums)]
  diffs: (nums) => asPy(list(pairwise(nums.map(pyNum))).map((t) => sub(t.__pyTuple[1], t.__pyTuple[0]))),

  // all(a <= b for a, b in pairwise(nums))  — a <= b is not (b < a) for numbers
  sorted: (nums) => {
    for (const t of pairwise(nums.map(pyNum))) {
      const [a, b] = t.__pyTuple;
      if (lt(b, a)) return false;
    }
    return true;
  },
};
