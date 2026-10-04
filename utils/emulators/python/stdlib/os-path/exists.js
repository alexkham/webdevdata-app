// utils/emulators/python/stdlib/os-path/exists.js
//
// Emulator for the os.path.exists / isfile / isdir demo, on the virtual
// file system in ../os/_vfs.js.

import { VFS, seed } from '../os/_vfs.js';
import { tuple } from './_posixpath.js';

export default {
  check: (files, checks) => {
    const fs = new VFS();
    seed(fs, files);
    return checks.map((p) => tuple(p, fs.exists(p), fs.isfile(p), fs.isdir(p)));
  },
};
