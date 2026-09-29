// utils/emulators/python/keywords/return.js
//
// Emulator for the return-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js).

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, cmp, isInt, toPy } from '../../../py-num.js';

// def find(items, target): return i at the first x == target, else None
function findIndex(items, target) {
  const xs = items.map((n) => fromLiteral(n));
  const t = fromLiteral(target);
  for (let i = 0; i < xs.length; i += 1) {
    if (cmp(xs[i], t) === 0) return i;
  }
  return null; // fell off the end → None
}

// min()/max() keep the first of equal items
function minMax(xs) {
  if (xs.length === 0) raise('ValueError', 'min() iterable argument is empty');
  let lo = xs[0];
  let hi = xs[0];
  for (const x of xs.slice(1)) {
    if (cmp(x, lo) < 0) lo = x;
    if (cmp(x, hi) > 0) hi = x;
  }
  return [lo, hi];
}

// low, high = min_max(nums); (low, high, min_max(nums))
function tupleReturn(nums) {
  const xs = nums.map((n) => fromLiteral(n));
  const [lo, hi] = minMax(xs);
  return { __pyTuple: [toPy(lo), toPy(hi), { __pyTuple: [toPy(lo), toPy(hi)] }] };
}

// CPython float floor division (float_floor_div via float_divmod)
function floatFloorDiv(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float floor division by zero');
  let mod = vx % wx; // C fmod
  let div = (vx - mod) / wx;
  if (mod !== 0) {
    if ((wx < 0) !== (mod < 0)) { mod += wx; div -= 1; }
  }
  let floordiv;
  if (div !== 0) {
    floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1;
  } else {
    floordiv = Math.sign(vx / wx) < 0 || Object.is(vx / wx, -0) ? -0 : 0;
  }
  return floordiv;
}

// 100 // n
function floorDiv100(n) {
  if (isInt(n)) {
    if (n.int === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
    const a = 100n;
    let q = a / n.int;
    if ((a % n.int !== 0n) && ((a < 0n) !== (n.int < 0n))) q -= 1n;
    return { int: q };
  }
  return { float: floatFloorDiv(100, n.float) };
}

// steps = []; def div(n): try: return 100 // n finally: steps.append(...)
function tryFinally(n) {
  const N = fromLiteral(n);
  const steps = [];
  let result;
  steps.push('try');
  try {
    result = floorDiv100(N);
  } finally {
    steps.push('finally'); // runs whether the division worked or raised
  }
  return { __pyTuple: [toPy(result), steps] };
}

export default {
  none: findIndex,
  tuple: tupleReturn,
  finally: tryFinally,
};
