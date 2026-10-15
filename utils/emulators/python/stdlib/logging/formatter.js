// utils/emulators/python/stdlib/logging/formatter.js
//
// Emulator for the logging.Formatter demo, on the ports in _pylogging.js
// and _pyfmt.js: the three format styles with their validation, the
// record attributes of a call made on line 10 at module level (file
// paths, times and ids are machine-dependent and stop the demo with a
// DemoLimit), and defaults= for custom fields.

import { fresh, py, splitlines } from './_demo.js';
import { INFO, StringIO, PyDict, kw } from './_pylogging.js';

export default {
  style: (fmt, style) => {
    const L = fresh();
    const log = L.getLogger('checkout.cart');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handler = L.StreamHandler(stream);
    handler.setFormatter(L.Formatter(py(fmt), null, py(style)));
    log.addHandler(handler);
    try {
      log.warning('%d items left', 3n, kw({ site: { lineno: 10, func: '<module>' } }));
    } finally {
      log.removeHandler(handler);
    }
    return stream.getvalue();
  },

  defaults: (user) => {
    const L = fresh();
    const log = L.getLogger('checkout.views');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const handler = L.StreamHandler(stream);
    handler.setFormatter(L.Formatter('[%(user)s] %(message)s', null, '%', true, { defaults: new PyDict([['user', 'anonymous']]) }));
    log.addHandler(handler);
    try {
      log.info('page viewed');
      log.info('page viewed', kw({ extra: new PyDict([['user', py(user)]]) }));
    } finally {
      log.removeHandler(handler);
    }
    return splitlines(stream.getvalue());
  },
};
