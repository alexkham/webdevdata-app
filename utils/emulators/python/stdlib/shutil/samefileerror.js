// utils/emulators/python/stdlib/shutil/samefileerror.js
//
// Emulator for the shutil.SameFileError demo: copyfile's samefile check
// (same file system node, whatever the spelling) from _pyshutil.js.

import { Shutil, typeName, isinst } from './_pyshutil.js';

export default {
  // a.txt exists; shutil.copyfile(src, dst), uncaught
  trigger: (src, dst) => {
    const sh = new Shutil();
    sh.fs.writeText('a.txt', 'data');
    return sh.copyfile(src, dst);
  },

  // 'copied' or (type(e).__name__, isinstance(e, OSError)) for a shutil.Error
  catch: (dst) => {
    const sh = new Shutil();
    sh.fs.writeText('a.txt', '');
    try {
      sh.copyfile('a.txt', dst);
      return 'copied';
    } catch (e) {
      if (isinst(e, 'Error')) return { __pyTuple: [typeName(e), true] };
      throw e;
    }
  },
};
