// utils/emulators/python/stdlib/datetime/utcoffset-tzname-dst.js
//
// Emulator for the utcoffset / tzname / dst demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';
import { raise } from '../../../../py-exceptions.js';

export default {
  // dt = datetime.fromisoformat(when); (dt.utcoffset(), dt.tzname(), dt.dst())
  ask: (when) => {
    const dt = D.dtFromisoformat(when);
    return D.asPy(D.tuple(D.utcoffset(dt), D.tzname(dt), D.dst(dt)));
  },

  // off = datetime.fromisoformat(when).utcoffset(); off.total_seconds() / 3600
  hours: (when) => {
    const off = D.utcoffset(D.dtFromisoformat(when));
    if (off === null) raise('AttributeError', "'NoneType' object has no attribute 'total_seconds'");
    return D.asPy(D.pyFloat(D.tdTotalSeconds(off).v / 3600));
  },
};
