// utils/emulators/python/keywords/true-false.js
//
// Emulator for the True / False demo tabs. Numbers reach Python as the
// literal text the code shows (utils/py-num.js). bool is an int subclass:
// True == 1, False == 0, and equal numbers hash equally, so 1 / 1.0 find
// the True key and 0 / 0.0 the False key.

import { raise } from '../../../py-exceptions.js';
import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { fromLiteral, cmp, reprOf } from '../../../py-num.js';

const ZERO = { int: 0n };
const ONE = { int: 1n };

// x = value; (bool(x), x == True)
function truthy(value) {
  if (typeof value === 'string') return { __pyTuple: [value.length > 0, false] };
  const v = fromLiteral(value);
  return { __pyTuple: [cmp(v, ZERO) !== 0, cmp(v, ONE) === 0] };
}

// flags = [n > 0 for n in numbers]; (flags, sum(flags))
function sumFlags(numbers) {
  const flags = numbers.map((n) => cmp(fromLiteral(n), ZERO) > 0);
  return { __pyTuple: [flags, flags.filter(Boolean).length] };
}

// {True: 'yes', False: 'no'}[key]
function keys(key) {
  if (typeof key === 'string') raise('KeyError', pyRepr(key));
  const v = fromLiteral(key);
  if (cmp(v, ONE) === 0) return 'yes';
  if (cmp(v, ZERO) === 0) return 'no';
  return raise('KeyError', reprOf(v));
}

export default { truthy, sum: sumFlags, keys };
