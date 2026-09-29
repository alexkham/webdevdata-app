// utils/emulators/python/stdlib/re/compile.js
//
// Emulator for the re.compile demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  compile: (pattern) => {
    const pat = re.compile(pattern);
    return { __pyTuple: [pat, pat.groups, pat.groupindex] };
  },
  reuse: (pattern, values) => {
    const pat = re.compile(pattern, re.SRE_FLAG_IGNORECASE);
    return values.filter((v) => pat.search(v) !== null);
  },
};
