// utils/emulators/python/stdlib/random/distributions.js
//
// Emulator for the continuous-distributions demo (expovariate, triangular,
// lognormvariate, paretovariate, weibullvariate, vonmisesvariate), on the
// CPython port in _pyrandom.js. Every tab rounds to 4 decimals, like the
// snippet shown.

import { PyRandom, lit, floatArg, pyF, pyRound } from './_pyrandom.js';

const five = (seed, draw) => {
  const r = new PyRandom(lit(seed));
  return Array.from({ length: 5 }, () => {
    let v = draw(r);
    if (v && v.same !== undefined) v = v.same; // triangular with high == low returns low
    return pyF(pyRound(v, 4));
  });
};

export default {
  expo: (seed, lambd) => five(seed, (r) => r.expovariate(floatArg(lambd))),
  triangular: (seed, low, high, mode) => five(seed, (r) => r.triangular(floatArg(low), floatArg(high), floatArg(mode))),
  lognorm: (seed, mu, sigma) => five(seed, (r) => r.lognormvariate(floatArg(mu), floatArg(sigma))),
  pareto: (seed, alpha) => five(seed, (r) => r.paretovariate(floatArg(alpha))),
  weibull: (seed, alpha, beta) => five(seed, (r) => r.weibullvariate(floatArg(alpha), floatArg(beta))),
  vonmises: (seed, mu, kappa) => five(seed, (r) => r.vonmisesvariate(floatArg(mu), floatArg(kappa))),
};
