// utils/emulators/python/stdlib/random/random.js
//
// Emulator for the random.random demo, on the CPython port in _pyrandom.js.

import { PyRandom, lit, asFloat, pyF, floorInt } from './_pyrandom.js';

// int(x) for a float: truncation toward zero
const truncInt = (x) => (x < 0 ? -floorInt(-x) : floorInt(x));

export default {
  floats: (seed) => {
    const r = new PyRandom(lit(seed));
    return [pyF(r.random()), pyF(r.random()), pyF(r.random())];
  },

  scale: (seed, n) => {
    const r = new PyRandom(lit(seed));
    const x = r.random();
    const y = x * asFloat(n);
    return { __pyTuple: [pyF(x), pyF(y), truncInt(y)] };
  },

  chance: (seed, p) => {
    const r = new PyRandom(lit(seed));
    return Array.from({ length: 6 }, () => r.random() < p);
  },
};
