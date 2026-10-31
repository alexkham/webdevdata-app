// utils/emulators/python/stdlib/io/bytesio.js
//
// Emulator for the io.BytesIO demo tabs, on the C io port in _pyio.js.

import { BytesIO, utf8Encode, tuple } from './_pyio.js';

export default {
  // n = b.write(text.encode()); (n, len(text), b.getvalue())
  count: (text) => {
    const b = new BytesIO();
    const n = b.write(utf8Encode(text));
    return tuple(n, BigInt([...text].length), b.getvalue());
  },

  // b = io.BytesIO(init.encode()); b.write(text.encode()); (b.getvalue(), b.tell())
  overwrite: (init, text) => {
    const b = new BytesIO(utf8Encode(init));
    b.write(utf8Encode(text));
    return tuple(b.getvalue(), b.tell());
  },
};
