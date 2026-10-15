// utils/emulators/python/stdlib/shutil/readerror.js
//
// Emulator for the shutil.ReadError demo: unpack_archive's extension
// lookup and the zip / tar checks from _pyshutil.js.

import { Shutil, typeName, isinst } from './_pyshutil.js';

export default {
  // a plain text file under that name; shutil.unpack_archive(filename, 'out'), uncaught
  trigger: (filename) => {
    const sh = new Shutil();
    sh.fs.writeText(filename, 'not an archive');
    sh.unpackArchive(filename, 'out');
    return null;
  },

  // nothing exists; 'unpacked' or (type(e).__name__, isinstance(e, shutil.ReadError))
  catch: (filename) => {
    const sh = new Shutil();
    try {
      sh.unpackArchive(filename, 'out');
      return 'unpacked';
    } catch (e) {
      if (isinst(e, 'OSError')) return { __pyTuple: [typeName(e), isinst(e, 'ReadError')] };
      throw e;
    }
  },
};
