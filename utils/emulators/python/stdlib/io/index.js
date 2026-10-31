// utils/emulators/python/stdlib/io/index.js
//
// Emulator for the io module hub demo tabs, on the C io port in _pyio.js.

import { StringIO, BytesIO, printTo, utf8Encode, tuple } from './_pyio.js';

// str.replace('\\n', '\n') — the demo's way to type a line break
export const unescapeNl = (s) => s.split('\\n').join('\n');

export default {
  // f = io.StringIO(text); (f.readline(), f.tell(), f.readlines())
  lines: (text) => {
    const f = new StringIO(unescapeNl(text));
    const first = f.readline();
    const pos = f.tell();
    return tuple(first, pos, f.readlines());
  },

  // print(*words, sep=sep, file=buf); buf.getvalue()
  capture: (words, sep) => {
    const buf = new StringIO();
    printTo(buf, words, sep);
    return buf.getvalue();
  },

  // n = b.write(text.encode()); (n, len(text), b.getvalue())
  bytes: (text) => {
    const b = new BytesIO();
    const n = b.write(utf8Encode(text));
    return tuple(n, BigInt([...text].length), b.getvalue());
  },
};
