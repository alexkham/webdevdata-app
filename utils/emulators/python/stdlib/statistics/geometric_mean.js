// utils/emulators/python/stdlib/statistics/geometric_mean.js
//
// Emulator for the statistics.geometric_mean demo (_pystatistics.js; log
// and exp are glibc's, from ../math/_libm.js — the demo rounds to 10 places
// because the C library's last digit varies by platform).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // round(statistics.geometric_mean(data), 10)
  gmean: (data) => Q.out(S.round(S.geometricMean(list(data)), 10)),

  // (round(statistics.geometric_mean(data), 10), statistics.mean(data))
  compare: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.round(S.geometricMean(d), 10), S.mean(d)));
  },
};
