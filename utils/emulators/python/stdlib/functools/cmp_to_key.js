// utils/emulators/python/stdlib/functools/cmp_to_key.js
//
// Emulator for the functools.cmp_to_key demo tabs. sorted() with a
// KeyWrapper key only asks compare(a, b) < 0; both comparators here are
// consistent total preorders, so any stable sort (JS Array.prototype.sort
// is stable) yields CPython's exact order.

import { asPy, pyNum, sub, lt } from './_pyfunctools.js';

const cpLen = (s) => [...s].length;

// (a > b) - (a < b) for str: code point order
function strCmp(a, b) {
  if (lt(a, b)) return -1;
  if (lt(b, a)) return 1;
  return 0;
}

export default {
  // sorted(words, key=cmp_to_key(compare)) — by length, then alphabetically
  sort: (words) => asPy([...words].sort((a, b) => (cpLen(a) !== cpLen(b) ? cpLen(a) - cpLen(b) : strCmp(a, b)))),

  // sorted(nums, key=cmp_to_key(lambda a, b: b - a))
  desc: (nums) => asPy(nums.map(pyNum).sort((a, b) => {
    const d = sub(b, a);
    const neg = typeof d === 'bigint' ? d < 0n : d.v < 0;
    const pos = typeof d === 'bigint' ? d > 0n : d.v > 0;
    return neg ? -1 : pos ? 1 : 0;
  })),
};
