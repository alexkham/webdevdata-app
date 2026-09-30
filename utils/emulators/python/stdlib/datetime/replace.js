// utils/emulators/python/stdlib/datetime/replace.js
//
// Emulator for the replace demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // datetime.fromisoformat(when).replace(day=day, hour=hour)
  fields: (when, day, hour) => D.asPy(D.replace(D.dtFromisoformat(when), { day: D.lit(day), hour: D.lit(hour) })),

  // naive dt → replace(tzinfo=timezone(timedelta(hours=2)))
  // (dt.replace(tzinfo=UTC).isoformat(), dt.astimezone(UTC).isoformat())
  relabel: (when) => {
    let dt = D.dtFromisoformat(when);
    if (dt.tz === null) dt = D.replace(dt, { tzinfo: D.timezone(D.td(0, 7200)) });
    const relabelled = D.isoformat(D.replace(dt, { tzinfo: D.UTC }));
    return D.asPy(D.tuple(relabelled, D.isoformat(D.astimezone(dt, D.UTC))));
  },
};
