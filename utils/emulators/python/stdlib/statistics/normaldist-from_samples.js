// utils/emulators/python/stdlib/statistics/normaldist-from_samples.js
//
// Emulator for the NormalDist.from_samples demo (_pystatistics.js:
// _mean_stdev on the exact _ss sums).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.NormalDist.from_samples(data)
  fit: (data) => Q.out(S.NormalDist.fromSamples(list(data))),

  // (nd.mean == mean(data), nd.mean == fmean(data), nd.stdev == stdev(data))
  compare: (data) => {
    const d = list(data);
    const nd = S.NormalDist.fromSamples(d);
    const mu = Q.F(nd.mu);
    return Q.out(Q.T(Q.eq(mu, S.mean(d)), Q.eq(mu, S.fmean(d)), Q.eq(Q.F(nd.sigma), S.stdev(d))));
  },
};
