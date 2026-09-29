// utils/emulators/python/stdlib/datetime/date-attributes.js
//
// Emulator for the date.year / month / day demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // d = datetime.fromisoformat(when)
  // (d.year, d.month, d.day, f'{d.day}.{d.month}.{d.year}')
  fields: (when) => {
    const d = D.dtFromisoformat(when);
    return D.asPy(D.tuple(d.y, d.m, d.d, `${d.d}.${d.m}.${d.y}`));
  },
};
