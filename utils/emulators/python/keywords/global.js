// utils/emulators/python/keywords/global.js
//
// Emulator for the global-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js).

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, add, cmp, toPy } from '../../../py-num.js';

// count = 0; def bump(step): global count; count += step; return count
// totals = [bump(s) for s in steps]; (totals, count)
function globalCounter(steps) {
  const xs = steps.map((n) => fromLiteral(n));
  const moduleNs = { count: { int: 0n } };
  const bump = (step) => {
    moduleNs.count = add(moduleNs.count, step); // rebinds the module name
    return moduleNs.count;
  };
  const totals = xs.map(bump);
  return { __pyTuple: [totals.map(toPy), toPy(moduleNs.count)] };
}

// total = 10; def f(n): if n > 5: total = 0; return total
// total is local to f (it is assigned in f), so the module 10 is never seen.
function withoutGlobal(n) {
  const N = fromLiteral(n);
  let local; // unbound until assigned
  let bound = false;
  if (cmp(N, { int: 5n }) > 0) { local = 0; bound = true; }
  if (!bound) raise('UnboundLocalError', "cannot access local variable 'total' where it is not associated with a value");
  return local;
}

export default {
  counter: globalCounter,
  local: withoutGlobal,
};
