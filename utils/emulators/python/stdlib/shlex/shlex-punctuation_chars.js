// utils/emulators/python/stdlib/shlex/shlex-punctuation_chars.js
//
// Emulator for the punctuation_chars demo tabs, on the CPython port in
// _pyshlex.js.

import { Shlex } from './_pyshlex.js';

export default {
  // shlex.shlex(cmd, posix=True, punctuation_chars=True) with whitespace_split = True
  shell: (cmd) => {
    const lex = new Shlex(cmd, null, true, true);
    lex.whitespace_split = true;
    return [...lex];
  },

  // shlex.shlex(cmd, posix=True) with whitespace_split = True
  without: (cmd) => {
    const lex = new Shlex(cmd, null, true);
    lex.whitespace_split = true;
    return [...lex];
  },

  // list(shlex.shlex(cmd, punctuation_chars=chars))
  custom: (cmd, chars) => [...new Shlex(cmd, null, false, chars)],
};
