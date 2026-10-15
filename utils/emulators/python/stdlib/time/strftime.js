// utils/emulators/python/stdlib/time/strftime.js
//
// Emulator for the time.strftime demo, on _pytime.js (glibc behaviour for
// the directives beyond the portable set; %z and %Z depend on the machine
// and are refused).

import * as T from './_pytime.js';

// 2026-09-29 14:30:05, a Tuesday, day 272 of the year
const TUESDAY = () => T.tuple(2026n, 9n, 29n, 14n, 30n, 5n, 1n, 272n, 0n);

export default {
  // time.strftime(fmt, (2026, 9, 29, 14, 30, 5, 1, 272, 0))
  format: (fmt) => T.strftime(fmt, TUESDAY()),

  // time.strftime('%Y-%m-%d %H:%M:%S', (year, month, day, hour, minute, second, 0, 1, -1))
  fields: (year, month, day, hour, minute, second) => T.strftime('%Y-%m-%d %H:%M:%S', T.tuple(
    ...[year, month, day, hour, minute, second].map(T.arg), 0n, 1n, -1n,
  )),
};
