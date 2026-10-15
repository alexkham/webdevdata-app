// utils/emulators/python/stdlib/logging/logger-info.js
//
// Emulator for the Logger.info / log demo: level check, lazy %-merge of
// msg and args inside the handler (a failure goes to Handler.handleError
// and the line is dropped) and extra= attributes, on _pylogging.js.

import { fresh, py, withLogger } from './_demo.js';
import { DEBUG, INFO, kw, PyDict } from './_pylogging.js';

export default {
  // log.log(level, msg, arg) on a DEBUG logger, '%(levelname)s %(message)s'
  call: (level, msg, arg) => {
    const L = fresh();
    const stream = withLogger(L, 'orders', DEBUG, '%(levelname)s %(message)s', (log) => {
      log.log(py(level), py(msg), py(arg));
    });
    return stream.getvalue();
  },

  // log.warning('refund requested', extra={key: value})
  extra: (key, value) => {
    const L = fresh();
    const stream = withLogger(L, 'orders', INFO, '%(levelname)s [%(customer)s] %(message)s', (log) => {
      log.warning('refund requested', kw({ extra: new PyDict([[py(key), py(value)]]) }));
    });
    return stream.getvalue();
  },
};
