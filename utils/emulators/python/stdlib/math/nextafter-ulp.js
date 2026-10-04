// utils/emulators/python/stdlib/math/nextafter-ulp.js
//
// Emulator for the math.nextafter / ulp demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // (math.nextafter(x, -math.inf), x, math.nextafter(x, math.inf), math.ulp(x))
  neighbours: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.nextafter(v, M.F(-Infinity)), v, M.nextafter(v, M.inf), M.ulp(v)] });
  },
  // math.nextafter(x, y, steps=n)
  steps: (x, y, n) => M.out(M.nextafter(M.litFloat(x), M.litFloat(y), M.lit(n))),
};
