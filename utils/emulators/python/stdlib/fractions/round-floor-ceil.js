// utils/emulators/python/stdlib/fractions/round-floor-ceil.js
//
// Emulator for the Fraction rounding demo: __round__, __floor__, __ceil__,
// __trunc__ and __int__ as ported in _pyfraction.js.

import * as Q from './_pyfraction.js';

export default {
  // f = Fraction(text); (round(f), round(f, ndigits))
  round: (text, ndigits) => {
    const f = Q.fraction(text);
    return Q.out(Q.T(Q.fracRound(f), Q.fracRound(f, Q.lit(ndigits))));
  },

  // (math.floor(f), math.ceil(f), math.trunc(f), int(f), round(f))
  toint: (text) => {
    const f = Q.fraction(text);
    return Q.out(Q.T(Q.fracFloor(f), Q.fracCeil(f), Q.fracTrunc(f), Q.fracTrunc(f), Q.fracRound(f)));
  },
};
