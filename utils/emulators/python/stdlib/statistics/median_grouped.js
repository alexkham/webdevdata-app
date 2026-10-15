// utils/emulators/python/stdlib/statistics/median_grouped.js
//
// Emulator for the statistics.median_grouped demo (_pystatistics.js).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.median_grouped(data, interval=interval)
  grouped: (data, interval) => Q.out(S.medianGrouped(list(data), Q.litFloat(interval))),

  // (statistics.median(data), statistics.median_grouped(data, interval=interval))
  compare: (data, interval) => {
    const d = list(data);
    return Q.out(Q.T(S.median(d), S.medianGrouped(d, Q.litFloat(interval))));
  },
};
