// utils/emulators/python/stdlib/random/choices.js
//
// Emulator for the random.choices demo, on the CPython port in _pyrandom.js
// (floor(random() * n) without weights, bisect on cumulative weights with).

import { PyRandom, lit } from './_pyrandom.js';

const weightsOf = (ws) => ws.map(lit);

export default {
  equal: (seed, items, k) => new PyRandom(lit(seed)).choices(items, null, null, lit(k)),

  weighted: (seed, items, weights, k) => new PyRandom(lit(seed)).choices(items, weightsOf(weights), null, lit(k)),

  // picks = random.choices(['a', 'b', 'c'], weights=weights, k=1000)
  // {x: picks.count(x) for x in 'abc'}
  tally: (seed, weights) => {
    const picks = new PyRandom(lit(seed)).choices(['a', 'b', 'c'], weightsOf(weights), null, 1000n);
    const out = {};
    for (const x of 'abc') out[x] = BigInt(picks.filter((p) => p === x).length);
    return out;
  },
};
