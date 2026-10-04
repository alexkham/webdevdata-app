// utils/emulators/python/stdlib/string/index.js
//
// Emulator for the string module hub demo, on the CPython port in _pystring.js.

import { Template, capwords, punctuation, title } from './_pystring.js';

export default {
  // Template(text).substitute(who=who, what=what)
  template: (text, who, what) => new Template(text).substitute(new Map([['who', who], ['what', what]])),

  // (string.capwords(text), text.title())
  capwords: (text) => ({ __pyTuple: [capwords(text), title(text)] }),

  // ''.join(c for c in text if c not in string.punctuation)
  chars: (text) => Array.from(text).filter((c) => !punctuation.includes(c)).join(''),
};
