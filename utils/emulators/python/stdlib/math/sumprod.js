// utils/emulators/python/stdlib/math/sumprod.js
//
// Emulator for the math.sumprod demo, on _pymath.js (CPython's int path,
// extended-precision float path and generic path).

import * as M from './_pymath.js';

export default {
  dot: (p, q) => M.out(M.sumprod(M.litList(p), M.litList(q))),

  // (math.sumprod(p, q), sum(a * b for a, b in zip(p, q)))
  compare: (p, q) => {
    const a = M.litList(p);
    const b = M.litList(q);
    const sp = M.sumprod(a, b);
    const n = Math.min(a.length, b.length);
    const terms = [];
    for (let i = 0; i < n; i++) terms.push(M.pyMul(a[i], b[i]));
    return M.out({ tuple: [sp, M.pySum(terms)] });
  },
};
