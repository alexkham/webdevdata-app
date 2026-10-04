// utils/emulators/python/stdlib/string/capwords.js
//
// Emulator for the string.capwords demo tabs, on the port in _pystring.js.

import { capwords, title } from './_pystring.js';

export default {
  // (string.capwords(text), text.title())
  words: (text) => ({ __pyTuple: [capwords(text), title(text)] }),

  // string.capwords(text, sep)
  sep: (text, sep) => capwords(text, sep),
};
