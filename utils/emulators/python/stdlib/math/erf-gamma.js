// utils/emulators/python/stdlib/math/erf-gamma.js
//
// Emulator for the math.erf / erfc / gamma / lgamma demo, on _pymath.js
// (gamma/lgamma: CPython's own Lanczos code; erf/erfc: glibc's s_erf.c).

import * as M from './_pymath.js';

export default {
  // (math.gamma(x), math.lgamma(x))
  gamma: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.gamma(v), M.lgamma(v)] });
  },
  // (math.erf(x), math.erfc(x))
  erf: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.erf(v), M.erfc(v)] });
  },
};
