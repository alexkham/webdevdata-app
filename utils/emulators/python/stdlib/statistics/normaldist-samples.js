// utils/emulators/python/stdlib/statistics/normaldist-samples.js
//
// Emulator for the NormalDist.samples demo: random.Random(seed).random from
// ../random/_pyrandom.js (MT19937) through the _normal_dist_inv_cdf port in
// _pystatistics.js. The demo rounds: tail draws use the C library's log.

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const autoArg = (x) => (typeof x === 'number' ? Q.lit(x) : x);
const nd = (mu, sigma) => new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));

export default {
  // [round(x, 4) for x in NormalDist(mu, sigma).samples(n, seed=seed)]
  draws: (mu, sigma, n, seed) => {
    const d = nd(mu, sigma);
    return Q.out(d.samples(Q.lit(n), autoArg(seed)).map((x) => S.round(x, 4)));
  },

  // xs = NormalDist(mu, sigma).samples(1000, seed=seed)
  // (round(fmean(xs), 1), round(stdev(xs), 1))
  check: (mu, sigma, seed) => {
    const xs = nd(mu, sigma).samples(Q.I(1000n), autoArg(seed));
    return Q.out(Q.T(S.round(S.fmean(xs), 1), S.round(S.stdev(xs), 1)));
  },
};
