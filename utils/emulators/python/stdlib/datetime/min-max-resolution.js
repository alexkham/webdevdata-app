// utils/emulators/python/stdlib/datetime/min-max-resolution.js
//
// Emulator for the min / max / resolution demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // (date.min + timedelta(days=days), date.max - timedelta(days=days))
  edges: (days) => {
    const step = D.timedelta({ days: D.lit(days) });
    return D.asPy(D.tuple(D.add(D.DATE_MIN, step), D.sub(D.DATE_MAX, step)));
  },

  // datetime(2026, 9, 29) + datetime.resolution * n
  step: (n) => D.asPy(D.add(D.datetime(2026, 9, 29), D.tdMul(D.RESOLUTION, D.lit(n)))),
};
