// utils/emulators/python/stdlib/statistics/fmean.js
//
// Emulator for the statistics.fmean demo (_pystatistics.js: math.fsum and
// the extended-precision math.sumprod port).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.fmean(data)
  fmean: (data) => Q.out(S.fmean(list(data))),

  // statistics.fmean(data, weights=weights)
  weights: (data, weights) => Q.out(S.fmean(list(data), list(weights))),
};
