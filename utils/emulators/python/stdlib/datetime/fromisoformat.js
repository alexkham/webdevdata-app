// utils/emulators/python/stdlib/datetime/fromisoformat.js
//
// Emulator for the fromisoformat / isoformat demo, on the CPython port in
// _pydatetime.js (the C parser of Modules/_datetimemodule.c).

import * as D from './_pydatetime.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  // datetime.fromisoformat(text)
  parse: (text) => D.asPy(D.dtFromisoformat(text)),

  // try date.fromisoformat(text), on ValueError time.fromisoformat(text)
  classes: (text) => {
    try {
      return D.asPy(D.dateFromisoformat(text));
    } catch (e) {
      if (!(e instanceof PyException) || e.name !== 'ValueError') throw e;
      return D.asPy(D.timeFromisoformat(text));
    }
  },

  // datetime.fromisoformat(when).isoformat(sep, timespec)
  format: (when, sep, timespec) => D.dtIsoformat(D.dtFromisoformat(when), sep, timespec),

  // dt = datetime.fromisoformat(when); text = dt.isoformat()
  // (text, datetime.fromisoformat(text) == dt)
  roundtrip: (when) => {
    const dt = D.dtFromisoformat(when);
    const text = D.isoformat(dt);
    return D.asPy(D.tuple(text, D.compare(D.dtFromisoformat(text), dt, '==')));
  },
};
