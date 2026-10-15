// utils/emulators/python/stdlib/shutil/move.js
//
// Emulator for the shutil.move demo, on the shutil port in _pyshutil.js:
// Linux rename(2) rules (os/_vfs.js), then the copy + delete fallback.

import { Shutil, seedEmpty, walkFiles, typeName, isinst } from './_pyshutil.js';
import { PyException } from '../../../../py-exceptions.js';

// moved.replace(...) on the None that move returns for move(d, d)
function str(moved) {
  if (moved === null) throw new PyException('AttributeError', "'NoneType' object has no attribute 'replace'");
  return moved;
}

export default {
  // (moved, every file below '.') — or the OSError class name
  move: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    let moved;
    try {
      moved = sh.move(src, dst);
    } catch (e) {
      if (isinst(e, 'OSError')) return typeName(e);
      throw e;
    }
    return { __pyTuple: [str(moved), walkFiles(sh.fs, '.')] };
  },

  // the return value, or str(e) of a shutil.Error
  message: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    let moved;
    try {
      moved = sh.move(src, dst);
    } catch (e) {
      if (isinst(e, 'Error')) return e.message;
      throw e;
    }
    return str(moved);
  },
};
