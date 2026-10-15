// utils/emulators/python/stdlib/decimal/getcontext-setcontext.js
//
// Emulator for the getcontext / setcontext demo: swapping the current
// context (templates are installed as copies, like _decimal does).

import * as D from './_pydecimal.js';

export default {
  // saved = getcontext(); setcontext(Context(...)); try: sqrt(2) finally: restore
  swap: (prec, rounding) => D.run(() => {
    const saved = D.getcontext();
    D.setcontext(D.newContext({ prec, rounding }));
    try {
      return D.method('sqrt', D.dec(2n));
    } finally {
      D.setcontext(saved);
    }
  }),

  // setcontext(ExtendedContext); (a / b, getcontext() is ExtendedContext)
  template: (a, b) => D.run(() => {
    const saved = D.getcontext();
    D.setcontext(D.ExtendedContext);
    try {
      return D.T(D.opTruediv(D.dec(a), D.dec(b)), D.getcontext() === D.ExtendedContext);
    } finally {
      D.setcontext(saved);
    }
  }),
};
