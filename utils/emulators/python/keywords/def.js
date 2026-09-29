// utils/emulators/python/keywords/def.js
//
// Emulator for the def-keyword demo tabs. Numbers follow the Python value
// of the literal the code shows (utils/py-num.js): a 'number' input is an
// int unless its JS text reads as a float (huge values) or as inf.

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, cmp, toPy } from '../../../py-num.js';

// min(a, b) / max(a, b) return the FIRST of equal items, like CPython.
const pyMin = (a, b) => (cmp(b, a) < 0 ? b : a);
const pyMax = (a, b) => (cmp(b, a) > 0 ? b : a);

// def clamp(x, low=0, high=10): return max(low, min(x, high))
// (clamp(x), clamp(x, high=high))
function clampDemo(x, high) {
  const X = fromLiteral(x);
  const H = fromLiteral(high);
  const low = { int: 0n };
  const clamp = (v, hi) => pyMax(low, pyMin(v, hi));
  return { __pyTuple: [toPy(clamp(X, { int: 10n })), toPy(clamp(X, H))] };
}

// def add(item, bucket=[]) — one shared default list
function mutableDefault(first, second) {
  const bucket = [];                    // created once, when def ran
  const add = (item) => { bucket.push(item); return bucket; };
  const a = add(fromLiteral(first));
  const b = add(fromLiteral(second));
  const shown = (lst) => lst.map(toPy);
  return { __pyTuple: [shown(a), shown(b), a === b] };
}

// def f(first, *rest, **opts): return first, rest, opts
// f(*numbers, end=end)
function starArgs(numbers, end) {
  const items = numbers.map((n) => fromLiteral(n)); // the list literal
  const endVal = fromLiteral(end);                  // then the keyword value
  if (items.length === 0) raise('TypeError', "f() missing 1 required positional argument: 'first'");
  const [first, ...rest] = items;
  return { __pyTuple: [toPy(first), { __pyTuple: rest.map(toPy) }, { end: toPy(endVal) }] };
}

export default {
  defaults: clampDemo,
  mutable: mutableDefault,
  args: starArgs,
};
