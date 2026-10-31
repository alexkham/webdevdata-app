// utils/emulators/python/stdlib/tempfile/spooledtemporaryfile.js
//
// Emulator for the tempfile.SpooledTemporaryFile demo tabs, on the
// Lib/tempfile.py port in _pytempfile.js.

import { SpooledTemporaryFile } from './_pytempfile.js';
import { utf8Encode, tuple, pyNum } from '../io/_pyio.js';
import { spool } from './index.js';

export default {
  rollover: spool,

  explicit: (maxSize, text) => {
    const f = new SpooledTemporaryFile(pyNum(maxSize));
    f.enter();
    try {
      f.write(utf8Encode(text));
      const before = f.inMemory;
      const pos = f.tell();
      f.rollover();
      const after = f.inMemory;
      const kept = f.tell() === pos;
      f.seek(0n);
      const data = f.read();
      return tuple(before, after, kept, data);
    } finally {
      f.exit();
    }
  },
};
