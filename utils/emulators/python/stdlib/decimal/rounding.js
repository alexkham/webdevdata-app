// utils/emulators/python/stdlib/decimal/rounding.js
//
// Emulator for the rounding-modes demo: quantize and division under each
// of the eight ROUND_* modes (_pydecimal.js port).

import * as D from './_pydecimal.js';

// [m for m in dir(decimal) if m.startswith('ROUND_')] — dir() is sorted
const MODES = [...D.ROUNDINGS].sort();

export default {
  // {m: str(x.quantize(Decimal(step), rounding=m)) for m in modes}
  quantize: (value, step) => D.run(() => {
    const x = D.dec(value);
    return { dict: MODES.map((m) => [m, D.str(D.methodQuantize(x, D.dec(step), m))]) };
  }),

  // results[m] = str(a / b) under localcontext(prec=prec, rounding=m)
  divide: (a, b, prec) => D.run(() => {
    const entries = [];
    for (const m of MODES) {
      entries.push([m, D.local({ prec, rounding: m }, () => D.str(D.opTruediv(D.dec(a), D.dec(b))))]);
    }
    return { dict: entries };
  }),
};
