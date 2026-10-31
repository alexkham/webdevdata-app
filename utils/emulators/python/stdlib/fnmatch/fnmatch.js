// utils/emulators/python/stdlib/fnmatch/fnmatch.js
//
// Emulator for the fnmatch.fnmatch demo, on the CPython port in
// _pyfnmatch.js. POSIX rules: os.path.normcase is the identity, so this is
// fnmatchcase — as on Linux and macOS.

import { fnmatch } from './_pyfnmatch.js';

export default {
  // fnmatch.fnmatch(name, pattern)
  match: (name, pattern) => fnmatch(name, pattern),

  // [n for n in names if fnmatch.fnmatch(n, pattern)]
  many: (names, pattern) => names.filter((n) => fnmatch(n, pattern)),
};
