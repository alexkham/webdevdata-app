// utils/emulators/python/keywords/lambda.js
//
// Emulator for the lambda-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js).

import { fromLiteral, cmp, isInt, toPy } from '../../../py-num.js';

const pyAbs = (v) => (isInt(v) ? { int: v.int < 0n ? -v.int : v.int } : { float: Math.abs(v.float) });

// sorted(nums, key=lambda n: abs(n)) — stable, compares keys only
function sortByAbs(nums) {
  const xs = nums.map((n) => fromLiteral(n));
  const keyed = xs.map((x, i) => ({ x, k: pyAbs(x), i }));
  keyed.sort((a, b) => cmp(a.k, b.k) || a.i - b.i);
  return keyed.map((e) => toPy(e.x));
}

// x = first; late = lambda: x; early = lambda x=x: x; x = second
function lateBinding(first, second) {
  let x = fromLiteral(first);
  const late = () => x;          // looks x up when called
  const early = ((frozen) => () => frozen)(x); // default evaluated now
  x = fromLiteral(second);
  return { __pyTuple: [toPy(late()), toPy(early())] };
}

// grade = lambda n: 'pass' if n >= 50 else 'fail'
function grades(scores) {
  const xs = scores.map((n) => fromLiteral(n));
  const fifty = { int: 50n };
  return xs.map((n) => (cmp(n, fifty) >= 0 ? 'pass' : 'fail'));
}

export default {
  key: sortByAbs,
  late: lateBinding,
  ternary: grades,
};
