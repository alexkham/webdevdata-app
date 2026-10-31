// utils/emulators/python/stdlib/calendar/weekday.js
//
// Emulator for the calendar.weekday demo tabs, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';

const call = (year, month, day) => C.weekday(C.arg(year), C.arg(month), C.arg(day));

export default {
  // calendar.weekday(year, month, day)
  day: (year, month, day) => C.asPy(call(year, month, day)),

  // d = calendar.weekday(year, month, day); (int(d), d.name, calendar.day_name[d])
  name: (year, month, day) => {
    const d = call(year, month, day);
    return C.asPy({ __pyTuple: [d.value, d.name, C.day_name(d)] });
  },
};
