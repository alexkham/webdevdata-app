// utils/emulators/python/stdlib/datetime/timestamp.js
//
// Emulator for the timestamp() demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // dt = datetime.fromisoformat(when)
  // dt.timestamp() if dt.tzinfo else 'naive: timestamp() would use local time'
  epoch: (when) => {
    const dt = D.dtFromisoformat(when);
    return dt.tz ? D.asPy(D.timestamp(dt)) : 'naive: timestamp() would use local time';
  },
};
