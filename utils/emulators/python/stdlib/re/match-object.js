// utils/emulators/python/stdlib/re/match-object.js
//
// Emulator for the re.Match attribute demo tabs, on the engine port in
// _pyre.js.

import * as re from './_pyre.js';
import { PyException } from '../../../../py-exceptions.js';

const need = (m, attr) => {
  if (m === null) throw new PyException('AttributeError', `'NoneType' object has no attribute '${attr}'`);
  return m;
};

export default {
  attrs: (pattern, text) => {
    const m = need(re.search(pattern, text), 'lastindex');
    return { __pyTuple: [m.lastindex, m.lastgroup, m.regs] };
  },
  scan: (pattern, text, pos, endpos) => {
    const m = need(re.compile(pattern).search(text, pos, endpos), 'pos');
    return { __pyTuple: [m, m.pos, m.endpos, m.re, m.string] };
  },
};
