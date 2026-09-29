// utils/emulators/python/stdlib/re/sub.js
//
// Emulator for the re.sub / re.subn demo tabs, on the engine port in
// _pyre.js (replacement templates parsed exactly like
// _parser.parse_template).

import * as re from './_pyre.js';

export default {
  sub: (pattern, repl, text) => re.sub(pattern, repl, text),
  errors: (pattern, repl, text) => re.sub(pattern, repl, text),
  subn: (pattern, repl, text, count) => re.subn(pattern, repl, text, count),
  // lambda m: m.group().upper() — str.upper() is the full Unicode mapping,
  // as is String.prototype.toUpperCase
  func: (pattern, text) => re.sub(pattern, (m) => m.group().toUpperCase(), text),
};
