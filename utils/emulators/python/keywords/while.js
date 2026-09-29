// utils/emulators/python/keywords/while.js
//
// Emulator for the while-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js).

import { raise } from '../../../py-exceptions.js';
import { fromLiteral, cmp, toPy } from '../../../py-num.js';

// n //= 2 — only reached while n > 0, where halving is exact for floats
// and BigInt division truncates the same way floor does.
const halve = (v) => (v.int !== undefined ? { int: v.int / 2n } : { float: Math.floor(v.float / 2) });

// steps = []; while n > 0: steps.append(n); n //= 2
function halving(n) {
  let v = fromLiteral(n);
  const steps = [];
  while (cmp(v, { int: 0n }) > 0) {
    steps.push(toPy(v));
    v = halve(v);
  }
  return steps;
}

// three attempts; break on the matching one, else "gave up"
function retry(succeedOn) {
  const target = fromLiteral(succeedOn);
  let attempts = 0n;
  while (attempts < 3n) {
    attempts += 1n;
    if (cmp({ int: attempts }, target) === 0) return `ok on try ${attempts}`;
  }
  return 'gave up after 3 tries';
}

// while True: item = queue.pop(0); if item == "stop": break; taken.append(item)
function takeUntilStop(queue) {
  const q = [...queue];
  const taken = [];
  while (true) {
    if (q.length === 0) raise('IndexError', 'pop from empty list');
    const item = q.shift();
    if (item === 'stop') break;
    taken.push(item);
  }
  return taken;
}

export default {
  while: halving,
  else: retry,
  true: takeUntilStop,
};
