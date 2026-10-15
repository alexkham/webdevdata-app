// utils/emulators/python/stdlib/time/struct-time-attributes.js
//
// Emulator for the struct_time attributes demo, on _pytime.js. tm_zone of
// a gmtime() result is left out: it is 'UTC' on Windows and macOS but
// 'GMT' on Linux.

import * as T from './_pytime.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default {
  // st = time.gmtime(seconds)
  // (st.tm_wday, st.tm_yday, st.tm_isdst, st.tm_gmtoff)
  fields: (seconds) => {
    const st = T.gmtime(T.arg(seconds));
    return T.asPy(T.tuple(...['tm_wday', 'tm_yday', 'tm_isdst', 'tm_gmtoff'].map((k) => T.attr(st, k))));
  },

  // st = time.gmtime(seconds)
  // days = ['Monday', ..., 'Sunday']
  // (days[st.tm_wday], st.tm_mon, st.tm_mday)
  names: (seconds) => {
    const st = T.gmtime(T.arg(seconds));
    return T.asPy(T.tuple(DAYS[Number(T.attr(st, 'tm_wday'))], T.attr(st, 'tm_mon'), T.attr(st, 'tm_mday')));
  },
};
