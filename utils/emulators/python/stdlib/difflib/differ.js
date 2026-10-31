// utils/emulators/python/stdlib/difflib/differ.js
//
// Emulator for the difflib.Differ demo tabs, on the CPython port in
// _pydifflib.js.

import { Differ, IS_LINE_JUNK, run } from './_pydifflib.js';

const lines = (text) => text.split('|').map((l) => l + '\n');

export default {
  // list(difflib.Differ().compare(old, new))
  compare: (oldText, newText) => run(() => [...new Differ().compare(lines(oldText), lines(newText))]),

  // (list(Differ().compare(old, new)), list(Differ(linejunk=IS_LINE_JUNK).compare(old, new)))
  linejunk: (oldText, newText) => run(() => {
    const a = lines(oldText);
    const b = lines(newText);
    const plain = [...new Differ().compare(a, b)];
    const junk = [...new Differ((l) => IS_LINE_JUNK(l)).compare(a, b)];
    return { __pyTuple: [plain, junk] };
  }),
};
