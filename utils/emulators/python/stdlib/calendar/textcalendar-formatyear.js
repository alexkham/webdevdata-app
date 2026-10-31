// utils/emulators/python/stdlib/calendar/textcalendar-formatyear.js
//
// Emulator for the TextCalendar.formatyear demo tab, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.TextCalendar(first).formatyear(year, c=c, m=m).splitlines()
  year: (first, year, c, m) => {
    const cal = new C.TextCalendar(C.arg(first));
    const y = C.arg(year);
    const cc = C.arg(c);
    const mm = C.arg(m);
    return C.splitlines(cal.formatyear(y, 2n, 1n, cc, mm));
  },
};
