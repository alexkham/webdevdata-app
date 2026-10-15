// utils/emulators/python/stdlib/decimal/context.js
//
// Emulator for the Context demo: construction with the C module's
// validation, Context.divide with its flags, Etiny / Etop and
// create_decimal under a small exponent range (_pydecimal.js port).

import * as D from './_pydecimal.js';

export default {
  // Context(prec=prec, rounding=rounding, Emax=Emax)
  build: (prec, rounding, Emax) => D.run(() => D.newContext({ prec, rounding, Emax })),

  // ctx = Context(prec=prec); result = ctx.divide(...); (result, set flags)
  flags: (a, b, prec) => D.run(() => {
    const ctx = D.newContext({ prec });
    const result = D.ctxMethod(ctx, 'divide', D.dec(a), D.dec(b));
    return D.T(result, D.flagNames(ctx));
  }),

  // (ctx.Etiny(), ctx.Etop(), ctx.create_decimal(x))
  limits: (x, prec, Emin, Emax) => D.run(() => {
    const ctx = D.newContext({ prec, Emin, Emax });
    return D.T(D.ctxMethod(ctx, 'Etiny'), D.ctxMethod(ctx, 'Etop'), D.createDecimal(ctx, x));
  }),
};
