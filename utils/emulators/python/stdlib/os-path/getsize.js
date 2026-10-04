// utils/emulators/python/stdlib/os-path/getsize.js
//
// Emulator for the os.path.getsize / getmtime / getatime demo.

import { tuple } from './_posixpath.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

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

const pyFloat = (n) => ({ __pyRaw: pyFloatRepr(n) });

export default {
  // (os.path.getsize('notes.txt'), len(text))
  size: (text) => tuple(utf8Length(text), [...text].length),

  // os.utime('f.txt', (atime, mtime)); (getmtime, getatime)
  times: (atime, mtime) => tuple(pyFloat(mtime), pyFloat(atime)),
};
