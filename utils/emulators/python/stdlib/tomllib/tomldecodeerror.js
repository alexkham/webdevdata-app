// utils/emulators/python/stdlib/tomllib/tomldecodeerror.js
//
// Emulator for the tomllib.TOMLDecodeError demo tabs, on the CPython port
// in _pytomllib.js.

import { loads, asPy, joinLines, TOMLDecodeError } from './_pytomllib.js';

export default {
  // tomllib.loads('\n'.join([line1, line2])), uncaught
  trigger: (l1, l2) => asPy(loads(joinLines(l1, l2))),

  // message, _, where = str(e).rpartition(' (at '); (message, where[:-1])
  position: (l1, l2) => {
    try {
      loads(joinLines(l1, l2));
    } catch (e) {
      if (!(e instanceof TOMLDecodeError)) throw e;
      const s = e.message;
      const i = s.lastIndexOf(' (at ');
      const message = i === -1 ? '' : s.slice(0, i);
      const where = i === -1 ? s : s.slice(i + 5);
      return { __pyTuple: [message, where.slice(0, -1)] };
    }
    return 'valid TOML';
  },

  // except ValueError as e: (type(e).__name__, isinstance(e, tomllib.TOMLDecodeError))
  catch: (text) => {
    try {
      loads(text);
    } catch (e) {
      if (e instanceof TOMLDecodeError) return { __pyTuple: ['TOMLDecodeError', true] };
      if (e.name === 'ValueError') return { __pyTuple: ['ValueError', false] };
      throw e;
    }
    return 'parsed fine';
  },
};
