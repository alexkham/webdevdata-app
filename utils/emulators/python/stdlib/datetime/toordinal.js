// utils/emulators/python/stdlib/datetime/toordinal.js
//
// Emulator for the toordinal / fromordinal demo, on the CPython port in
// _pydatetime.js.

import * as D from './_pydatetime.js';
import { add } from '../../../../py-num.js';

export default {
  // n = date.fromisoformat(when).toordinal(); (n, date.fromordinal(n + k))
  roundtrip: (when, k) => {
    const n = D.toordinal(D.dateFromisoformat(when));
    const target = add({ int: BigInt(n) }, D.lit(k));
    return D.asPy(D.tuple(n, D.dateFromOrdinal(target)));
  },
};
