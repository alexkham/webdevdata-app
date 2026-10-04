// utils/emulators/python/stdlib/random/uniform.js
//
// Emulator for the random.uniform demo, on the CPython port in _pyrandom.js.

import { PyRandom, lit, floatArg, pyF, pyRound } from './_pyrandom.js';

export default {
  three: (seed, a, b) => {
    const r = new PyRandom(lit(seed));
    const lo = floatArg(a);
    const hi = floatArg(b);
    return [0, 1, 2].map(() => pyF(r.uniform(lo, hi)));
  },

  rounded: (seed, a, b) => {
    const r = new PyRandom(lit(seed));
    return pyF(pyRound(r.uniform(floatArg(a), floatArg(b)), 2));
  },
};
