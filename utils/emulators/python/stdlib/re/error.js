// utils/emulators/python/stdlib/re/error.js
//
// Emulator for the re.error (re.PatternError) demo tabs, on the engine
// port in _pyre.js — messages and positions come from the ported parser.

import * as re from './_pyre.js';

export default {
  trigger: (pattern) => re.compile(pattern),
  where: (pattern) => {
    try {
      re.compile(pattern);
    } catch (e) {
      if (!(e instanceof re.PatternError)) throw e;
      return { __pyTuple: [e.msg, e.pos, e.lineno, e.colno] };
    }
    return 'valid pattern';
  },
  handle: (pattern, text) => {
    try {
      return re.findall(pattern, text);
    } catch (e) {
      if (!(e instanceof re.PatternError)) throw e;
      return `invalid pattern: ${e.message}`;
    }
  },
};
