// utils/emulators/python/stdlib/math/copysign-fabs.js
//
// Emulator for the math.copysign / fabs demo, on _pymath.js.

import * as M from './_pymath.js';
import { raise } from '../../../../py-exceptions.js';

const pyAbs = (v) => {
  if (M.isFloat(v)) return M.F(Math.abs(v.float));
  if (M.isInt(v)) return { int: v.int < 0n ? -v.int : v.int };
  if (typeof v === 'boolean') return { int: v ? 1n : 0n };
  return raise('TypeError', `bad operand type for abs(): '${M.typeName(v)}'`);
};

export default {
  // (abs(x), math.fabs(x), math.copysign(1.0, x))
  compare: (x) => {
    const v = M.lit(x);
    return M.out({ tuple: [pyAbs(v), M.fabs(v), M.copysign(M.F(1.0), v)] });
  },
  // math.copysign(mag, sign)
  sign: (mag, sign) => M.out(M.copysign(M.litFloat(mag), M.litFloat(sign))),
};
