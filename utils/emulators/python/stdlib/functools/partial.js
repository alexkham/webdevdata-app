// utils/emulators/python/stdlib/functools/partial.js
//
// Emulator for the functools.partial demo tabs: int(text, base) via the
// CPython int-parsing port, partial reprs built like partial_repr in
// Modules/_functoolsmodule.c.

import { pyIntFromStr } from './_pyint.js';
import { pyNum, PyFloat, intRepr, raise, asPy, tuple } from './_pyfunctools.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // parse = partial(int, base=base); parse(text)
  base: (base, text) => {
    const b = pyNum(base);
    if (b instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
    return { __pyRaw: intRepr(pyIntFromStr(text, b)) };
  },

  // p = partial(print, first, sep=sep); p, p.args, p.keywords
  repr: (first, sep) => ({
    __pyRaw: `(functools.partial(<built-in function print>, ${pyStrRepr(first)}, sep=${pyStrRepr(sep)}), `
      + `${asPy(tuple(first)).__pyRaw}, {'sep': ${pyStrRepr(sep)}})`,
  }),

  // hello = partial(greet, greeting, end='.'); [hello(n) for n in names] + [hello('you', end='?')]
  greet: (greeting, names) => asPy([...names.map((n) => `${greeting}, ${n}.`), `${greeting}, you?`]),
};
