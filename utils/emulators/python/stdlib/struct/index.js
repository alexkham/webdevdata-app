// utils/emulators/python/stdlib/struct/index.js
//
// Emulator for the struct module hub demo (pack / unpack / calcsize), on
// the Modules/_struct.c port in _pystruct.js. Values are read with the
// ast.literal_eval port from the pickle demos.

import { literalEval } from '../pickle/_pyliteral.js';
import { pack, unpack, calcsize, starArgs, fromhex, show } from './_pystruct.js';

export default {
  // values = ast.literal_eval(values); struct.pack(fmt, *values)
  pack: (fmt, values) => show(pack(fmt, starArgs(literalEval(values)))),

  // struct.unpack(fmt, bytes.fromhex(hex))
  unpack: (fmt, hex) => show(unpack(fmt, fromhex(hex))),

  // struct.calcsize(fmt)
  calcsize: (fmt) => ({ __pyRaw: String(calcsize(fmt)) }),
};
