// utils/emulators/python/stdlib/re/match-groups.js
//
// Emulator for the Match.groups / Match.groupdict demo tabs, on the engine
// port in _pyre.js.

import * as re from './_pyre.js';
import { PyException } from '../../../../py-exceptions.js';

const found = (m, attr) => {
  if (m === null) throw new PyException('AttributeError', `'NoneType' object has no attribute '${attr}'`);
  return m;
};

export default {
  groups: (pattern, text) => {
    const m = found(re.search(pattern, text), 'groups');
    return { __pyTuple: [m.groups(), m.groups('')] };
  },
  groupdict: (pattern, text) => found(re.search(pattern, text), 'groupdict').groupdict(),
};
