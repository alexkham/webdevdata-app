// utils/emulators/python/stdlib/decimal/quantize.js
//
// Emulator for the quantize demo: quantize with any rounding mode and the
// C module's InvalidOperation rules, plus same_quantum (_pydecimal.js).

import * as D from './_pydecimal.js';

const MODES = [...D.ROUNDINGS].sort();

export default {
  // Decimal(amount).quantize(Decimal(step), rounding=rounding)
  money: (amount, step, rounding) => D.run(() => D.methodQuantize(D.dec(amount), D.dec(step), rounding)),

  // {m: str(price.quantize(Decimal('0.01'), rounding=m)) for each mode}
  every: (price) => D.run(() => {
    const p = D.dec(price);
    return { dict: MODES.map((m) => [m, D.str(D.methodQuantize(p, D.dec('0.01'), m))]) };
  }),

  // (a.same_quantum(b), a.as_tuple().exponent, b.as_tuple().exponent)
  same: (a, b) => D.run(() => {
    const x = D.dec(a);
    const y = D.dec(b);
    const exp = (d) => {
      const e = D.asTuple(d).dtuple.exponent;
      return typeof e === 'string' ? e : BigInt(e);
    };
    return D.T(D.method('same_quantum', x, y), exp(x), exp(y));
  }),
};
