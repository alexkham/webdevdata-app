// utils/emulators/python/stdlib/time/gmtime.js
//
// Emulator for the time.gmtime demo, on the CPython port in _pytime.js
// (glibc's range: years that fit a C int).

import * as T from './_pytime.js';
import { PyFloat, trueDiv } from '../datetime/_pydatetime.js';

// ms / 1000
function perThousand(ms) {
  const n = T.asNum(ms);
  if (n === null) return T.raise('TypeError', `unsupported operand type(s) for /: '${T.typeName(ms)}' and 'int'`);
  return new PyFloat(n.int !== undefined ? trueDiv(n.int, 1000n) : n.float / 1000);
}

export default {
  // time.gmtime(seconds)
  struct: (seconds) => T.asPy(T.gmtime(T.arg(seconds))),

  // ms = ...  # e.g. JavaScript Date.now()
  // time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ms / 1000))
  ms: (ms) => T.strftime('%Y-%m-%d %H:%M:%S', T.gmtime(perThousand(T.arg(ms)))),

  // calendar.timegm(time.gmtime(seconds))
  inverse: (seconds) => T.asPy(T.timegm(T.gmtime(T.arg(seconds)))),
};
