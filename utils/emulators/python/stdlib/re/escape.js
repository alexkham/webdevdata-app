// utils/emulators/python/stdlib/re/escape.js
//
// Emulator for the re.escape demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

export default {
  escape: (text) => re.escape(text),
  literal: (needle, text) => ({ __pyTuple: [re.findall(needle, text), re.findall(re.escape(needle), text)] }),
};
