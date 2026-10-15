// utils/emulators/python/stdlib/decimal/limits.js
//
// Emulator for the limits demo: Context construction validated against
// MAX_PREC / MIN_EMIN / MAX_EMAX, then Etiny() and Etop() (_pydecimal.js).

import * as D from './_pydecimal.js';

export default {
  // ctx = Context(prec=prec, Emin=Emin, Emax=Emax); (ctx.Etiny(), ctx.Etop())
  range: (prec, Emin, Emax) => D.run(() => {
    const ctx = D.newContext({ prec, Emin, Emax });
    return D.T(D.ctxMethod(ctx, 'Etiny'), D.ctxMethod(ctx, 'Etop'));
  }),
};
