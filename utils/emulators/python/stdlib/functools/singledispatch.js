// utils/emulators/python/stdlib/functools/singledispatch.js
//
// Emulator for the functools.singledispatch demo tabs: the registry is
// looked up with the class of the first argument; types that are not
// registered fall back to the default implementation.

import { pyNum, PyFloat, asPy, tuple, pyValRepr } from './_pyfunctools.js';

// an 'auto' demo value: a JS number is a Python literal, a string is a str
const auto = (v) => (typeof v === 'number' ? pyNum(v) : v);

export default {
  value: (raw) => {
    const x = auto(raw);
    if (typeof x === 'bigint') return `int ${x}`;
    if (x instanceof PyFloat) return `float ${pyValRepr(x)}`; // str(float) == repr(float)
    return `str of length ${[...x].length}`;
  },

  // describe(items), describe(tuple(items))
  fallback: (items) => asPy(tuple(`list of ${items.length}`, `something else: ${pyValRepr(tuple(...items))}`)),
};
