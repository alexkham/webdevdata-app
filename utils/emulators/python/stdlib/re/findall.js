// utils/emulators/python/stdlib/re/findall.js
//
// Emulator for the re.findall demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

const typeName = (x) => (typeof x === 'string' ? 'str' : 'tuple');

export default {
  findall: (pattern, text) => re.findall(pattern, text),
  groups: (pattern, text) => {
    const found = re.findall(pattern, text);
    return { __pyTuple: [found, found.map(typeName)] };
  },
  pos: (pattern, text, pos, endpos) => re.compile(pattern).findall(text, pos, endpos),
};
