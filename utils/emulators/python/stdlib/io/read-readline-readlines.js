// utils/emulators/python/stdlib/io/read-readline-readlines.js
//
// Emulator for the read / readline / readlines demo tabs, on the C io port
// in _pyio.js.

import { StringIO, BytesIO, utf8Encode, tuple, pyNum, newByteArray } from './_pyio.js';

const unescapeNl = (s) => s.split('\\n').join('\n');

export default {
  // first = f.read(n); (first, f.tell(), f.read(), f.read())
  read: (text, n) => {
    const f = new StringIO(text);
    const first = f.read(pyNum(n));
    const pos = f.tell();
    const rest = f.read();
    return tuple(first, pos, rest, f.read());
  },

  // [f.readline(size) for _ in range(4)]
  readline: (text, size) => {
    const f = new StringIO(unescapeNl(text));
    const s = pyNum(size);
    const out = [];
    for (let i = 0; i < 4; i += 1) out.push(f.readline(s));
    return out;
  },

  // (io.StringIO(text).readlines(hint), io.BytesIO(text.encode()).readlines(hint))
  hint: (text, hint) => {
    const t = unescapeNl(text);
    const h = pyNum(hint);
    const a = new StringIO(t).readlines(h);
    return tuple(a, new BytesIO(utf8Encode(t)).readlines(h));
  },

  // buf = bytearray(size); n = b.readinto(buf); (n, buf, b.read())
  readinto: (text, size) => {
    const b = new BytesIO(utf8Encode(text));
    const buf = newByteArray(pyNum(size));
    const n = b.readinto(buf);
    return tuple(n, buf, b.read());
  },
};
