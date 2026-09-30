// utils/emulators/python/stdlib/datetime/time-attributes.js
//
// Emulator for the hour / minute / second / microsecond / tzinfo / fold
// demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // dt = datetime.fromisoformat(when)
  // (dt.hour, dt.minute, dt.second, dt.microsecond, dt.tzinfo, dt.fold)
  fields: (when) => {
    const dt = D.dtFromisoformat(when);
    return D.asPy(D.tuple(dt.h, dt.mi, dt.s, dt.us, dt.tz, dt.fold));
  },

  // t = time.fromisoformat(t); (t.microsecond, t.microsecond // 1000)
  millis: (text) => {
    const t = D.timeFromisoformat(text);
    return D.asPy(D.tuple(t.us, Math.floor(t.us / 1000)));
  },
};
