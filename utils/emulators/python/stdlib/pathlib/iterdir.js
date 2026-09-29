// utils/emulators/python/stdlib/pathlib/iterdir.js
//
// Emulator for the iterdir demo, on the virtual file system in _pypath.js.

import { makePath, VFS, seedFiles, sortPy } from './_pypath.js';

export default {
  // create the files; sorted(p.as_posix() for p in Path(folder).iterdir())
  list: (files, folder) => {
    const Path = makePath(new VFS());
    seedFiles(Path, files);
    return sortPy(Path(folder).iterdir().map((p) => p.asPosix()));
  },
};
