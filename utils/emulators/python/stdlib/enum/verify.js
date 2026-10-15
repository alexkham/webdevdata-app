// utils/emulators/python/stdlib/enum/verify.js
//
// Emulator for the enum.verify demo tabs (CONTINUOUS, NAMED_FLAGS, UNIQUE)
// on the Lib/enum.py port in _pyenum.js.

import { defineEnum, ENUM, FLAG, verify, members, autoArg, numArg, py } from './_pyenum.js';

export default {
  // @verify(CONTINUOUS) class Grade(Enum): A = a; B = b; C = c — list(Grade)
  continuous: (a, b, c) => py(members(verify(defineEnum('Grade', [ENUM], [['A', numArg(a)], ['B', numArg(b)], ['C', numArg(c)]]), 'CONTINUOUS'))),

  // @verify(NAMED_FLAGS) class Color(Flag): RED = 1; GREEN = 2; WHITE = value
  // — list(Color.__members__)
  named: (value) => [...verify(defineEnum('Color', [FLAG], [['RED', 1n], ['GREEN', 2n], ['WHITE', numArg(value)]]), 'NAMED_FLAGS').memberMap.keys()],

  // @verify(UNIQUE) class Color(Enum): RED = 1; GREEN = 2; BLUE = value — list(Color)
  unique: (value) => py(members(verify(defineEnum('Color', [ENUM], [['RED', 1n], ['GREEN', 2n], ['BLUE', autoArg(value)]]), 'UNIQUE'))),
};
