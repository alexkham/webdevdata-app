// utils/emulators/python/stdlib/difflib/index.js
//
// Emulator for the difflib module hub demo (unified diff, ndiff,
// SequenceMatcher, get_close_matches), on the CPython port in _pydifflib.js.

import { unified_diff, ndiff, SequenceMatcher, get_close_matches, opcodeToPy, run } from './_pydifflib.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';

const lines = (text) => text.split('|').map((l) => l + '\n');

export default {
  // list(difflib.unified_diff(old.split('|'), new.split('|'), 'old.txt', 'new.txt', lineterm=''))
  unified: (oldText, newText) => run(() => [...unified_diff(oldText.split('|'), newText.split('|'), 'old.txt', 'new.txt', '', '', 3, '')]),

  // list(difflib.ndiff([l + '\n' for l in old.split('|')], [... new ...]))
  ndiff: (oldText, newText) => run(() => [...ndiff(lines(oldText), lines(newText))]),

  // s = difflib.SequenceMatcher(None, a, b); (s.ratio(), s.get_opcodes())
  ratio: (a, b) => run(() => {
    const s = new SequenceMatcher(null, a, b);
    return { __pyTuple: [{ __pyRaw: pyFloatRepr(s.ratio()) }, s.get_opcodes().map(opcodeToPy)] };
  }),

  // difflib.get_close_matches(word, words)
  close: (word, words) => run(() => get_close_matches(word, words)),
};
