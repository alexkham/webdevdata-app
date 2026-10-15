// utils/emulators/python/stdlib/decimal/index.js
//
// Emulator for the decimal module hub demo, on the Lib/_pydecimal.py port
// (with the C module's signalling) in _pydecimal.js.

import * as D from './_pydecimal.js';

export default {
  // x, y = {$x}, {$y}; (x + y, Decimal(str(x)) + Decimal(str(y)))
  sum: (x, y) => D.run(() => {
    const fx = D.floatLit(x);
    const fy = D.floatLit(y);
    return D.T(D.F(fx.float + fy.float), D.opAdd(D.dec(D.floatStr(x)), D.dec(D.floatStr(y))));
  }),

  // (Decimal(x), Decimal(str(x)))
  float: (x) => D.run(() => {
    const fx = D.floatLit(x);
    return D.T(D.dec(fx), D.dec(D.floatStr(x)));
  }),

  // with localcontext(prec=prec, rounding=rounding): Decimal(a) / Decimal(b)
  context: (a, b, prec, rounding) => D.run(() => D.local({ prec, rounding }, () => D.opTruediv(D.dec(a), D.dec(b)))),
};
