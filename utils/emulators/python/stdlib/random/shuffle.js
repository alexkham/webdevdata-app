// utils/emulators/python/stdlib/random/shuffle.js
//
// Emulator for the random.shuffle demo, on the CPython port in _pyrandom.js.

import { PyRandom, lit } from './_pyrandom.js';

export default {
  inplace: (seed, items) => {
    const r = new PyRandom(lit(seed));
    const list = items.slice();
    const result = r.shuffle(list);
    return { __pyTuple: [result, list] };
  },

  copy: (seed, items) => {
    const r = new PyRandom(lit(seed));
    const copy = r.sample(items, BigInt(items.length));
    return { __pyTuple: [items, copy] };
  },
};
