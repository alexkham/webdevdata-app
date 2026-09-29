// utils/emulators/python/keywords/del.js
//
// Emulator for the del-keyword demo tabs. Numbers follow the Python value
// of the literal the code shows (utils/py-num.js); list indexing comes from
// the try emulator.

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, isInt, toPy } from '../../../py-num.js';
import { listIndex } from './try.js';

const SSIZE_MAX = (1n << 63n) - 1n;
const SSIZE_MIN = -(1n << 63n);

// del nums[i]
function item(i) {
  const nums = [10n, 20n, 30n, 40n];
  const pos = listIndex(nums.length, fromLiteral(i), true);
  nums.splice(pos, 1);
  return nums;
}

// One slice bound: _PyEval_SliceIndex (huge ints clamp, floats are
// rejected) then PySlice_AdjustIndices for a positive step.
function sliceBound(v, length) {
  if (!isInt(v)) raise('TypeError', 'slice indices must be integers or None or have an __index__ method');
  let x = v.int;
  if (x > SSIZE_MAX) x = SSIZE_MAX;
  if (x < SSIZE_MIN) x = SSIZE_MIN;
  const len = BigInt(length);
  if (x < 0n) {
    x += len;
    if (x < 0n) x = 0n;
  } else if (x >= len) {
    x = len;
  }
  return Number(x);
}

// del nums[start:stop]
function slice(start, stop) {
  const nums = [0n, 1n, 2n, 3n, 4n, 5n];
  // both bounds are evaluated (NameError) before either is checked
  const a = fromLiteral(start);
  const b = fromLiteral(stop);
  const lo = sliceBound(a, nums.length);
  const hi = sliceBound(b, nums.length);
  if (hi > lo) nums.splice(lo, hi - lo);
  return nums;
}

// a = items; b = a; del a; b.append(...) — the list survives through b
function name(items) {
  const b = items.map((n) => toPy(fromLiteral(n)));
  b.push('still here');
  return { __pyTuple: [b, false] };
}

export default {
  item,
  slice,
  name,
};
