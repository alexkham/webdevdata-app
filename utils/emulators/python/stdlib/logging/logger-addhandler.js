// utils/emulators/python/stdlib/logging/logger-addhandler.js
//
// Emulator for the Logger.addHandler / hasHandlers demo: duplicate-free
// handler lists, one emit per handler, and hasHandlers walking up while
// propagate is true, on the port in _pylogging.js.

import { fresh, py, splitlines } from './_demo.js';
import { INFO, StringIO, PyDict } from './_pylogging.js';
import { raise, pyRepr } from './_pyfmt.js';

export default {
  add: (first, second) => {
    const L = fresh();
    const log = L.getLogger('mailer');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handlers = new PyDict([['a', L.StreamHandler(stream)], ['b', L.StreamHandler(stream)]]);
    handlers.get('a').setFormatter(L.Formatter('a> %(message)s'));
    handlers.get('b').setFormatter(L.Formatter('b> %(message)s'));
    const pick = (k) => (handlers.has(k) ? handlers.get(k) : raise('KeyError', pyRepr(k)));
    try {
      log.addHandler(pick(py(first)));
      log.addHandler(pick(py(second)));
      log.info('sent %d mails', 3n);
    } finally {
      for (const h of handlers.map.values()) log.removeHandler(h);
    }
    return splitlines(stream.getvalue());
  },

  has: (name) => {
    const L = fresh();
    const notify = L.getLogger('notify');
    const handler = L.NullHandler();
    notify.addHandler(handler);
    L.getLogger('notify.sms').propagate = false;
    try {
      return L.getLogger(py(name)).hasHandlers();
    } finally {
      notify.removeHandler(handler);
    }
  },
};
