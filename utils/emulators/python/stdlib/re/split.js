// utils/emulators/python/stdlib/re/split.js
//
// Emulator for the re.split demo tabs, on the engine port in _pyre.js.

import * as re from './_pyre.js';

// str.split() with no separator splits on runs of str.isspace() characters
// and drops empty strings — the Unicode \s class is exactly str.isspace()
const strSplit = (s) => re.split('\\s+', s).filter((p) => p !== '');

export default {
  split: (pattern, text) => re.split(pattern, text),
  maxsplit: (pattern, text, maxsplit) => re.split(pattern, text, maxsplit),
  vs: (text) => ({ __pyTuple: [re.split('\\s+', text), strSplit(text)] }),
};
