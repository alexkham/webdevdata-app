// utils/emulators/python/stdlib/calendar/timegm.js
//
// Emulator for the calendar.timegm demo tabs, on the port in _pycalendar.js.
// The round trip adds the result to datetime(1970, 1, 1) with timedelta —
// ported here for int seconds (timedelta's C-int day conversion, its
// ±999999999-day limit and datetime's year range, with CPython's messages).

import * as C from './_pycalendar.js';

const EPOCH_ORD = 719163n;   // date(1970, 1, 1).toordinal()
const MAX_ORD = 3652059n;    // date(9999, 12, 31).toordinal()
const INT_MIN = -(2n ** 31n);
const INT_MAX = 2n ** 31n - 1n;

// datetime.datetime(1970, 1, 1) + datetime.timedelta(seconds=ts), repr'd
function epochPlus(ts) {
  if (!(typeof ts === 'bigint')) {
    C.raise('DemoLimit', 'A float timestamp in the round trip is not reproduced in the browser demo (timedelta rounds it to microseconds).');
  }
  let days = ts / 86400n;
  let secs = ts % 86400n;
  if (secs < 0n) { secs += 86400n; days -= 1n; }
  if (days < INT_MIN || days > INT_MAX) C.raise('OverflowError', 'Python int too large to convert to C int');
  if (days > 999999999n || days < -999999999n) C.raise('OverflowError', `days=${days}; must have magnitude <= 999999999`);
  const ord = EPOCH_ORD + days;
  if (ord < 1n || ord > MAX_ORD) C.raise('OverflowError', 'date value out of range');
  const { y, m, d } = C.ord2ymd(Number(ord));
  const s = Number(secs);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `datetime.datetime(${y}, ${m}, ${d}, ${hh}, ${mm}${ss ? `, ${ss}` : ''})`;
}

const timegm = (fields) => C.timegm({ __pyTuple: fields.map(C.arg) });

export default {
  // calendar.timegm((year, month, day, hour, minute, second))
  tuple: (...fields) => C.asPy(timegm(fields)),

  // ts = calendar.timegm((...)); (ts, datetime.datetime(1970, 1, 1) + datetime.timedelta(seconds=ts))
  roundtrip: (...fields) => {
    const ts = timegm(fields);
    return { __pyRaw: `(${C.repr(ts)}, ${epochPlus(ts)})` };
  },
};
