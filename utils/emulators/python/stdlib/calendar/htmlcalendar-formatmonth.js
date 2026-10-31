// utils/emulators/python/stdlib/calendar/htmlcalendar-formatmonth.js
//
// Emulator for the HTMLCalendar.formatmonth demo tabs, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.HTMLCalendar(first).formatmonth(year, month).splitlines()
  month: (first, year, month) => {
    const cal = new C.HTMLCalendar(C.arg(first));
    return C.splitlines(cal.formatmonth(C.arg(year), C.arg(month)));
  },

  // (cal.formatmonth(year, month).splitlines()[1],
  //  cal.formatmonth(year, month, withyear=False).splitlines()[1])
  title: (year, month) => {
    const cal = new C.HTMLCalendar();
    const y = C.arg(year);
    const m = C.arg(month);
    const a = C.splitlines(cal.formatmonth(y, m))[1];
    const b = C.splitlines(cal.formatmonth(y, m, false))[1];
    return { __pyTuple: [a, b] };
  },
};
