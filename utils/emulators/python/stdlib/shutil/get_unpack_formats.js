// utils/emulators/python/stdlib/shutil/get_unpack_formats.js
//
// Emulator for the unpack-format registry demo: the registry and
// unpack_archive's extension lookup from _pyshutil.js (a fresh registry per
// run, like a fresh process), with the snippet's unpackers as JS functions.

import { Shutil, typeName, isinst } from './_pyshutil.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // register (or RegistryError); [(name, exts) …]; unregister
  register: (name, extensions) => {
    const sh = new Shutil();
    try {
      sh.registerUnpackFormat(name, extensions, '', () => null);
    } catch (e) {
      if (typeName(e) === 'RegistryError') return `RegistryError: ${e.message}`;
      throw e;
    }
    const result = sh.getUnpackFormats().map((t) => ({ __pyTuple: [t.__pyTuple[0], t.__pyTuple[1]] }));
    sh.unregisterUnpackFormat(name);
    return result;
  },

  // a spy unpacker for .spy / .dat; unpack_archive(filename, 'out')
  detect: (filename) => {
    const sh = new Shutil();
    const calls = [];
    sh.registerUnpackFormat('spy', ['.spy', '.dat'], '', (fn) => calls.push(fn));
    try {
      sh.unpackArchive(filename, 'out');
      return `spy got ${pyStrRepr(calls[0])}`;
    } catch (e) {
      if (isinst(e, 'ReadError')) return `ReadError: ${e.message}`;
      throw e;
    } finally {
      sh.unregisterUnpackFormat('spy');
    }
  },
};
