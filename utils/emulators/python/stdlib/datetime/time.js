// utils/emulators/python/stdlib/datetime/time.js
//
// Emulator for the time class demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // t = time(hour, minute, second); (t, str(t), t.strftime('%I:%M'))
  construct: (hour, minute, second) => {
    const t = D.time(D.lit(hour), D.lit(minute), D.lit(second));
    return D.asPy(D.tuple(t, D.str(t), D.strftime(t, '%I:%M')));
  },

  // start = datetime.combine(date(2000, 1, 1), time.fromisoformat(t))
  // end = start + timedelta(minutes=…)
  // (end.time(), (end.date() - start.date()).days)
  shift: (t, minutes) => {
    const start = D.combine(D.date(2000, 1, 1), D.timeFromisoformat(t));
    const end = D.add(start, D.timedelta({ minutes: D.lit(minutes) }));
    return D.asPy(D.tuple(D.dtTime(end), D.sub(D.dtDate(end), D.dtDate(start)).days));
  },
};
