// utils/emulators/python/stdlib/enum/name-value.js
//
// Emulator for the Enum.name / Enum.value demo tabs (Lib/enum.py port in
// _pyenum.js).

import { defineEnum, ENUM, FLAG, call, getitem, attr, autoArg, numArg, pyTuple } from './_pyenum.js';

const nameValue = (m) => pyTuple(attr(m, 'name'), attr(m, 'value'));

export default {
  // m = Color(value); (m.name, m.value)
  value: (value) => nameValue(call(defineEnum('Color', [ENUM], [['RED', 1n], ['GREEN', 2n], ['BLUE', 3n]]), autoArg(value))),

  // m = Color[name] with CRIMSON an alias of RED
  alias: (name) => nameValue(getitem(defineEnum('Color', [ENUM], [['RED', 1n], ['CRIMSON', 1n], ['GREEN', 2n]]), name)),

  // p = Perm(value); (p.name, p.value)
  flag: (value) => nameValue(call(defineEnum('Perm', [FLAG], [['R', 4n], ['W', 2n], ['X', 1n]]), numArg(value))),
};
