// utils/emulators/python/stdlib/logging/handler.js
//
// Emulator for the logging.Handler demo, on the port in _pylogging.js:
// per-handler levels after the logger's level, and a Handler subclass
// whose emit() appends self.format(record) to a list — with no try/except,
// so formatting errors reach the logging call exactly as in CPython.

import { fresh, py, show, splitlines } from './_demo.js';
import { DEBUG, INFO, Handler, StringIO, PyDict } from './_pylogging.js';

class ListHandler extends Handler {
  constructor(L) {
    super(L);
    this.pyTypeName = 'ListHandler';
    this.lines = [];
  }
  emit(record) { this.lines.push(this.format(record)); }
}

export default {
  levels: (consoleLevel, fileLevel) => {
    const L = fresh();
    const log = L.getLogger('relay');
    log.setLevel(DEBUG);
    log.propagate = false;
    const consoleStream = new StringIO();
    const fileStream = new StringIO();
    const toConsole = L.StreamHandler(consoleStream);
    toConsole.setLevel(py(consoleLevel));
    const toFile = L.StreamHandler(fileStream);
    toFile.setLevel(py(fileLevel));
    for (const handler of [toConsole, toFile]) {
      handler.setFormatter(L.Formatter('%(levelname)s %(message)s'));
      log.addHandler(handler);
    }
    try {
      log.debug('cache miss');
      log.info('job started');
      log.warning('disk %d%% full', 91n);
      log.error('job failed');
    } finally {
      log.removeHandler(toConsole);
      log.removeHandler(toFile);
    }
    return show(new PyDict([['console', splitlines(consoleStream.getvalue())], ['file', splitlines(fileStream.getvalue())]]));
  },

  subclass: (fmt, msg) => {
    const L = fresh();
    const log = L.getLogger('relay.memory');
    log.setLevel(INFO);
    log.propagate = false;
    const handler = new ListHandler(L);
    handler.setFormatter(L.Formatter(py(fmt)));
    log.addHandler(handler);
    try {
      log.info('order %s shipped', 1042n);
      log.warning(py(msg));
    } finally {
      log.removeHandler(handler);
    }
    return handler.lines;
  },
};
