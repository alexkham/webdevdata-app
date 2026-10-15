// utils/emulators/python/stdlib/statistics/harmonic_mean.js
//
// Emulator for the statistics.harmonic_mean demo (_pystatistics.js).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.harmonic_mean(data)
  hmean: (data) => Q.out(S.harmonicMean(list(data))),

  // statistics.harmonic_mean(data, weights=weights)
  weights: (data, weights) => Q.out(S.harmonicMean(list(data), list(weights))),
};
