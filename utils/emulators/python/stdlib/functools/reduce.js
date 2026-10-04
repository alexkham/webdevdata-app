// utils/emulators/python/stdlib/functools/reduce.js
//
// Emulator for the functools.reduce demo tabs, on _pyfunctools.js.

import { reduce, add, asPy, pyNum, pyValRepr } from './_pyfunctools.js';

// f-string {x} of a str is the str itself
export default {
  // reduce(lambda total, x: total + x, nums)
  sum: (nums) => asPy(reduce(add, nums.map(pyNum))),

  // reduce(lambda total, x: total + x, nums, start)
  initial: (nums, start) => asPy(reduce(add, nums.map(pyNum), pyNum(start))),

  // reduce(lambda acc, x: f'({acc} + {x})', items)
  trace: (items) => {
    const r = reduce((acc, x) => `(${acc} + ${x})`, items);
    return { __pyRaw: pyValRepr(r) };
  },
};
