// utils/emulators/python/stdlib/time/strptime.js
//
// Emulator for the time.strptime demo, on _pytime.js (which builds the
// struct_time from the Lib/_strptime.py port shared with datetime).

import * as T from './_pytime.js';

export default {
  // time.strptime(text, fmt)
  parse: (text, fmt) => T.asPy(T.strptime(text, fmt)),

  // st = time.strptime(text, '%Y-%m-%d %H:%M %z')
  // (st.tm_hour, st.tm_gmtoff, st.tm_isdst)
  offset: (text) => {
    const st = T.strptime(text, '%Y-%m-%d %H:%M %z');
    return T.asPy(T.tuple(T.attr(st, 'tm_hour'), T.attr(st, 'tm_gmtoff'), T.attr(st, 'tm_isdst')));
  },

  // time.strptime(text)  # default format '%a %b %d %H:%M:%S %Y'
  ctime: (text) => T.asPy(T.strptime(text)),
};
