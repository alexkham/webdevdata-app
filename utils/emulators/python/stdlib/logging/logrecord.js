// utils/emulators/python/stdlib/logging/logrecord.js
//
// Emulator for the logging.LogRecord demo, on the ports in _pylogging.js
// and _pyfmt.js: getMessage's str(msg) % args (errors raised directly),
// filename / module derived from the path, and levelname computed with
// getLevelName from an unchecked level.

import { fresh, py, show } from './_demo.js';
import { INFO, tuple } from './_pylogging.js';

export default {
  message: (msg, arg) => {
    const L = fresh();
    const record = L.LogRecord('shop.cart', INFO, 'shop/cart.py', 42n, py(msg), tuple(py(arg)), null);
    return show(tuple(record.getMessage(), record.get('levelname'), record.get('filename'), record.get('module'), record.get('lineno')));
  },

  level: (level) => {
    const L = fresh();
    const record = L.LogRecord('shop', py(level), 'app.py', 1n, 'x', null, null);
    return show(tuple(record.get('levelno'), record.get('levelname')));
  },
};
