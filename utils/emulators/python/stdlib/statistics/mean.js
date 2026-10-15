// utils/emulators/python/stdlib/statistics/mean.js
//
// Emulator for the statistics.mean demo, on the Lib/statistics.py port in
// _pystatistics.js (exact _sum / _convert with the Fraction engine).

import * as M from '../math/_pymath.js';
import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.mean(data)
  mean: (data) => Q.out(S.mean(list(data))),

  // (statistics.mean(data), sum(data) / len(data), statistics.fmean(data))
  compare: (data) => {
    const d = list(data);
    const m = S.mean(d);
    const avg = Q.truediv(M.pySum(d), Q.I(d.length));
    return Q.out(Q.T(m, avg, S.fmean(d)));
  },

  // statistics.mean([Fraction(x) for x in text.split(',')])
  fractions: (text) => Q.out(S.mean(text.split(',').map((x) => Q.fraction(x)))),
};
