// utils/emulators/python/stdlib/decimal/copy_abs-copy_negate-copy_sign.js
//
// Emulator for the quiet sign operations demo: copy_negate / copy_abs /
// copy_sign next to the rounding -x and abs(x) (_pydecimal.js port).

import * as D from './_pydecimal.js';

export default {
  // with localcontext(prec): (x.copy_negate(), -x, x.copy_abs(), abs(x))
  versus: (x, prec) => D.run(() => D.local({ prec }, () => {
    const d = D.dec(x);
    return D.T(D.method('copy_negate', d), D.opNeg(d), D.method('copy_abs', d), D.opAbs(d));
  })),

  // Decimal(x).copy_sign(Decimal(y))
  sign: (x, y) => D.run(() => D.method('copy_sign', D.dec(x), D.dec(y))),
};
