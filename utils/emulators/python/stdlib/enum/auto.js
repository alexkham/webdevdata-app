// utils/emulators/python/stdlib/enum/auto.js
//
// Emulator for the enum.auto demo tabs: _generate_next_value_ of Enum and
// Flag as ported in _pyenum.js (EnumDict resolves auto() while the class
// body runs).

import { defineEnum, ENUM, FLAG, members, auto, autoArg, numArg, py } from './_pyenum.js';

export default {
  // RED = first; GREEN = auto(); BLUE = auto()
  enum: (first) => py(members(defineEnum('Color', [ENUM], [['RED', autoArg(first)], ['GREEN', auto()], ['BLUE', auto()]]))),

  // class Perm(Flag): R = first; W = auto(); X = auto()
  flag: (first) => py(members(defineEnum('Perm', [FLAG], [['R', numArg(first)], ['W', auto()], ['X', auto()]]))),

  // RED = auto(); GREEN = auto(value); BLUE = auto()
  explicit: (value) => py(members(defineEnum('Color', [ENUM], [['RED', auto()], ['GREEN', auto(autoArg(value))], ['BLUE', auto()]]))),
};
