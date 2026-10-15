// utils/emulators/python/stdlib/shutil/copystat.js
//
// Emulator for the copymode / copystat demo, on the shutil port in
// _pyshutil.js (Lib/shutil.py over the Linux file system of os/_vfs.js).

import { Shutil, seedEmpty, typeName, isinst } from './_pyshutil.js';

const S_IREAD = 0o400;
const S_IWRITE = 0o200;

export default {
  // read-only src.txt with mtime 1000000000; for copymode and copystat:
  // (name, dst content, writable, st_mtime == 1000000000)
  meta: (text) => {
    const sh = new Shutil();
    sh.fs.writeText('src.txt', 'source');
    sh.fs.utime('src.txt', 1000000000, 1000000000);
    sh.fs.chmod('src.txt', S_IREAD);
    return ['copymode', 'copystat'].map((fn) => {
      const dst = `${fn}.txt`;
      sh.fs.writeText(dst, text);
      sh[fn]('src.txt', dst);
      const st = sh.fs.stat(dst);
      return { __pyTuple: [fn, sh.fs.readText(dst), Boolean(st.mode & S_IWRITE), st.mtime === 1000000000] };
    });
  },

  // shutil.copystat(src, dst) → 'copied' or the OSError class name
  missing: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    try {
      sh.copystat(src, dst);
      return 'copied';
    } catch (e) {
      if (isinst(e, 'OSError')) return typeName(e);
      throw e;
    }
  },
};
