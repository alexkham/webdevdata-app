// utils/emulators/python/stdlib/datetime/isocalendar.js
//
// Emulator for the isocalendar / fromisocalendar demo, on the CPython port
// in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // d = date.fromisoformat(when); (d.year, d.isocalendar())
  week: (when) => {
    const d = D.dateFromisoformat(when);
    return D.asPy(D.tuple(d.y, D.isocalendar(d)));
  },

  // date.fromisocalendar(year, week, day)
  build: (year, week, day) => D.asPy(D.fromisocalendar(D.lit(year), D.lit(week), D.lit(day))),
};
