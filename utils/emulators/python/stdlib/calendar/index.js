// utils/emulators/python/stdlib/calendar/index.js
//
// Emulator for the calendar module hub demo (month grid, month facts,
// timegm), on the CPython port in _pycalendar.js. Arguments are converted
// in the order the snippet evaluates them, so a NameError ('inf') or an
// exception surfaces at the same point as in CPython.

import * as C from './_pycalendar.js';

export default {
  // cal = calendar.TextCalendar(firstweekday=fw)
  // cal.formatmonth(year, month, w=w, l=l).splitlines()
  month: (firstweekday, year, month, w, l) => {
    const cal = new C.TextCalendar(C.arg(firstweekday));
    const args = [year, month, w, l].map(C.arg);
    return C.splitlines(cal.formatmonth(...args));
  },

  // {'isleap': ..., 'monthrange': ..., 'weekday': ..., 'leapdays from 2000': ...}
  facts: (year, month, day) => {
    const pairs = [];
    const y = C.arg(year);
    pairs.push(['isleap', C.isleap(y)]);
    const m = C.arg(month);
    pairs.push(['monthrange', C.monthrange(y, m)]);
    const d = C.arg(day);
    pairs.push(['weekday', C.weekday(y, m, d)]);
    pairs.push(['leapdays from 2000', C.leapdays(2000n, y)]);
    return { __pyRaw: '{' + pairs.map(([k, v]) => `${C.repr(k)}: ${C.repr(v)}`).join(', ') + '}' };
  },

  // calendar.timegm((year, month, day, hour, minute, second))
  timegm: (...fields) => C.asPy(C.timegm({ __pyTuple: fields.map(C.arg) })),
};
