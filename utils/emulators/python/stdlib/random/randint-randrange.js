// utils/emulators/python/stdlib/random/randint-randrange.js
//
// Emulator for the randint / randrange demo, on the CPython port in
// _pyrandom.js (randrange → _randbelow → getrandbits rejection).

import { PyRandom, lit } from './_pyrandom.js';

export default {
  randint: (seed, a, b) => {
    const r = new PyRandom(lit(seed));
    const lo = lit(a);
    const hi = lit(b);
    return Array.from({ length: 8 }, () => r.randint(lo, hi));
  },

  randrange: (seed, start, stop, step) => {
    const r = new PyRandom(lit(seed));
    const s = lit(start);
    const e = lit(stop);
    const k = lit(step);
    return Array.from({ length: 6 }, () => r.randrange(s, e, k));
  },
};
