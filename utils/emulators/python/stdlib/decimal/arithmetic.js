// utils/emulators/python/stdlib/decimal/arithmetic.js
//
// Emulator for the Decimal arithmetic demo: operators under the current
// context, //, %, remainder_near, ** (libmpdec's power algorithm) and the
// Context methods, all from the _pydecimal.js port.

import * as D from './_pydecimal.js';

export default {
  // (a + b, a - b, a * b, a / b)
  ops: (a, b) => D.run(() => {
    const x = D.dec(a);
    const y = D.dec(b);
    return D.T(D.opAdd(x, y), D.opSub(x, y), D.opMul(x, y), D.opTruediv(x, y));
  }),

  // (a // b, a % b, a.remainder_near(b))
  intdiv: (a, b) => D.run(() => {
    const x = D.dec(a);
    const y = D.dec(b);
    return D.T(D.opFloordiv(x, y), D.opMod(x, y), D.method('remainder_near', x, y));
  }),

  // with localcontext(prec=prec): Decimal(base) ** Decimal(exp)
  power: (base, exp, prec) => D.run(() => D.local({ prec }, () => D.opPow(D.dec(base), D.dec(exp)))),

  // (ctx.add(ctx.multiply(a, b), c), ctx.fma(a, b, c)) with prec 7
  fma: (a, b, c) => D.run(() => {
    const ctx = D.newContext({ prec: 7 });
    const x = D.dec(a);
    const y = D.dec(b);
    return D.T(D.ctxMethod(ctx, 'add', D.ctxMethod(ctx, 'multiply', x, y), c), D.ctxMethod(ctx, 'fma', x, y, c));
  }),
};
