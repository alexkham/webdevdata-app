// utils/emulators/python/stdlib/calendar/htmlcalendar-formatday.js
//
// Emulator for the HTMLCalendar building-block demo tabs (formatday,
// formatweek, formatweekheader, formatmonthname), on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // calendar.HTMLCalendar().formatday(day, weekday)
  day: (day, weekday) => new C.HTMLCalendar().formatday(C.arg(day), C.arg(weekday)),

  // cal = calendar.HTMLCalendar(); cal.formatweek(cal.monthdays2calendar(year, month)[row])
  week: (year, month, row) => {
    const cal = new C.HTMLCalendar();
    const weeks = cal.monthdays2calendar(C.arg(year), C.arg(month));
    return cal.formatweek(C.listItem(weeks, C.arg(row)));
  },

  // calendar.HTMLCalendar(first).formatweekheader()
  header: (first) => new C.HTMLCalendar(C.arg(first)).formatweekheader(),

  // calendar.HTMLCalendar().formatmonthname(year, month)
  name: (year, month) => new C.HTMLCalendar().formatmonthname(C.arg(year), C.arg(month)),
};
