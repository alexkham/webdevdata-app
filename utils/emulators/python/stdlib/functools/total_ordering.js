// utils/emulators/python/stdlib/functools/total_ordering.js
//
// Emulator for the functools.total_ordering demo tabs. Version.parts is
// tuple(int(p) for p in text.split('.')) — int() through the CPython
// parsing port — and the derived methods follow Lib/functools.py:
//   __le__ = (a < b) or (a == b)     __gt__ = not (a < b) and a != b
//   __ge__ = not (a < b)
// (tuples of ints compare lexicographically).

import { pyIntFromStr } from './_pyint.js';
import { asPy, tuple, raise } from './_pyfunctools.js';

const parts = (text) => text.split('.').map((p) => pyIntFromStr(p, 10n));

function tupleCmp(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return a.length - b.length;
}

export default {
  // a < b, a <= b, a > b, a >= b, a == b
  compare: (a, b) => {
    const pa = parts(a);
    const pb = parts(b);
    const c = tupleCmp(pa, pb);
    const lt = c < 0;
    const eq = c === 0;
    return asPy(tuple(lt, lt || eq, !(lt || eq), !lt, eq));
  },

  // max(Version(v) for v in versions).text — the first maximum wins
  max: (versions) => {
    let best = null;
    for (const v of versions) {
      const p = parts(v);
      // max keeps the current best unless the new item is > it
      if (best === null || tupleCmp(p, best.p) > 0) best = { v, p };
    }
    if (best === null) raise('ValueError', 'max() iterable argument is empty');
    return best.v;
  },
};
