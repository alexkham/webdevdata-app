// utils/emulators/python/stdlib/difflib/get_close_matches.js
//
// Emulator for the difflib.get_close_matches demo tabs, on the CPython port
// in _pydifflib.js. n is the Python value of the literal the code shows; a
// cutoff typed as inf is a NameError, as in the shown code.

import { get_close_matches, SequenceMatcher, cmpStr, literal, run } from './_pydifflib.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';

export default {
  // difflib.get_close_matches(word, words, n=n, cutoff=cutoff)
  match: (word, words, n, cutoff) => run(() => {
    const nv = literal(n);
    if (!Number.isFinite(cutoff)) literal(cutoff);   // NameError for inf
    return get_close_matches(word, words, nv, cutoff);
  }),

  // sorted(((difflib.SequenceMatcher(None, w, word).ratio(), w) for w in words), reverse=True)
  scores: (word, words) => run(() => words
    .map((w) => [new SequenceMatcher(null, w, word).ratio(), w])
    .sort((p, q) => (q[0] - p[0]) || cmpStr(q[1], p[1]))
    .map(([r, w]) => ({ __pyTuple: [{ __pyRaw: pyFloatRepr(r) }, w] }))),
};
