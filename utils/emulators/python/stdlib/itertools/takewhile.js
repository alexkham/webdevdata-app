// utils/emulators/python/stdlib/itertools/takewhile.js
//
// Emulator for the takewhile / dropwhile demo tabs, on _pyitertools.js.

import { takewhile, dropwhile, list, tuple, asPy, pyNum, lt } from './_pyitertools.js';

export default {
  // taken, dropped, filtered — each with the test x < limit
  split: (nums, limit) => {
    // the template evaluates {$limit} inside the lambda, so a bad literal
    // only fails once the lambda first runs — on an empty list it never does
    const xs = nums.map(pyNum);
    const below = (x) => lt(x, pyNum(limit));
    const taken = list(takewhile(below, xs));
    const dropped = list(dropwhile(below, xs));
    const filtered = xs.filter(below);
    return asPy(tuple(taken, dropped, filtered));
  },

  // list(dropwhile(lambda line: line.startswith('#'), lines))
  comments: (lines) => asPy(list(dropwhile((line) => line.startsWith('#'), lines))),
};
