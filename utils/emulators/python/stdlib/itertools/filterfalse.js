// utils/emulators/python/stdlib/itertools/filterfalse.js
//
// Emulator for the filterfalse / compress demo tabs, on _pyitertools.js.

import { filterfalse, compress, list, tuple, asPy, pyNum, pyLen, lt } from './_pyitertools.js';

export default {
  // is_long = lambda w: len(w) > n; list(filter(...)), list(filterfalse(...))
  partition: (words, n) => {
    const isLong = (w) => lt(pyNum(n), BigInt(pyLen(w)));
    return asPy(tuple(words.filter(isLong), list(filterfalse(isLong, words))));
  },

  // list(filterfalse(None, items))
  falsy: (items) => asPy(list(filterfalse(null, items))),

  // list(compress(data, flags))
  compress: (data, flags) => asPy(list(compress(data, flags.map(pyNum)))),
};
