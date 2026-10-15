// utils/emulators/python/stdlib/decimal/next_plus-next_minus-next_toward.js
//
// Emulator for the neighbouring-values demo: next_minus / next_plus /
// next_toward under a chosen precision (_pydecimal.js port).

import * as D from './_pydecimal.js';

export default {
  // with localcontext(prec): (x.next_minus(), x.next_plus(), x.next_toward(y))
  next: (x, y, prec) => D.run(() => D.local({ prec }, () => {
    const d = D.dec(x);
    return D.T(D.method('next_minus', d), D.method('next_plus', d), D.method('next_toward', d, D.dec(y)));
  })),
};
