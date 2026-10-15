// utils/emulators/python/stdlib/decimal/inexact-rounded.js
//
// Emulator for the Inexact / Rounded demo: the two flags after a division
// in a private context, and quantize to cents with Inexact trapped
// (_pydecimal.js port, C-module error reporting).

import * as D from './_pydecimal.js';

export default {
  // ctx = Context(prec=prec); r = ctx.divide(Decimal(a), Decimal(b))
  // (r, ctx.flags[Inexact], ctx.flags[Rounded])
  flags: (a, b, prec) => D.run(() => {
    const ctx = D.newContext({ prec });
    const r = D.ctxMethod(ctx, 'divide', D.dec(a), D.dec(b));
    return D.T(r, D.sigGet(ctx.flags, 'Inexact'), D.sigGet(ctx.flags, 'Rounded'));
  }),

  // with localcontext() as ctx: ctx.traps[Inexact] = True
  //     cents = Decimal(amount).quantize(Decimal('0.01'))
  strict: (amount) => D.run(() => D.local({}, (ctx) => {
    D.sigSet(ctx.traps, 'Inexact', true);
    return D.methodQuantize(D.dec(amount), D.dec('0.01'));
  })),
};
