// utils/emulators/python/stdlib/csv/quoting.js
//
// Emulator for the quoting-constants demo tabs, on the CPython port in
// _pycsv.js.

import { asPy, newCsv, Reader, Writer, StringIOOut, nextRow, PyFloat, autoVal } from './_pycsv.js';

export default {
  // csv.writer(buf, quoting=q, escapechar='\\').writerow(['Ada', 36, 2.5, None, ''])
  write: (quoting) => {
    const out = new StringIOOut('');
    new Writer(newCsv(), out, undefined, { quoting: autoVal(quoting), escapechar: '\\' })
      .writerow(['Ada', 36n, new PyFloat(2.5), null, '']);
    return out.getvalue();
  },

  // next(csv.reader([line], quoting=q))
  read: (line, quoting) => asPy(nextRow(new Reader(newCsv(), [line], undefined, { quoting: autoVal(quoting) }))),
};
