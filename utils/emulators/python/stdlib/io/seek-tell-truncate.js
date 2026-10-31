// utils/emulators/python/stdlib/io/seek-tell-truncate.js
//
// Emulator for the seek / tell / truncate demo tabs, on the C io port in
// _pyio.js.

import { StringIO, BytesIO, utf8Encode, tuple, pyNum } from './_pyio.js';

export default {
  // pos = b.seek(offset, whence); (pos, b.read())
  bytes: (text, offset, whence) => {
    const b = new BytesIO(utf8Encode(text));
    const pos = b.seek(pyNum(offset), pyNum(whence));
    return tuple(pos, b.read());
  },

  // pos = f.seek(offset, whence); (pos, f.read())
  text: (text, offset, whence) => {
    const f = new StringIO(text);
    const pos = f.seek(pyNum(offset), pyNum(whence));
    return tuple(pos, f.read());
  },

  // f.seek(pos); n = f.truncate(size); (n, f.tell(), f.getvalue())
  truncate: (text, pos, size) => {
    const f = new StringIO(text);
    f.seek(pyNum(pos));
    const n = f.truncate(size === null ? null : pyNum(size));
    return tuple(n, f.tell(), f.getvalue());
  },
};
