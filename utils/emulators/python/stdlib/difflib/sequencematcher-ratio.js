// utils/emulators/python/stdlib/difflib/sequencematcher-ratio.js
//
// Emulator for the SequenceMatcher.ratio / quick_ratio / real_quick_ratio
// demo tabs, on the CPython port in _pydifflib.js.

import { SequenceMatcher, run } from './_pydifflib.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';

const flt = (x) => ({ __pyRaw: pyFloatRepr(x) });

export default {
  // s = difflib.SequenceMatcher(None, a, b)
  // (s.ratio(), s.quick_ratio(), s.real_quick_ratio())
  ratios: (a, b) => run(() => {
    const s = new SequenceMatcher(null, a, b);
    return { __pyTuple: [flt(s.ratio()), flt(s.quick_ratio()), flt(s.real_quick_ratio())] };
  }),

  // (SequenceMatcher(None, a, b).ratio(), SequenceMatcher(None, b, a).ratio())
  order: (a, b) => run(() => ({
    __pyTuple: [flt(new SequenceMatcher(null, a, b).ratio()), flt(new SequenceMatcher(null, b, a).ratio())],
  })),
};
