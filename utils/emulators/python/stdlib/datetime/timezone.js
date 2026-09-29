// utils/emulators/python/stdlib/datetime/timezone.js
//
// Emulator for the timezone class demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

// timezone.__eq__: equal offsets, names ignored
const tzEq = (a, b) => D.tdCmp(a.offset, b.offset) === 0;

export default {
  // tz = timezone(timedelta(hours=…, minutes=…)); (tz, str(tz))
  offset: (hours, minutes) => {
    const tz = D.timezone(D.timedelta({ hours: D.lit(hours), minutes: D.lit(minutes) }));
    return D.asPy(D.tuple(tz, D.str(tz)));
  },

  // dt = fromisoformat(when); naive → replace(tzinfo=utc)
  // dt.astimezone(timezone(timedelta(hours=…))).isoformat()
  convert: (when, hours) => {
    let dt = D.dtFromisoformat(when);
    if (dt.tz === null) dt = D.replace(dt, { tzinfo: D.UTC });
    const tz = D.timezone(D.timedelta({ hours: D.lit(hours) }));
    return D.isoformat(D.astimezone(dt, tz));
  },

  // tz = timezone(timedelta(hours=…), name)
  // (datetime(2026, 9, 29, 12, tzinfo=tz).strftime('%H:%M %Z %z'),
  //  tz == timezone(timedelta(hours=…)))
  named: (hours, name) => {
    const tz = D.timezone(D.timedelta({ hours: D.lit(hours) }), name);
    const text = D.strftime(D.datetime(2026, 9, 29, 12, 0, 0, 0, tz), '%H:%M %Z %z');
    return D.asPy(D.tuple(text, tzEq(tz, D.timezone(D.timedelta({ hours: D.lit(hours) })))));
  },
};
