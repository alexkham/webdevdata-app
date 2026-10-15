// utils/emulators/python/stdlib/statistics/normaldist-inv_cdf-quantiles.js
//
// Emulator for the NormalDist.inv_cdf / quantiles demo (_pystatistics.js:
// the AS241 code of _statisticsmodule.c, log from glibc in the tails — the
// demo rounds).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const nd = (mu, sigma) => new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));

export default {
  // round(nd.inv_cdf(p), 6)
  inv: (mu, sigma, p) => Q.out(S.round(nd(mu, sigma).invCdf(Q.litFloat(p)), 6)),

  // [round(q, 2) for q in NormalDist(mu, sigma).quantiles(n)]
  quantiles: (mu, sigma, n) => Q.out(nd(mu, sigma).quantiles(Q.lit(n)).map((q) => S.round(q, 2))),
};
