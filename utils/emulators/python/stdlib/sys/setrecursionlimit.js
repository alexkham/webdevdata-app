// utils/emulators/python/stdlib/sys/setrecursionlimit.js
//
// Emulator for the sys.setrecursionlimit demo: the argument checks of
// setrecursionlimit, called from a top-level script (recursion depth 1),
// followed by getrecursionlimit(); the finally restores the old limit.

import { setRecursionLimit } from './_pysys.js';

export default {
  set: (limit) => setRecursionLimit(limit),
};
