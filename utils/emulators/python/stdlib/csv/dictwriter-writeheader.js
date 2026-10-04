// utils/emulators/python/stdlib/csv/dictwriter-writeheader.js
//
// Emulator for the DictWriter.writeheader demo tabs, on the Lib/csv.py
// port in _pycsv.js.

import { asPy, newCsv, DictWriter, StringIOOut, autoVal } from './_pycsv.js';

export default {
  // n = csv.DictWriter(buf, fieldnames=names).writeheader(); (n, buf.getvalue())
  header: (fieldnames) => {
    const out = new StringIOOut('');
    const n = new DictWriter(newCsv(), out, fieldnames).writeheader();
    return asPy({ __pyTuple: [n, out.getvalue()] });
  },

  // csv.DictWriter(buf, ['id', name], quoting=q).writeheader()
  quoted: (name, quoting) => {
    const out = new StringIOOut('');
    new DictWriter(newCsv(), out, ['id', name], { kw: { quoting: autoVal(quoting) } }).writeheader();
    return out.getvalue();
  },
};
