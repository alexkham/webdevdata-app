// utils/emulators/python/stdlib/functools/index.js
//
// Emulator for the functools module hub demo, reusing the member
// emulators (lru_cache, partial) and the reduce port.

import lruCache from './lru_cache.js';
import partialEmu from './partial.js';
import { reduce, mul, pyNum, asPy } from './_pyfunctools.js';

export default {
  cache: (size, calls) => lruCache.lru(size, calls),
  partial: (base, text) => partialEmu.base(base, text),
  // reduce(operator.mul, nums, 1)
  reduce: (nums) => asPy(reduce(mul, nums.map(pyNum), 1n)),
};
