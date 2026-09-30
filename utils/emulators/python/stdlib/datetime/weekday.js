// utils/emulators/python/stdlib/datetime/weekday.js
//
// Emulator for the weekday / isoweekday demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // (d.weekday(), d.isoweekday(), d.strftime('%w'), d.strftime('%A'))
  numbers: (when) => {
    const d = D.dateFromisoformat(when);
    return D.asPy(D.tuple(D.weekday(d), D.isoweekday(d), D.strftime(d, '%w'), D.strftime(d, '%A')));
  },
};
