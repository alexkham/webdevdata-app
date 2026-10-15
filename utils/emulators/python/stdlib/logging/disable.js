// utils/emulators/python/stdlib/logging/disable.js
//
// Emulator for the logging.disable demo, on the port in _pylogging.js:
// the manager-wide ceiling (names resolved by _checkLevel, so an unknown
// name is CPython's ValueError), the isEnabledFor cache that disable()
// clears, and the combination with a logger's own effective level.

import { fresh, py, stringHandler, splitlines } from './_demo.js';
import { DEBUG, INFO, WARNING, ERROR, CRITICAL, NOTSET } from './_pylogging.js';

export default {
  ceiling: (level) => {
    const L = fresh();
    const log = L.getLogger('maintenance');
    log.setLevel(DEBUG);
    log.propagate = false;
    const [handler, stream] = stringHandler(L, '%(levelname)s %(message)s');
    log.addHandler(handler);
    try {
      L.disable(py(level));
      for (const lv of [DEBUG, INFO, WARNING, ERROR, CRITICAL]) log.log(lv, 'event at level %d', lv);
    } finally {
      L.disable(NOTSET);
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },

  combined: (loggerLevel) => {
    const L = fresh();
    const log = L.getLogger('maintenance.db');
    log.setLevel(py(loggerLevel));
    let enabled;
    try {
      L.disable(INFO);
      enabled = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].filter((name) => log.isEnabledFor(L.getLevelName(name)));
    } finally {
      L.disable(NOTSET);
    }
    return enabled;
  },
};
