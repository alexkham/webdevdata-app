// utils/emulators/python/stdlib/statistics/normaldist-zscore.js
//
// Emulator for the NormalDist.zscore demo (_pystatistics.js) — pure float
// arithmetic, exact on every platform.

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // statistics.NormalDist(mu, sigma).zscore(x)
  z: (mu, sigma, x) => Q.out(new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma)).zscore(Q.litFloat(x))),

  // nd = NormalDist.from_samples(data); [round(nd.zscore(x), 3) for x in data]
  sample: (data) => {
    const d = list(data);
    const nd = S.NormalDist.fromSamples(d);
    return Q.out(d.map((x) => S.round(nd.zscore(x), 3)));
  },
};
