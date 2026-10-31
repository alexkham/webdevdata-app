// utils/emulators/python/stdlib/struct/struct.js
//
// Emulator for the struct.Struct demo tabs, on the Modules/_struct.c port
// in _pystruct.js. repr(Struct) is the 3.13 form, Struct('<hi').

import { literalEval } from '../pickle/_pyliteral.js';
import { Struct, starArgs, fromhex, reprOf } from './_pystruct.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // s = struct.Struct(fmt); data = s.pack(*ast.literal_eval(values))
  // (s, s.size, data, s.unpack(data))
  compile: (fmt, values) => {
    const s = new Struct(fmt);
    const data = s.pack(starArgs(literalEval(values), 'Struct.pack()'));
    return { __pyRaw: `(${s.repr(pyStrRepr)}, ${s.size}, ${reprOf(data)}, ${reprOf(s.unpack(data))})` };
  },

  // s = struct.Struct(fmt); data = bytes.fromhex(hex)
  // (s.format, s.size, list(s.iter_unpack(data)))
  methods: (fmt, hex) => {
    const s = new Struct(fmt);
    const rows = s.iterUnpack(fromhex(hex));
    return { __pyRaw: `(${pyStrRepr(s.format)}, ${s.size}, [${rows.map(reprOf).join(', ')}])` };
  },
};
