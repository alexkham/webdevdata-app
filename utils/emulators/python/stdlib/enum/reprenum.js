// utils/emulators/python/stdlib/enum/reprenum.js
//
// Emulator for the enum.ReprEnum demo tabs: the same int-mixed enum built
// on ReprEnum and on Enum (Lib/enum.py port in _pyenum.js, format() through
// the formatter_unicode.c port).

import { defineEnum, INT, REPR_ENUM, ENUM, getitem, repr, str, format, pyTuple } from './_pyenum.js';

// m = Level.HIGH; (repr(m), str(m), format(m, spec))
const show = (base, spec) => {
  const m = getitem(defineEnum('Level', [INT, base], [['LOW', 1n], ['HIGH', 10n]]), 'HIGH');
  return pyTuple(repr(m), str(m), format(m, spec));
};

export default {
  // class Level(int, ReprEnum)
  reprenum: (spec) => show(REPR_ENUM, spec),
  // class Level(int, Enum)
  mixin: (spec) => show(ENUM, spec),
};
