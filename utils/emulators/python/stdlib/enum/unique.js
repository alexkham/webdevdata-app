// utils/emulators/python/stdlib/enum/unique.js
//
// Emulator for the enum.unique demo tabs (Lib/enum.py port in _pyenum.js).

import { defineEnum, ENUM, FLAG, unique, members, autoArg, numArg, py } from './_pyenum.js';

export default {
  // @unique class Color(Enum): RED = red; GREEN = green; BLUE = blue — list(Color)
  values: (red, green, blue) => py(members(unique(defineEnum('Color', [ENUM], [['RED', autoArg(red)], ['GREEN', autoArg(green)], ['BLUE', autoArg(blue)]])))),

  // @unique class Perm(Flag): R = 4; W = 2; RW = value — list(Perm.__members__)
  flag: (value) => [...unique(defineEnum('Perm', [FLAG], [['R', 4n], ['W', 2n], ['RW', numArg(value)]])).memberMap.keys()],
};
