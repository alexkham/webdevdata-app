// utils/emulators/python/stdlib/math/modf-frexp-ldexp.js
//
// Emulator for the math.modf / frexp / ldexp demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // (math.modf(x), math.frexp(x))
  split: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.modf(v), M.frexp(v)] });
  },
  // math.ldexp(m, e)
  ldexp: (m, e) => M.out(M.ldexp(M.litFloat(m), M.lit(e))),
};
