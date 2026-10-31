// utils/emulators/python/stdlib/difflib/restore.js
//
// Emulator for the difflib.restore demo, on the CPython port in
// _pydifflib.js. which is the Python value of the literal the code shows.

import { ndiff, restore, literal, run } from './_pydifflib.js';

const lines = (text) => text.split('|').map((l) => l + '\n');

export default {
  // delta = list(difflib.ndiff(old, new)); list(difflib.restore(delta, which))
  restore: (oldText, newText, which) => run(() => {
    const delta = [...ndiff(lines(oldText), lines(newText))];
    return [...restore(delta, literal(which))];
  }),
};
