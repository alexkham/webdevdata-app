// utils/emulators/python/stdlib/io/write-writelines.js
//
// Emulator for the write / writelines demo tabs, on the C io port in _pyio.js.

import { StringIO, BytesIO, utf8Encode, tuple, pyNum } from './_pyio.js';

export default {
  // counts = [(s.write(p), b.write(p.encode())) for p in parts]
  counts: (parts) => {
    const s = new StringIO();
    const b = new BytesIO();
    const counts = parts.map((p) => {
      const n = s.write(p);
      return tuple(n, b.write(utf8Encode(p)));
    });
    return tuple(counts, s.getvalue(), b.getvalue());
  },

  // f.seek(pos); f.write(more); (f.getvalue(), f.tell())
  position: (text, pos, more) => {
    const f = new StringIO(text);
    f.seek(pyNum(pos));
    f.write(more);
    return tuple(f.getvalue(), f.tell());
  },

  // f.writelines(lines); g.writelines(line + '\n' for line in lines)
  writelines: (lines) => {
    const f = new StringIO();
    const g = new StringIO();
    f.writelines(lines);
    g.writelines(lines.map((line) => line + '\n'));
    return tuple(f.getvalue(), g.getvalue());
  },
};
