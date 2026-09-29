// utils/emulators/python/stdlib/datetime/datetime.js
//
// Emulator for the datetime class demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // datetime(year, month, day, hour, minute)
  construct: (year, month, day, hour, minute) => D.asPy(D.datetime(...[year, month, day, hour, minute].map(D.lit))),

  // (a == b, a < b)
  compare: (a, b) => {
    const x = D.dtFromisoformat(a);
    const y = D.dtFromisoformat(b);
    return D.asPy(D.tuple(D.compare(x, y, '=='), D.compare(x, y, '<')));
  },

  // datetime.fromisoformat(a) - datetime.fromisoformat(b)
  subtract: (a, b) => {
    const x = D.dtFromisoformat(a);
    return D.asPy(D.sub(x, D.dtFromisoformat(b)));
  },
};
