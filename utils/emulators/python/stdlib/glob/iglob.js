// utils/emulators/python/stdlib/glob/iglob.js
//
// Emulator for the glob.iglob demo tabs, on the CPython port in _pyglob.js
// (a real generator over the os module's virtual file system).

import { tree, iglob, sortedPaths } from './_pyglob.js';

export default {
  // next(glob.iglob(pattern, recursive=True), None) is not None
  first: (files, pattern) => !iglob(tree(files), pattern, { recursive: true }).next().done,

  // sum(1 for _ in glob.iglob(pattern, recursive=True))
  count: (files, pattern) => {
    let n = 0;
    for (const p of iglob(tree(files), pattern, { recursive: true })) if (p !== undefined) n += 1;
    return n;
  },

  // sorted(p.replace(os.sep, '/') for p in glob.iglob(pattern, recursive=True))
  sorted: (files, pattern) => sortedPaths([...iglob(tree(files), pattern, { recursive: true })]),
};
