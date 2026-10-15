// utils/emulators/python/stdlib/logging/filehandler.js
//
// Emulator for the logging.FileHandler demo, on the port in _pylogging.js
// with its in-memory file system (L.files: path → text): append vs
// truncate modes, a read-only mode whose write fails into handleError,
// and delay=True postponing the creation of the file.

import { fresh, py, show } from './_demo.js';
import { INFO, WARNING, tuple, truthy } from './_pylogging.js';

export default {
  mode: (mode, msg) => {
    const L = fresh();
    // with open('app.log', 'w', encoding='utf-8') as f: f.write(...)
    L.files.set('app.log', 'from the last run\n');
    const log = L.getLogger('files');
    log.setLevel(INFO);
    log.propagate = false;
    const handler = L.FileHandler('app.log', py(mode), 'utf-8');
    handler.setFormatter(L.Formatter('%(levelname)s %(message)s'));
    log.addHandler(handler);
    try {
      log.info(py(msg));
    } finally {
      log.removeHandler(handler);
      handler.close();
    }
    return L.files.get('app.log');
  },

  delay: (delay, level) => {
    const L = fresh();
    const log = L.getLogger('files.lazy');
    log.setLevel(WARNING);
    log.propagate = false;
    const handler = L.FileHandler('lazy.log', 'a', 'utf-8', truthy(py(delay)));
    const createdEarly = L.files.has('lazy.log');
    log.addHandler(handler);
    try {
      log.log(py(level), 'checked %d files', 12n);
    } finally {
      log.removeHandler(handler);
      handler.close();
    }
    return show(tuple(createdEarly, L.files.has('lazy.log')));
  },
};
