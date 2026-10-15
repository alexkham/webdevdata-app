// utils/emulators/python/stdlib/logging/getlevelname.js
//
// Emulator for the logging.getLevelName / getLevelNamesMapping demo, on
// the level tables of the CPython port in _pylogging.js.

import { fresh, py, show } from './_demo.js';
import { raise, typeName } from './_pyfmt.js';

// str.upper() — Python's full case mapping ('ß' → 'SS'), which JS shares
function upper(s) {
  if (typeof s !== 'string') raise('AttributeError', `'${typeName(s)}' object has no attribute 'upper'`);
  return s.toUpperCase();
}

export default {
  // logging.getLevelName(value)
  lookup: (value) => show(fresh().getLevelName(py(value))),

  // levels = logging.getLevelNamesMapping(); levels.get(name.upper(), 'unknown level')
  mapping: (name) => {
    const levels = fresh().getLevelNamesMapping();
    const key = upper(py(name));
    return show(levels.has(key) ? levels.get(key) : 'unknown level');
  },
};
