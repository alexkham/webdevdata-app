// utils/emulators/python/stdlib/calendar/calendar-class.js
//
// Emulator for the calendar.Calendar demo tab, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // cal = calendar.Calendar(firstweekday=first)
  // (cal.firstweekday, list(cal.iterweekdays()), cal.monthdayscalendar(year, month)[0])
  basics: (first, year, month) => {
    const cal = new C.Calendar(C.arg(first));
    const fw = cal.firstweekday;
    const order = [...cal.iterweekdays()];
    const week = cal.monthdayscalendar(C.arg(year), C.arg(month))[0];
    return C.asPy({ __pyTuple: [fw, order, week] });
  },
};
