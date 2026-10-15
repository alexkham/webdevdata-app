// utils/emulators/python/stdlib/decimal/normalize-adjusted.js
//
// Emulator for the exponent demo: normalize / adjusted / logb / scaleb, and
// deduplicating Decimals with a set (_pydecimal.js port).

import * as D from './_pydecimal.js';

// set(values): keeps the first of equal values; hashing an sNaN fails
function pySet(values) {
  const out = [];
  for (const v of values) {
    if (v.exp === 'N') D.pyErr('TypeError', 'Cannot hash a signaling NaN value');
    if (!out.some((u) => D.compare('eq', u, v))) out.push(v);
  }
  return out;
}
// sorted(list) with Decimal.__lt__ (stable insertion sort)
function pySorted(values) {
  const out = [];
  for (const v of values) {
    let i = out.length;
    while (i > 0 && D.compare('lt', v, out[i - 1])) i -= 1;
    out.splice(i, 0, v);
  }
  return out;
}

export default {
  // (x.normalize(), x.adjusted(), x.logb(), x.scaleb(n))
  parts: (x, n) => D.run(() => {
    const d = D.dec(x);
    return D.T(D.method('normalize', d), D.method('adjusted', d), D.method('logb', d), D.method('scaleb', d, n));
  }),

  // (sorted(set(values)), sorted({v.normalize() for v in values}))
  dedupe: (csv) => D.run(() => {
    const values = csv.split(',').map((s) => D.dec(s));
    const plain = pySorted(pySet(values));
    const normal = pySorted(pySet(values.map((v) => D.method('normalize', v))));
    return D.T(plain, normal);
  }),
};
