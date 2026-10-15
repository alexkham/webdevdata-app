// utils/emulators/python/stdlib/enum/enum.js
//
// Emulator for the enum.Enum demo tabs, on the Lib/enum.py port in
// _pyenum.js (format() goes through the formatter_unicode.c port).

import { defineEnum, ENUM, call, contains, getitem, repr, str, format, autoArg, py, pyTuple } from './_pyenum.js';

const color = (n = 2) => defineEnum('Color', [ENUM], [['RED', 1n], ['GREEN', 2n], ['BLUE', 3n]].slice(0, n));

export default {
  // m = Color.RED; (repr(m), str(m), format(m, spec))
  format: (spec) => {
    const m = getitem(color(), 'RED');
    return pyTuple(repr(m), str(m), format(m, spec));
  },

  // value in Color
  contains: (value) => contains(color(), autoArg(value)),

  // Setting(value) — ON = True, OFF = False, AUTO = 'auto'
  equal: (value) => py(call(defineEnum('Setting', [ENUM], [['ON', true], ['OFF', false], ['AUTO', 'auto']]), autoArg(value))),
};
