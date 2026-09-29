// utils/emulators/python/stdlib/re/index.js
//
// Emulator for the re module hub demo (search / findall / sub / split), on
// the CPython engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  // m = re.search(pattern, text); m.group() if m else None
  search: (pattern, text) => {
    const m = re.search(pattern, text);
    return m ? m.group() : null;
  },
  findall: (pattern, text) => re.findall(pattern, text),
  sub: (pattern, repl, text) => re.sub(pattern, repl, text),
  split: (pattern, text) => re.split(pattern, text),
};
