// utils/emulators/python/stdlib/statistics/normaldist-attributes.js
//
// Emulator for the NormalDist properties demo (_pystatistics.js).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // (nd.mean, nd.median, nd.mode, nd.stdev, nd.variance)
  props: (mu, sigma) => {
    const nd = new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));
    return Q.out(Q.T(Q.F(nd.mu), Q.F(nd.mu), Q.F(nd.mu), Q.F(nd.sigma), Q.F(nd.variance())));
  },

  // nd = NormalDist.from_samples(data); (nd.mean, nd.stdev, nd.variance)
  fitted: (data) => {
    const nd = S.NormalDist.fromSamples(list(data));
    return Q.out(Q.T(Q.F(nd.mu), Q.F(nd.sigma), Q.F(nd.variance())));
  },
};
