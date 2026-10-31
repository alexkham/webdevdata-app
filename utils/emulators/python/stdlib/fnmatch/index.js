// utils/emulators/python/stdlib/fnmatch/index.js
//
// Emulator for the fnmatch module hub demo (filter, fnmatchcase,
// translate), on the CPython port in _pyfnmatch.js. filter follows POSIX
// (os.path.normcase is the identity), as the tab says.

import { filter, fnmatchcase, translate } from './_pyfnmatch.js';

export default {
  // fnmatch.filter(names, pattern)
  filter: (names, pattern) => filter(names, pattern),

  // fnmatch.fnmatchcase(name, pattern)
  case: (name, pattern) => fnmatchcase(name, pattern),

  // fnmatch.translate(pattern)
  translate: (pattern) => translate(pattern),
};
