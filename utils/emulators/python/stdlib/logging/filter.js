// utils/emulators/python/stdlib/logging/filter.js
//
// Emulator for the logging.Filter demo, on the port in _pylogging.js:
// Filter(name)'s "this logger or a dotted descendant" rule, and a lambda
// filter on a handler (Filterer calls plain callables directly).

import { fresh, py, splitlines } from './_demo.js';
import { INFO, StringIO, PyDict } from './_pylogging.js';
import { raise, typeName } from './_pyfmt.js';

export default {
  byname: (allowed) => {
    const L = fresh();
    const f = L.Filter(py(allowed));
    const names = ['shop', 'shop.cart', 'shop.cart.items', 'shopping', 'billing'];
    return names.filter((name) => f.filter(L.makeLogRecord(new PyDict([['name', name]]))));
  },

  drop: (word) => {
    const L = fresh();
    const w = py(word);
    const log = L.getLogger('web.access');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handler = L.StreamHandler(stream);
    // lambda record: word not in record.getMessage()
    handler.addFilter((record) => {
      if (typeof w !== 'string') raise('TypeError', `'in <string>' requires string as left operand, not ${typeName(w)}`);
      return !record.getMessage().includes(w);
    });
    log.addHandler(handler);
    try {
      for (const path of ['/health', '/cart', '/health', '/checkout']) log.info('GET %s 200', path);
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },
};
