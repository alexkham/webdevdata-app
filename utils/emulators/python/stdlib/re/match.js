// utils/emulators/python/stdlib/re/match.js
//
// Emulator for the re.match demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  match: (pattern, text) => re.match(pattern, text),
  compare: (pattern, text) => ({ __pyTuple: [re.search(pattern, text), re.match(pattern, text), re.fullmatch(pattern, text)] }),
  multiline: (pattern, text) => ({ __pyTuple: [re.match(pattern, text, re.SRE_FLAG_MULTILINE), re.findall(pattern, text, re.SRE_FLAG_MULTILINE)] }),
};
