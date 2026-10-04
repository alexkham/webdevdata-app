// utils/emulators/python/stdlib/bisect/index.js
//
// Emulator for the bisect module hub demo, on the CPython port in _pybisect.js.

import { bisectLeft, bisectRight, nums, num, asPy, tuple, raise } from './_pybisect.js';

// 'FDCBA'[i] — a str index (always 0..4 here, but checked like Python)
function strIndex(s, i) {
  const n = BigInt(s.length);
  const j = i < 0n ? i + n : i;
  if (j < 0n || j >= n) raise('IndexError', 'string index out of range');
  return s[Number(j)];
}

export default {
  // the docs' grade() table lookup
  grade: (scores) => {
    const breakpoints = [60n, 70n, 80n, 90n];
    return asPy(nums(scores).map((score) => strIndex('FDCBA', bisectRight(breakpoints, score))));
  },

  // (bisect_left(a, x), bisect_right(a, x))
  leftright: (a, x) => {
    const list = nums(a);
    const v = num(x);
    return asPy(tuple(bisectLeft(list, v), bisectRight(list, v)));
  },
};
