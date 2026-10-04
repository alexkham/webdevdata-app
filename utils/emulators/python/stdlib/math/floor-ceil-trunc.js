// utils/emulators/python/stdlib/math/floor-ceil-trunc.js
//
// Emulator for the math.floor / ceil / trunc demo, on _pymath.js.

import * as M from './_pymath.js';

export default {
  // (math.floor(x), math.ceil(x), math.trunc(x), int(x), round(x))
  compare: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.floor(v), M.ceil(v), M.trunc(v), M.trunc(v), M.pyRound(v)] });
  },

  // (a // b, math.floor(a / b), math.ceil(a / b))
  division: (a, b) => {
    const x = M.lit(a);
    const y = M.lit(b);
    const fd = M.pyFloorDiv(x, y);
    const q = M.pyTrueDiv(x, y);
    return M.out({ tuple: [fd, M.floor(q), M.ceil(q)] });
  },

  // math.floor(float(s))
  special: (s) => M.out(M.floor(M.floatFromStr(s))),
};
