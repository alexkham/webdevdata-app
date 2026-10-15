// utils/emulators/python/stdlib/decimal/predicates.js
//
// Emulator for the predicates demo: number_class and the is_* tests
// (quiet, context-dependent only through Emin), from _pydecimal.js.

import * as D from './_pydecimal.js';

const NAMES = ['is_finite', 'is_infinite', 'is_nan', 'is_qnan', 'is_snan', 'is_signed', 'is_zero', 'is_normal', 'is_subnormal'];

export default {
  // (x.number_class(), [name for name in NAMES if getattr(x, name)()])
  classify: (x) => D.run(() => {
    const d = D.dec(x);
    return D.T(D.method('number_class', d), NAMES.filter((n) => D.method(n, d)));
  }),

  // ctx = Context(Emin=Emin); (ctx.number_class(x), ctx.is_normal(x), ctx.is_subnormal(x))
  context: (x, Emin) => D.run(() => {
    const ctx = D.newContext({ Emin });
    const d = D.dec(x);
    return D.T(D.ctxMethod(ctx, 'number_class', d), D.ctxMethod(ctx, 'is_normal', d), D.ctxMethod(ctx, 'is_subnormal', d));
  }),
};
