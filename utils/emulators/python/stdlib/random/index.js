// utils/emulators/python/stdlib/random/index.js
//
// Emulator for the random module hub demo, on the CPython port in
// _pyrandom.js (Mersenne Twister + Lib/random.py algorithms).

import { PyRandom, lit } from './_pyrandom.js';

export default {
  // random.seed(seed); [random.randint(1, 6) for _ in range(10)]
  dice: (seed) => {
    const r = new PyRandom(lit(seed));
    return Array.from({ length: 10 }, () => r.randint(1n, 6n));
  },

  // (random.choice(items), random.sample(items, 2), random.choices(items, k=3))
  pick: (seed, items) => {
    const r = new PyRandom(lit(seed));
    return { __pyTuple: [r.choice(items), r.sample(items, 2n), r.choices(items, null, null, 3n)] };
  },
};
