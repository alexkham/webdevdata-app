// utils/emulators/python/stdlib/fractions/as_integer_ratio-is_integer.js
//
// Emulator for the Fraction.as_integer_ratio / is_integer demo (_pyfraction.js).

import * as Q from './_pyfraction.js';

export default {
  // f = Fraction(text); (f.as_integer_ratio(), f.is_integer())
  methods: (text) => {
    const f = Q.fraction(text);
    return Q.out(Q.T(Q.asIntegerRatio(f), Q.isInteger(f)));
  },

  // x = <float>; (x.as_integer_ratio(), Fraction(x).as_integer_ratio())
  float: (x) => {
    const v = Q.litFloat(x);
    const [n, d] = Q.floatRatio(v.float);
    return Q.out(Q.T(Q.T(Q.I(n), Q.I(d)), Q.asIntegerRatio(Q.fraction(v))));
  },
};
