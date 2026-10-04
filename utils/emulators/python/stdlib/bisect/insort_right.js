// utils/emulators/python/stdlib/bisect/insort_right.js
//
// Emulator for the bisect.insort_right / bisect.insort demo tabs, on _pybisect.js.

import { insortRight, pyNeg, nums, num, asPy } from './_pybisect.js';

export default {
  // insert each value with insort, recording the list after every insert
  trace: (a, xs) => {
    const list = nums(a);
    const trace = [];
    for (const x of nums(xs)) {
      insortRight(list, x);
      trace.push(list.slice());
    }
    return asPy(trace);
  },

  // insort into a descending list: key=lambda v: -v (applied to x too)
  descending: (a, x) => {
    const list = nums(a);
    insortRight(list, num(x), undefined, undefined, pyNeg);
    return asPy(list);
  },
};
