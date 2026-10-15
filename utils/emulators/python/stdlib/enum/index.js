// utils/emulators/python/stdlib/enum/index.js
//
// Emulator for the enum module hub demo, on the Lib/enum.py port in
// _pyenum.js. Each call builds the template's class afresh, as the snippet
// does.

import { defineEnum, ENUM, FLAG, call, getitem, autoArg, numArg, py } from './_pyenum.js';

const color = () => defineEnum('Color', [ENUM], [['RED', 1n], ['GREEN', 2n], ['BLUE', 3n]]);
const perm = () => defineEnum('Perm', [FLAG], [['R', 4n], ['W', 2n], ['X', 1n]]);

export default {
  // Color(value)
  lookup: (value) => py(call(color(), autoArg(value))),
  // Color[name]
  name: (name) => py(getitem(color(), name)),
  // Perm(value)
  flags: (value) => py(call(perm(), numArg(value))),
};
