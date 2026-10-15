// utils/emulators/python/stdlib/enum/enumtype.js
//
// Emulator for the enum.EnumType demo tabs (functional API, start=, and
// the class-level len / iteration / __members__), on the Lib/enum.py port
// in _pyenum.js.

import { defineEnum, functional, ENUM, members, length, autoArg, numArg, py, pyTuple } from './_pyenum.js';

export default {
  // Color = Enum('Color', names); list(Color)
  functional: (names) => py(members(functional(ENUM, 'Color', names))),

  // Color = Enum('Color', 'RED GREEN BLUE', start=start); list(Color)
  start: (start) => py(members(functional(ENUM, 'Color', 'RED GREEN BLUE', { start: numArg(start) }))),

  // RED = 1, CRIMSON = value, GREEN = 2
  // (len(Color), list(Color), list(Color.__members__))
  aliases: (value) => {
    const Color = defineEnum('Color', [ENUM], [['RED', 1n], ['CRIMSON', autoArg(value)], ['GREEN', 2n]]);
    return pyTuple(BigInt(length(Color)), members(Color), [...Color.memberMap.keys()]);
  },
};
