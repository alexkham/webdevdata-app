// utils/emulators/python/stdlib/logging/shutdown.js
//
// Emulator for the logging.shutdown demo, on the port in _pylogging.js:
// shutdown walking its handler list backwards (flush unless flushOnClose
// is false, then close), MemoryHandler's capacity / flushOnClose rules
// (logging.handlers), and a FileHandler that is logged to again after it
// was closed — reopened for every mode except 'w'.

import { fresh, py, splitlines, show } from './_demo.js';
import { INFO, ERROR, StringIO, truthy, tuple } from './_pylogging.js';
import { raise } from './_pyfmt.js';

export default {
  memory: (capacity, flush) => {
    const L = fresh();
    const log = L.getLogger('batch');
    log.setLevel(INFO);
    log.propagate = false;
    const stream = new StringIO();
    const target = L.StreamHandler(stream);
    const memory = L.MemoryHandler(py(capacity), ERROR, target, truthy(py(flush)));
    log.addHandler(memory);
    let before;
    try {
      for (let row = 1n; row < 4n; row++) log.info('row %d imported', row);
      before = splitlines(stream.getvalue());
      L.shutdown([target, memory]);
    } finally {
      log.removeHandler(memory);
    }
    return show(tuple(before, splitlines(stream.getvalue())));
  },

  after: (mode) => {
    const L = fresh();
    const log = L.getLogger('batch.file');
    log.setLevel(INFO);
    log.propagate = false;
    const handler = L.FileHandler('batch.log', py(mode), 'utf-8');
    log.addHandler(handler);
    try {
      log.info('before shutdown');
      L.shutdown([handler]);
      log.info('after shutdown');
    } finally {
      log.removeHandler(handler);
      handler.close();
    }
    // open('batch.log', encoding='utf-8').read().splitlines()
    if (!L.files.has('batch.log')) raise('FileNotFoundError', "[Errno 2] No such file or directory: 'batch.log'");
    return splitlines(L.files.get('batch.log'));
  },
};
