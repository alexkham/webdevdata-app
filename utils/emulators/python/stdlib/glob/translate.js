// utils/emulators/python/stdlib/glob/translate.js
//
// Emulator for the glob.translate demo tabs, on the CPython port in
// _pyglob.js; re.match runs the regex text through the small regex engine
// of ../fnmatch/_pyfnmatch.js.

import { translate, reMatches } from './_pyglob.js';

export default {
  // glob.translate(pattern, recursive=True, seps='/')
  regex: (pattern) => translate(pattern, { recursive: true, seps: '/' }),

  // regex = glob.translate(pattern, recursive=True, seps='/'); [p for p in paths if re.match(regex, p)]
  match: (pattern, paths) => {
    const regex = translate(pattern, { recursive: true, seps: '/' });
    return paths.filter((p) => reMatches(regex, p));
  },

  // ... include_hidden=True
  hidden: (pattern, paths) => {
    const regex = translate(pattern, { recursive: true, includeHidden: true, seps: '/' });
    return paths.filter((p) => reMatches(regex, p));
  },
};
