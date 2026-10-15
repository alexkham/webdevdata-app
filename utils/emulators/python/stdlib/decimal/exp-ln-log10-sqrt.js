// utils/emulators/python/stdlib/decimal/exp-ln-log10-sqrt.js
//
// Emulator for the sqrt / exp / ln / log10 demo: _pydecimal's correctly
// rounded integer algorithms (ported in _pydecimal.js), and ** for contrast.

import * as D from './_pydecimal.js';

export default {
  // with localcontext(prec=prec): (x.sqrt(), x.exp(), x.ln(), x.log10())
  all: (x, prec) => D.run(() => D.local({ prec }, () => {
    const d = D.dec(x);
    return D.T(D.method('sqrt', d), D.method('exp', d), D.method('ln', d), D.method('log10', d));
  })),

  // with localcontext(prec, rounding): (x.sqrt(), x ** Decimal('0.5'))
  rounding: (x, prec, rounding) => D.run(() => D.local({ prec, rounding }, () => {
    const d = D.dec(x);
    return D.T(D.method('sqrt', d), D.opPow(d, D.dec('0.5')));
  })),
};
