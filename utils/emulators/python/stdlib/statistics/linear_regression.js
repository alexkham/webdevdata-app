// utils/emulators/python/stdlib/statistics/linear_regression.js
//
// Emulator for the statistics.linear_regression demo (_pystatistics.js).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.linear_regression(x, y)
  fit: (x, y) => Q.out(S.linearRegression(list(x), list(y))),

  // statistics.linear_regression(x, y, proportional=True)
  origin: (x, y) => Q.out(S.linearRegression(list(x), list(y), true)),

  // slope, intercept = statistics.linear_regression(x, y); slope * at + intercept
  predict: (x, y, at) => {
    const fit = S.linearRegression(list(x), list(y));
    return Q.out(Q.add(Q.mul(fit.slope, Q.litFloat(at)), fit.intercept));
  },
};
