// utils/emulators/python/stdlib/statistics/normaldist-overlap.js
//
// Emulator for the NormalDist.overlap demo (_pystatistics.js; erf, log
// from glibc — the demo rounds, as the C library varies by platform).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const nd = (mu, sigma) => new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));

export default {
  // round(a.overlap(b), 6)
  ovl: (mu1, s1, mu2, s2) => {
    const a = nd(mu1, s1);
    const b = nd(mu2, s2);
    return Q.out(S.round(a.overlap(b), 6));
  },
};
