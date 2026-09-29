// utils/emulators/python/stdlib/re/flags.js
//
// Emulator for the re flags demo tabs: each tab runs findall without and
// with one flag, on the engine port in _pyre.js.

import * as re from './_pyre.js';

const both = (flag) => (pattern, text) => ({ __pyTuple: [re.findall(pattern, text), re.findall(pattern, text, flag)] });

export default {
  ignorecase: both(re.SRE_FLAG_IGNORECASE),
  multiline: both(re.SRE_FLAG_MULTILINE),
  dotall: both(re.SRE_FLAG_DOTALL),
  verbose: both(re.SRE_FLAG_VERBOSE),
  ascii: both(re.SRE_FLAG_ASCII),
};
