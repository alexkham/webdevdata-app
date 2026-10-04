// utils/emulators/python/stdlib/itertools/chain.js
//
// Emulator for the itertools.chain demo tabs, on _pyitertools.js.

import { chain, chainFromIterable, list, asPy } from './_pyitertools.js';

export default {
  // list(chain(a, b))
  join: (a, b) => asPy(list(chain(a, b))),

  // list(chain.from_iterable(words))
  flatten: (words) => asPy(list(chainFromIterable(words))),

  // ''.join(chain(a, b))
  strings: (a, b) => list(chain(a, b)).join(''),
};
