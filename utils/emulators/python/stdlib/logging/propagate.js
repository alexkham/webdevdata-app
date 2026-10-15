// utils/emulators/python/stdlib/logging/propagate.js
//
// Emulator for the Logger.propagate demo: callHandlers walking up the
// tree (parent loggers' levels are not consulted, handler levels are) and
// propagate = False stopping the walk, on the port in _pylogging.js.

import { fresh, py, splitlines } from './_demo.js';
import { DEBUG, INFO, NOTSET, StringIO } from './_pylogging.js';

export default {
  climb: (appLevel, handlerLevel, level) => {
    const L = fresh();
    const app = L.getLogger('app');
    const db = L.getLogger('app.db');
    app.setLevel(py(appLevel));
    app.propagate = false;
    db.setLevel(DEBUG);
    const stream = new StringIO();
    const appHandler = L.StreamHandler(stream);
    appHandler.setLevel(py(handlerLevel));
    appHandler.setFormatter(L.Formatter('app handler: %(levelname)s %(message)s'));
    const dbHandler = L.StreamHandler(stream);
    dbHandler.setFormatter(L.Formatter('db handler:  %(levelname)s %(message)s'));
    app.addHandler(appHandler);
    db.addHandler(dbHandler);
    try {
      db.log(py(level), 'query took %d ms', 870n);
    } finally {
      app.removeHandler(appHandler);
      db.removeHandler(dbHandler);
    }
    return splitlines(stream.getvalue());
  },

  stop: (name) => {
    const L = fresh();
    const app = L.getLogger('app');
    app.setLevel(INFO);
    app.propagate = false;
    const audit = L.getLogger('app.audit');
    audit.setLevel(NOTSET);
    audit.propagate = false;
    const stream = new StringIO();
    const handlers = new Map();
    for (const logger of [app, audit]) {
      const h = L.StreamHandler(stream);
      h.setFormatter(L.Formatter(`${logger.name} handler <- %(name)s`));
      logger.addHandler(h);
      handlers.set(logger, h);
    }
    try {
      L.getLogger(py(name)).info('event');
    } finally {
      for (const [logger, h] of handlers) logger.removeHandler(h);
    }
    return splitlines(stream.getvalue());
  },
};
