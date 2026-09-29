// utils/emulators/python/stdlib/re/fullmatch.js
//
// Emulator for the re.fullmatch demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  fullmatch: (pattern, text) => re.fullmatch(pattern, text),
  compare: (pattern, text) => ({ __pyTuple: [re.search(pattern, text), re.match(pattern, text), re.fullmatch(pattern, text)] }),
  validate: (pattern, values) => values.filter((v) => re.fullmatch(pattern, v) !== null),
};
