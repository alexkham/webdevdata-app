// utils/emulators/python/stdlib/typing/index.js
//
// Emulator for the typing hub demo, on the CPython port in _pytyping.js.

import { autoValue, demo } from './_pytyping.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';

export default {
  // def double(x: int) -> int:
  //     return x * 2
  // double({$x})          — the annotation is never checked
  ignored: (x) => {
    const v = autoValue(x, ['double']);
    if (v.kind === 'int') return { __pyRaw: (v.v * 2n).toString() };
    if (v.kind === 'float') return { __pyRaw: pyFloatRepr(v.v * 2) };
    return { __pyRaw: pyStrRepr(v.v.repeat(2)) };
  },
  evaluate: demo.evaluate,
};
