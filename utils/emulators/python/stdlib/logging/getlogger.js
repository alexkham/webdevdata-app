// utils/emulators/python/stdlib/logging/getlogger.js
//
// Emulator for the logging.getLogger demo: the registry, PlaceHolder
// parents and the root-logger aliases, on the port in _pylogging.js.

import { fresh, py, show } from './_demo.js';
import { tuple } from './_pylogging.js';

export default {
  // logging.getLogger('billing'); logging.getLogger('billing.invoice')
  // log = logging.getLogger(name); (log.name, log.parent.name if log.parent else None)
  parent: (name) => {
    const L = fresh();
    L.getLogger('billing');
    L.getLogger('billing.invoice');
    const log = L.getLogger(py(name));
    return show(tuple(log.name, log.parent ? log.parent.name : null));
  },

  same: (a, b) => {
    const L = fresh();
    return L.getLogger(py(a)) === L.getLogger(py(b));
  },
};
