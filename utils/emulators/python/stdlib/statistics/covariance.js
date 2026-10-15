// utils/emulators/python/stdlib/statistics/covariance.js
//
// Emulator for the statistics.covariance demo (_pystatistics.js: fsum and
// the extended-precision sumprod port).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.covariance(x, y)
  cov: (x, y) => Q.out(S.covariance(list(x), list(y))),

  // (covariance(x, y), covariance([v * 100 for v in x], y), correlation(x, y))
  units: (x, y) => {
    const a = list(x);
    const b = list(y);
    const scaled = a.map((v) => Q.mul(v, Q.I(100n)));
    return Q.out(Q.T(S.covariance(a, b), S.covariance(scaled, b), S.correlation(a, b)));
  },
};
