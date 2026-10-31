// utils/emulators/python/stdlib/io/stringio.js
//
// Emulator for the io.StringIO demo tabs, on the C io port in _pyio.js.

import { StringIO, tuple, pyDict } from './_pyio.js';

// text.replace('\\r', '\r').replace('\\n', '\n')
export const unescapeCrLf = (s) => s.split('\\r').join('\r').split('\\n').join('\n');
const NEWLINES = [null, '', '\n', '\r', '\r\n'];

export default {
  overwrite: (init, text) => {
    const f = new StringIO(init);
    f.write(text);
    return tuple(f.getvalue(), f.tell());
  },

  stored: (text) => {
    const t = unescapeCrLf(text);
    return pyDict(NEWLINES.map((nl) => [nl, new StringIO(t, nl).getvalue()]));
  },

  lines: (text) => {
    const t = unescapeCrLf(text);
    return pyDict(NEWLINES.map((nl) => [nl, new StringIO(t, nl).readlines()]));
  },

  seen: (parts) => {
    const f = new StringIO('', null);
    for (const part of parts) f.write(unescapeCrLf(part));
    return tuple(f.newlines, f.getvalue());
  },
};
