// utils/emulators/python/exceptions/recursionerror.js
//
// Emulator for the RecursionError demo modes. The demo function counts
// digits by recursing on n // 10 until n == 0. For n >= 0 the depth is at
// most ~310 (even for the largest float), far below the default limit of
// 1000, so no cutoff has to be guessed. For n < 0 floor division rounds
// toward minus infinity: -5 // 10 == -1 and -1 // 10 == -1, so the base
// case is never reached and the recursion is unbounded — RecursionError
// whatever the exact limit is.

import { raise } from '../../../py-exceptions.js';

// CPython float_floor_div (Objects/floatobject.c), used when the literal
// is a float (JS prints numbers >= 1e21 in exponent form → Python float).
function floatFloorDiv(vx, wx) {
  let mod = vx % wx; // fmod
  let div = (vx - mod) / wx;
  if (mod && (wx < 0) !== (mod < 0)) {
    mod += wx;
    div -= 1.0;
  }
  if (!div) return 0;
  let floordiv = Math.floor(div);
  if (div - floordiv > 0.5) floordiv += 1.0;
  return floordiv;
}

function digits(n) {
  if (!Number.isFinite(n)) raise('NameError', "name 'inf' is not defined");
  if (n < 0) raise('RecursionError', 'maximum recursion depth exceeded');
  const isFloat = Math.abs(n) >= 1e21;
  let count = 0;
  while (n !== 0) {
    n = isFloat ? floatFloorDiv(n, 10) : Math.floor(n / 10);
    count += 1;
  }
  return count;
}

export default {
  trigger: (n) => digits(n),

  handle: (n) => {
    try {
      return digits(n);
    } catch (e) {
      if (e.name !== 'RecursionError') throw e;
      return 'never reached the base case';
    }
  },
};
