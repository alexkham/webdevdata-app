// utils/emulators/python/stdlib/calendar/textcalendar-formatweek.js
//
// Emulator for the TextCalendar building-block demo tabs (formatweek,
// formatweekday, formatmonthname, formatday), on the port in _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // cal = calendar.TextCalendar()
  // cal.formatweek(cal.monthdays2calendar(year, month)[row], width)
  week: (year, month, row, width) => {
    const cal = new C.TextCalendar();
    const weeks = cal.monthdays2calendar(C.arg(year), C.arg(month));
    const week = C.listItem(weeks, C.arg(row));
    return cal.formatweek(week, C.arg(width));
  },

  // calendar.TextCalendar().formatweekday(day, width)
  weekday: (day, width) => new C.TextCalendar().formatweekday(C.arg(day), C.arg(width)),

  // calendar.TextCalendar().formatmonthname(year, month, width)
  name: (year, month, width) => new C.TextCalendar().formatmonthname(C.arg(year), C.arg(month), C.arg(width)),

  // calendar.TextCalendar().formatday(day, 0, width)
  day: (day, width) => new C.TextCalendar().formatday(C.arg(day), 0n, C.arg(width)),
};
