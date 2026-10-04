// utils/emulators/python/stdlib/itertools/islice.js
//
// Emulator for the itertools.islice demo tabs, on _pyitertools.js.

import { islice, count, list, tuple, asPy, pyNum, iter, mul } from './_pyitertools.js';

const opt = (v) => (v === null ? null : pyNum(v));

export default {
  // ''.join(islice(text, start, stop, step))
  slice: (text, start, stop, step) => list(islice(text, opt(start), opt(stop), opt(step))).join(''),

  // it = iter(items); head = list(islice(it, n)); head, list(it)
  consume: (items, n) => {
    const it = iter(items);
    const head = list(islice(it, pyNum(n)));
    return asPy(tuple(head, list(it)));
  },

  // squares = (x * x for x in count(1)); list(islice(squares, n))
  infinite: (n) => {
    const stop = pyNum(n);
    const squares = (function* gen() {
      for (const x of count(1n)) yield mul(x, x);
    })();
    return asPy(list(islice(squares, stop)));
  },
};
