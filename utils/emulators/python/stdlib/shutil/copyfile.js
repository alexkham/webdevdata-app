// utils/emulators/python/stdlib/shutil/copyfile.js
//
// Emulator for the shutil.copyfile demo, on the shutil port in
// _pyshutil.js (Lib/shutil.py over the Linux file system of os/_vfs.js).

import { Shutil, seedNamed, typeName, isinst } from './_pyshutil.js';

export default {
  // files hold their own name; (dst, open(dst).read()) or the OSError class name
  copy: (files, src, dst) => {
    const sh = new Shutil();
    seedNamed(sh.fs, files);
    try {
      const d = sh.copyfile(src, dst);
      return { __pyTuple: [d, sh.fs.readText(d)] };
    } catch (e) {
      if (isinst(e, 'OSError')) return typeName(e);
      throw e;
    }
  },

  // a.txt exists; the return value or f'{type(e).__name__}: {e}'
  message: (src, dst) => {
    const sh = new Shutil();
    sh.fs.writeText('a.txt', 'data');
    try {
      return sh.copyfile(src, dst);
    } catch (e) {
      if (isinst(e, 'OSError')) return `${typeName(e)}: ${e.message}`;
      throw e;
    }
  },
};
