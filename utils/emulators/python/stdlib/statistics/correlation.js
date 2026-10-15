// utils/emulators/python/stdlib/statistics/correlation.js
//
// Emulator for the statistics.correlation demo (_pystatistics.js: 3.13's
// _rank, sumprod and _sqrtprod).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // (correlation(x, y), correlation(x, y, method='ranked'))
  both: (x, y) => {
    const a = list(x);
    const b = list(y);
    return Q.out(Q.T(S.correlation(a, b), S.correlation(a, b, 'ranked')));
  },

  // statistics.correlation(x, y, method=method)
  method: (x, y, method) => Q.out(S.correlation(list(x), list(y), method)),
};
