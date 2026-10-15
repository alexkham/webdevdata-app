// utils/emulators/python/stdlib/logging/log-functions.js
//
// Emulator for the module-level logging functions demo: the implicit
// basicConfig() on an empty root logger (writing to the captured stderr)
// and the five level shortcuts, on the port in _pylogging.js.

import { fresh, py, show, splitlines } from './_demo.js';
import { StringIO, tuple } from './_pylogging.js';

function withRoot(L, body) {
  const root = L.getLogger();
  const saved = [[...root.handlers], root.level];
  try {
    return body(saved);
  } finally {
    root.handlers.splice(0, root.handlers.length, ...saved[0]);
    root.setLevel(saved[1]);
  }
}

export default {
  // with redirect_stderr(err): logging.log(level, msg); added = ...
  implicit: (level, msg) => {
    const L = fresh();
    const root = L.getLogger();
    const lv = py(level);
    const m = py(msg);
    let added;
    withRoot(L, (saved) => {
      L.log(lv, m);
      added = BigInt(root.handlers.length - saved[0].length);
    });
    return show(tuple(added, L.stderr.getvalue()));
  },

  calls: (level) => {
    const L = fresh();
    const stream = new StringIO();
    const lv = py(level);
    withRoot(L, () => {
      L.basicConfig({ stream, level: lv, format: '%(levelname)s %(message)s', force: true });
      L.debug('cache miss');
      L.info('request served');
      L.warning('slow response');
      L.error('upstream failed');
      L.critical('out of memory');
    });
    return splitlines(stream.getvalue());
  },
};
