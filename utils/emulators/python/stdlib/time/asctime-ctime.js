// utils/emulators/python/stdlib/time/asctime-ctime.js
//
// Emulator for the asctime / ctime demo, on _pytime.js. ctime() itself
// converts with the machine's time zone, so the demo uses asctime() on
// tuples the reader controls and on gmtime() (the UTC twin of ctime).

import * as T from './_pytime.js';

export default {
  // time.asctime((year, month, day, hour, minute, second, weekday, 1, 0))
  fields: (year, month, day, hour, minute, second, weekday) => T.asctime(T.tuple(
    ...[year, month, day, hour, minute, second, weekday].map(T.arg), 1n, 0n,
  )),

  // time.asctime(time.gmtime(seconds))
  utc: (seconds) => T.asctime(T.gmtime(T.arg(seconds))),
};
