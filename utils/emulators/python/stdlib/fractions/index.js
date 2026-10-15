// utils/emulators/python/stdlib/fractions/index.js
//
// Emulator for the fractions module hub demo, on the Lib/fractions.py port
// in _pyfraction.js.

import * as Q from './_pyfraction.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';

export default {
  // Fraction(text)
  parse: (text) => Q.out(Q.fraction(text)),

  // (Fraction(x), Fraction(str(x)), Fraction(x).limit_denominator())
  float: (x) => {
    const v = Q.litFloat(x);
    return Q.out(Q.T(Q.fraction(v), Q.fraction(pyFloatRepr(v.float)), Q.limitDenominator(Q.fraction(v))));
  },

  // a = Fraction(a); b = Fraction(b); (a + b, a - b, a * b, a / b)
  arith: (a, b) => {
    const x = Q.fraction(a);
    const y = Q.fraction(b);
    return Q.out(Q.T(Q.add(x, y), Q.sub(x, y), Q.mul(x, y), Q.truediv(x, y)));
  },
};
