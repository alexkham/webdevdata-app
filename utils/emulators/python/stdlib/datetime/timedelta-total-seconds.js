// utils/emulators/python/stdlib/datetime/timedelta-total-seconds.js
//
// Emulator for the timedelta fields / total_seconds demo, on the CPython
// port in _pydatetime.js.

import * as D from './_pydatetime.js';

const div = (f, n) => D.pyFloat(f.v / n); // float / int: IEEE division, as in CPython

export default {
  // d = timedelta(hours=…, minutes=…)
  // (d.days, d.seconds, d.microseconds, d.total_seconds())
  fields: (hours, minutes) => {
    const d = D.timedelta({ hours: D.lit(hours), minutes: D.lit(minutes) });
    return D.asPy(D.tuple(d.days, d.seconds, d.us, D.tdTotalSeconds(d)));
  },

  // d = end - start; s = d.total_seconds(); (s, s / 60, s / 3600, d.seconds)
  elapsed: (start, end) => {
    const e = D.dtFromisoformat(end);
    const d = D.sub(e, D.dtFromisoformat(start));
    const s = D.tdTotalSeconds(d);
    return D.asPy(D.tuple(s, div(s, 60), div(s, 3600), d.seconds));
  },
};
