// utils/emulators/python/stdlib/copy/deepcopy.js
//
// Emulator for the copy.deepcopy demo tabs, on _pycopy.js.

import { deepcopy, nums, num, show, tuple } from './_pycopy.js';

export default {
  // d = copy.deepcopy([a, b]); d[0].append(0); d.append([]); (original, d)
  nested: (a, b) => {
    const original = [nums(a), nums(b)];
    const d = deepcopy(original);
    d[0].push(0n);
    d.push([]);
    return show(tuple(original, d));
  },

  // a list that contains itself
  cycle: (xs) => {
    const a = nums(xs);
    a.push(a);
    const b = deepcopy(a);
    return show(tuple(b, b[b.length - 1] === b, b[b.length - 1] === a));
  },

  // one inner list referenced twice stays shared in the copy
  shared: (xs, x) => {
    const inner = nums(xs);
    const outer = [inner, inner];
    const d = deepcopy(outer);
    d[0].push(num(x));
    return show(tuple(d, d[0] === d[1], outer));
  },
};
