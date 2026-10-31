// utils/emulators/python/stdlib/calendar/calendar-firstweekday.js
//
// Emulator for the Calendar.firstweekday demo tab, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // cal = calendar.TextCalendar(); cal.setfirstweekday(value)
  // (cal.firstweekday, cal.getfirstweekday(), cal.formatweekheader(2))
  set: (value) => {
    const cal = new C.TextCalendar();
    cal.setfirstweekday(C.arg(value));
    return C.asPy({ __pyTuple: [cal.firstweekday, cal.getfirstweekday(), cal.formatweekheader(2n)] });
  },
};
