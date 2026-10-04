// utils/emulators/python/stdlib/bisect/insort_left.js
//
// Emulator for the bisect.insort_left demo tabs, on _pybisect.js.

import { insortLeft, insortRight, nums, num, toFloat, asPy, tuple } from './_pybisect.js';

export default {
  // insert each value, recording the list after every insert
  trace: (a, xs) => {
    const list = nums(a);
    const trace = [];
    for (const x of nums(xs)) {
      insortLeft(list, x);
      trace.push(list.slice());
    }
    return asPy(trace);
  },

  // float(x) inserted on the left and on the right of equal items
  ties: (a, x) => {
    const base = nums(a);
    const v = toFloat(num(x));
    const left = base.slice();
    insortLeft(left, v);
    const right = base.slice();
    insortRight(right, v);
    return asPy(tuple(left, right));
  },
};
