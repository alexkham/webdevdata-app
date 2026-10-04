// utils/emulators/python/stdlib/uuid/uuid-class.js
//
// Emulator for the uuid.UUID class demo tabs, on the port in _pyuuid.js.

import { UUID, fromStr } from './_pyuuid.js';

export default {
  // uuid.UUID(text)
  hex: (text) => fromStr(text).toPy(),
  // uuid.UUID(text, version=version)
  version: (text, version) => new UUID({ hex: text, version: BigInt(version) }).toPy(),
  // a = UUID(a); b = UUID(b); (a == b, a < b, str(a) == b)
  compare: (a, b) => {
    const ua = fromStr(a);
    const ub = fromStr(b);
    return { __pyTuple: [ua.int === ub.int, ua.int < ub.int, ua.str() === b] };
  },
};
