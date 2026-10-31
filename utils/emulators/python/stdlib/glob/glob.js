// utils/emulators/python/stdlib/glob/glob.js
//
// Emulator for the glob.glob demo tabs, on the CPython port in _pyglob.js
// running over the os module's virtual file system (Linux rules).

import { tree, glob, sortedPaths } from './_pyglob.js';

export default {
  // sorted(p.replace(os.sep, '/') for p in glob.glob(pattern))
  glob: (files, pattern) => sortedPaths(glob(tree(files), pattern)),

  // ... glob.glob(pattern, recursive=True)
  recursive: (files, pattern) => sortedPaths(glob(tree(files), pattern, { recursive: true })),

  // ... glob.glob(pattern, recursive=True, include_hidden=True)
  hidden: (files, pattern) => sortedPaths(glob(tree(files), pattern, { recursive: true, includeHidden: true })),

  // ... glob.glob(pattern, root_dir=root, recursive=True)
  root: (files, root, pattern) => sortedPaths(glob(tree(files), pattern, { rootDir: root, recursive: true })),
};
