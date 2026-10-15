// utils/emulators/python/stdlib/enum/global-enum.js
//
// Emulator for the global_enum demo tabs: re.RegexFlag (built like
// Lib/re/__init__.py builds it) and classes that install
// global_enum_repr / global_flag_repr / global_str themselves
// (Lib/enum.py port in _pyenum.js).

import { defineEnum, makeRegexFlag, ENUM, FLAG, call, repr, str, autoArg, numArg, py, pyTuple } from './_pyenum.js';

export default {
  // re.RegexFlag(value)
  regexflag: (value) => py(call(makeRegexFlag(), numArg(value))),

  // __module__ = 'paint'; RED = 1; GREEN = 2; __repr__ = global_enum_repr;
  // __str__ = global_str — m = Color(value); (repr(m), str(m))
  enumrepr: (value) => {
    const Color = defineEnum('Color', [ENUM], [
      ['__module__', 'paint'], ['RED', 1n], ['GREEN', 2n],
      ['__repr__', 'global_enum_repr'], ['__str__', 'global_str'],
    ]);
    const m = call(Color, autoArg(value));
    return pyTuple(repr(m), str(m));
  },

  // __module__ = 'files'; R = 4; W = 2; X = 1; __repr__ = global_flag_repr;
  // __str__ = global_str — p = Perm(value); (repr(p), str(p))
  flagrepr: (value) => {
    const Perm = defineEnum('Perm', [FLAG], [
      ['__module__', 'files'], ['R', 4n], ['W', 2n], ['X', 1n],
      ['__repr__', 'global_flag_repr'], ['__str__', 'global_str'],
    ]);
    const p = call(Perm, numArg(value));
    return pyTuple(repr(p), str(p));
  },
};
