// utils/emulators/python/stdlib/operator/methodcaller.js
//
// Emulator for the operator.methodcaller page: a str method called by name
// on every word, and methodcaller as a sort key — the str methods (and
// their exact argument errors) are ported in _pyoperator.js.

import { auto, out, methodcaller, callObj, sorted } from './_pyoperator.js';

export default {
  // f = methodcaller(name, arg); [f(w) for w in words]
  call: (name, arg, words) => {
    const f = methodcaller(name, auto(arg));
    return out(words.map((w) => callObj(f, [w])));
  },

  // sorted(words, key=methodcaller(name))
  sort: (words, name) => {
    const f = methodcaller(name);
    return out(sorted([...words], (w) => callObj(f, [w])));
  },
};
