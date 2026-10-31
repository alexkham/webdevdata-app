// utils/emulators/python/stdlib/calendar/monthdayscalendar.js
//
// Emulator for the Calendar.month*calendar demo tabs, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

const cal = (first) => new C.Calendar(C.arg(first));

export default {
  // calendar.Calendar(first).monthdayscalendar(year, month)
  days: (first, year, month) => cal(first).monthdayscalendar(C.arg(year), C.arg(month)),

  // calendar.Calendar(first).monthdays2calendar(year, month)[0]
  days2: (first, year, month) => C.asPy(cal(first).monthdays2calendar(C.arg(year), C.arg(month))[0]),

  // [[d.day for d in week] for week in calendar.Calendar(first).monthdatescalendar(year, month)]
  dates: (first, year, month) => cal(first).monthdatescalendar(C.arg(year), C.arg(month))
    .map((week) => week.map((d) => BigInt(d.d))),
};
