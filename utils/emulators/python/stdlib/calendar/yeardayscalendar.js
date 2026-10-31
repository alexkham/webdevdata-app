// utils/emulators/python/stdlib/calendar/yeardayscalendar.js
//
// Emulator for the Calendar.year*calendar demo tabs, on the port in
// _pycalendar.js.

import * as C from './_pycalendar.js';

export default {
  // [[len(month) for month in row] for row in calendar.Calendar(first).yeardayscalendar(year, width)]
  shape: (first, year, width) => new C.Calendar(C.arg(first))
    .yeardayscalendar(C.arg(year), C.arg(width))
    .map((row) => row.map((month) => BigInt(month.length))),

  // [month[0] for row in calendar.Calendar(first).yeardayscalendar(year) for month in row]
  firsts: (first, year) => new C.Calendar(C.arg(first))
    .yeardayscalendar(C.arg(year))
    .flatMap((row) => row.map((month) => month[0])),
};
