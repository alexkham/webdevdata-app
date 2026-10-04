// utils/emulators/python/stdlib/itertools/starmap.js
//
// Emulator for the itertools.starmap demo tabs, on _pyitertools.js.

import { starmap, list, tuple, asPy, pyNum, mul } from './_pyitertools.js';

// zip(a, b) — stops at the shorter input
const zip = (a, b) => a.slice(0, Math.min(a.length, b.length)).map((x, i) => tuple(x, b[i]));

export default {
  // list(starmap(mul, zip(a, b)))
  mul: (a, b) => asPy(list(starmap(mul, zip(a.map(pyNum), b.map(pyNum))))),

  // list(starmap('{}={}'.format, zip(keys, values)))
  format: (keys, values) => asPy(list(starmap((k, v) => `${k}=${v}`, zip(keys, values)))),
};
