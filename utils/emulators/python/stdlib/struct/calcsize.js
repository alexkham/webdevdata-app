// utils/emulators/python/stdlib/struct/calcsize.js
//
// Emulator for the struct.calcsize demo tabs, on the Modules/_struct.c port
// in _pystruct.js (native mode = Linux x86-64).

import { calcsize } from './_pystruct.js';

export default {
  // struct.calcsize(fmt)
  size: (fmt) => ({ __pyRaw: String(calcsize(fmt)) }),

  // (struct.calcsize('@' + codes), struct.calcsize('=' + codes))
  compare: (codes) => {
    const native = calcsize('@' + codes);
    const standard = calcsize('=' + codes);
    return { __pyRaw: `(${native}, ${standard})` };
  },
};
