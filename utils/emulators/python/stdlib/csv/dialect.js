// utils/emulators/python/stdlib/csv/dialect.js
//
// Emulator for the csv.Dialect demo tabs, on the CPython port in
// _pycsv.js (dialect_new validation + the reader).

import { asPy, newCsv, Reader, DialectClass, excel, stringIOLines, typed } from './_pycsv.js';

export default {
  // d = csv.reader([], delimiter=…, quotechar=…).dialect; (d.delimiter, …)
  settings: (delimiter, quotechar) => {
    const d = new Reader(newCsv(), [], undefined, { delimiter, quotechar }).dialect;
    return asPy({ __pyTuple: ['delimiter', 'quotechar', 'escapechar', 'doublequote', 'skipinitialspace', 'quoting', 'lineterminator'].map((n) => d.attr(n)) });
  },

  // class MyDialect(csv.excel): delimiter = …; skipinitialspace = True
  subclass: (delimiter, text) => {
    const MyDialect = new DialectClass('MyDialect', { delimiter, skipinitialspace: true }, excel);
    return asPy(new Reader(newCsv(), stringIOLines(typed(text), ''), MyDialect).all());
  },
};
