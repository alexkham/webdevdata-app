// utils/emulators/python/stdlib/calendar/illegalmontherror.js
//
// Emulator for the calendar.IllegalMonthError demo tabs, on the port in
// _pycalendar.js (which raises it with CPython's exact message).

import * as C from './_pycalendar.js';

// `except ValueError as e: return type(e).__name__` — anything that is not
// a ValueError (TypeError, OverflowError …) propagates, as in CPython
function kind(fn) {
  try {
    fn();
  } catch (e) {
    if (e.pyClass === 'IllegalMonthError') return 'IllegalMonthError';
    if (e.name === 'ValueError') return 'ValueError';
    throw e;
  }
  return 'ok';
}

export default {
  // calendar.monthrange(year, month)
  trigger: (year, month) => C.asPy(C.monthrange(C.arg(year), C.arg(month))),

  // try: calendar.monthcalendar(year, month)
  // except calendar.IllegalMonthError as e: result = (e.month, e.args, str(e))
  // else: result = 'valid month'
  attributes: (year, month) => {
    try {
      C.makeModule().monthcalendar(C.arg(year), C.arg(month));
    } catch (e) {
      if (e.pyClass !== 'IllegalMonthError') throw e;
      return { __pyRaw: C.repr({ __pyTuple: [e.month, { __pyTuple: [e.month] }, e.message] }) };
    }
    return 'valid month';
  },

  // (kind(calendar.monthrange, 2026, month), kind(calendar.weekday, 2026, month, 1),
  //  kind(calendar.timegm, (2026, month, 1, 0, 0, 0)))
  who: (month) => {
    const m = C.arg(month);
    const a = kind(() => C.monthrange(2026n, m));
    const b = kind(() => C.weekday(2026n, m, 1n));
    const c = kind(() => C.timegm({ __pyTuple: [2026n, m, 1n, 0n, 0n, 0n] }));
    return { __pyTuple: [a, b, c] };
  },
};
