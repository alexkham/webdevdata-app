// utils/emulators/python/stdlib/logging/nullhandler.js
//
// Emulator for the logging.NullHandler demo, on the port in _pylogging.js:
// Logger.callHandlers counting the NullHandler as a handler (so lastResort
// stays silent) while records still propagate to a root handler.

import { fresh, py, show, redirectStderr } from './_demo.js';
import { StringIO, PyDict, truthy } from './_pylogging.js';

export default {
  library: (nullFlag, configured) => {
    const L = fresh();
    const lib = L.getLogger('lib');
    const nullHandler = L.NullHandler();
    const appStream = new StringIO();
    const appHandler = L.StreamHandler(appStream);
    if (truthy(py(nullFlag))) lib.addHandler(nullHandler);
    if (truthy(py(configured))) L.getLogger().addHandler(appHandler);
    let err;
    try {
      err = redirectStderr(L, () => {
        lib.warning('cache directory missing');
        lib.info('cache warmed');
      });
    } finally {
      lib.removeHandler(nullHandler);
      L.getLogger().removeHandler(appHandler);
    }
    return show(new PyDict([['app handler', appStream.getvalue()], ['stderr', err.getvalue()]]));
  },
};
