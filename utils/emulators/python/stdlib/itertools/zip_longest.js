// utils/emulators/python/stdlib/itertools/zip_longest.js
//
// Emulator for the itertools.zip_longest demo tabs, on _pyitertools.js.

import { zipLongest, list, tuple, asPy } from './_pyitertools.js';

// f'{l:<6}' for a str: pad with spaces on the right to 6 code points
const ljust6 = (s) => s + ' '.repeat(Math.max(0, 6 - [...s].length));

export default {
  // list(zip_longest(a, b, fillvalue=fill))
  pad: (a, b, fill) => asPy(list(zipLongest([a, b], fill))),

  // list(zip(a, b)), list(zip_longest(a, b))
  compare: (a, b) => {
    const n = Math.min(a.length, b.length);
    const zipped = a.slice(0, n).map((x, i) => tuple(x, b[i]));
    return asPy(tuple(zipped, list(zipLongest([a, b]))));
  },

  // [f'{l:<6}|{r}' for l, r in zip_longest(left, right, fillvalue='')]
  columns: (left, right) => asPy(list(zipLongest([left, right], '')).map((t) => `${ljust6(t.__pyTuple[0])}|${t.__pyTuple[1]}`)),
};
