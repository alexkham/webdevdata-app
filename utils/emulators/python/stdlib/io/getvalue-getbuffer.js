// utils/emulators/python/stdlib/io/getvalue-getbuffer.js
//
// Emulator for the getvalue / getbuffer demo tabs, on the C io port in
// _pyio.js (BytesIO export counting and the memoryview it hands out).

import { StringIO, BytesIO, utf8Encode, tuple, pyNum } from './_pyio.js';

export default {
  // f.write(text); (f.read(), f.getvalue(), f.tell())
  value: (text) => {
    const f = new StringIO();
    f.write(text);
    const r = f.read();
    const v = f.getvalue();
    return tuple(r, v, f.tell());
  },

  // with b.getbuffer() as view: view[index] = value
  view: (text, index, value) => {
    const b = new BytesIO(utf8Encode(text));
    const view = b.getbuffer();
    try {
      const v = pyNum(value);
      view.setitem(pyNum(index), v);
    } finally {
      view.release();
    }
    return b.getvalue();
  },
};
