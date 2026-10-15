// utils/emulators/python/stdlib/logging/basicconfig.js
//
// Emulator for the logging.basicConfig demo: the run-once rule, force=True
// and style=, on the port of basicConfig in _pylogging.js. Each snippet
// saves and restores the root logger, which a fresh module makes moot.

import { fresh, py, splitlines } from './_demo.js';
import { StringIO } from './_pylogging.js';

// root = logging.getLogger(); saved = ...; try: body finally: restore
function withRoot(L, body) {
  const root = L.getLogger();
  const saved = [[...root.handlers], root.level];
  try {
    body();
  } finally {
    root.handlers.splice(0, root.handlers.length, ...saved[0]);
    root.setLevel(saved[1]);
  }
}

export default {
  once: (first, second) => {
    const L = fresh();
    const stream = new StringIO();
    // each literal is evaluated when its own line runs: a bad first level
    // raises before the second line's `inf` NameError could
    withRoot(L, () => {
      L.basicConfig({ stream, level: py(first), format: '%(levelname)s:%(message)s' });
      L.basicConfig({ stream, level: py(second), format: '%(levelname)s:%(message)s' });
      L.info('info line');
      L.debug('debug line');
    });
    return splitlines(stream.getvalue());
  },

  force: (fmt, msg) => {
    const L = fresh();
    const stream = new StringIO();
    withRoot(L, () => {
      L.basicConfig({ stream, format: 'first: %(message)s' });
      L.basicConfig({ stream, format: py(fmt), force: true });
      L.warning(py(msg));
    });
    return stream.getvalue();
  },

  style: (style, fmt) => {
    const L = fresh();
    const stream = new StringIO();
    withRoot(L, () => {
      L.basicConfig({ stream, style: py(style), format: py(fmt), force: true });
      L.getLogger('cron').error('job %s failed', 'backup');
    });
    return stream.getvalue();
  },
};
