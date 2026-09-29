// utils/emulators/python/stdlib/datetime/date.js
//
// Emulator for the date class demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // d = date(year, month, day); (d, d.isoformat(), d.strftime('%A'))
  construct: (year, month, day) => {
    const d = D.date(D.lit(year), D.lit(month), D.lit(day));
    return D.asPy(D.tuple(d, D.isoformat(d), D.strftime(d, '%A')));
  },

  // start = date.fromisoformat(start); end = start + timedelta(days=days)
  // (end, end - start, end > start)
  arith: (start, days) => {
    const s = D.dateFromisoformat(start);
    const end = D.add(s, D.timedelta({ days: D.lit(days) }));
    return D.asPy(D.tuple(end, D.sub(end, s), D.compare(end, s, '>')));
  },
};
