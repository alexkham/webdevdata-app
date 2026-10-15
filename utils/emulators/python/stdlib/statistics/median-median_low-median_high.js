// utils/emulators/python/stdlib/statistics/median-median_low-median_high.js
//
// Emulator for the median / median_low / median_high demo (_pystatistics.js:
// a stable sort with Python's exact mixed-type comparisons).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // (median, median_low, median_high)
  median: (data) => {
    const d = list(data);
    return Q.out(Q.T(S.median(d), S.medianLow(d), S.medianHigh(d)));
  },

  // (median_low, median_high) of a list of str
  words: (words) => Q.out(Q.T(S.medianLow(words), S.medianHigh(words))),
};
