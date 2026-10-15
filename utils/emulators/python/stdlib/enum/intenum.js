// utils/emulators/python/stdlib/enum/intenum.js
//
// Emulator for the enum.IntEnum demo tabs (Lib/enum.py port in _pyenum.js;
// format() through the formatter_unicode.c port).

import { defineEnum, INT_ENUM, call, getitem, str, format, autoArg, py, pyTuple } from './_pyenum.js';

export default {
  // p = Priority(value); (p, p + 1, p > Priority.LOW)
  compare: (value) => {
    const Priority = defineEnum('Priority', [INT_ENUM], [['LOW', 1n], ['MEDIUM', 2n], ['HIGH', 3n]]);
    const p = call(Priority, autoArg(value));
    const low = getitem(Priority, 'LOW');
    // int.__add__ / int.__gt__ on the members' int data
    return pyTuple(p, p.data + 1n, p.data > low.data);
  },

  // (str(Priority.HIGH), format(Priority.HIGH, spec))
  format: (spec) => {
    const high = getitem(defineEnum('Priority', [INT_ENUM], [['LOW', 1n], ['HIGH', 3n]]), 'HIGH');
    return pyTuple(str(high), format(high, spec));
  },
};
