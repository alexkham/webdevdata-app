// utils/emulators/python/stdlib/math/pow.js
//
// Emulator for the math.pow demo, on _pymath.js (math.pow and the **
// operator, including ** turning a negative base complex).

import * as M from './_pymath.js';

export default {
  // (math.pow(x, y), x ** y)
  compare: (x, y) => {
    const a = M.lit(x);
    const b = M.lit(y);
    return M.out({ tuple: [M.pow(a, b), M.pyPow(a, b)] });
  },

  // math.pow(x, y)
  big: (x, y) => M.out(M.pow(M.lit(x), M.lit(y))),
};
