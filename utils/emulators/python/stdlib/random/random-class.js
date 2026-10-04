// utils/emulators/python/stdlib/random/random-class.js
//
// Emulator for the random.Random class demo, on the CPython port in
// _pyrandom.js. Each instance is an independent Mersenne Twister.

import { PyRandom, lit } from './_pyrandom.js';

const five = (r) => Array.from({ length: 5 }, () => r.randint(1n, 6n));

export default {
  two: (seedA, seedB) => {
    const a = new PyRandom(lit(seedA));
    const b = new PyRandom(lit(seedB));
    return { __pyTuple: [five(a), five(b)] };
  },

  // the global generator is reseeded and used in between; rng is untouched
  isolated: (seed) => five(new PyRandom(lit(seed))),
};
