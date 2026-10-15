// utils/emulators/python/stdlib/decimal/overflow-underflow.js
//
// Emulator for the exponent-limit demo: untrapped overflow under each
// rounding mode, subnormal / underflow results near Etiny, and clamp's
// fold-down — all computed by the _pydecimal.js port.

import * as D from './_pydecimal.js';

export default {
  // ctx = Context(prec=3, Emax=9, rounding=rounding, traps=[])
  // r = ctx.multiply(Decimal(a), Decimal(b)); (r, [set flags])
  overflow: (a, b, rounding) => D.run(() => {
    const ctx = D.newContext({ prec: 3, Emax: 9, rounding, traps: [] });
    const r = D.ctxMethod(ctx, 'multiply', D.dec(a), D.dec(b));
    return D.T(r, D.flagNames(ctx));
  }),

  // ctx = Context(prec=3, Emin=-9, traps=[]); r = ctx.divide(Decimal(a), Decimal(b))
  // (r, ctx.is_subnormal(r), [set flags])
  underflow: (a, b) => D.run(() => {
    const ctx = D.newContext({ prec: 3, Emin: -9, traps: [] });
    const r = D.ctxMethod(ctx, 'divide', D.dec(a), D.dec(b));
    return D.T(r, D.ctxMethod(ctx, 'is_subnormal', r), D.flagNames(ctx));
  }),

  // ctx = Context(prec=5, Emax=9, clamp=clamp); r = ctx.create_decimal(x)
  // (r, ctx.flags[Clamped])
  clamp: (x, clamp) => D.run(() => {
    const ctx = D.newContext({ prec: 5, Emax: 9, clamp });
    const r = D.createDecimal(ctx, x);
    return D.T(r, D.sigGet(ctx.flags, 'Clamped'));
  }),
};
