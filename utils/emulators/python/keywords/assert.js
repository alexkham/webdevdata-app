// utils/emulators/python/keywords/assert.js
//
// Emulator for the assert-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js).

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, cmp, sub, toPy, reprOf } from '../../../py-num.js';

// take(5, n): assert n <= stock, f'cannot take {n}, only {stock} left'
function take(n) {
  const stock = { int: 5n };
  const v = fromLiteral(n);
  if (!(cmp(v, stock) <= 0)) raise('AssertionError', `cannot take ${reprOf(v)}, only 5 left`);
  return toPy(sub(stock, v));
}

// assert (x > 0, msg) is a non-empty tuple — always true;
// assert x > 0, msg really checks
function trap(x) {
  const v = fromLiteral(x);
  const results = ['tuple form: passed'];
  if (cmp(v, { int: 0n }) > 0) results.push('real assert: passed');
  else results.push('real assert: x must be positive');
  return results;
}

export default {
  assert: take,
  tuple: trap,
};
