// utils/emulators/python/stdlib/csv/field_size_limit.js
//
// Emulator for the csv.field_size_limit demo, on the CPython port in
// _pycsv.js (module state with its own field limit per run).

import { asPy, newCsv, Reader, fieldSizeLimit, autoVal } from './_pycsv.js';

export default {
  // old = csv.field_size_limit(limit); rows = list(csv.reader([line])); (old, rows)
  limit: (limit, line) => {
    const mod = newCsv();
    const old = fieldSizeLimit(mod, autoVal(limit));
    let rows;
    try {
      rows = new Reader(mod, [line]).all();
    } finally {
      fieldSizeLimit(mod, old);
    }
    return asPy({ __pyTuple: [old, rows] });
  },
};
