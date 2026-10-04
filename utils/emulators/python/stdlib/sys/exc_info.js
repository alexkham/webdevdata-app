// utils/emulators/python/stdlib/sys/exc_info.js
//
// Emulator for the sys.exc_info / sys.exception demo: int(text) either
// succeeds (nothing is being handled: exc_info() is three Nones) or raises
// ValueError, which the except block sees through exc_info() and exception().

import { PyException } from '../../../../py-exceptions.js';
import { intFromStr } from './_pysys.js';

export default {
  parse: (text) => {
    let n;
    try {
      n = intFromStr(text);
    } catch (e) {
      if (!(e instanceof PyException) || e.name !== 'ValueError') throw e;
      return { __pyTuple: ['ValueError', e.message, true] };
    }
    return { __pyTuple: [{ __pyRaw: String(n) }, { __pyTuple: [null, null, null] }] };
  },
};
