// utils/emulators/python/keywords/raise.js
//
// Emulator for the raise-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js); floor division
// and list indexing come from the try emulator.

import { raise } from '../../../py-exceptions.js';
import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { fromLiteral, cmp, toPy, reprOf } from '../../../py-num.js';
import { floorDiv, listIndex } from './try.js';

// set_age(age): raise ValueError(f'age must be >= 0, got {age}')
function validate(age) {
  const v = fromLiteral(age);
  if (cmp(v, { int: 0n }) < 0) raise('ValueError', `age must be >= 0, got ${reprOf(v)}`);
  return toPy(v);
}

// prices[i] → IndexError → raise ValueError(...) from e; caught, shown
// as (str(err), repr(err.__cause__))
function chain(i) {
  const prices = [5n, 8n, 13n];
  const v = fromLiteral(i);
  try {
    return prices[listIndex(prices.length, v)];
  } catch (e) {
    if (e.name !== 'IndexError') throw e; // TypeError for a float index escapes
    // f'{i}' of an int is its decimal digits
    return { __pyTuple: [`no item #${reprOf(v)}`, `IndexError(${pyRepr(e.message)})`] };
  }
}

// log, then bare raise; the caller catches the same ZeroDivisionError
function reraise(b) {
  const v = fromLiteral(b);
  const log = [];
  let result;
  try {
    result = toPy(floorDiv({ int: 100n }, v));
  } catch (e) {
    if (e.name !== 'ZeroDivisionError') throw e;
    log.push('logged');
    result = `caught again: ${e.message}`;
  }
  return { __pyTuple: [result, log] };
}

export default {
  raise: validate,
  from: chain,
  reraise,
};
