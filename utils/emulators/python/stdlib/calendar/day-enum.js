// utils/emulators/python/stdlib/calendar/day-enum.js
//
// Emulator for the calendar.Day demo tabs, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

// calendar.Day[name]
function byName(name) {
  const d = C.Day.find((x) => x.name === name);
  if (!d) C.raise('KeyError', pyStrRepr(name));
  return d;
}

export default {
  // d = calendar.Day(n); (d, d.name, calendar.day_name[d])
  lookup: (n) => {
    const d = C.DayOf(C.arg(n));
    return C.asPy({ __pyTuple: [d, d.name, C.day_name(d)] });
  },

  // calendar.Day((calendar.Day[start] + n) % 7)
  next: (start, n) => {
    const d = byName(start);
    return C.asPy(C.DayOf(C.mod(C.add(d, C.arg(n)), 7n)));
  },
};
