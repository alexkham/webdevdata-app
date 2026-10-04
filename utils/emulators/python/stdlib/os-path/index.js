// utils/emulators/python/stdlib/os-path/index.js
//
// Emulator for the os.path hub demo: posixpath anatomy and join (the port
// in _posixpath.js) and exists/isfile/isdir on the virtual file system.

import { dirname, basename, splitext, join, tuple } from './_posixpath.js';
import { VFS, seed } from '../os/_vfs.js';

export default {
  anatomy: (p) => tuple(dirname(p), basename(p), splitext(p)[1]),

  join: (parts) => {
    // posixpath.join(*[]) → TypeError (join needs at least one argument)
    if (parts.length === 0) {
      const e = new Error("join() missing 1 required positional argument: 'a'");
      e.name = 'TypeError';
      throw e;
    }
    return join(...parts);
  },

  exists: (files, query) => {
    const fs = new VFS();
    seed(fs, files);
    return tuple(fs.exists(query), fs.isfile(query), fs.isdir(query));
  },
};
