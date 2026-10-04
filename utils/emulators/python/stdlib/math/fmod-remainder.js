// utils/emulators/python/stdlib/math/fmod-remainder.js
//
// Emulator for the math.fmod / remainder demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // (x % y, math.fmod(x, y), math.remainder(x, y))
  compare: (x, y) => {
    const a = M.litFloat(x);
    const b = M.litFloat(y);
    return M.out({ tuple: [M.pyMod(a, b), M.fmod(a, b), M.remainder(a, b)] });
  },
};
