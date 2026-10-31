// utils/emulators/python/stdlib/difflib/unified_diff.js
//
// Emulator for the difflib.unified_diff demo tabs, on the CPython port in
// _pydifflib.js. n is the Python value of the literal the code shows.

import { unified_diff, splitlines, contextN, run } from './_pydifflib.js';

export default {
  // list(difflib.unified_diff(old.split('|'), new.split('|'), 'old.txt', 'new.txt', n=n, lineterm=lineterm))
  diff: (oldText, newText, n, lineterm) => run(() => {
    const a = oldText.split('|');
    const b = newText.split('|');
    return [...unified_diff(a, b, 'old.txt', 'new.txt', '', '', contextN(n, a.length, b.length), lineterm)];
  }),

  // list(difflib.unified_diff(['a', 'b', 'c'], ['a', 'B', 'c'], fromfile=..., tofile=...,
  //      fromfiledate=..., tofiledate=..., lineterm=''))
  headers: (fromfile, tofile, fromdate, todate) => run(() => [...unified_diff(['a', 'b', 'c'], ['a', 'B', 'c'], fromfile, tofile, fromdate, todate, 3, '')]),

  // old = old.replace('|', '\n').splitlines(keepends=True) (same for new);
  // list(difflib.unified_diff(old, new, 'old.txt', 'new.txt'))
  files: (oldText, newText) => run(() => {
    const a = splitlines(oldText.replaceAll('|', '\n'), true);
    const b = splitlines(newText.replaceAll('|', '\n'), true);
    return [...unified_diff(a, b, 'old.txt', 'new.txt')];
  }),
};
