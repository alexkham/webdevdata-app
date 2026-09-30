// utils/emulators/python/stdlib/datetime/fromtimestamp.js
//
// Emulator for the fromtimestamp demo, on the CPython port in
// _pydatetime.js (gmtime path; out-of-range years follow glibc).

import * as D from './_pydatetime.js';

export default {
  // datetime.fromtimestamp(ts, timezone(timedelta(hours=…))).isoformat()
  convert: (ts, hours) => {
    const t = D.lit(ts);
    const tz = D.timezone(D.timedelta({ hours: D.lit(hours) }));
    return D.isoformat(D.fromtimestamp(t, tz));
  },
};
