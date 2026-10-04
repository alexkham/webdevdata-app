// utils/emulators/python/stdlib/csv/writer.js
//
// Emulator for the csv.writer demo tabs, on the CPython port in _pycsv.js.

import { asPy, newCsv, Writer, StringIOOut, autoVal, QUOTE_NONE } from './_pycsv.js';

export default {
  // n = w.writerow([a, b, c]); (n, buf.getvalue())
  row: (a, b, c) => {
    const vals = [a, b, c].map((v) => autoVal(v));
    const out = new StringIOOut('');
    const n = new Writer(newCsv(), out).writerow(vals);
    return asPy({ __pyTuple: [n, out.getvalue()] });
  },

  // csv.writer(buf, quoting=q).writerow([a, b, None, ''])
  quoting: (quoting, a, b) => {
    const vals = [autoVal(a), autoVal(b), null, ''];
    const out = new StringIOOut('');
    new Writer(newCsv(), out, undefined, { quoting: autoVal(quoting) }).writerow(vals);
    return out.getvalue();
  },

  // csv.writer(buf, quoting=csv.QUOTE_NONE, escapechar=e).writerow([a, 'end'])
  escape: (a, escapechar) => {
    const out = new StringIOOut('');
    new Writer(newCsv(), out, undefined, { quoting: BigInt(QUOTE_NONE), escapechar }).writerow([a, 'end']);
    return out.getvalue();
  },
};
