// utils/emulators/python/stdlib/decimal/decimalexception.js
//
// Emulator for the DecimalException demo: the flags one operation sets,
// trapping a single named signal, and catching any signal through the base
// class — all on the _pydecimal.js port, which raises the C module's way
// (first trapped signal class, list of trapped conditions as the message).

import * as D from './_pydecimal.js';

export default {
  // ctx = Context(prec=prec, Emin=-99, Emax=99, traps=[])
  // r = ctx.multiply(Decimal(a), Decimal(b)); (r, [names of set flags])
  flags: (a, b, prec) => D.run(() => {
    const ctx = D.newContext({ prec, Emin: -99, Emax: 99, traps: [] });
    const r = D.ctxMethod(ctx, 'multiply', D.dec(a), D.dec(b));
    return D.T(r, D.flagNames(ctx));
  }),

  // with localcontext() as ctx:
  //     for s in ctx.traps: ctx.traps[s] = s.__name__ == signal
  //     r = Decimal(a) / Decimal(b)
  trap: (a, b, signal) => D.run(() => D.local({}, (ctx) => {
    for (const s of D.SIGNALS) D.sigSet(ctx.traps, s, s === signal);
    return D.opTruediv(D.dec(a), D.dec(b));
  })),

  // try: Decimal(a) / Decimal(b)
  // except decimal.DecimalException as e: (type name, isinstance(e, ArithmeticError), str(e))
  catch: (a, b) => D.run(() => {
    try {
      return D.opTruediv(D.dec(a), D.dec(b));
    } catch (e) {
      if (!D.excIs(e, 'DecimalException')) throw e;
      return D.T(D.excName(e), D.excIs(e, 'ArithmeticError'), e.message);
    }
  }),
};
