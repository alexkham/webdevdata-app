// utils/emulators/python/stdlib/operator/in-place.js
//
// Emulator for the in-place functions page (iadd, iand, iconcat, ifloordiv,
// ilshift, imatmul, imod, imul, ior, ipow, irshift, isub, itruediv, ixor):
// a list is changed in place and returned; immutable values get a new
// object back — except where CPython's concat returns an operand itself.

import { auto, out, tuple, binop, toTuple } from './_pyoperator.js';

export default {
  // a = [...]; alias = a; a = operator.iadd(a, [...]); (a, alias, a is alias)
  list: (items, more) => {
    const a = [...items];
    const alias = a;
    const r = binop('add', a, [...more], true);
    return out(tuple(r, alias, r === alias));
  },

  // a = tuple([...]); alias = a; a = operator.iadd(a, tuple([...])); (a, alias, a is alias)
  // (tupleconcat returns the right operand when the left one is empty, and
  // the left operand itself when the right one is empty)
  tuple: (items, more) => {
    const a = toTuple([...items]);
    const alias = a;
    const r = binop('add', a, toTuple([...more]), true);
    return out(tuple(r, alias, r === alias));
  },

  // a = '…'; alias = a; a = operator.iadd(a, '…'); (a, alias, a is alias)
  // (PyUnicode_Concat returns the left operand itself when the right one is
  // empty; otherwise a new str — or the right operand when the left is '')
  str: (text, more) => {
    const r = binop('add', text, more, true);
    return out(tuple(r, text, more === ''));
  },

  // x = …; y = operator.iadd(x, …); (x, y)
  numbers: (x, y) => {
    const a = auto(x);
    const b = auto(y);
    return out(tuple(a, binop('add', a, b, true)));
  },
};
