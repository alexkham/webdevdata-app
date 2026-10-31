// utils/emulators/python/stdlib/difflib/sequencematcher-get_opcodes.js
//
// Emulator for the SequenceMatcher.get_opcodes / get_grouped_opcodes demo
// tabs, on the CPython port in _pydifflib.js. n is the Python value of the
// literal the code shows.

import { SequenceMatcher, opcodeToPy, contextN, cps, run } from './_pydifflib.js';

export default {
  // [(tag, a[i1:i2], b[j1:j2]) for tag, i1, i2, j1, j2 in SequenceMatcher(None, a, b).get_opcodes()]
  slices: (a, b) => run(() => {
    const ca = cps(a);
    const cb = cps(b);
    return new SequenceMatcher(null, a, b).get_opcodes().map(([tag, i1, i2, j1, j2]) => ({
      __pyTuple: [tag, ca.slice(i1, i2).join(''), cb.slice(j1, j2).join('')],
    }));
  }),

  // difflib.SequenceMatcher(None, a, b).get_opcodes()
  raw: (a, b) => run(() => new SequenceMatcher(null, a, b).get_opcodes().map(opcodeToPy)),

  // list(difflib.SequenceMatcher(None, old.split('|'), new.split('|')).get_grouped_opcodes(n))
  grouped: (oldText, newText, n) => run(() => {
    const a = oldText.split('|');
    const b = newText.split('|');
    const s = new SequenceMatcher(null, a, b);
    return [...s.get_grouped_opcodes(contextN(n, a.length, b.length))].map((g) => g.map(opcodeToPy));
  }),
};
