// utils/emulators/python/stdlib/difflib/context_diff.js
//
// Emulator for the difflib.context_diff demo tabs, on the CPython port in
// _pydifflib.js. n is the Python value of the literal the code shows.

import { context_diff, contextN, run } from './_pydifflib.js';

export default {
  // list(difflib.context_diff(old.split('|'), new.split('|'), 'old.txt', 'new.txt', n=n, lineterm=''))
  diff: (oldText, newText, n) => run(() => {
    const a = oldText.split('|');
    const b = newText.split('|');
    return [...context_diff(a, b, 'old.txt', 'new.txt', '', '', contextN(n, a.length, b.length), '')];
  }),

  // list(difflib.context_diff(['a', 'b', 'c'], ['a', 'B', 'c'], fromfile=..., tofile=...,
  //      fromfiledate=..., tofiledate=..., lineterm=lineterm))
  headers: (fromfile, tofile, fromdate, lineterm) => run(() => [...context_diff(['a', 'b', 'c'], ['a', 'B', 'c'], fromfile, tofile, fromdate, '', 3, lineterm)]),
};
