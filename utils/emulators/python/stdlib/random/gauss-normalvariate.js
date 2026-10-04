// utils/emulators/python/stdlib/random/gauss-normalvariate.js
//
// Emulator for the gauss / normalvariate demo, on the CPython port in
// _pyrandom.js (Box-Muller with a cached second value / Kinderman-Monahan;
// math.log/cos/sin computed correctly rounded).

import { PyRandom, lit, floatArg, pyF, pyRound } from './_pyrandom.js';

const five = (draw) => Array.from({ length: 5 }, () => pyF(pyRound(draw(), 4)));

export default {
  gauss: (seed, mu, sigma) => {
    const r = new PyRandom(lit(seed));
    const m = floatArg(mu);
    const s = floatArg(sigma);
    return five(() => r.gauss(m, s));
  },

  normal: (seed, mu, sigma) => {
    const r = new PyRandom(lit(seed));
    const m = floatArg(mu);
    const s = floatArg(sigma);
    return five(() => r.normalvariate(m, s));
  },

  // a = random.gauss(); state = random.getstate(); (round(a, 6), round(state[2], 6))
  cache: (seed) => {
    const r = new PyRandom(lit(seed));
    const a = r.gauss();
    const cached = r.getstate()[2];
    return { __pyTuple: [pyF(pyRound(a, 6)), pyF(pyRound(cached, 6))] };
  },
};
