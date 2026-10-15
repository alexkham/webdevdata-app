// utils/emulators/python/stdlib/logging/index.js
//
// Emulator for the logging module hub demo, on the CPython port in
// _pylogging.js: level filtering, propagation up the dotted-name tree and
// the lazy %-formatting of msg and args (a formatting error drops the line
// and goes to stderr, as Handler.handleError does).

import { fresh, py, stringHandler, splitlines } from './_demo.js';

export default {
  levels: (level, user) => {
    const L = fresh();
    const lv = py(level);
    const u = py(user);
    const log = L.getLogger('shop');
    log.setLevel(lv);
    log.propagate = false;
    const [handler, stream] = stringHandler(L, '%(levelname)s:%(name)s:%(message)s');
    log.addHandler(handler);
    try {
      log.debug('cart contents for %s', u);
      log.info('%s logged in', u);
      log.warning('%s has 3 failed payments', u);
      log.error('payment for %s declined', u);
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },

  tree: (name, message) => {
    const L = fresh();
    const shop = L.getLogger('shop');
    shop.setLevel(L.getLevelNamesMapping().get('INFO'));
    shop.propagate = false;
    const [handler, stream] = stringHandler(L, '%(name)s -> %(message)s');
    shop.addHandler(handler);
    try {
      L.getLogger(py(name)).info(py(message));
    } finally {
      shop.removeHandler(handler);
    }
    return stream.getvalue();
  },

  args: (msg, value) => {
    const L = fresh();
    const log = L.getLogger('shop');
    log.setLevel(10n);
    log.propagate = false;
    const [handler, stream] = stringHandler(L);
    log.addHandler(handler);
    try {
      log.info(py(msg), py(value));
    } finally {
      log.removeHandler(handler);
    }
    return stream.getvalue();
  },
};
