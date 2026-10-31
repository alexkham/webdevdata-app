// utils/emulators/python/stdlib/fnmatch/fnmatchcase.js
//
// Emulator for the fnmatch.fnmatchcase demo, on the CPython port in
// _pyfnmatch.js (translate + the regex it produces).

import { fnmatchcase } from './_pyfnmatch.js';

export default {
  // fnmatch.fnmatchcase(name, pattern)
  match: (name, pattern) => fnmatchcase(name, pattern),

  // [n for n in names if fnmatch.fnmatchcase(n, pattern)]
  select: (names, pattern) => names.filter((n) => fnmatchcase(n, pattern)),
};
