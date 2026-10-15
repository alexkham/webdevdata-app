// utils/emulators/python/stdlib/fractions/format.js
//
// Emulator for the Fraction formatting demo: str / repr and the 3.13
// __format__ port (general and float-style specs) in _pyfraction.js.

import * as Q from './_pyfraction.js';

export default {
  // format(Fraction(text), spec)
  spec: (text, spec) => Q.fracFormat(Q.fraction(text), spec),

  // (str(f), repr(f), f'{f}', f'{f:#}')
  str: (text) => {
    const f = Q.fraction(text);
    return Q.out(Q.T(Q.fracStr(f), Q.fracRepr(f), Q.fracFormat(f, ''), Q.fracFormat(f, '#')));
  },

  // (f'{x:.20f}', f'{float(x):.20f}') — the float printed through its exact
  // value (float 'f' formatting is correctly rounded, half to even, too);
  // a tiny negative value becomes -0.0, which keeps its sign
  // (the tuple is built left to right: the Fraction is formatted first, so
  // its errors — e.g. the 4300-digit str() limit — win over float()'s)
  digits: (text) => {
    const x = Q.fraction(text);
    const exact = Q.fracFormat(x, '.20f');
    const r = Q.fracToFloat(x);
    const asFloat = Q.fracFormat(Q.fraction(Q.F(r)), '.20f');
    return Q.out(Q.T(exact, Object.is(r, -0) ? `-${asFloat}` : asFloat));
  },
};
