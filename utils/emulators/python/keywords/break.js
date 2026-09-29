// utils/emulators/python/keywords/break.js
//
// Emulator for the break-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js); the list literal
// is evaluated in full before the loop starts, as in Python.

import { fromLiteral, cmp, toPy } from '../../../py-num.js';

const ZERO = { int: 0n };

// seen = []; for n in numbers: if n < 0: break; seen.append(n)
function untilNegative(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  const seen = [];
  for (const n of items) {
    if (cmp(n, ZERO) < 0) break;
    seen.push(toPy(n));
  }
  return seen;
}

// the same search, logging "break" or "else"
function searchLog(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  const log = [];
  let broke = false;
  for (const n of items) {
    log.push(toPy(n));
    if (cmp(n, ZERO) < 0) {
      log.push('break');
      broke = true;
      break;
    }
  }
  if (!broke) log.push('else');
  return log;
}

// for i in range(3): for j in range(3): if j == stop_at: break; pairs.append((i, j))
function nested(stopAt) {
  const target = fromLiteral(stopAt);
  const pairs = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (cmp({ int: BigInt(j) }, target) === 0) break;
      pairs.push({ __pyTuple: [i, j] });
    }
  }
  return pairs;
}

export default {
  break: untilNegative,
  else: searchLog,
  nested,
};
