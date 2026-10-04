// utils/emulators/python/stdlib/itertools/count-cycle-repeat.js
//
// Emulator for the count / cycle / repeat demo tabs, on _pyitertools.js.

import { count, cycle, repeat, islice, list, asPy, pyNum } from './_pyitertools.js';

// an 'auto' demo value: a JS number is a Python literal, a string is a str
const auto = (v) => (typeof v === 'number' ? pyNum(v) : v);

export default {
  // list(islice(count(start, step), n))
  count: (start, step, n) => asPy(list(islice(count(auto(start), auto(step)), pyNum(n)))),

  // list(islice(cycle(items), n))
  cycle: (items, n) => asPy(list(islice(cycle(items), pyNum(n)))),

  // list(repeat(value, times))
  repeat: (value, times) => asPy(list(repeat(value, pyNum(times)))),

  // [f'{n}. {line}' for n, line in zip(count(1), lines)]
  number: (lines) => asPy(lines.map((line, i) => `${i + 1}. ${line}`)),
};
