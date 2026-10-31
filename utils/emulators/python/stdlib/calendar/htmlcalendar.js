// utils/emulators/python/stdlib/calendar/htmlcalendar.js
//
// Emulator for the calendar.HTMLCalendar demo tab, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.HTMLCalendar(firstweekday=first).formatmonth(year, month).splitlines()
  month: (first, year, month) => {
    const cal = new C.HTMLCalendar(C.arg(first));
    return C.splitlines(cal.formatmonth(C.arg(year), C.arg(month)));
  },
};
