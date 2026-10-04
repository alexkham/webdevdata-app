// utils/emulators/python/stdlib/itertools/batched.js
//
// Emulator for the itertools.batched demo tabs, on _pyitertools.js.

import { batched, list, asPy, pyNum } from './_pyitertools.js';

export default {
  // list(batched(items, n))
  chunks: (items, n) => asPy(list(batched(items, pyNum(n)))),

  // list(batched(items, n, strict=True))
  strict: (items, n) => asPy(list(batched(items, pyNum(n), true))),

  // [''.join(chunk) for chunk in batched(text, n)]
  text: (text, n) => asPy(list(batched(text, pyNum(n))).map((t) => t.__pyTuple.join(''))),
};
