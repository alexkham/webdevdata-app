// utils/emulators/python/stdlib/re/match-group.js
//
// Emulator for the Match.group demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';
import { PyException } from '../../../../py-exceptions.js';

const found = (m, attr) => {
  if (m === null) throw new PyException('AttributeError', `'NoneType' object has no attribute '${attr}'`);
  return m;
};

export default {
  group: (pattern, text, group) => found(re.search(pattern, text), 'group').group(group),
  many: (pattern, text) => {
    const m = found(re.search(pattern, text), 'group');
    return { __pyTuple: [m.group(1, 2), m.getitem(1), m.getitem(0)] };
  },
};
