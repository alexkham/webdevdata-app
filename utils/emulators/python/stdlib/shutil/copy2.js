// utils/emulators/python/stdlib/shutil/copy2.js
//
// Emulator for the shutil.copy2 demo, on the shutil port in _pyshutil.js
// (Lib/shutil.py over the Linux file system of os/_vfs.js). New files get
// a non-integral "now" as mtime, so they never equal a timestamp the
// snippet sets — exactly as with a real clock.

import { Shutil, seedEmpty, utimeStamp } from './_pyshutil.js';

const S_IREAD = 0o400;
const S_IWRITE = 0o200;

export default {
  // report.txt with mtime = stamp, read-only; rows of
  // (fn.__name__, st_mtime == stamp, writable) for copyfile, copy, copy2
  // (os.utime: OverflowError outside time_t; ext4 clamps the stored seconds
  // to 1901 … 2446, so st_mtime == stamp is False beyond that range)
  compare: (stamp) => {
    const sh = new Shutil();
    sh.fs.writeText('report.txt', 'Q3 numbers');
    const { stored, equal } = utimeStamp(stamp);
    sh.fs.utime('report.txt', stored, stored);
    sh.fs.chmod('report.txt', S_IREAD);
    return ['copyfile', 'copy', 'copy2'].map((fn) => {
      const st = sh.fs.stat(sh[fn]('report.txt', `${fn}.txt`));
      return { __pyTuple: [fn, equal && st.mtime === stored, Boolean(st.mode & S_IWRITE)] };
    });
  },

  // every file gets mtime 1234567890; new = copy2(src, dst);
  // (new, getmtime(new) == getmtime(src))
  into: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    for (const f of files) sh.fs.utime(f, 1234567890, 1234567890);
    const created = sh.copy2(src, dst);
    return { __pyTuple: [created, sh.fs.stat(created).mtime === sh.fs.stat(src).mtime] };
  },
};
