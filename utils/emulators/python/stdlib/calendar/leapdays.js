// utils/emulators/python/stdlib/calendar/leapdays.js
//
// Emulator for the calendar.leapdays demo tabs, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';

const MAX_SPAN = 5000n; // years the browser loop walks through

export default {
  // calendar.leapdays(y1, y2)
  count: (y1, y2) => C.asPy(C.leapdays(C.arg(y1), C.arg(y2))),

  // (calendar.leapdays(y1, y2), sum(calendar.isleap(y) for y in range(y1, y2)))
  loop: (y1, y2) => {
    const a = C.arg(y1);
    const b = C.arg(y2);
    const formula = C.leapdays(a, b);
    for (const v of [a, b]) {
      if (!C.isInt(v)) C.raise('TypeError', `'${C.typeName(v)}' object cannot be interpreted as an integer`);
    }
    if (b - a > MAX_SPAN) {
      C.raise('DemoLimit', `The browser demo loops over at most ${MAX_SPAN} years; CPython counts all ${b - a} the same way.`);
    }
    let n = 0n;
    for (let y = a; y < b; y += 1n) if (C.isleap(y)) n += 1n;
    return C.asPy({ __pyTuple: [formula, n] });
  },
};
