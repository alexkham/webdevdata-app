// utils/emulators/python/stdlib/decimal/compare-max-min.js
//
// Emulator for the comparison demo: compare / compare_total, the rich
// comparison operators (exact against floats, NaN ordering signals) and
// max / min / max_mag / min_mag versus the built-in max() (_pydecimal.js).

import * as D from './_pydecimal.js';

// built-in max(a, b): keeps a unless b > a
const builtinMax = (a, b) => (D.compare('gt', b, a) ? b : a);

export default {
  // (a.compare(b), a.compare_total(b), a == b, a < b)
  compare: (a, b) => D.run(() => {
    const x = D.dec(a);
    const y = D.dec(b);
    return D.T(D.method('compare', x, y), D.method('compare_total', x, y), D.compare('eq', x, y), D.compare('lt', x, y));
  }),

  // (x == f, x < f, x > f)
  float: (a, f) => D.run(() => {
    const x = D.dec(a);
    const fl = D.floatLit(f);
    return D.T(D.compare('eq', x, fl), D.compare('lt', x, fl), D.compare('gt', x, fl));
  }),

  // (a.max(b), a.min(b), a.max_mag(b), a.min_mag(b), max(a, b))
  maxmin: (a, b) => D.run(() => {
    const x = D.dec(a);
    const y = D.dec(b);
    return D.T(D.method('max', x, y), D.method('min', x, y), D.method('max_mag', x, y), D.method('min_mag', x, y), builtinMax(x, y));
  }),
};
