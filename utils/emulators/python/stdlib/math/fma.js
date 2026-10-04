// utils/emulators/python/stdlib/math/fma.js
//
// Emulator for the math.fma demo (Python 3.13+), on _pymath.js: one
// rounding of the exact x*y + z, computed with BigInt.

import * as M from './_pymath.js';

export default {
  // (x * y + z, math.fma(x, y, z))
  compare: (x, y, z) => {
    const a = M.litFloat(x);
    const b = M.litFloat(y);
    const c = M.litFloat(z);
    return M.out({ tuple: [M.pyAdd(M.pyMul(a, b), c), M.fma(a, b, c)] });
  },
};
