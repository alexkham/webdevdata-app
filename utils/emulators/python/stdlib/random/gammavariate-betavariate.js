// utils/emulators/python/stdlib/random/gammavariate-betavariate.js
//
// Emulator for the gammavariate / betavariate demo, on the CPython port in
// _pyrandom.js (Cheng's algorithm for alpha > 1, algorithm GS for
// alpha < 1; beta = y / (y + gamma)). Results rounded to 4 decimals.

import { PyRandom, lit, floatArg, pyF, pyRound } from './_pyrandom.js';

const five = (seed, draw) => {
  const r = new PyRandom(lit(seed));
  return Array.from({ length: 5 }, () => pyF(pyRound(draw(r), 4)));
};

export default {
  gamma: (seed, alpha, beta) => five(seed, (r) => r.gammavariate(floatArg(alpha), floatArg(beta))),
  beta: (seed, alpha, beta) => five(seed, (r) => r.betavariate(floatArg(alpha), floatArg(beta))),
};
