// utils/emulators/python/stdlib/enum/flag.js
//
// Emulator for the enum.Flag demo tabs, on the Lib/enum.py port in
// _pyenum.js. Each call builds the template's class afresh (pseudo-members
// and ~ results are cached per class, as in CPython).

import { defineEnum, FLAG, call, getitem, flagOp, invert, flagContains, flagList, flagLen, truthy, numArg, pyTuple } from './_pyenum.js';

// class Perm(Flag): R = 4; W = 2; X = 1; RWX = 7
const perm = () => defineEnum('Perm', [FLAG], [['R', 4n], ['W', 2n], ['X', 1n], ['RWX', 7n]]);

export default {
  // p = Perm(value); (list(p), len(p), bool(p))
  members: (value) => {
    const p = call(perm(), numArg(value));
    return pyTuple(flagList(p), flagLen(p), truthy(p));
  },

  // a, b = Perm[a], Perm[b]; (a | b, a & b, a ^ b)
  ops: (a, b) => {
    const Perm = perm();
    const x = getitem(Perm, a);
    const y = getitem(Perm, b);
    return pyTuple(flagOp(x, '|', y), flagOp(x, '&', y), flagOp(x, '^', y));
  },

  // p = Perm(value); (~p, Perm.W in p)
  invert: (value) => {
    const Perm = perm();
    const p = call(Perm, numArg(value));
    const inv = invert(p);
    return pyTuple(inv, flagContains(p, getitem(Perm, 'W')));
  },
};
