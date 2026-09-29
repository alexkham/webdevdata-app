// utils/emulators/python/keywords/yield.js
//
// Emulator for the yield-keyword demo tabs, written with JS generators so
// the laziness is real: only the values asked for are produced. Numbers
// follow the Python value of the literal the code shows (utils/py-num.js).

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, mul, isInt, toPy } from '../../../py-num.js';

// log = []; def numbers(n): for i in range(n): log.append(...); yield i
// g = numbers(n); first = next(g); (first, log)
function lazy(n) {
  const N = fromLiteral(n);
  const log = [];
  function* numbers() {
    // range() runs inside the body, i.e. at the first next()
    if (!isInt(N)) raise('TypeError', "'float' object cannot be interpreted as an integer");
    for (let i = 0n; i < N.int; i += 1n) {
      log.push(`made ${i}`);
      yield i;
    }
  }
  const g = numbers();
  const r = g.next();
  if (r.done) raise('StopIteration');
  return { __pyTuple: [r.value, log] };
}

// def squares(nums): for n in nums: yield n * n
// g = squares(nums); (list(g), list(g))
function consumedOnce(nums) {
  const xs = nums.map((n) => fromLiteral(n));
  function* squares() {
    for (const x of xs) yield mul(x, x);
  }
  const g = squares();
  const first = [...g].map(toPy);
  const second = [...g].map(toPy); // exhausted: always empty
  return { __pyTuple: [first, second] };
}

// inner yields xs then returns len(xs); outer: count = yield from inner(xs)
function yieldFrom(xs) {
  const items = xs.map((n) => fromLiteral(n));
  function* inner() {
    yield* items;
    return items.length;
  }
  function* outer() {
    const count = yield* inner();
    yield `${count} items`;
  }
  return [...outer()].map((v) => (typeof v === 'string' ? v : toPy(v)));
}

export default {
  lazy,
  once: consumedOnce,
  from: yieldFrom,
};
