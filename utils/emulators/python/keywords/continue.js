// utils/emulators/python/keywords/continue.js
//
// Emulator for the continue-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js).

import { fromLiteral, reprOf } from '../../../py-num.js';

// n % 2 is truthy exactly when it is non-zero. The sign of Python's result
// differs from JS for negatives, but whether it is zero does not.
const isOdd = (v) => (v.int !== undefined ? v.int % 2n !== 0n : v.float % 2 !== 0);

// for n in numbers: if n % 2: log "skip n"; continue — log "use n"
function skipOdd(numbers) {
  const items = numbers.map((n) => fromLiteral(n));
  const log = [];
  for (const n of items) {
    if (isOdd(n)) {
      log.push(`skip ${reprOf(n)}`);
      continue;
    }
    log.push(`use ${reprOf(n)}`);
  }
  return log;
}

// while i < len(items): item = items[i]; i += 1; if not item: continue; kept.append(item)
function skipBlanks(items) {
  const kept = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    i += 1;
    if (item === '') continue;
    kept.push(item);
  }
  return kept;
}

export default {
  for: skipOdd,
  while: skipBlanks,
};
