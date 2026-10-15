// utils/emulators/python/stdlib/fractions/numerator-denominator.js
//
// Emulator for the Fraction.numerator / .denominator demo (_pyfraction.js).

import * as Q from './_pyfraction.js';

const parts = (f) => Q.out(Q.T(Q.I(f.n), Q.I(f.d)));

export default {
  // f = Fraction(text); (f.numerator, f.denominator)
  parts: (text) => parts(Q.fraction(text)),

  // f = Fraction(x); (f.numerator, f.denominator)
  float: (x) => parts(Q.fraction(Q.litFloat(x))),
};
