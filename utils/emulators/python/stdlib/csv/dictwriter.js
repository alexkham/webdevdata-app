// utils/emulators/python/stdlib/csv/dictwriter.js
//
// Emulator for the csv.DictWriter demo tabs, on the Lib/csv.py port in
// _pycsv.js.

import { newCsv, DictWriter, StringIOOut, PyDict } from './_pycsv.js';

export default {
  // w.writeheader(); w.writerow(dict(zip(keys, values))); buf.getvalue()
  write: (fieldnames, keys, values) => {
    const out = new StringIOOut('');
    const w = new DictWriter(newCsv(), out, fieldnames);
    w.writeheader();
    const n = Math.min(keys.length, values.length);
    w.writerow(new PyDict(keys.slice(0, n).map((k, i) => [k, values[i]])));
    return out.getvalue();
  },

  // DictWriter(buf, ['name', 'age', 'city'], restval=…, extrasaction=…)
  //   .writerows([{'name': 'Ada', 'age': 36}, {'name': 'Bob', 'id': 7}])
  options: (restval, extrasaction) => {
    const out = new StringIOOut('');
    const w = new DictWriter(newCsv(), out, ['name', 'age', 'city'], { restval, extrasaction });
    w.writerows([
      new PyDict([['name', 'Ada'], ['age', 36n]]),
      new PyDict([['name', 'Bob'], ['id', 7n]]),
    ]);
    return out.getvalue();
  },
};
