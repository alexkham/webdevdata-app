// utils/emulators/python/stdlib/decimal/floatoperation.js
//
// Emulator for the FloatOperation demo: the flag set by Decimal(float),
// the trapped constructor, and trapped comparisons with floats
// (_pydecimal.js port, C-module semantics: == only flags, < raises).

import * as D from './_pydecimal.js';
import { fromLiteral } from '../../../../py-num.js';

// an 'auto' demo value as the Python object the snippet code holds:
// text → str; a number → int or float exactly as its literal reads
function pyValue(x) {
  if (typeof x === 'string') return x;
  const v = fromLiteral(x);
  return v.int !== undefined ? v.int : D.F(v.float);
}

export default {
  // with localcontext() as ctx: ctx.clear_flags(); d = Decimal(x)
  // (d, ctx.flags[FloatOperation])
  flag: (x) => D.run(() => D.local({}, (ctx) => {
    D.clearFlags(ctx);
    const d = D.dec(pyValue(x));
    return D.T(d, D.sigGet(ctx.flags, 'FloatOperation'));
  })),

  // with localcontext() as ctx: ctx.traps[FloatOperation] = True; d = Decimal(x)
  strict: (x) => D.run(() => D.local({}, (ctx) => {
    D.sigSet(ctx.traps, 'FloatOperation', true);
    return D.dec(pyValue(x));
  })),

  // trapped: same = Decimal(a) == f
  //          try: smaller = Decimal(a) < f
  //          except FloatOperation as e: smaller = type(e).__name__
  compare: (a, f) => D.run(() => D.local({}, (ctx) => {
    D.sigSet(ctx.traps, 'FloatOperation', true);
    // Python evaluates Decimal(a) before it looks up / builds f
    // (an out-of-range float literal renders as the undefined name inf)
    const left = D.dec(a);
    const other = pyValue(f);
    const same = D.compare('eq', left, other);
    let smaller;
    try {
      smaller = D.compare('lt', D.dec(a), other);
    } catch (e) {
      if (!D.excIs(e, 'FloatOperation')) throw e;
      smaller = D.excName(e);
    }
    return D.T(same, smaller);
  })),
};
