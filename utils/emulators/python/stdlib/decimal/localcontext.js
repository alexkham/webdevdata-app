// utils/emulators/python/stdlib/decimal/localcontext.js
//
// Emulator for the localcontext demo: arithmetic under a temporary copy of
// the current context (or of a given context), via _pydecimal.js.

import * as D from './_pydecimal.js';

export default {
  // with localcontext(prec, rounding): inside = a / b; outside = a / b
  block: (a, b, prec, rounding) => D.run(() => {
    const inside = D.local({ prec, rounding }, () => D.opTruediv(D.dec(a), D.dec(b)));
    const outside = D.opTruediv(D.dec(a), D.dec(b));
    return D.T(inside, outside);
  }),

  // with localcontext() as ctx: ctx.traps[Inexact] = True; a / b
  traps: (a, b) => D.run(() => D.local({}, (ctx) => {
    D.sigSet(ctx.traps, 'Inexact', true);
    return D.opTruediv(D.dec(a), D.dec(b));
  })),

  // with localcontext(ExtendedContext, prec=prec): a / b
  base: (a, b, prec) => D.run(() => D.withContext(D.localcontext({ prec }, D.ExtendedContext), () => D.opTruediv(D.dec(a), D.dec(b)))),
};
