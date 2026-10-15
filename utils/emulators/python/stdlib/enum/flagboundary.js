// utils/emulators/python/stdlib/enum/flagboundary.js
//
// Emulator for the enum.FlagBoundary demo tabs: Flag._missing_ under each
// boundary (Lib/enum.py port in _pyenum.js). EJECT can hand back a plain
// int, which prints as a number.

import { defineEnum, FLAG, call, numArg, py } from './_pyenum.js';

// class Perm(Flag, boundary=B): R = 4; W = 2; X = 1 — Perm(value)
const lookup = (boundary) => (value) => py(call(defineEnum('Perm', [FLAG], [['R', 4n], ['W', 2n], ['X', 1n]], { boundary }), numArg(value)));

export default {
  strict: lookup('strict'),
  conform: lookup('conform'),
  eject: lookup('eject'),
  keep: lookup('keep'),
};
