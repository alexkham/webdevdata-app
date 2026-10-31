// utils/emulators/python/stdlib/calendar/itermonthdates.js
//
// Emulator for the Calendar.itermonthdates / itermonthdays… demo tabs, on
// the generator port in _pycalendar.js.

import * as C from './_pycalendar.js';

// list(calendar.Calendar(first).<meth>(year, month))[:n]
const run = (meth, n) => (first, year, month) => {
  const cal = new C.Calendar(C.arg(first));
  const items = [...cal[meth](C.arg(year), C.arg(month))];
  return C.asPy(n === undefined ? items : items.slice(0, n));
};

export default {
  days: run('itermonthdays'),
  days2: run('itermonthdays2', 7),
  days4: run('itermonthdays4', 7),
  dates: run('itermonthdates', 3),
};
