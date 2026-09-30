// utils/emulators/python/stdlib/datetime/combine.js
//
// Emulator for the combine / date() / time() / timetz() demo, on the
// CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // datetime.combine(date.fromisoformat(d), time.fromisoformat(t))
  join: (d, t) => {
    const day = D.dateFromisoformat(d);
    return D.asPy(D.combine(day, D.timeFromisoformat(t)));
  },

  // (dt.date(), dt.time(), dt.timetz())
  split: (when) => {
    const dt = D.dtFromisoformat(when);
    return D.asPy(D.tuple(D.dtDate(dt), D.dtTime(dt), D.dtTimetz(dt)));
  },
};
