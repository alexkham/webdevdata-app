// utils/emulators/python/stdlib/statistics/index.js
//
// Emulator for the statistics module hub demo, on the Lib/statistics.py
// port in _pystatistics.js. csv-num data reaches Python as a list literal,
// so each number is read the way CPython reads its text (int or float).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // (mean, median, mode, stdev)
  summary: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.mean(d), S.median(d), S.mode(d), S.stdev(d)));
  },

  // (variance, pvariance, stdev, pstdev)
  spread: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.variance(d), S.pvariance(d), S.stdev(d), S.pstdev(d)));
  },

  // nd = NormalDist(mu, sigma); (nd.zscore(x), round(nd.cdf(x), 6))
  normal: (mu, sigma, x) => {
    const nd = new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));
    const v = Q.litFloat(x);
    return Q.out(Q.T(nd.zscore(v), S.round(nd.cdf(v), 6)));
  },
};
