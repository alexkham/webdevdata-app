// utils/emulators/python/stdlib/logging/setloggerclass.js
//
// Emulator for the logging.setLoggerClass / setLogRecordFactory demo, on
// the port in _pylogging.js: Manager.getLogger instantiating the installed
// class only for names it has not seen (existing loggers and the root
// logger keep their class), and a record factory that wraps the previous
// one and adds an attribute the format string reads with %(env)s.

import { fresh, py, stringHandler, splitlines, show } from './_demo.js';
import { Logger, INFO, tuple } from './_pylogging.js';

// class AuditLogger(logging.Logger):
//     def audit(self, msg, *args):
//         self.warning('AUDIT ' + msg, *args)
class AuditLogger extends Logger {
  constructor(L, name, level) {
    super(L, name, level);
    this.pyTypeName = 'AuditLogger';
  }
  audit(msg, ...args) { this.warning(`AUDIT ${msg}`, ...args); }
}
AuditLogger.pyName = 'AuditLogger';

// hasattr(obj, 'audit') for the logger objects the engine builds
const hasAudit = (log) => log instanceof AuditLogger;

export default {
  class: (name) => {
    const L = fresh();
    L.getLogger('payments');
    L.setLoggerClass(AuditLogger);
    let log;
    try {
      log = L.getLogger(py(name));
    } finally {
      L.setLoggerClass(Logger);
    }
    return show(tuple(log.pyTypeName, hasAudit(log)));
  },

  factory: (env) => {
    const L = fresh();
    const value = py(env);
    const log = L.getLogger('deploys');
    log.setLevel(INFO);
    log.propagate = false;
    const [handler, stream] = stringHandler(L, '[%(env)s] %(levelname)s %(message)s');
    log.addHandler(handler);
    const oldFactory = L.getLogRecordFactory();
    L.setLogRecordFactory((...args) => {
      const record = oldFactory(...args);
      record.set('env', value);
      return record;
    });
    try {
      log.info('deploy started');
      log.warning('%d hosts unreachable', 2n);
    } finally {
      L.setLogRecordFactory(oldFactory);
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },
};
