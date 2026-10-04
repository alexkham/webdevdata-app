// utils/emulators/python/stdlib/math/sqrt-isqrt-cbrt.js
//
// Emulator for the math.sqrt / isqrt / cbrt demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // n = int(s); (math.sqrt(n), math.isqrt(n), n ** 0.5)
  compare: (s) => {
    const n = M.intFromStr(s);
    return M.out({ tuple: [M.sqrt(n), M.isqrt(n), M.pyPow(n, M.F(0.5))] });
  },

  // n = int(s); math.isqrt(n) ** 2 == n
  perfect: (s) => {
    const n = M.intFromStr(s);
    const r = M.isqrt(n);
    return r.int * r.int === n.int;
  },

  // math.cbrt(x)
  cbrt: (x) => M.out(M.cbrt(M.litFloat(x))),
};
