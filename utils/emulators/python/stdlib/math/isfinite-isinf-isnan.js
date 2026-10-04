// utils/emulators/python/stdlib/math/isfinite-isinf-isnan.js
//
// Emulator for the math.isfinite / isinf / isnan demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // x = float(s); (math.isfinite(x), math.isinf(x), math.isnan(x))
  classify: (s) => {
    const x = M.floatFromStr(s);
    return M.out({ tuple: [M.isfinite(x), M.isinf(x), M.isnan(x)] });
  },

  // x = float(s); (x == x, x != x, math.isnan(x))
  nan: (s) => {
    const x = M.floatFromStr(s);
    return M.out({ tuple: [x.float === x.float, x.float !== x.float, M.isnan(x)] });
  },
};
