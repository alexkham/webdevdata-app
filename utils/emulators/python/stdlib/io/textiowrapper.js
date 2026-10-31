// utils/emulators/python/stdlib/io/textiowrapper.js
//
// Emulator for the io.TextIOWrapper demo tabs, on the UTF-8 TextIOWrapper
// and BytesIO of _pyio.js.

import { BytesIO, TextIOWrapper, utf8Encode, pyDict } from './_pyio.js';

const unescapeCrLf = (s) => s.split('\\r').join('\r').split('\\n').join('\n');

export default {
  read: (text) => {
    const data = utf8Encode(unescapeCrLf(text));
    return pyDict([null, '', '\n', '\r', '\r\n'].map((nl) => [nl, new TextIOWrapper(new BytesIO(data), 'utf-8', null, nl).readlines()]));
  },

  write: (text) => {
    const t0 = text.split('\\n').join('\n');
    return pyDict(['', '\n', '\r', '\r\n'].map((nl) => {
      const t = new TextIOWrapper(new BytesIO(), 'utf-8', null, nl);
      t.write(t0);
      t.flush();
      return [nl, t.buffer.getvalue()];
    }));
  },

  reconfigure: (newline) => {
    const t = new TextIOWrapper(new BytesIO(), 'utf-8', null, '');
    t.write('one\n');
    t.reconfigure({ newline: unescapeCrLf(newline) });
    t.write('two\n');
    t.flush();
    return t.buffer.getvalue();
  },
};
