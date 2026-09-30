// utils/emulators/python/stdlib/datetime/today-now.js
//
// Emulator for the now(tz) demo, on the CPython port in _pydatetime.js.
// The template only reads what does not depend on the clock: the aware
// result's utcoffset() and tzname(), which come from tz.

import * as D from './_pydatetime.js';

export default {
  // now = datetime.now(timezone(timedelta(hours=…))); (now.utcoffset(), now.tzname())
  zone: (hours) => {
    const tz = D.timezone(D.timedelta({ hours: D.lit(hours) }));
    return D.asPy(D.tuple(tz.offset, D.str(tz)));
  },
};
