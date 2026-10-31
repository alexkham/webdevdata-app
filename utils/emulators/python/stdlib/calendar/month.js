// utils/emulators/python/stdlib/calendar/month.js
//
// Emulator for the calendar.month / prmonth demo tabs, on the port in
// _pycalendar.js (the module's shared TextCalendar).

import * as C from './_pycalendar.js';

export default {
  // calendar.month(year, month, w=w, l=l).splitlines()
  text: (year, month, w, l) => {
    const args = [year, month, w, l].map(C.arg);
    return C.splitlines(C.makeModule().month(...args));
  },

  // calendar.month(year, month)
  raw: (year, month) => C.makeModule().month(C.arg(year), C.arg(month)),
};
