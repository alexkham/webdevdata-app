// utils/emulators/python/keywords/for.js
//
// Emulator for the for-keyword demo tabs. Numbers follow the Python value
// of the literal the code shows (utils/py-num.js); strings iterate by code
// point, like Python str.

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, add, cmp, toPy, reprOf } from '../../../py-num.js';

// total = 0; for n in numbers: total += n; (total, n)
function sumLoop(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  if (items.length === 0) raise('NameError', "name 'n' is not defined");
  let total = { int: 0n };
  for (const n of items) total = add(total, n);
  return { __pyTuple: [toPy(total), toPy(items[items.length - 1])] };
}

// first negative via for / else
function search(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  for (const n of items) {
    if (cmp(n, { int: 0n }) < 0) return `found ${reprOf(n)}`;
  }
  return 'no negatives';
}

// enumerate(word, start=1)
function pairs(word) {
  return [...word].map((ch, i) => ({ __pyTuple: [i + 1, ch] }));
}

export default {
  for: sumLoop,
  else: search,
  enumerate: pairs,
};
