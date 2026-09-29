// utils/emulators/python/keywords/none.js
//
// Emulator for the None-keyword demo tabs. A number typed into the 'is'
// tab reaches Python as its literal text (utils/py-num.js): only a value
// equal to zero is falsy; None is falsy and equal only to itself.

import { fromLiteral, cmp } from '../../../py-num.js';

// x = value; (x is None, x == None, not x)
function isNone(value) {
  if (value === null) return { __pyTuple: [true, true, true] };
  const v = fromLiteral(value);
  return { __pyTuple: [false, false, cmp(v, { int: 0n }) === 0] };
}

// index of the first item equal to target, else None (falls off the end)
function implicitReturn(items, target) {
  const i = items.indexOf(target);
  return i === -1 ? null : i;
}

// [add(x) for x in items] with a fresh list per call
function sentinelDefault(items) {
  return items.map((x) => [x]);
}

export default {
  is: isNone,
  return: implicitReturn,
  default: sentinelDefault,
};
