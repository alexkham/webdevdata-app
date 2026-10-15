// utils/emulators/python/stdlib/statistics/kde.js
//
// Emulator for the statistics.kde demo (_pystatistics.js: every kernel of
// Lib/statistics.py 3.13, bisect over the sorted sample for bounded
// kernels, builtin sum's Neumaier compensation; libm from glibc — the demo
// rounds, as the C library's last digit varies by platform).

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));

export default {
  // f = statistics.kde(data, h=h, kernel=kernel); [round(f(x), 6) for x in xs]
  pdf: (data, h, kernel, xs) => {
    const f = S.kde(list(data), Q.litFloat(h), kernel);
    return Q.out(list(xs).map((x) => S.round(f(x), 6)));
  },

  // F = statistics.kde(data, h=h, cumulative=True); round(F(b) - F(a), 4)
  cdf: (data, h, a, b) => {
    const F = S.kde(list(data), Q.litFloat(h), 'normal', true);
    const fb = F(Q.litFloat(b));
    return Q.out(S.round(Q.sub(fb, F(Q.litFloat(a))), 4));
  },
};
