// utils/emulators/python/keywords/if.js
//
// Emulator for the if-keyword demo tabs. Numbers follow the Python value
// of the literal the code shows (utils/py-num.js); strings are truthy
// when non-empty, like Python str.

import { fromLiteral, cmp } from '../../../py-num.js';

// Python value of a demo argument: a JS number → int/float by its literal
// text, anything else stays a str.
const pyValue = (v) => (typeof v === 'number' ? fromLiteral(v) : { str: v });

function truthy(v) {
  if (v.str !== undefined) return v.str.length > 0;
  if (v.int !== undefined) return v.int !== 0n;
  return v.float !== 0;
}

// value = …; verdict = "falsy"; if value: verdict = "truthy"
function truthTest(value) {
  return truthy(pyValue(value)) ? 'truthy' : 'falsy';
}

// if / elif / elif / else grade ladder
function grade(score) {
  const s = fromLiteral(score);
  if (cmp(s, { int: 90n }) >= 0) return 'A';
  if (cmp(s, { int: 75n }) >= 0) return 'B';
  if (cmp(s, { int: 50n }) >= 0) return 'C';
  return 'F';
}

// "in range" if 0 <= n < 10 else "out of range"
function inRange(n) {
  const v = fromLiteral(n);
  return cmp({ int: 0n }, v) <= 0 && cmp(v, { int: 10n }) < 0 ? 'in range' : 'out of range';
}

export default {
  if: truthTest,
  elif: grade,
  ternary: inRange,
};
