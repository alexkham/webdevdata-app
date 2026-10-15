// utils/emulators/python/stdlib/decimal/format.js
//
// Emulator for the Decimal text-forms demo: format() with the C module's
// accepted specs, str / repr / to_eng_string, and capitals (_pydecimal.js).

import * as D from './_pydecimal.js';

export default {
  // format(Decimal(x), spec)
  format: (x, spec) => D.run(() => D.format(D.dec(x), spec)),

  // (str(x), repr(x), x.to_eng_string(), f'{x:f}')
  str: (x) => D.run(() => {
    const d = D.dec(x);
    return D.T(D.str(d), D.repr(d), D.method('to_eng_string', d), D.format(d, 'f'));
  }),

  // ctx = Context(capitals=c); (ctx.to_sci_string(x), ctx.to_eng_string(x))
  capitals: (x, capitals) => D.run(() => {
    const ctx = D.newContext({ capitals });
    return D.T(D.ctxMethod(ctx, 'to_sci_string', D.dec(x)), D.ctxMethod(ctx, 'to_eng_string', D.dec(x)));
  }),
};
