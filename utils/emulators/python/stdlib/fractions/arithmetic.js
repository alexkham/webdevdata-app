// utils/emulators/python/stdlib/fractions/arithmetic.js
//
// Emulator for the Fraction operators demo: the _operator_fallbacks
// dispatch and rational algorithms ported in _pyfraction.js.

import * as Q from './_pyfraction.js';

export default {
  // (a + b, a - b, a * b, a / b)
  basic: (a, b) => {
    const x = Q.fraction(a);
    const y = Q.fraction(b);
    return Q.out(Q.T(Q.add(x, y), Q.sub(x, y), Q.mul(x, y), Q.truediv(x, y)));
  },

  // (a // b, a % b)
  floor: (a, b) => {
    const x = Q.fraction(a);
    const y = Q.fraction(b);
    return Q.out(Q.T(Q.floordiv(x, y), Q.mod(x, y)));
  },

  // Fraction(base) ** n
  power: (base, n) => Q.out(Q.pyPow(Q.fraction(base), Q.lit(n))),

  // f = Fraction(a); (f + x, f == x, f < x)
  mixed: (a, x) => {
    const f = Q.fraction(a);
    const v = Q.litFloat(x);
    return Q.out(Q.T(Q.add(f, v), Q.eq(f, v), Q.lt(f, v)));
  },
};
