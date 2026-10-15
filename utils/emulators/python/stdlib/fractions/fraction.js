// utils/emulators/python/stdlib/fractions/fraction.js
//
// Emulator for the fractions.Fraction constructor demo, on the
// Lib/fractions.py port in _pyfraction.js.

import * as Q from './_pyfraction.js';

// an 'auto' demo value: numbers are read like their literal text, the rest is a str
const autoArg = (x) => (typeof x === 'number' ? Q.lit(x) : x);

export default {
  // Fraction(text)
  string: (text) => Q.out(Q.fraction(text)),

  // Fraction(numerator, denominator)
  pair: (n, d) => Q.out(Q.fraction(Q.lit(n), Q.lit(d))),

  // Fraction(x) for an int, float or str
  value: (x) => Q.out(Q.fraction(autoArg(x))),
};
