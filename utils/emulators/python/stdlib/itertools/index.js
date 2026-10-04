// utils/emulators/python/stdlib/itertools/index.js
//
// Emulator for the itertools module hub demo, on the CPython port in
// _pyitertools.js.

import { groupby, combinations, cycle, islice, list, tuple, asPy, pyNum } from './_pyitertools.js';

export default {
  // [(ch, len(list(run))) for ch, run in groupby(text)]
  rle: (text) => {
    const out = [];
    for (const { key, group } of groupby(text)) out.push(tuple(key, BigInt(list(group).length)));
    return asPy(out);
  },

  // list(combinations(items, r))
  combos: (items, r) => asPy(list(combinations(items, pyNum(r)))),

  // list(islice(cycle(items), n))
  cycle: (items, n) => asPy(list(islice(cycle(items), pyNum(n)))),
};
