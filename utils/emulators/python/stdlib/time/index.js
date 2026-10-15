// utils/emulators/python/stdlib/time/index.js
//
// Emulator for the time module hub demo (epoch seconds → UTC text, parse
// and reformat, struct_time fields), on the CPython port in _pytime.js.

import * as T from './_pytime.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default {
  // st = time.gmtime(seconds)
  // time.strftime('%Y-%m-%d %H:%M:%S UTC', st)
  utc: (seconds) => T.strftime('%Y-%m-%d %H:%M:%S UTC', T.gmtime(T.arg(seconds))),

  // st = time.strptime(text, informat)
  // time.strftime(outformat, st)
  reformat: (text, informat, outformat) => T.strftime(outformat, T.strptime(text, informat)),

  // st = time.gmtime(seconds)
  // (st.tm_year, st.tm_yday, ('Mon', ..., 'Sun')[st.tm_wday])
  parts: (seconds) => {
    const st = T.gmtime(T.arg(seconds));
    return T.asPy(T.tuple(T.attr(st, 'tm_year'), T.attr(st, 'tm_yday'), DAYS[Number(T.attr(st, 'tm_wday'))]));
  },
};
