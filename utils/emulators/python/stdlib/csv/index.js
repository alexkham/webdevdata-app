// utils/emulators/python/stdlib/csv/index.js
//
// Emulator for the csv module hub demo (read / split vs csv / write), on
// the CPython port in _pycsv.js.

import { asPy, newCsv, Reader, Writer, StringIOOut, stringIOLines, typed, autoVal, nextRow } from './_pycsv.js';

export default {
  // list(csv.reader(io.StringIO(text, newline=''), delimiter=delimiter))
  read: (text, delimiter) => {
    const mod = newCsv();
    return asPy(new Reader(mod, stringIOLines(typed(text), ''), undefined, { delimiter }).all());
  },

  // (line.split(','), next(csv.reader([line])))
  split: (line) => asPy({ __pyTuple: [line.split(','), nextRow(new Reader(newCsv(), [line]))] }),

  // csv.writer(buf).writerow([a, b, c]); buf.getvalue()
  write: (a, b, c) => {
    const row = [a, b, c].map((v) => autoVal(v));
    const out = new StringIOOut('');
    new Writer(newCsv(), out).writerow(row);
    return out.getvalue();
  },
};
