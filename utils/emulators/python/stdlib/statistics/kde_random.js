// utils/emulators/python/stdlib/statistics/kde_random.js
//
// Emulator for the statistics.kde_random demo: _pystatistics.js (every
// kernel inverse CDF of Lib/statistics.py 3.13) on random.Random from
// ../random/_pyrandom.js (MT19937, int and str seeds). The demo rounds,
// as the C library's last digit varies by platform.

import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';

const list = (arr) => arr.map((x) => Q.lit(x));
const autoArg = (x) => (typeof x === 'number' ? Q.lit(x) : x);
const draws = (rand, k, nd) => Array.from({ length: k }, () => S.round(rand(), nd));

export default {
  // rand = statistics.kde_random(data, h=h, kernel=kernel, seed=seed)
  // [round(rand(), 2) for _ in range(5)]
  draws: (data, h, kernel, seed) => {
    const rand = S.kdeRandom(list(data), Q.litFloat(h), kernel, autoArg(seed));
    return Q.out(draws(rand, 5, 2));
  },

  // two generators with the same seed, three draws each
  same: (data, seed) => {
    const d = list(data);
    const r1 = S.kdeRandom(d, Q.F(1.5), 'normal', autoArg(seed));
    const r2 = S.kdeRandom(d, Q.F(1.5), 'normal', autoArg(seed));
    const a = draws(r1, 3, 3);
    return Q.out(Q.T(a, draws(r2, 3, 3)));
  },
};
