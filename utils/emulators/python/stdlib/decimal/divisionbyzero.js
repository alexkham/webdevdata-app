// utils/emulators/python/stdlib/decimal/divisionbyzero.js
//
// Emulator for the DivisionByZero demo: division with the default traps,
// with the DivisionByZero trap off, and caught as ZeroDivisionError
// (_pydecimal.js port, C-module error reporting).

import * as D from './_pydecimal.js';

export default {
  // Decimal(a) / Decimal(b)
  trigger: (a, b) => D.run(() => D.opTruediv(D.dec(a), D.dec(b))),

  // with localcontext() as ctx: trap off, clear flags, r = a / b
  // (r, ctx.flags[DivisionByZero])
  untrapped: (a, b) => D.run(() => D.local({}, (ctx) => {
    D.sigSet(ctx.traps, 'DivisionByZero', false);
    D.clearFlags(ctx);
    const r = D.opTruediv(D.dec(a), D.dec(b));
    return D.T(r, D.sigGet(ctx.flags, 'DivisionByZero'));
  })),

  // try: r = a / b except ZeroDivisionError as e: r = type(e).__name__
  except: (a, b) => D.run(() => {
    try {
      return D.opTruediv(D.dec(a), D.dec(b));
    } catch (e) {
      if (!D.excIs(e, 'ZeroDivisionError')) throw e;
      return D.excName(e);
    }
  }),
};
