// utils/emulators/python/stdlib/pickle/opcodes.js
//
// Emulator for the opcode-constants demo tabs: pickletools.genops and
// pickletools.dis over what pickle.dumps writes. On the _pickle.c port and
// the genops/dis port in _pypickle.js, and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, genops, dis, pyRepr } from './_pypickle.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // [(op.name, arg) for op, arg, pos in pickletools.genops(data)]
  ops: (text, protocol) => {
    const data = dumps(literalEval(text), protocol);
    const items = genops(data).map((o) => `(${pyStrRepr(o.info.name)}, ${o.arg === null ? 'None' : pyRepr(o.arg)})`);
    return { __pyRaw: '[' + items.join(', ') + ']' };
  },

  // out = io.StringIO(); pickletools.dis(data, out); out.getvalue().splitlines()
  dis: (text, protocol) => {
    const data = dumps(literalEval(text), protocol);
    return { __pyRaw: '[' + dis(data).map(pyStrRepr).join(', ') + ']' };
  },
};
