// utils/emulators/python/stdlib/calendar/monthrange.js
//
// Emulator for the calendar.monthrange demo tabs, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.monthrange(year, month)
  range: (year, month) => C.asPy(C.monthrange(C.arg(year), C.arg(month))),

  // datetime.date(year, month, calendar.monthrange(year, month)[1])
  last: (year, month) => {
    const y = C.arg(year);
    const m = C.arg(month);
    const days = C.monthrange(y, m).__pyTuple[1];
    return C.asPy(C.makeDate(y, m, days));
  },
};
