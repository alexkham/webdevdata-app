// utils/emulators/python/stdlib/bisect/bisect_left.js
//
// Emulator for the bisect.bisect_left demo tabs, on _pybisect.js.

import { bisectLeft, pyNeg, nums, num, asPy } from './_pybisect.js';

export default {
  // bisect.bisect_left(a, x)
  position: (a, x) => asPy(bisectLeft(nums(a), num(x))),

  // bisect.bisect_left(a, x, lo, hi)
  lohi: (a, x, lo, hi) => asPy(bisectLeft(nums(a), num(x), num(lo), num(hi))),

  // descending list searched with key=lambda v: -v and the key applied to x by hand
  descending: (a, x) => asPy(bisectLeft(nums(a), pyNeg(num(x)), undefined, undefined, pyNeg)),
};
