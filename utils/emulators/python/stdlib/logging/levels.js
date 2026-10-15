// utils/emulators/python/stdlib/logging/levels.js
//
// Emulator for the logging levels demo: setLevel (ints and registered
// names) and isEnabledFor against the five standard levels, including
// NOTSET falling back to the root logger's WARNING.

import { fresh, py } from './_demo.js';
import { DEBUG, INFO, WARNING, ERROR, CRITICAL } from './_pylogging.js';

const STANDARD = [['DEBUG', DEBUG], ['INFO', INFO], ['WARNING', WARNING], ['ERROR', ERROR], ['CRITICAL', CRITICAL]];

export default {
  threshold: (level) => {
    const L = fresh();
    const log = L.getLogger('levels.demo');
    log.setLevel(py(level));
    return STANDARD.filter(([, value]) => log.isEnabledFor(value)).map(([name]) => name);
  },
};
