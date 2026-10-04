// utils/emulators/python/stdlib/math/prod.js
//
// Emulator for the math.prod demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  values: (xs) => M.out(M.prod(M.litList(xs))),
  start: (xs, s) => M.out(M.prod(M.litList(xs), M.lit(s))),
  // math.prod(range(1, n + 1)) == math.factorial(n)
  factorial: (n) => {
    const k = M.lit(n);
    const items = [];
    for (let i = 1n; i <= k.int; i++) items.push({ int: i });
    const p = M.prod(items);
    return M.factorial(k).int === p.int;
  },
};
