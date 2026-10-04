// utils/emulators/python/stdlib/math/exp-exp2-expm1.js
//
// Emulator for the math.exp / exp2 / expm1 demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // (math.exp(x), math.exp2(x))
  compare: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.exp(v), M.exp2(v)] });
  },

  // (math.exp(x) - 1, math.expm1(x))
  small: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.F(M.exp(v).float - 1), M.expm1(v)] });
  },
};
