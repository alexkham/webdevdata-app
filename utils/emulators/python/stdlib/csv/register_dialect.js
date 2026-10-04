// utils/emulators/python/stdlib/csv/register_dialect.js
//
// Emulator for the dialect-registry demo tabs, on the CPython port in
// _pycsv.js. Each run starts from a fresh registry (excel, excel-tab,
// unix), like the demo snippet that unregisters its name in finally.

import { asPy, newCsv, registerDialect, getDialect, listDialects, unregisterDialect } from './_pycsv.js';

export default {
  // register, (list_dialects(), get_dialect(name).delimiter), unregister
  register: (name, delimiter) => {
    const mod = newCsv();
    registerDialect(mod, name, undefined, { delimiter });
    let result;
    try {
      result = { __pyTuple: [listDialects(mod), getDialect(mod, name).attr('delimiter')] };
    } finally {
      unregisterDialect(mod, name);
    }
    return asPy(result);
  },

  // d = csv.get_dialect(name); (d.delimiter, d.lineterminator, d.quoting)
  lookup: (name) => {
    const d = getDialect(newCsv(), name);
    return asPy({ __pyTuple: [d.attr('delimiter'), d.attr('lineterminator'), d.attr('quoting')] });
  },
};
