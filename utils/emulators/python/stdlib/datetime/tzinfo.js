// utils/emulators/python/stdlib/datetime/tzinfo.js
//
// Emulator for the tzinfo demo, on the CPython port in _pydatetime.js.
// The `class Fixed(tzinfo)` of the template is modelled by FixedTzinfo.

import * as D from './_pydatetime.js';

export default {
  // class Fixed(tzinfo): utcoffset → timedelta(hours=…), tzname → name, dst → 0
  // dt = datetime(2026, 9, 29, 12, tzinfo=Fixed())
  // (dt.isoformat(), dt.tzname(), dt.astimezone(timezone.utc).isoformat())
  subclass: (hours, name) => {
    // utcoffset() builds its timedelta when first called — by isoformat()
    const offset = D.timedelta({ hours: D.lit(hours) });
    const tz = new D.FixedTzinfo({ offset, name, dst: D.td(0) });
    const dt = D.datetime(2026, 9, 29, 12, 0, 0, 0, tz);
    const iso = D.isoformat(dt);
    return D.asPy(D.tuple(iso, D.tzname(dt), D.isoformat(D.astimezone(dt, D.UTC))));
  },

  // tz = timezone(timedelta(hours=…))
  // utc_fields = datetime.fromisoformat(when).replace(tzinfo=tz)
  // tz.fromutc(utc_fields).isoformat()
  fromutc: (when, hours) => {
    const tz = D.timezone(D.timedelta({ hours: D.lit(hours) }));
    const utcFields = D.replace(D.dtFromisoformat(when), { tzinfo: tz });
    return D.isoformat(D.fromutc(tz, utcFields));
  },
};
