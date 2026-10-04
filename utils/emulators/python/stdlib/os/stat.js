// utils/emulators/python/stdlib/os/stat.js
//
// Emulator for the os.stat demo: st_size of UTF-8 text, the file type
// from st_mode (virtual file system in _vfs.js), and utime round trips.

import { VFS, seed, isOSError } from './_vfs.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

const tuple = (...items) => ({ __pyTuple: items });

// str.encode('utf-8'): lone surrogates are an error, like CPython
function utf8Length(text) {
  let n = 0;
  let pos = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      throw new PyException('UnicodeEncodeError', `'utf-8' codec can't encode character '${'\\'}u${cp.toString(16)}' in position ${pos}: surrogates not allowed`);
    }
    n += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
    pos += 1;
  }
  return n;
}

export default {
  // (os.stat('data.txt').st_size, len(text))
  size: (text) => tuple(utf8Length(text), [...text].length),

  // (stat.S_ISDIR(st.st_mode), stat.S_ISREG(st.st_mode)) or the OSError class name
  kind: (files, path) => {
    const fs = new VFS();
    seed(fs, files);
    try {
      const n = fs.stat(path);
      return tuple(n.type === 'dir', n.type === 'file');
    } catch (e) {
      if (isOSError(e)) return e.name;
      throw e;
    }
  },

  // os.utime('f.txt', (1000000000, mtime)); (st.st_mtime, st.st_mtime_ns)
  utime: (mtime) => tuple({ __pyRaw: pyFloatRepr(mtime) }, BigInt(mtime) * 1000000000n),
};
