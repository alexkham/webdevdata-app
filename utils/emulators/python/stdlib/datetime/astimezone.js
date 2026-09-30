// utils/emulators/python/stdlib/datetime/astimezone.js
//
// Emulator for the astimezone demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';
import { raise } from '../../../../py-exceptions.js';

export default {
  // dt = datetime.fromisoformat(when); naive → ValueError (template guard)
  // local = dt.astimezone(timezone(timedelta(hours=…)))
  // (local.isoformat(), local == dt)
  convert: (when, hours) => {
    const dt = D.dtFromisoformat(when);
    if (dt.tz === null) raise('ValueError', 'give the timestamp an offset, e.g. Z or +02:00');
    const local = D.astimezone(dt, D.timezone(D.timedelta({ hours: D.lit(hours) })));
    return D.asPy(D.tuple(D.isoformat(local), D.compare(local, dt, '==')));
  },
};
