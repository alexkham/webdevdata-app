// utils/emulators/python/stdlib/calendar/day_name.js
//
// Emulator for the day_name / day_abbr demo tabs (C-locale names), on the
// port in _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // (calendar.day_name[i], calendar.day_abbr[i])
  lookup: (i) => {
    const k = C.arg(i);
    return { __pyTuple: [C.day_name(k), C.day_abbr(k)] };
  },

  // calendar.day_name[calendar.weekday(year, month, day)]
  date: (year, month, day) => C.day_name(C.weekday(C.arg(year), C.arg(month), C.arg(day))),
};
