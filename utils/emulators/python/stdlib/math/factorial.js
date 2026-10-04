// utils/emulators/python/stdlib/math/factorial.js
//
// Emulator for the math.factorial demo, on _pymath.js (exact BigInt).

import * as M from './_pymath.js';
import { raise } from '../../../../py-exceptions.js';

export default {
  value: (n) => M.out(M.factorial(M.lit(n))),

  // len(str(math.factorial(n))) — str() of an int refuses > 4300 digits
  digits: (n) => {
    const s = M.factorial(M.lit(n)).int.toString();
    if (s.length > 4300) raise('ValueError', 'Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit');
    return BigInt(s.length);
  },

  // (math.factorial(n), math.gamma(n + 1))
  gamma: (n) => {
    const v = M.lit(n);
    return M.out({ tuple: [M.factorial(v), M.gamma(M.pyAdd(v, M.I(1)))] });
  },
};
