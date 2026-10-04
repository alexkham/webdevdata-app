// utils/emulators/python/stdlib/functools/lru_cache.js
//
// Emulator for the lru_cache / cache demo tabs, on the lru_cache port in
// _pyfunctools.js (same keys, eviction and counters as the C wrappers).

import { LruCache, PyFloat, pyNum, mul, add, lt, raise, intRepr } from './_pyfunctools.js';

// Python frames available to fib() when the snippet runs as a script:
// fib(n) needs n nested fib frames, plus the module frame, against the
// default recursion limit of 1000 (measured: fib(999) works, fib(1000)
// raises RecursionError)
const MAX_FIB_DEPTH = 999;

export default {
  // @lru_cache(maxsize=size) def square(x): ...; for x in calls: square(x); square.cache_info()
  lru: (size, calls) => {
    const maxsize = size === null ? null : pyNum(size);
    if (maxsize instanceof PyFloat) raise('TypeError', 'Expected first argument to be an integer, a callable, or None');
    const cache = new LruCache((x) => mul(x, x), maxsize);
    // the list literal is evaluated before the loop
    const xs = calls.map(pyNum);
    for (const x of xs) cache.call(x);
    return cache.info();
  },

  // @cache def fib(n): ...; fib(n), fib.cache_info()
  fib: (nRaw) => {
    const n = pyNum(nRaw);
    const cache = new LruCache(null, null);
    let depth = 0;
    const fib = (k) => cache.call(k);
    cache.fn = (k) => {
      depth += 1;
      if (depth > MAX_FIB_DEPTH) raise('RecursionError', 'maximum recursion depth exceeded');
      // n if n < 2 else fib(n - 1) + fib(n - 2)
      const r = lt(k, 2n) ? k : add(fib(add(k, -1n)), fib(add(k, -2n)));
      depth -= 1;
      return r;
    };
    const value = fib(n);
    return { __pyRaw: `(${typeof value === 'bigint' ? intRepr(value) : value}, ${cache.info().__pyRaw})` };
  },
};
