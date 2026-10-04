// utils/emulators/python/stdlib/math/index.js
//
// Emulator for the math module hub demo, on the CPython port in _pymath.js.

import * as M from './_pymath.js';
import { raise } from '../../../../py-exceptions.js';

// what calling getattr(math, name) with ONE argument raises when the
// function needs another arity (CPython's argument-clinic messages)
const ARITY = {
  atan2: 'atan2 expected 2 arguments, got 1',
  comb: 'comb expected 2 arguments, got 1',
  copysign: 'copysign expected 2 arguments, got 1',
  dist: 'dist expected 2 arguments, got 1',
  fma: 'fma expected 3 arguments, got 1',
  fmod: 'fmod expected 2 arguments, got 1',
  ldexp: 'ldexp expected 2 arguments, got 1',
  pow: 'pow expected 2 arguments, got 1',
  remainder: 'remainder expected 2 arguments, got 1',
  sumprod: 'sumprod expected 2 arguments, got 1',
  isclose: "isclose() missing required argument 'b' (pos 2)",
  nextafter: 'nextafter() takes exactly 2 positional arguments (1 given)',
};
const ITERABLE = new Set(['fsum', 'prod']);

// f = getattr(math, name); f(x)
export function callOne(name, x) {
  const f = M.attr(name);
  if (typeof f !== 'function') {
    if (f && f.pyObject) raise('TypeError', f.call);
    raise('TypeError', `'${M.typeName(f)}' object is not callable`);
  }
  if (ARITY[name]) raise('TypeError', ARITY[name]);
  if (ITERABLE.has(name) && !Array.isArray(x)) raise('TypeError', `'${M.typeName(x)}' object is not iterable`);
  return f(x);
}

export const floats = (text) => text.split(',').map(M.floatFromStr);

export default {
  call: (fn, x) => M.out(callOne(fn, M.litFloat(x))),

  // xs = [float(x) for x in text.split(',')]; (sum(xs), math.fsum(xs))
  sums: (text) => {
    const xs = floats(text);
    return M.out({ tuple: [M.pySum(xs), M.fsum(xs)] });
  },

  // (math.floor(x), math.ceil(x), math.trunc(x), round(x))
  round: (x) => {
    const v = M.litFloat(x);
    return M.out({ tuple: [M.floor(v), M.ceil(v), M.trunc(v), M.pyRound(v)] });
  },
};
