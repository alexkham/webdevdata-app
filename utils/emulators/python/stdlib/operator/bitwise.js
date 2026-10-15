// utils/emulators/python/stdlib/operator/bitwise.js
//
// Emulator for the bitwise functions page (and_, or_, xor, invert / inv,
// lshift, rshift), via the int/set operator port in _pyoperator.js.

import { PySet, auto, num, out, binop, unop, tuple, sorted } from './_pyoperator.js';

export default {
  // a, b = …; (operator.and_(a, b), operator.or_(a, b), operator.xor(a, b))
  logic: (a, b) => {
    const x = auto(a);
    const y = auto(b);
    return out(tuple(binop('and_', x, y), binop('or_', x, y), binop('xor', x, y)));
  },

  // x, n = …; (operator.lshift(x, n), operator.rshift(x, n))
  shift: (x, n) => {
    const a = auto(x);
    const k = num(n);
    return out(tuple(binop('lshift', a, k), binop('rshift', a, k)));
  },

  // x = …; (operator.invert(x), operator.inv(x), -x - 1)
  invert: (x) => {
    const a = auto(x);
    return out(tuple(unop('invert', a), unop('inv', a), binop('sub', unop('neg', a), 1n)));
  },

  // a, b = set(…), set(…); [sorted(f(a, b)) for f in (and_, or_, xor, sub)]
  sets: (a, b) => {
    const x = new PySet(a);
    const y = new PySet(b);
    return out(['and_', 'or_', 'xor', 'sub'].map((f) => sorted(binop(f, x, y).items)));
  },
};
