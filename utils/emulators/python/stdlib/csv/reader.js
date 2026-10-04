// utils/emulators/python/stdlib/csv/reader.js
//
// Emulator for the csv.reader demo tabs, on the CPython port in _pycsv.js.

import { asPy, newCsv, Reader, DONE, stringIOLines, typed } from './_pycsv.js';

const lines = (text) => stringIOLines(typed(text), '');

export default {
  // list(csv.reader(io.StringIO(text, newline=''), delimiter=…, quotechar=…))
  rows: (text, delimiter, quotechar) => asPy(new Reader(newCsv(), lines(text), undefined, { delimiter, quotechar }).all()),

  // [(r.line_num, row) for row in r]
  linenum: (text) => {
    const r = new Reader(newCsv(), lines(text));
    const out = [];
    for (let row = r.next(); row !== DONE; row = r.next()) out.push({ __pyTuple: [BigInt(r.line_num), row] });
    return asPy(out);
  },

  // (non-strict rows, strict rows)
  strict: (text) => {
    const loose = new Reader(newCsv(), lines(text)).all();
    const strict = new Reader(newCsv(), lines(text), undefined, { strict: true }).all();
    return asPy({ __pyTuple: [loose, strict] });
  },
};
