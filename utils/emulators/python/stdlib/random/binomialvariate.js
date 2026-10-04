// utils/emulators/python/stdlib/random/binomialvariate.js
//
// Emulator for the random.binomialvariate demo (3.12+), on the CPython port
// in _pyrandom.js (geometric method for n * p < 10, BTRS otherwise).

import { PyRandom, lit, floatArg, pyF, demoGuard } from './_pyrandom.js';

export default {
  draws: (seed, n, p) => {
    const r = new PyRandom(lit(seed));
    const nn = lit(n);
    const pp = floatArg(p);
    demoGuard(nn, 'binomialvariate(n, ...)');
    return Array.from({ length: 8 }, () => r.binomialvariate(Number(nn), pp));
  },

  // sum(random.binomialvariate(7, p) >= 5 for _ in range(10000)) / 10000
  estimate: (seed, p) => {
    const r = new PyRandom(lit(seed));
    const pp = floatArg(p);
    let hits = 0;
    for (let i = 0; i < 10000; i += 1) if (r.binomialvariate(7, pp) >= 5n) hits += 1;
    return pyF(hits / 10000);
  },
};
