// utils/emulators/python/stdlib/struct/error.js
//
// Emulator for the struct.error demo tabs, on the Modules/_struct.c port in
// _pystruct.js.

import { literalEval } from '../pickle/_pyliteral.js';
import { pack, unpack, starArgs, fromhex, show } from './_pystruct.js';

export default {
  // struct.pack(fmt, *ast.literal_eval(values))
  trigger: (fmt, values) => show(pack(fmt, starArgs(literalEval(values)))),

  // struct.unpack(fmt, bytes.fromhex(hex))
  unpack: (fmt, hex) => show(unpack(fmt, fromhex(hex))),

  // try: struct.pack(...) except struct.error as e: f'struct.error: {e}'
  handle: (fmt, values) => {
    try {
      pack(fmt, starArgs(literalEval(values)));
    } catch (e) {
      if (e.name !== 'struct.error') throw e;
      return `struct.error: ${e.message}`;
    }
    return 'packed fine';
  },
};
