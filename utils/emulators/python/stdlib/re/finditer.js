// utils/emulators/python/stdlib/re/finditer.js
//
// Emulator for the re.finditer demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  spans: (pattern, text) => re.finditer(pattern, text).map((m) => ({ __pyTuple: [m.group(), m.span()] })),
  named: (pattern, text) => re.finditer(pattern, text).map((m) => m.groupdict()),
};
