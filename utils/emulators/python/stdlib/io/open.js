// utils/emulators/python/stdlib/io/open.js
//
// Emulator for the io.open demo: open()'s mode / buffering resolution for an
// existing regular file (the template creates it first), from _pyio.js.

import { openFile, tuple, pyNum } from './_pyio.js';

export default {
  // with io.open('demo.txt', mode, buffering=b) as f: (type(f).__name__, f.mode)
  stack: (mode, buffering) => {
    const f = openFile('demo.txt', mode, pyNum(buffering), true);
    return tuple(f.cls, f.mode);
  },
};
