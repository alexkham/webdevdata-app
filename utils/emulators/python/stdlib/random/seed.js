// utils/emulators/python/stdlib/random/seed.js
//
// Emulator for the random.seed demo, on the CPython port in _pyrandom.js.

import { PyRandom, lit, pyF } from './_pyrandom.js';

const draw3 = (r) => [r.randint(1n, 100n), r.randint(1n, 100n), r.randint(1n, 100n)];

export default {
  repeat: (seed) => {
    const r = new PyRandom(lit(seed));
    const a = draw3(r);
    r.seed(lit(seed));
    const b = draw3(r);
    return { __pyTuple: [a, b, a.every((v, i) => v === b[i])] };
  },

  kinds: (seed) => pyF(new PyRandom(lit(seed)).random()),
};
