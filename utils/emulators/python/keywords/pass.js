// utils/emulators/python/keywords/pass.js
//
// Emulator for the pass-keyword demo tabs: the same loop with pass and
// with continue. Numbers follow the Python value of the literal the code
// shows (utils/py-num.js).

import { fromLiteral, cmp, toPy } from '../../../py-num.js';

const ZERO = { int: 0n };

// for n in numbers: if n < 0: pass — out.append(n)
function withPass(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  const out = [];
  for (const n of items) {
    if (cmp(n, ZERO) < 0) {
      // pass: nothing happens, execution falls through
    }
    out.push(toPy(n));
  }
  return out;
}

// for n in numbers: if n < 0: continue — out.append(n)
function withContinue(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  const out = [];
  for (const n of items) {
    if (cmp(n, ZERO) < 0) continue;
    out.push(toPy(n));
  }
  return out;
}

export default {
  pass: withPass,
  continue: withContinue,
};
