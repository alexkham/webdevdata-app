// utils/emulators/python/stdlib/math/sinh-cosh-tanh.js
//
// Emulator for the hyperbolic functions demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // (math.sinh(x), math.cosh(x), math.tanh(x))
  forward: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.sinh(v), M.cosh(v), M.tanh(v)] });
  },

  // (math.asinh(x), math.acosh(x))
  inverse: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.asinh(v), M.acosh(v)] });
  },

  // math.atanh(x)
  atanh: (x) => M.out(M.atanh(M.litFloat(x))),
};
