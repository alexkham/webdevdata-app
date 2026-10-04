// utils/emulators/python/stdlib/math/log.js
//
// Emulator for the math.log / log2 / log10 / log1p demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // math.log(x, base)
  base: (x, base) => M.out(M.log(M.lit(x), M.lit(base))),

  // (math.log(x, 10), math.log10(x), math.log2(x))
  compare: (x) => {
    const v = M.lit(x);
    return M.out({ tuple: [M.log(v, M.I(10)), M.log10(v), M.log2(v)] });
  },

  // math.log10(10 ** n)
  bigint: (n) => M.out(M.log10(M.pyPow(M.I(10), M.lit(n)))),

  // (math.log(1 + x), math.log1p(x))
  small: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.log(M.pyAdd(M.I(1), v)), M.log1p(v)] });
  },
};
