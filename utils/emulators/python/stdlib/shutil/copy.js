// utils/emulators/python/stdlib/shutil/copy.js
//
// Emulator for the shutil.copy demo, on the shutil port in _pyshutil.js
// (Lib/shutil.py over the Linux file system of os/_vfs.js; a new file is
// created 0o644, chmod(stat.S_IREAD) leaves 0o400).

import { Shutil, seedEmpty, walkFiles } from './_pyshutil.js';

const S_IREAD = 0o400;
const S_IWRITE = 0o200;

export default {
  // new = shutil.copy(src, dst); (new, every file below '.')
  into: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    const created = sh.copy(src, dst);
    return { __pyTuple: [created, walkFiles(sh.fs, '.')] };
  },

  // read-only config.ini copied with copyfile and copy: (dst, content, writable)
  perms: (text) => {
    const sh = new Shutil();
    sh.fs.writeText('config.ini', text);
    sh.fs.chmod('config.ini', S_IREAD);
    const rows = [];
    for (const fn of ['copyfile', 'copy']) {
      const dst = sh[fn]('config.ini', `${fn}.ini`);
      rows.push({ __pyTuple: [dst, sh.fs.readText(dst), Boolean(sh.fs.stat(dst).mode & S_IWRITE)] });
    }
    return rows;
  },
};
