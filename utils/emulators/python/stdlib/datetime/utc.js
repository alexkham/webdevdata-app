// utils/emulators/python/stdlib/datetime/utc.js
//
// Emulator for the UTC / timezone.utc demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // dt = fromisoformat(when); naive → replace(tzinfo=UTC), aware → astimezone(UTC)
  // (dt.isoformat(), dt.tzinfo is UTC)
  attach: (when) => {
    let dt = D.dtFromisoformat(when);
    dt = dt.tz === null ? D.replace(dt, { tzinfo: D.UTC }) : D.astimezone(dt, D.UTC);
    return D.asPy(D.tuple(D.isoformat(dt), dt.tz === D.UTC));
  },
};
