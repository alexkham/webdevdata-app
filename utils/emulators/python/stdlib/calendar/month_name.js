// utils/emulators/python/stdlib/calendar/month_name.js
//
// Emulator for the month_name / month_abbr demo tabs (C-locale names), on
// the port in _pycalendar.js.

import * as C from './_pycalendar.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // (calendar.month_name[i], calendar.month_abbr[i])
  lookup: (i) => {
    const k = C.arg(i);
    return { __pyTuple: [C.month_name(k), C.month_abbr(k)] };
  },

  // list(calendar.month_abbr).index(abbr)
  parse: (abbr) => {
    const k = C.NAMES.month_abbr.indexOf(abbr);
    if (k === -1) C.raise('ValueError', `${pyStrRepr(abbr)} is not in list`);
    return BigInt(k);
  },
};
