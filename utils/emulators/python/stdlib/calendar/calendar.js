// utils/emulators/python/stdlib/calendar/calendar.js
//
// Emulator for the calendar.calendar / prcal demo tab, on the port in
// _pycalendar.js (the module's shared TextCalendar).

import * as C from './_pycalendar.js';

export default {
  // calendar.calendar(year, w=w, l=l, c=c, m=m).splitlines()
  year: (year, w, l, c, m) => {
    const args = [year, w, l, c, m].map(C.arg);
    return C.splitlines(C.makeModule().calendar(...args));
  },
};
