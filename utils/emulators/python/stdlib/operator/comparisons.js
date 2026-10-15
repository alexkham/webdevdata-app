// utils/emulators/python/stdlib/operator/comparisons.js
//
// Emulator for the comparison functions page (lt, le, eq, ne, ge, gt):
// exact int/float comparison, code-point str order, lexicographic list
// order and the TypeError for unorderable pairs, via _pyoperator.js.

import { auto, num, out, compare, tuple, truth } from './_pyoperator.js';

const SIX = ['lt', 'le', 'eq', 'ne', 'ge', 'gt'];

export default {
  // a, b = …; [f(a, b) for f in (lt, le, eq, ne, ge, gt)]
  six: (a, b) => {
    const x = auto(a);
    const y = auto(b);
    return out(SIX.map((f) => compare(f, x, y)));
  },

  // a, b = [...], [...]; (operator.lt(a, b), operator.eq(a, b))
  lists: (a, b) => {
    const x = a.map(num);
    const y = b.map(num);
    return out(tuple(compare('lt', x, y), compare('eq', x, y)));
  },

  // list(filter(partial(operator.lt, limit), nums)) — keeps x where limit < x
  partial: (limit, nums) => {
    const l = auto(limit);
    const xs = nums.map(num);
    return out(xs.filter((x) => truth(compare('lt', l, x))));
  },
};
