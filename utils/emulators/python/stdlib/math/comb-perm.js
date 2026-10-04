// utils/emulators/python/stdlib/math/comb-perm.js
//
// Emulator for the math.comb / perm demo, on _pymath.js (exact BigInt).

import * as M from './_pymath.js';

const thousands = (n) => {
  const neg = n < 0n;
  const s = (neg ? -n : n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return neg ? '-' + s : s;
};

export default {
  // (math.comb(n, k), math.perm(n, k))
  count: (n, k) => {
    const a = M.lit(n);
    const b = M.lit(k);
    return M.out({ tuple: [M.comb(a, b), M.perm(a, b)] });
  },

  // f"1 in {math.comb(n, k):,}"
  odds: (n, k) => '1 in ' + thousands(M.comb(M.lit(n), M.lit(k)).int),

  // math.perm(n)
  all: (n) => M.out(M.perm(M.lit(n))),
};
