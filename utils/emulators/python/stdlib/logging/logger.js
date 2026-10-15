// utils/emulators/python/stdlib/logging/logger.js
//
// Emulator for the logging.Logger demo, on the port in _pylogging.js:
// an unregistered Logger() (no parent → lastResort on stderr) next to the
// registered getLogger() logger, findCaller's stacklevel walk over the
// snippet's own frames, and makeRecord's extra= collision check.

import { fresh, py, show, stringHandler, redirectStderr, splitlines } from './_demo.js';
import { INFO, PyDict, tuple } from './_pylogging.js';
import { raise } from './_pyfmt.js';

export default {
  direct: (name) => {
    const L = fresh();
    const n = py(name);
    const ledger = L.getLogger('ledger');
    ledger.setLevel(INFO);
    ledger.propagate = false;
    const [handler, stream] = stringHandler(L, '%(name)s: %(message)s');
    ledger.addHandler(handler);
    let err;
    try {
      err = redirectStderr(L, () => {
        L.Logger(n).warning('from Logger()');
        L.getLogger(n).warning('from getLogger()');
      });
    } finally {
      ledger.removeHandler(handler);
    }
    return show(new PyDict([['ledger handler', splitlines(stream.getvalue())], ['stderr', splitlines(err.getvalue())]]));
  },

  // the frames of the snippet, innermost first: the findCaller call in
  // post() (line 4), post(3) in close_books() (line 6), close_books() at
  // module level (line 7)
  caller: (stacklevel) => {
    const L = fresh();
    const log = L.getLogger('ledger');
    const n = py(stacklevel);
    if (n < 1n) {
      raise('DemoLimit', 'with stacklevel below 1, findCaller reports a line inside logging/__init__.py itself, which changes between Python versions — run it in CPython to see it');
    }
    if (n > 3n) {
      raise('DemoLimit', 'stacklevel 4 or more goes past the snippet’s outermost frame: a plain script stops at that <module> frame, but an IDE, test runner or interactive shell adds frames of its own — run it in CPython to see your setup’s answer');
    }
    const frames = [{ lineno: 4, func: 'post' }, { lineno: 6, func: 'close_books' }, { lineno: 7, func: '<module>' }];
    const [, lineno, func] = log.findCaller(false, n, frames);
    return show(tuple(lineno, func));
  },

  record: (key, value) => {
    const L = fresh();
    const log = L.getLogger('ledger');
    const k = py(key);
    const record = log.makeRecord('ledger', INFO, 'books.py', 42n, 'posted %d entries', tuple(12n), null, null, new PyDict([[k, py(value)]]));
    return show(tuple(record.getMessage(), record.get('lineno'), record.get(k)));
  },
};
