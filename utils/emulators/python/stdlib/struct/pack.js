// utils/emulators/python/stdlib/struct/pack.js
//
// Emulator for the struct.pack demo tabs, on the Modules/_struct.c port in
// _pystruct.js (values read with the ast.literal_eval port).

import { literalEval } from '../pickle/_pyliteral.js';
import { pack, starArgs, show, hexOf, numArg } from './_pystruct.js';
import { pyStr } from '../pickle/_pypickle.js';

// an 'auto' demo input: int / float literal, or a str
const autoArg = (v) => (typeof v === 'number' ? numArg(v) : pyStr(v));

export default {
  // values = ast.literal_eval(values); struct.pack(fmt, *values)
  pack: (fmt, values) => show(pack(fmt, starArgs(literalEval(values)))),

  // little = struct.pack('<' + code, value); big = struct.pack('>' + code, value)
  // (little.hex(' '), big.hex(' '))
  order: (code, value) => {
    const v = autoArg(value);
    const little = pack('<' + code, [v]);
    const big = pack('>' + code, [v]);
    return { __pyTuple: [hexOf(little, ' '), hexOf(big, ' ')] };
  },
};
