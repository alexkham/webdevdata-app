// utils/emulators/python/stdlib/re/search.js
//
// Emulator for the re.search demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  search: (pattern, text) => re.search(pattern, text),
  compare: (pattern, text) => ({ __pyTuple: [re.search(pattern, text), re.match(pattern, text), re.fullmatch(pattern, text)] }),
  pos: (pattern, text, pos) => re.compile(pattern).search(text, pos),
};
