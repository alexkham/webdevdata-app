// utils/emulators/python/stdlib/random/sample.js
//
// Emulator for the random.sample demo, on the CPython port in _pyrandom.js
// (pool or set method chosen exactly like Lib/random.py, counts= via a
// sample of range(total) and bisect).

import { PyRandom, lit } from './_pyrandom.js';

export default {
  sample: (seed, items, k) => new PyRandom(lit(seed)).sample(items, lit(k)),

  counts: (seed, items, counts, k) => new PyRandom(lit(seed)).sample(items, lit(k), counts.map(lit)),

  range: (seed, n, k) => new PyRandom(lit(seed)).sample({ range: lit(n) }, lit(k)),
};
