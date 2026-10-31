// utils/emulators/python/stdlib/calendar/textcalendar-formatmonth.js
//
// Emulator for the TextCalendar.formatmonth demo tab, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.TextCalendar(first).formatmonth(year, month, w=w, l=l).splitlines()
  month: (first, year, month, w, l) => {
    const cal = new C.TextCalendar(C.arg(first));
    const args = [year, month, w, l].map(C.arg);
    return C.splitlines(cal.formatmonth(...args));
  },
};
