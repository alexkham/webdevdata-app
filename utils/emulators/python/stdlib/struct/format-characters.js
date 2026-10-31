// utils/emulators/python/stdlib/struct/format-characters.js
//
// Emulator for the format-character demo tabs, on the Modules/_struct.c
// port in _pystruct.js (native mode = Linux x86-64).

import { literalEval } from '../pickle/_pyliteral.js';
import { pack, unpack, calcsize, reprOf } from './_pystruct.js';

export default {
  // value = ast.literal_eval(value); data = struct.pack(fmt, value)
  // (struct.calcsize(fmt), data, struct.unpack(fmt, data)[0])
  char: (fmt, value) => {
    const v = literalEval(value);
    const data = pack(fmt, [v]);
    const size = calcsize(fmt);
    const back = unpack(fmt, data).items[0];
    return { __pyRaw: `(${size}, ${reprOf(data)}, ${reprOf(back)})` };
  },

  // (struct.calcsize('@' + codes), struct.calcsize('=' + codes))
  align: (codes) => {
    const native = calcsize('@' + codes);
    const standard = calcsize('=' + codes);
    return { __pyRaw: `(${native}, ${standard})` };
  },
};
