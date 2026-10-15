// utils/emulators/python/stdlib/decimal/logical-shift-rotate.js
//
// Emulator for the digit-wise operations demo: logical_and / or / xor /
// invert on logical operands, shift and rotate within prec digits
// (_pydecimal.js port).

import * as D from './_pydecimal.js';

export default {
  // with localcontext(prec=prec): (a & b, a | b, a ^ b, ~a) digit-wise
  logical: (a, b, prec) => D.run(() => D.local({ prec }, () => {
    const x = D.dec(a);
    const y = D.dec(b);
    return D.T(D.method('logical_and', x, y), D.method('logical_or', x, y), D.method('logical_xor', x, y), D.method('logical_invert', x));
  })),

  // with localcontext(prec=prec): (x.shift(n), x.rotate(n))
  shift: (x, n, prec) => D.run(() => D.local({ prec }, () => {
    const d = D.dec(x);
    return D.T(D.method('shift', d, n), D.method('rotate', d, n));
  })),
};
