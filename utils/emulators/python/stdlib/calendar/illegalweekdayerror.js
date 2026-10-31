// utils/emulators/python/stdlib/calendar/illegalweekdayerror.js
//
// Emulator for the calendar.IllegalWeekdayError demo tabs, on the port in
// _pycalendar.js. Each run gets a fresh module state (firstweekday() == 0),
// which is what the snippets restore in their finally clause.

import * as C from './_pycalendar.js';

export default {
  // try: calendar.setfirstweekday(day); result = calendar.firstweekday()
  // finally: calendar.setfirstweekday(calendar.MONDAY)
  trigger: (day) => {
    const M = C.makeModule();
    M.setfirstweekday(C.arg(day));
    return C.asPy(M.firstweekday());
  },

  // try: calendar.setfirstweekday(day)
  // except calendar.IllegalWeekdayError as e: result = (e.weekday, e.args, str(e))
  // else: result = 'accepted'
  // finally: calendar.setfirstweekday(calendar.MONDAY)
  attributes: (day) => {
    try {
      C.makeModule().setfirstweekday(C.arg(day));
    } catch (e) {
      if (e.pyClass !== 'IllegalWeekdayError') throw e;
      return { __pyRaw: C.repr({ __pyTuple: [e.weekday, { __pyTuple: [e.weekday] }, e.message] }) };
    }
    return 'accepted';
  },
};
