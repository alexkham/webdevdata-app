// utils/emulators/python/stdlib/pathlib/exists.js
//
// Emulator for the exists / is_file / is_dir demo, on the virtual file
// system in _pypath.js.

import { makePath, VFS, seedFiles, tuple } from './_pypath.js';

export default {
  // create the files; p = Path(query); (p.exists(), p.is_file(), p.is_dir())
  check: (files, query) => {
    const Path = makePath(new VFS());
    seedFiles(Path, files);
    const p = Path(query);
    return tuple(p.exists(), p.isFile(), p.isDir());
  },
};
