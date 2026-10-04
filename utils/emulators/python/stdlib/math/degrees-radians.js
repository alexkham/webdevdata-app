// utils/emulators/python/stdlib/math/degrees-radians.js
//
// Emulator for the math.degrees / radians demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  toRad: (deg) => M.out(M.radians(M.litFloat(deg))),
  toDeg: (rad) => M.out(M.degrees(M.litFloat(rad))),
  // math.degrees(math.radians(d)) == d
  roundtrip: (deg) => {
    const d = M.litFloat(deg);
    return M.degrees(M.radians(d)).float === d.float;
  },
};
