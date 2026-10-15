// utils/emulators/python/stdlib/decimal/invalidoperation.js
//
// Emulator for the InvalidOperation demo: the condition list of a trapped
// InvalidOperation, the untrapped NaN result, and quiet vs signaling NaNs
// (_pydecimal.js port, C-module error reporting).

import * as D from './_pydecimal.js';

// [c.__name__ for c in e.args[0]] — the classes in the message list
const conditionNames = (e) => [...String(e.message).matchAll(/<class 'decimal\.(\w+)'>/g)].map((m) => m[1]);

export default {
  // try: r = Decimal(a) // Decimal(b)
  // except InvalidOperation as e: r = [c.__name__ for c in e.args[0]]
  conditions: (a, b) => D.run(() => {
    try {
      return D.opFloordiv(D.dec(a), D.dec(b));
    } catch (e) {
      if (!D.excIs(e, 'InvalidOperation')) throw e;
      return conditionNames(e);
    }
  }),

  // ctx = Context(traps=[]); r = ctx.sqrt(Decimal(x)); (r, ctx.flags[InvalidOperation])
  quiet: (x) => D.run(() => {
    const ctx = D.newContext({ traps: [] });
    const r = D.ctxMethod(ctx, 'sqrt', D.dec(x));
    return D.T(r, D.sigGet(ctx.flags, 'InvalidOperation'));
  }),

  // x = Decimal(x); (x + 1, x.is_nan(), x == x)
  nan: (text) => D.run(() => {
    const x = D.dec(text);
    return D.T(D.opAdd(x, 1n), D.method('is_nan', x), D.compare('eq', x, x));
  }),
};
