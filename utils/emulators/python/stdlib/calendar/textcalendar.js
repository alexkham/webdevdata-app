// utils/emulators/python/stdlib/calendar/textcalendar.js
//
// Emulator for the calendar.TextCalendar demo tab, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.TextCalendar(firstweekday=first).formatmonth(year, month).splitlines()
  month: (first, year, month) => {
    const cal = new C.TextCalendar(C.arg(first));
    return C.splitlines(cal.formatmonth(C.arg(year), C.arg(month)));
  },
};
