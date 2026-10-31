// utils/emulators/python/stdlib/glob/index.js
//
// Emulator for the glob module hub demo, on the CPython port in
// _pyglob.js running over the os module's virtual file system. The
// template's file-creating loop is tree(files); sorted(...) and
// replace(os.sep, '/') are sortedPaths (on POSIX the replace is a no-op).

import { tree, glob, escape, sortedPaths } from './_pyglob.js';

export default {
  // sorted(p.replace(os.sep, '/') for p in glob.glob(pattern))
  glob: (files, pattern) => sortedPaths(glob(tree(files), pattern)),

  // sorted(p.replace(os.sep, '/') for p in glob.glob(pattern, recursive=True))
  recursive: (files, pattern) => sortedPaths(glob(tree(files), pattern, { recursive: true })),

  // glob.escape(name)
  escape: (name) => escape(name),
};
