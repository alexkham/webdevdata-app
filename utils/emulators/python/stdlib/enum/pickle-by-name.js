// utils/emulators/python/stdlib/enum/pickle-by-name.js
//
// Emulator for the pickle_by_enum_name / pickle_by_global_name demo tabs:
// member.__reduce_ex__(4), the (callable, args) pair pickle stores
// (Lib/enum.py port in _pyenum.js).

import { defineEnum, ENUM, FLAG, getitem, call, reduceEx, numArg, py } from './_pyenum.js';

const color = (extra) => defineEnum('Color', [ENUM], [['RED', 1n], ['GREEN', 2n], ...extra]);

export default {
  // Enum.__reduce_ex__: (Color, (value,))
  byvalue: (name) => py(reduceEx(getitem(color([]), name))),

  // __reduce_ex__ = pickle_by_enum_name: (getattr, (Color, name))
  byname: (name) => py(reduceEx(getitem(color([['__reduce_ex__', 'pickle_by_enum_name']]), name))),

  // a Flag with pickle_by_enum_name: Perm(value).__reduce_ex__(4)
  flag: (value) => {
    const Perm = defineEnum('Perm', [FLAG], [['R', 4n], ['W', 2n], ['X', 1n], ['__reduce_ex__', 'pickle_by_enum_name']]);
    return py(reduceEx(call(Perm, numArg(value))));
  },
};
