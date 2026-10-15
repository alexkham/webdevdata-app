// utils/emulators/python/stdlib/operator/arithmetic.js
//
// Emulator for the arithmetic functions page (add, sub, mul, truediv,
// floordiv, mod, pow, neg, pos, abs, matmul, index): any operator function
// looked up by name and called on typed operands, via _pyoperator.js.

import { OPERATOR_MODULE, getattr, callValue, auto, out, binop, tuple } from './_pyoperator.js';

export default {
  // f = getattr(operator, name); f(a, b)
  byname: (name, a, b) => {
    const f = getattr(OPERATOR_MODULE, name);
    const x = auto(a);
    const y = auto(b);
    return out(callValue(f, [x, y]));
  },

  // f = getattr(operator, name); f(x)
  unary: (name, x) => {
    const f = getattr(OPERATOR_MODULE, name);
    return out(callValue(f, [auto(x)]));
  },

  // a, b = …; (operator.truediv(a, b), operator.floordiv(a, b), operator.mod(a, b))
  division: (a, b) => {
    const x = auto(a);
    const y = auto(b);
    return out(tuple(binop('truediv', x, y), binop('floordiv', x, y), binop('mod', x, y)));
  },
};
