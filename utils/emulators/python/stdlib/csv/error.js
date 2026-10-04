// utils/emulators/python/stdlib/csv/error.js
//
// Emulator for the csv.Error demo tabs, on the CPython port in _pycsv.js.

import { asPy, newCsv, Reader, CsvError, DONE, stringIOLines, typed } from './_pycsv.js';

const strictReader = (text) => new Reader(newCsv(), stringIOLines(typed(text), ''), undefined, { strict: true });

export default {
  // list(csv.reader(io.StringIO(text, newline=''), strict=True))
  trigger: (text) => asPy(strictReader(text).all()),

  // except csv.Error as e: (r.line_num, str(e))
  handle: (text) => {
    const r = strictReader(text);
    const rows = [];
    try {
      for (let row = r.next(); row !== DONE; row = r.next()) rows.push(row);
    } catch (e) {
      if (!(e instanceof CsvError)) throw e;
      return asPy({ __pyTuple: [BigInt(r.line_num), e.message] });
    }
    return asPy(rows);
  },
};
