// utils/emulators/python/stdlib/fnmatch/translate.js
//
// Emulator for the fnmatch.translate demo, on the CPython port in
// _pyfnmatch.js. re.match runs the translated text through the port's
// small regex engine (the syntax translate produces, plus | for joins).

import { translate, reMatches } from './_pyfnmatch.js';

export default {
  // fnmatch.translate(pattern)
  translate: (pattern) => translate(pattern),

  // regex = fnmatch.translate(pattern); [n for n in names if re.match(regex, n)]
  match: (pattern, names) => {
    const regex = translate(pattern);
    return names.filter((n) => reMatches(regex, n));
  },

  // regex = '|'.join(fnmatch.translate(p) for p in patterns); [n for n in names if re.match(regex, n)]
  join: (patterns, names) => {
    const regex = patterns.map(translate).join('|');
    return names.filter((n) => reMatches(regex, n));
  },
};
