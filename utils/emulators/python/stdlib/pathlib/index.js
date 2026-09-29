// utils/emulators/python/stdlib/pathlib/index.js
//
// Emulator for the pathlib module hub demo (path anatomy + glob over a
// small tree), on the CPython port in _pypath.js.

import { pure, VFS, makePath, seedFiles, sortPy, py, tuple } from './_pypath.js';

export default {
  // p = PurePosixPath(path); (p.parent, p.name, p.stem, p.suffix)
  anatomy: (path) => {
    const p = pure(path);
    return py(tuple(p.parent, p.name, p.stem, p.suffix));
  },

  // create the files, then sorted(p.as_posix() for p in Path('.').glob(pattern))
  tree: (files, pattern) => {
    const Path = makePath(new VFS());
    seedFiles(Path, files);
    return sortPy(Path('.').glob(pattern).map((p) => p.asPosix()));
  },
};
