// utils/emulators/python/stdlib/random/choice.js
//
// Emulator for the random.choice demo, on the CPython port in _pyrandom.js.

import { PyRandom, lit } from './_pyrandom.js';

export default {
  // [random.choice(items) for _ in range(5)]
  pick: (seed, items) => {
    const r = new PyRandom(lit(seed));
    return Array.from({ length: 5 }, () => r.choice(items));
  },

  // random.choice(text): one character of a str
  text: (seed, text) => new PyRandom(lit(seed)).choice(text),
};
