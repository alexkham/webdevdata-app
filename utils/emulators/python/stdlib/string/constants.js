// utils/emulators/python/stdlib/string/constants.js
//
// Emulator for the string-constants demo tabs, on the port in _pystring.js.

import { CONSTANTS, moduleAttr } from './_pystring.js';

const NAMES = ['ascii_lowercase', 'ascii_uppercase', 'digits', 'hexdigits', 'octdigits', 'punctuation', 'whitespace'];

export default {
  // [n for n in names if ch in getattr(string, n)]   (str "in" = substring test)
  which: (ch) => NAMES.filter((n) => CONSTANTS[n].includes(ch)),

  // all(c in string.hexdigits for c in text)
  check: (text) => ({ __pyRaw: Array.from(text).every((c) => CONSTANTS.hexdigits.includes(c)) ? 'True' : 'False' }),

  // getattr(string, name)
  value: (name) => moduleAttr(name),
};
