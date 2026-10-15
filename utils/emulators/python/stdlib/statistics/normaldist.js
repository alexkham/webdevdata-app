// utils/emulators/python/stdlib/statistics/normaldist.js
//
// Emulator for the statistics.NormalDist class demo (_pystatistics.js:
// constructor checks, properties, + - * with constants and with other
// NormalDists — sigma via the math.hypot port).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const nd = (mu, sigma) => new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));

export default {
  // nd = NormalDist(mu, sigma); (nd, nd.mean, nd.stdev, nd.variance)
  make: (mu, sigma) => {
    const d = nd(mu, sigma);
    return Q.out(Q.T(d, Q.F(d.mu), Q.F(d.sigma), Q.F(d.variance())));
  },

  // celsius * (9/5) + 32
  scale: (mu, sigma) => Q.out(nd(mu, sigma).times(Q.F(9 / 5)).plus(Q.I(32n))),

  // (a + b, a - b)
  combine: (mu1, s1, mu2, s2) => {
    const a = nd(mu1, s1);
    const b = nd(mu2, s2);
    return Q.out(Q.T(a.plus(b), a.minus(b)));
  },
};
