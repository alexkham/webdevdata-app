// utils/emulators/python/stdlib/math/constants.js
//
// Emulator for the math.pi / e / tau / inf / nan demo.

import * as M from './_pymath.js';

export default {
  // getattr(math, name)
  value: (name) => M.out(M.attr(name)),

  // x = float(s); (x == math.inf, math.isinf(x), x == x, math.isnan(x))
  special: (s) => {
    const x = M.floatFromStr(s);
    return M.out({ tuple: [x.float === Infinity, M.isinf(x), x.float === x.float, M.isnan(x)] });
  },

  // (math.pi * r ** 2, math.tau * r)
  circle: (r) => {
    const v = M.litFloat(r);
    const area = M.pyMul(M.pi, M.pyPow(v, M.I(2)));
    return M.out({ tuple: [area, M.pyMul(M.tau, v)] });
  },
};
