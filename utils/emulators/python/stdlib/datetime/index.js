// utils/emulators/python/stdlib/datetime/index.js
//
// Emulator for the datetime module hub demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // start = datetime.fromisoformat(start)
  // (start + timedelta(days=days, hours=hours)).isoformat()
  shift: (start, days, hours) => {
    const s = D.dtFromisoformat(start);
    const delta = D.timedelta({ days: D.lit(days), hours: D.lit(hours) });
    return D.isoformat(D.add(s, delta));
  },

  // delta = date.fromisoformat(end) - date.fromisoformat(start)
  // (delta.days, str(delta))
  between: (start, end) => {
    const e = D.dateFromisoformat(end);
    const delta = D.sub(e, D.dateFromisoformat(start));
    return D.asPy(D.tuple(delta.days, D.str(delta)));
  },

  // datetime.fromisoformat(when).strftime(fmt)
  format: (when, fmt) => D.strftime(D.dtFromisoformat(when), fmt),
};
