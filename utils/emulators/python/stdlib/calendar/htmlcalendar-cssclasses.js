// utils/emulators/python/stdlib/calendar/htmlcalendar-cssclasses.js
//
// Emulator for the HTMLCalendar CSS-class attribute demo tabs, on the port
// in _pycalendar.js. Assigning on the instance replaces only that
// attribute: cssclasses_weekday_head keeps pointing at the original list,
// as in CPython.

import * as C from './_pycalendar.js';

export default {
  // cal = calendar.HTMLCalendar(); cal.cssclass_month = table
  // cal.cssclass_month_head = title; cal.cssclass_noday = noday
  // cal.formatmonth(2026, 2).splitlines()[:4]
  month: (table, title, noday) => {
    const cal = new C.HTMLCalendar();
    cal.cssclass_month = table;
    cal.cssclass_month_head = title;
    cal.cssclass_noday = noday;
    return C.splitlines(cal.formatmonth(2026n, 2n)).slice(0, 4);
  },

  // cal = calendar.HTMLCalendar(); cal.cssclasses = classes
  // (cal.formatweek(cal.monthdays2calendar(2026, 10)[1]), cal.formatweekday(calendar.MONDAY))
  weekdays: (classes) => {
    const cal = new C.HTMLCalendar();
    cal.cssclasses = classes;
    const row = cal.formatweek(cal.monthdays2calendar(2026n, 10n)[1]);
    return { __pyTuple: [row, cal.formatweekday(C.MONDAY)] };
  },

  // cal = calendar.HTMLCalendar(); cal.cssclass_year = table
  // cal.cssclass_year_head = head; cal.formatyear(2026).splitlines()[:2]
  year: (table, head) => {
    const cal = new C.HTMLCalendar();
    cal.cssclass_year = table;
    cal.cssclass_year_head = head;
    return C.splitlines(cal.formatyear(2026n)).slice(0, 2);
  },
};
