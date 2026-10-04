// utils/emulators/python/stdlib/uuid/version-variant.js
//
// Emulator for the UUID.version / variant demo tabs.

import { fromStr } from './_pyuuid.js';

export default {
  // (u.version, u.variant)
  vv: (text) => {
    const u = fromStr(text);
    return { __pyTuple: [u.version, u.variant] };
  },
  // (str(u)[14], str(u)[19], u.version)
  digits: (text) => {
    const u = fromStr(text);
    const s = u.str();
    return { __pyTuple: [s[14], s[19], u.version] };
  },
};
