// utils/emulators/python/stdlib/itertools/product.js
//
// Emulator for the itertools.product demo tabs, on _pyitertools.js.

import { product, list, asPy, pyNum, raise } from './_pyitertools.js';

// range(n) for an int demo value → a lazy JS iterable of bigints
function range(nRaw) {
  const n = pyNum(nRaw);
  if (typeof n !== 'bigint') raise('TypeError', "'float' object cannot be interpreted as an integer");
  return {
    * [Symbol.iterator]() {
      for (let i = 0n; i < n; i++) yield i;
    },
    size: n > 0n ? n : 0n,
  };
}

export default {
  // list(product(a, b))
  pairs: (a, b) => asPy(list(product([a, b]))),

  // [''.join(p) for p in product(alphabet, repeat=n)]
  repeat: (alphabet, n) => asPy(list(product([alphabet], pyNum(n))).map((t) => t.__pyTuple.join(''))),

  // list(product(range(h), range(w)))
  grid: (w, h) => {
    const rh = range(h);
    const rw = range(w);
    // product() copies every input into a tuple first: the browser demo
    // stops before copying a huge range
    if (rh.size > 100000n || rw.size > 100000n) raise('DemoLimit', 'the browser demo stops at 100,000 items (CPython would keep going)');
    return asPy(list(product([rh, rw])));
  },
};
