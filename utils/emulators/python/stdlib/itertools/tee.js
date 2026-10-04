// utils/emulators/python/stdlib/itertools/tee.js
//
// Emulator for the itertools.tee demo tabs, on _pyitertools.js.

import { tee, list, tuple, next, asPy, pyNum } from './_pyitertools.js';

export default {
  // a, b = tee(items); first = next(a, None); first, list(a), list(b)
  lookahead: (items) => {
    const [a, b] = tee(items);
    const first = next(a, null);
    return asPy(tuple(first, list(a), list(b)));
  },

  // [list(t) for t in tee(items, n)]
  n: (items, n) => asPy(tee(items, pyNum(n)).map((t) => list(t))),
};
