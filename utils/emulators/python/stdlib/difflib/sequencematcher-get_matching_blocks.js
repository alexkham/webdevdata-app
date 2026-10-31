// utils/emulators/python/stdlib/difflib/sequencematcher-get_matching_blocks.js
//
// Emulator for the SequenceMatcher.get_matching_blocks / find_longest_match
// / Match demo tabs, on the CPython port in _pydifflib.js. Index arguments
// are the Python values of the literals the code shows.

import { SequenceMatcher, smallInt, cps, run } from './_pydifflib.js';

export default {
  // difflib.SequenceMatcher(None, a, b).get_matching_blocks()
  blocks: (a, b) => run(() => new SequenceMatcher(null, a, b).get_matching_blocks().map((m) => m.toPy())),

  // difflib.SequenceMatcher(None, a, b).find_longest_match(alo, ahi, blo, bhi)
  longest: (a, b, alo, ahi, blo, bhi) => run(() => {
    const args = [smallInt(alo), smallInt(ahi), smallInt(blo), smallInt(bhi)];
    return new SequenceMatcher(null, a, b).find_longest_match(...args).toPy();
  }),

  // m = difflib.SequenceMatcher(None, a, b).find_longest_match()
  // (m, a[m.a:m.a + m.size])
  match: (a, b) => run(() => {
    const m = new SequenceMatcher(null, a, b).find_longest_match();
    return { __pyTuple: [m.toPy(), cps(a).slice(m.a, m.a + m.size).join('')] };
  }),
};
