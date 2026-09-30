// utils/emulators/python/stdlib/datetime/timetuple.js
//
// Emulator for the timetuple / utctimetuple demo, on the CPython port in
// _pydatetime.js. StructTime.f holds the nine struct_time fields in order.

import * as D from './_pydatetime.js';

const HOUR = 3;
const MDAY = 2;
const YDAY = 7;
const ISDST = 8;

export default {
  // local, utc = dt.timetuple(), dt.utctimetuple()
  // (local.tm_hour, local.tm_isdst, utc.tm_mday, utc.tm_hour, utc.tm_isdst, local.tm_yday)
  tuple: (when) => {
    const dt = D.dtFromisoformat(when);
    const local = D.timetuple(dt).f;
    const utc = D.utctimetuple(dt).f;
    return D.asPy(D.tuple(local[HOUR], local[ISDST], utc[MDAY], utc[HOUR], utc[ISDST], local[YDAY]));
  },
};
