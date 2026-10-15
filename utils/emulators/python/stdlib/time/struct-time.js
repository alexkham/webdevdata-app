// utils/emulators/python/stdlib/time/struct-time.js
//
// Emulator for the time.struct_time demo, on _pytime.js.

import * as T from './_pytime.js';

export default {
  // st = time.gmtime(seconds)
  // (st[0], st.tm_year, st[:3], len(st))
  access: (seconds) => {
    const st = T.gmtime(T.arg(seconds));
    return T.asPy(T.tuple(T.index(st, 0), T.attr(st, 'tm_year'), T.tuple(...T.visible(st).slice(0, 3)), BigInt(T.visible(st).length)));
  },

  // time.struct_time((year, month, day, 0, 0, 0, 0, 1, -1))
  build: (year, month, day) => T.asPy(T.structTime(T.tuple(
    ...[year, month, day].map(T.arg), 0n, 0n, 0n, 0n, 1n, -1n,
  ))),
};
