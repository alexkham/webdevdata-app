// utils/emulators/python/stdlib/os/makedirs.js
//
// Emulator for the mkdir / makedirs / removedirs demo, on the virtual
// file system in _vfs.js (Lib/os.py's makedirs and removedirs algorithms).

import { VFS, seed, pySorted, isOSError } from './_vfs.js';

const tuple = (...items) => ({ __pyTuple: items });

function attempt(fn) {
  try {
    fn();
    return 'created';
  } catch (e) {
    if (isOSError(e)) return e.name;
    throw e;
  }
}

export default {
  mkdir: (existing, path) => {
    const fs = new VFS();
    for (const d of existing) fs.makedirs(d);
    return attempt(() => fs.mkdir(path));
  },

  makedirs: (existing, path) => {
    const fs = new VFS();
    for (const d of existing) fs.makedirs(d);
    const plain = attempt(() => fs.makedirs(path));
    fs.makedirs(path, true);
    return tuple(plain, fs.isdir(path));
  },

  removedirs: (files, path) => {
    const fs = new VFS();
    seed(fs, files);
    fs.makedirs(path, true);
    fs.removedirs(path);
    return pySorted(fs.listdir('.'));
  },
};
