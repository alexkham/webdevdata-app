// utils/emulators/python/stdlib/shutil/rmtree.js
//
// Emulator for the shutil.rmtree demo: the fd-based walk CPython uses on
// Linux (_rmtree_safe_fd), ported in _pyshutil.js over the file system of
// os/_vfs.js. onexc receives the same function names CPython passes
// (lstat, open, scandir, unlink, rmdir, close).

import { Shutil, seedEmpty, walkAll, typeName, isinst } from './_pyshutil.js';

export default {
  // shutil.rmtree(target); everything left below '.' — or the OSError class name
  remove: (files, target) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    try {
      sh.rmtree(target);
      return walkAll(sh.fs, '.');
    } catch (e) {
      if (isinst(e, 'OSError')) return typeName(e);
      throw e;
    }
  },

  // onexc collects (func.__name__, path, type(exc).__name__); (errors, exists(target))
  onexc: (files, target) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    const errors = [];
    sh.rmtree(target, (func, path, exc) => errors.push({ __pyTuple: [func, path, typeName(exc)] }));
    return { __pyTuple: [errors, sh.fs.exists(target)] };
  },
};
