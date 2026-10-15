// utils/emulators/python/stdlib/shutil/unpack_archive.js
//
// Emulator for the shutil.unpack_archive demo: the extension lookup,
// _unpack_zipfile and the tarfile extraction (with the 'data' filter)
// ported in _pyshutil.js over the Linux file system of os/_vfs.js.

import { Shutil, seedEmpty, walkAll, typeName, isinst } from './_pyshutil.js';

export default {
  // make_archive('backup', fmt, root_dir='project'); unpack into restored/
  // (filter='data' unless zip); everything below restored/
  roundtrip: (files, fmt) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    const name = sh.makeArchive('backup', fmt, 'project');
    sh.unpackArchive(name, 'restored', null, name.endsWith('.zip') ? null : 'data');
    return walkAll(sh.fs, 'restored');
  },

  // nothing exists; unpack_archive(filename, 'out') → 'unpacked' or 'Type: message'
  detect: (filename) => {
    const sh = new Shutil();
    try {
      sh.unpackArchive(filename, 'out');
      return 'unpacked';
    } catch (e) {
      if (isinst(e, 'OSError')) return `${typeName(e)}: ${e.message}`;
      throw e;
    }
  },
};
