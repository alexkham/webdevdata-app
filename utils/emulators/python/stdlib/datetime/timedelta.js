// utils/emulators/python/stdlib/datetime/timedelta.js
//
// Emulator for the timedelta demo, on the CPython port in _pydatetime.js.

import * as D from './_pydatetime.js';
import { raise } from '../../../../py-exceptions.js';

// a 'float' demo input is always written as a float literal; inf/-inf are
// not literals but names, which do not exist
const floatArg = (x) => {
  if (!Number.isFinite(x)) raise('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
  return D.pyFloat(x);
};

export default {
  // d = timedelta(days=…, hours=…, minutes=…, seconds=…); (d, str(d))
  normalize: (days, hours, minutes, seconds) => {
    const d = D.timedelta({ days: D.lit(days), hours: D.lit(hours), minutes: D.lit(minutes), seconds: D.lit(seconds) });
    return D.asPy(D.tuple(d, D.str(d)));
  },

  // (total / step, total // step, total % step)
  divide: (hours, minutes) => {
    const total = D.timedelta({ hours: D.lit(hours) });
    const step = D.timedelta({ minutes: D.lit(minutes) });
    return D.asPy(D.tuple(D.tdTrueDiv(total, step), D.tdFloorDiv(total, step), D.tdMod(total, step)));
  },

  // timedelta(minutes=minutes) * factor
  scale: (minutes, factor) => {
    const d = D.timedelta({ minutes: D.lit(minutes) });
    return D.asPy(D.tdMul(d, floatArg(factor)));
  },
};
