// utils/emulators/python/stdlib/csv/dictreader.js
//
// Emulator for the csv.DictReader demo tabs, on the Lib/csv.py port in
// _pycsv.js.

import { asPy, newCsv, DictReader, stringIOLines, typed } from './_pycsv.js';

const lines = (text) => stringIOLines(typed(text), '');

export default {
  // list(csv.DictReader(io.StringIO(text, newline='')))
  rows: (text) => asPy(new DictReader(newCsv(), lines(text)).all()),

  // r = DictReader(..., fieldnames=names); (list(r), r.fieldnames)
  fieldnames: (text, names) => {
    const r = new DictReader(newCsv(), lines(text), { fieldnames: names });
    const rows = r.all();
    return asPy({ __pyTuple: [rows, r.fieldnames] });
  },

  // list(csv.DictReader(..., restkey=restkey, restval=restval))
  ragged: (text, restkey, restval) => asPy(new DictReader(newCsv(), lines(text), { restkey, restval }).all()),
};
