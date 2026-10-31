// utils/emulators/python/stdlib/calendar/month-enum.js
//
// Emulator for the calendar.Month demo tabs, on the port in _pycalendar.js.

import * as C from './_pycalendar.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // m = calendar.Month(n); (m, m.name, m.value, calendar.month_name[m])
  lookup: (n) => {
    const m = C.MonthOf(C.arg(n));
    return C.asPy({ __pyTuple: [m, m.name, m.value, C.month_name(m)] });
  },

  // calendar.Month[name]
  byname: (name) => {
    const m = C.Month.find((x) => x.name === name);
    if (!m) C.raise('KeyError', pyStrRepr(name));
    return C.asPy(m);
  },
};
