// utils/emulators/python/stdlib/math/fsum.js
//
// Emulator for the math.fsum demo: a plain += loop, built-in sum()
// (compensated since Python 3.12) and math.fsum (exact), on _pymath.js.

import * as M from './_pymath.js';
import { raise } from '../../../../py-exceptions.js';

// [x] * n — list repetition (an index-sized int is required)
function repeat(v, k) {
  if (!M.isInt(k)) raise('TypeError', `can't multiply sequence by non-int of type '${M.typeName(k)}'`);
  if (k.int > (1n << 63n) - 1n) raise('OverflowError', "cannot fit 'int' into an index-sized integer");
  if (k.int > 20000000n) raise('MemoryError'); // the demo does not build lists this large
  return Array.from({ length: k.int > 0n ? Number(k.int) : 0 }, () => v);
}

export default {
  // xs = [float(x) for x in text.split(',')]; (loop total, sum(xs), math.fsum(xs))
  compare: (text) => {
    const xs = text.split(',').map(M.floatFromStr);
    let total = M.F(0.0);
    for (const x of xs) total = M.pyAdd(total, x);
    return M.out({ tuple: [total, M.pySum(xs), M.fsum(xs)] });
  },

  // xs = [x] * n; (sum(xs), math.fsum(xs), x * n)
  repeat: (x, n) => {
    const v = M.litFloat(x);
    const k = M.lit(n);
    const xs = repeat(v, k);
    return M.out({ tuple: [M.pySum(xs), M.fsum(xs), M.pyMul(v, k)] });
  },
};
