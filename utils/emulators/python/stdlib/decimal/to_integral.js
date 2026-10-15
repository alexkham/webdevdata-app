// utils/emulators/python/stdlib/decimal/to_integral.js
//
// Emulator for the to_integral demo: to_integral_value / to_integral_exact
// and the int-returning built-ins round, int, math.floor, math.ceil
// (_pydecimal.js port).

import * as D from './_pydecimal.js';

export default {
  // (x.to_integral_value(rounding), round(x), int(x), floor(x), ceil(x))
  compare: (x, rounding) => D.run(() => {
    const d = D.dec(x);
    const v = D.method('to_integral_value', d, rounding);
    return D.T(v, D.round(d), D.toInt(d), D.floor(d), D.ceil(d));
  }),

  // (c1.to_integral_value(x), c2.to_integral_exact(x), flags of c2)
  exact: (x) => D.run(() => {
    const d = D.dec(x);
    const c1 = D.newContext({});
    const c2 = D.newContext({});
    const v = D.ctxMethod(c1, 'to_integral_value', d);
    const e = D.ctxMethod(c2, 'to_integral_exact', d);
    return D.T(v, e, D.flagNames(c2));
  }),
};
