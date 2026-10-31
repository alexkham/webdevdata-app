// utils/emulators/python/stdlib/fnmatch/filter.js
//
// Emulator for the fnmatch.filter demo, on the CPython port in
// _pyfnmatch.js. POSIX rules (os.path.normcase is the identity).

import { filter, fnmatch } from './_pyfnmatch.js';

export default {
  // fnmatch.filter(names, pattern)
  filter: (names, pattern) => filter(names, pattern),

  // [n for n in names if not fnmatch.fnmatch(n, pattern)]
  exclude: (names, pattern) => names.filter((n) => !fnmatch(n, pattern)),

  // [n for n in names if any(fnmatch.fnmatch(n, p) for p in patterns)]
  any: (names, patterns) => names.filter((n) => patterns.some((p) => fnmatch(n, p))),
};
