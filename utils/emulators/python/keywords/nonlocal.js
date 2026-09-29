// utils/emulators/python/keywords/nonlocal.js
//
// Emulator for the nonlocal-keyword demo tabs: real JS closures stand in
// for Python closure cells. Numbers follow the Python value of the literal
// the code shows (utils/py-num.js).

import { fromLiteral, add, toPy } from '../../../py-num.js';

// def make_counter(start): count = start; def bump(): nonlocal count; count += 1 ...
// c = make_counter(start); (c(), c(), c())
function counter(start) {
  const makeCounter = (s) => {
    let count = s;
    return () => { count = add(count, { int: 1n }); return count; };
  };
  const c = makeCounter(fromLiteral(start));
  return { __pyTuple: [toPy(c()), toPy(c()), toPy(c())] };
}

// def make_acc(): total = 0; def add(n): nonlocal total; total += n; return total
// acc = make_acc(); [acc(n) for n in nums]
function accumulator(nums) {
  const makeAcc = () => {
    let total = { int: 0n };
    return (n) => { total = add(total, n); return total; };
  };
  const acc = makeAcc();
  const xs = nums.map((n) => fromLiteral(n));
  return xs.map((n) => toPy(acc(n)));
}

export default {
  counter,
  acc: accumulator,
};
