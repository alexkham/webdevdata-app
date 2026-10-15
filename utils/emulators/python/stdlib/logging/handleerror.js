// utils/emulators/python/stdlib/logging/handleerror.js
//
// Emulator for the Handler.handleError demo: a failing msg % args inside
// StreamHandler.emit, the "--- Logging error ---" report written to the
// (redirected) stderr, and logging.raiseExceptions switching it off — on
// the ports in _pylogging.js / _pyfmt.js. Frame lines (indented) are not
// part of the result, as in the snippet.

import { fresh, py, show, stringHandler, redirectStderr, unindented, splitlines } from './_demo.js';
import { INFO, tuple, truthy } from './_pylogging.js';

export default {
  report: (msg, arg) => {
    const L = fresh();
    const log = L.getLogger('alerts');
    log.setLevel(INFO);
    log.propagate = false;
    const [handler] = stringHandler(L);
    log.addHandler(handler);
    let err;
    try {
      err = redirectStderr(L, () => log.info(py(msg), py(arg)));
    } finally {
      log.removeHandler(handler);
    }
    return unindented(err.getvalue());
  },

  switch: (flag) => {
    const L = fresh();
    const log = L.getLogger('alerts.quiet');
    log.setLevel(INFO);
    log.propagate = false;
    const [handler, stream] = stringHandler(L);
    log.addHandler(handler);
    let err;
    try {
      L.raiseExceptions = truthy(py(flag));
      err = redirectStderr(L, () => {
        log.info('disk %d%% full', 'ninety');
        log.info('disk %d%% full', 91n);
      });
    } finally {
      L.raiseExceptions = true;
      log.removeHandler(handler);
    }
    return show(tuple(stream.getvalue(), splitlines(err.getvalue()).slice(0, 1)));
  },
};
