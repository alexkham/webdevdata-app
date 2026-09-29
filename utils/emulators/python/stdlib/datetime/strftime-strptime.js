// utils/emulators/python/stdlib/datetime/strftime-strptime.js
//
// Emulator for the strftime / strptime demo, on the CPython port in
// _pydatetime.js (strftime: glibc behaviour for non-portable directives;
// strptime: Lib/_strptime.py in the C locale).

import * as D from './_pydatetime.js';

export default {
  // datetime.fromisoformat(when).strftime(fmt)
  format: (when, fmt) => D.strftime(D.dtFromisoformat(when), fmt),

  // datetime.strptime(text, fmt)
  parse: (text, fmt) => D.asPy(D.strptime(text, fmt)),

  // s = datetime.fromisoformat(when).strftime(fmt)
  // (s, datetime.strptime(s, fmt))
  roundtrip: (when, fmt) => {
    const s = D.strftime(D.dtFromisoformat(when), fmt);
    return D.asPy(D.tuple(s, D.strptime(s, fmt)));
  },
};
