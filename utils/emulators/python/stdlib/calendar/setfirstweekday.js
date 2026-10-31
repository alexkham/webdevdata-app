// utils/emulators/python/stdlib/calendar/setfirstweekday.js
//
// Emulator for the calendar.setfirstweekday / firstweekday demo tab, on the
// port in _pycalendar.js. Each run gets a fresh module state (Monday first),
// as every snippet does after the previous one restored it.

import * as C from './_pycalendar.js';

export default {
  // try: calendar.setfirstweekday(day)
  //      result = (calendar.firstweekday(), calendar.monthcalendar(2026, 2)[0])
  // finally: calendar.setfirstweekday(calendar.MONDAY)
  set: (day) => {
    const M = C.makeModule();
    M.setfirstweekday(C.arg(day));
    return C.asPy({ __pyTuple: [M.firstweekday(), M.monthcalendar(2026n, 2n)[0]] });
  },
};
