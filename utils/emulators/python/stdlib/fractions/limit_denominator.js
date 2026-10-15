// utils/emulators/python/stdlib/fractions/limit_denominator.js
//
// Emulator for the Fraction.limit_denominator demo (_pyfraction.js).

import * as Q from './_pyfraction.js';

export default {
  // Fraction(text).limit_denominator(max_denominator)
  approx: (text, maxDen) => Q.out(Q.limitDenominator(Q.fraction(text), Q.lit(maxDen))),

  // (Fraction(x), Fraction(x).limit_denominator())
  float: (x) => {
    const f = Q.fraction(Q.litFloat(x));
    return Q.out(Q.T(f, Q.limitDenominator(f)));
  },
};
