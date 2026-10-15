// utils/emulators/python/stdlib/statistics/stdev-pstdev.js
//
// Emulator for the stdev / pstdev demo (_pystatistics.js:
// _float_sqrt_of_frac with BigInt isqrt, exactly as CPython).

import * as M from '../math/_pymath.js';
import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // (statistics.stdev(data), statistics.pstdev(data))
  both: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.stdev(d), S.pstdev(d)));
  },

  // m = sum(data) / len(data)
  // (statistics.stdev(data), math.sqrt(sum((x - m) * (x - m) for x in data) / (len(data) - 1)))
  naive: (data) => {
    const d = list(data);
    const m = Q.truediv(M.pySum(d), Q.I(d.length)); // line 4 runs first
    const sd = S.stdev(d);
    const ss =M.pySum(d.map((x) => { const t = Q.sub(x, m); return Q.mul(t, t); }));
    return Q.out(Q.T(sd, M.sqrt(Q.truediv(ss, Q.I(d.length - 1)))));
  },
};
