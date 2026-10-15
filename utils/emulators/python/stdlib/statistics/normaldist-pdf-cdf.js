// utils/emulators/python/stdlib/statistics/normaldist-pdf-cdf.js
//
// Emulator for the NormalDist.pdf / cdf demo (_pystatistics.js; exp and erf
// are glibc's — the demo rounds, as the C library varies by platform).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const nd = (mu, sigma) => new S.NormalDist(Q.litFloat(mu), Q.litFloat(sigma));

export default {
  // (round(nd.pdf(x), 6), round(nd.cdf(x), 6))
  pdfcdf: (mu, sigma, x) => {
    const d = nd(mu, sigma);
    const v = Q.litFloat(x);
    const p = S.round(d.pdf(v), 6);
    return Q.out(Q.T(p, S.round(d.cdf(v), 6)));
  },

  // round(nd.cdf(b) - nd.cdf(a), 4)
  between: (mu, sigma, a, b) => {
    const d = nd(mu, sigma);
    const fb = d.cdf(Q.litFloat(b));
    return Q.out(S.round(Q.sub(fb, d.cdf(Q.litFloat(a))), 4));
  },
};
