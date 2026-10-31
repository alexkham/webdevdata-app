// utils/emulators/python/stdlib/difflib/ndiff.js
//
// Emulator for the difflib.ndiff demo tabs, on the CPython port in
// _pydifflib.js.

import { ndiff, run } from './_pydifflib.js';

const lines = (text) => text.split('|').map((l) => l + '\n');
const hints = (delta) => [...delta].filter((l) => l.startsWith('?'));

export default {
  // list(difflib.ndiff([l + '\n' for l in old.split('|')], [... new ...]))
  delta: (oldText, newText) => run(() => [...ndiff(lines(oldText), lines(newText))]),

  // (hints(difflib.ndiff(old, new)), hints(difflib.ndiff(old, new, charjunk=None)))
  charjunk: (oldLine, newLine) => run(() => {
    const a = [oldLine + '\n'];
    const b = [newLine + '\n'];
    return { __pyTuple: [hints(ndiff(a, b)), hints(ndiff(a, b, null, null))] };
  }),

  // list(difflib.ndiff(old.split('|'), new.split('|')))
  raw: (oldText, newText) => run(() => [...ndiff(oldText.split('|'), newText.split('|'))]),
};
