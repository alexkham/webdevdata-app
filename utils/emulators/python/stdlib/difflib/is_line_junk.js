// utils/emulators/python/stdlib/difflib/is_line_junk.js
//
// Emulator for the IS_LINE_JUNK / IS_CHARACTER_JUNK demo tabs, on the
// CPython port in _pydifflib.js.

import { IS_LINE_JUNK, IS_CHARACTER_JUNK, cps } from './_pydifflib.js';

export default {
  // [difflib.IS_LINE_JUNK(line) for line in lines.split('|')]
  line: (lines) => lines.split('|').map((l) => IS_LINE_JUNK(l)),

  // [(ch, difflib.IS_CHARACTER_JUNK(ch)) for ch in text]
  char: (text) => cps(text).map((ch) => ({ __pyTuple: [ch, IS_CHARACTER_JUNK(ch)] })),

  // difflib.IS_CHARACTER_JUNK(s)
  substring: (s) => IS_CHARACTER_JUNK(s),
};
