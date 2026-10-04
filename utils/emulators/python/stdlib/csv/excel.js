// utils/emulators/python/stdlib/csv/excel.js
//
// Emulator for the built-in dialects demo tabs, on the CPython port in
// _pycsv.js (registry lookups by name).

import { asPy, newCsv, Reader, Writer, StringIOOut, stringIOLines, typed } from './_pycsv.js';

export default {
  // csv.writer(buf, dialect=name).writerows([['id', 'note'], [1, 'say "hi"']])
  write: (name) => {
    const out = new StringIOOut('');
    const w = new Writer(newCsv(), out, name);
    w.writerows([['id', 'note'], [1n, 'say "hi"']]);
    return out.getvalue();
  },

  // list(csv.reader(io.StringIO(text, newline=''), dialect=name))
  read: (text, name) => asPy(new Reader(newCsv(), stringIOLines(typed(text), ''), name).all()),
};
