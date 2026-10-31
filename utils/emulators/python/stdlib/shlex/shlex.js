// utils/emulators/python/stdlib/shlex/shlex.js
//
// Emulator for the shlex.shlex class demo tabs, on the CPython port in
// _pyshlex.js.

import { Shlex } from './_pyshlex.js';

export default {
  // list(shlex.shlex(text))
  compat: (text) => [...new Shlex(text)],

  // list(shlex.shlex(text, posix=True))
  posix: (text) => [...new Shlex(text, null, true)],

  // lex = shlex.shlex(text, posix=True); lex.whitespace_split = True; list(lex)
  wsplit: (text) => {
    const lex = new Shlex(text, null, true);
    lex.whitespace_split = true;
    return [...lex];
  },
};
