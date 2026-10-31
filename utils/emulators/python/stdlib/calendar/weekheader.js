// utils/emulators/python/stdlib/calendar/weekheader.js
//
// Emulator for the calendar.weekheader demo tabs, on the port in
// _pycalendar.js (the module's shared TextCalendar).

import * as C from './_pycalendar.js';

export default {
  // calendar.weekheader(width)
  header: (width) => C.makeModule().weekheader(C.arg(width)),

  // try: calendar.setfirstweekday(first); header = calendar.weekheader(width)
  // finally: calendar.setfirstweekday(calendar.MONDAY)
  first: (first, width) => {
    const M = C.makeModule();
    M.setfirstweekday(C.arg(first));
    return M.weekheader(C.arg(width));
  },
};
