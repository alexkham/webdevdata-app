// utils/emulators/python/stdlib/datetime/minyear-maxyear.js
//
// Emulator for the MINYEAR / MAXYEAR demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';
import { cmp } from '../../../../py-num.js';

export default {
  // (MINYEAR <= year <= MAXYEAR, date(year, 1, 1))
  year: (year) => {
    const y = D.lit(year);
    const inRange = cmp({ int: 1n }, y) <= 0 && cmp(y, { int: 9999n }) <= 0;
    return D.asPy(D.tuple(inRange, D.date(y, 1, 1)));
  },

  // date(MAXYEAR, 12, 1) + timedelta(days=days)
  overflow: (days) => D.asPy(D.add(D.date(9999, 12, 1), D.timedelta({ days: D.lit(days) }))),
};
