// utils/emulators/python/stdlib/math/sin-cos-tan.js
//
// Emulator for the trigonometric functions demo, on _pymath.js (glibc's
// sin/cos/tan/asin/acos/atan/atan2 ported in _libm.js).

import * as M from './_pymath.js';

export default {
  // r = math.radians(deg); (math.sin(r), math.cos(r), math.tan(r))
  degrees: (deg) => {
    const r = M.radians(M.litFloat(deg));
    return M.out({ tuple: [M.sin(r), M.cos(r), M.tan(r)] });
  },

  // (math.degrees(math.asin(x)), math.degrees(math.acos(x)), math.degrees(math.atan(x)))
  inverse: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.degrees(M.asin(v)), M.degrees(M.acos(v)), M.degrees(M.atan(v))] });
  },

  // math.degrees(math.atan2(y, x))
  atan2: (y, x) => M.out(M.degrees(M.atan2(M.litFloat(y), M.litFloat(x)))),
};
