// utils/emulators/python/stdlib/statistics/variance-pvariance.js
//
// Emulator for the variance / pvariance demo (_pystatistics.js: exact _ss
// with the Fraction engine, _convert back to the data type).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));
const autoArg = (x) => (typeof x === 'number' ? Q.lit(x) : x);

export default {
  // (statistics.variance(data), statistics.pvariance(data))
  both: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.variance(d), S.pvariance(d)));
  },

  // statistics.variance(data, xbar)
  xbar: (data, xbar) => Q.out(S.variance(list(data), autoArg(xbar))),
};
