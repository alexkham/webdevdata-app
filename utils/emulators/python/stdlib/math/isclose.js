// utils/emulators/python/stdlib/math/isclose.js
//
// Emulator for the math.isclose demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // x = a + b; (x, x == c, math.isclose(x, c))
  sum: (a, b, c) => {
    const x = M.pyAdd(M.litFloat(a), M.litFloat(b));
    const cv = M.litFloat(c);
    return M.out({ tuple: [x, x.float === cv.float, M.isclose(x, cv)] });
  },

  // math.isclose(a, b, rel_tol=rel, abs_tol=abs)
  tol: (a, b, rel, abs) => M.isclose(M.litFloat(a), M.litFloat(b), M.litFloat(rel), M.litFloat(abs)),
};
