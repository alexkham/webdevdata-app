// utils/emulators/python/stdlib/datetime/ctime.js
//
// Emulator for the ctime demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';

export default {
  // datetime.fromisoformat(when).ctime()
  text: (when) => D.ctime(D.dtFromisoformat(when)),
};
