// utils/emulators/python/stdlib/logging/addlevelname.js
//
// Emulator for the logging.addLevelName demo, on the port in
// _pylogging.js: the two level tables (with dict semantics, so 25.0 finds
// 25), level filtering by number, %(levelno)s / %(levelname)s, and
// setLevel resolving names. mock.patch.dict around the registration is
// modelled by saving and restoring both tables.

import { fresh, py, stringHandler, splitlines, show } from './_demo.js';
import { DEBUG, INFO, tuple } from './_pylogging.js';

// with mock.patch.dict(logging._levelToName), mock.patch.dict(logging._nameToLevel):
function patchedTables(L, body) {
  const l2n = new Map(L._levelToName);
  const n2l = new Map(L._nameToLevel);
  try {
    return body();
  } finally {
    L._levelToName = l2n;
    L._nameToLevel = n2l;
  }
}

export default {
  register: (level, name) => {
    const L = fresh();
    const lv = py(level);
    const nm = py(name);
    const log = L.getLogger('alarms');
    log.setLevel(DEBUG);
    log.propagate = false;
    const [handler, stream] = stringHandler(L, '%(levelno)s %(levelname)s: %(message)s');
    log.addHandler(handler);
    patchedTables(L, () => {
      L.addLevelName(lv, nm);
      try {
        log.log(lv, 'disk usage at %d%%', 91n);
        log.warning('backup is late');
      } finally {
        log.removeHandler(handler);
      }
    });
    return splitlines(stream.getvalue());
  },

  byname: (name) => {
    const L = fresh();
    const log = L.getLogger('alarms.names');
    const result = patchedTables(L, () => {
      L.addLevelName(25n, 'NOTICE');
      log.setLevel(py(name));
      return tuple(log.level, L.getLevelName(log.level), log.isEnabledFor(INFO));
    });
    return show(result);
  },
};
