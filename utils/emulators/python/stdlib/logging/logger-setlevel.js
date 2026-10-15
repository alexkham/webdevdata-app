// utils/emulators/python/stdlib/logging/logger-setlevel.js
//
// Emulator for the Logger.setLevel / getEffectiveLevel / isEnabledFor
// demo: level checking, inheritance through the dotted-name tree and the
// root logger's default WARNING, on the port in _pylogging.js.

import { fresh, py, show } from './_demo.js';
import { INFO, tuple } from './_pylogging.js';

export default {
  inherit: (parentLevel, childLevel) => {
    const L = fresh();
    const parent = L.getLogger('inventory');
    const child = L.getLogger('inventory.sync');
    parent.setLevel(py(parentLevel));
    child.setLevel(py(childLevel));
    return show(tuple(child.level, child.getEffectiveLevel(), child.isEnabledFor(INFO)));
  },
};
