// utils/emulators/python/stdlib/re/pattern-object.js
//
// Emulator for the re.Pattern demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  attrs: (pattern) => {
    const p = re.compile(pattern);
    return { __pyTuple: [p.pattern, p.flags, p.groups, p.groupindex] };
  },
  // [m.group() for m in iter(sc.match, None)]
  scanner: (pattern, text) => {
    const sc = re.compile(pattern).scanner(text);
    const out = [];
    for (let m = sc.match(); m !== null; m = sc.match()) out.push(m.group());
    return out;
  },
};
