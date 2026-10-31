// utils/emulators/python/stdlib/calendar/monthcalendar.js
//
// Emulator for the calendar.monthcalendar demo tabs, on the port in
// _pycalendar.js (the module-level function is the shared TextCalendar's
// monthdayscalendar).

import * as C from './_pycalendar.js';

export default {
  // calendar.monthcalendar(year, month)
  weeks: (year, month) => C.makeModule().monthcalendar(C.arg(year), C.arg(month)),

  // days = [week[wd] for week in calendar.monthcalendar(year, month) if week[wd]]
  // days[n - 1]
  nth: (year, month, weekday, n) => {
    const weeks = C.makeModule().monthcalendar(C.arg(year), C.arg(month));
    const days = [];
    for (const week of weeks) {
      const wd = C.arg(weekday);
      if (C.listItem(week, wd) !== 0n) days.push(C.listItem(week, wd));
    }
    return C.listItem(days, C.sub(C.arg(n), 1n));
  },
};
