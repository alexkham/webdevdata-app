// utils/emulators/python/stdlib/itertools/combinations.js
//
// Emulator for the itertools.combinations demo tabs, on _pyitertools.js.

import { combinations, combinationsWithReplacement, list, asPy, pyNum, add, eq } from './_pyitertools.js';

export default {
  // list(combinations(items, r))
  comb: (items, r) => asPy(list(combinations(items, pyNum(r)))),

  // list(combinations_with_replacement(items, r))
  cwr: (items, r) => asPy(list(combinationsWithReplacement(items, pyNum(r)))),

  // [pair for pair in combinations(nums, 2) if sum(pair) == target]
  sums: (nums, target) => {
    const t = pyNum(target);
    const out = [];
    for (const pair of combinations(nums.map(pyNum), 2n)) {
      // sum() starts from int 0
      const s = pair.__pyTuple.reduce((acc, x) => add(acc, x), 0n);
      if (eq(s, t)) out.push(pair);
    }
    return asPy(out);
  },
};
