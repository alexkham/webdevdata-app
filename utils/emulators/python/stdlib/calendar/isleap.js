// utils/emulators/python/stdlib/calendar/isleap.js
//
// Emulator for the calendar.isleap demo tabs, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';

const MAX_SPAN = 5000n; // years a browser loop walks through

export default {
  // calendar.isleap(year)
  check: (year) => C.isleap(C.arg(year)),

  // [y for y in range(start, stop) if calendar.isleap(y)]
  list: (start, stop) => {
    const a = C.arg(start);
    const b = C.arg(stop);
    for (const v of [a, b]) {
      if (!C.isInt(v)) C.raise('TypeError', `'${C.typeName(v)}' object cannot be interpreted as an integer`);
    }
    if (b - a > MAX_SPAN) {
      C.raise('DemoLimit', `The browser demo walks at most ${MAX_SPAN} years; CPython loops over all ${b - a} the same way.`);
    }
    const out = [];
    for (let y = a; y < b; y += 1n) if (C.isleap(y)) out.push(y);
    return out;
  },
};
