// utils/emulators/python/stdlib/logging/lastresort.js
//
// Emulator for the logging.lastResort demo, on the port in _pylogging.js:
// a DEBUG logger without handlers whose records fall through to the
// _StderrHandler fallback, filtered by its own level and printed bare.

import { fresh, py, redirectStderr, splitlines } from './_demo.js';
import { DEBUG } from './_pylogging.js';

export default {
  level: (level) => {
    const L = fresh();
    const log = L.getLogger('orphan');
    log.setLevel(DEBUG);
    const saved = L.lastResort.level;
    let err;
    try {
      L.lastResort.setLevel(py(level));
      err = redirectStderr(L, () => {
        log.debug('debug line');
        log.info('info line');
        log.warning('warning line');
        log.error('error line');
      });
    } finally {
      L.lastResort.setLevel(saved);
    }
    return splitlines(err.getvalue());
  },
};
