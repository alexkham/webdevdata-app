// utils/emulators/python/stdlib/math/dist-hypot.js
//
// Emulator for the math.dist / hypot demo, on _pymath.js (CPython's
// vector_norm: scaling, exact squares, compensated sum, corrected sqrt).

import * as M from './_pymath.js';

export default {
  dist: (p, q) => M.out(M.dist(M.litList(p), M.litList(q))),
  hypot: (xs) => M.out(M.hypot(...M.litList(xs))),
  // (math.sqrt(x * x + y * y), math.hypot(x, y))
  naive: (x, y) => {
    const a = M.litFloat(x);
    const b = M.litFloat(y);
    const s = M.pyAdd(M.pyMul(a, a), M.pyMul(b, b));
    return M.out({ tuple: [M.sqrt(s), M.hypot(a, b)] });
  },
};
