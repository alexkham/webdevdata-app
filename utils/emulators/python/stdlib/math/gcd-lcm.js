// utils/emulators/python/stdlib/math/gcd-lcm.js
//
// Emulator for the math.gcd / lcm demo, on _pymath.js (exact BigInt).

import * as M from './_pymath.js';

export default {
  // (math.gcd(a, b), math.lcm(a, b))
  pair: (a, b) => {
    const x = M.lit(a);
    const y = M.lit(b);
    return M.out({ tuple: [M.gcd(x, y), M.lcm(x, y)] });
  },

  // nums = [int(x) for x in text.split(',')]; (math.gcd(*nums), math.lcm(*nums))
  many: (text) => {
    const nums = text.split(',').map(M.intFromStr);
    return M.out({ tuple: [M.gcd(...nums), M.lcm(...nums)] });
  },

  // g = math.gcd(num, den); (num // g, den // g)
  fraction: (num, den) => {
    const a = M.lit(num);
    const b = M.lit(den);
    const g = M.gcd(a, b);
    return M.out({ tuple: [M.pyFloorDiv(a, g), M.pyFloorDiv(b, g)] });
  },
};
