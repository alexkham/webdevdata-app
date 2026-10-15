// utils/emulators/python/stdlib/decimal/decimal.js
//
// Emulator for the Decimal constructor demo: Decimal(str) with libmpdec's
// parsing rules, exact float conversion and Context.create_decimal, from
// the _pydecimal.js port.

import * as D from './_pydecimal.js';

export default {
  // Decimal(text)
  str: (text) => D.run(() => D.dec(text)),

  // d = Decimal(x); (d, d == x, Decimal(str(x)) == x)
  float: (x) => D.run(() => {
    const f = D.floatLit(x);
    const d = D.dec(f);
    return D.T(d, D.compare('eq', d, f), D.compare('eq', D.dec(D.floatStr(x)), f));
  }),

  // ctx = Context(prec=prec); (Decimal(text), ctx.create_decimal(text))
  create: (text, prec) => D.run(() => {
    const ctx = D.newContext({ prec });
    return D.T(D.dec(text), D.createDecimal(ctx, text));
  }),
};
