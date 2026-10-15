// utils/emulators/python/stdlib/enum/intflag.js
//
// Emulator for the enum.IntFlag demo tabs, on the Lib/enum.py port in
// _pyenum.js (IntFlag: int members, boundary KEEP).

import { defineEnum, INT_FLAG, call, getitem, flagOp, flagList, invert, str, numArg, float, py, pyTuple } from './_pyenum.js';

// class Perm(IntFlag): R = 4; W = 2; X = 1
const perm = () => defineEnum('Perm', [INT_FLAG], [['R', 4n], ['W', 2n], ['X', 1n]]);

export default {
  // p = Perm(value); (p, str(p), list(p))
  value: (value) => {
    const p = call(perm(), numArg(value));
    return pyTuple(p, str(p), flagList(p));
  },

  // (Perm.R | value, Perm.R + value)
  ints: (value) => {
    const n = numArg(value);
    const r = getitem(perm(), 'R');
    const or = flagOp(r, '|', n);
    // int.__add__: the member's int data plus the number
    const sum = typeof n === 'bigint' ? r.data + n : float(Number(r.data) + n.v);
    return pyTuple(or, sum);
  },

  // ~Perm(value)
  invert: (value) => py(invert(call(perm(), numArg(value)))),
};
