// utils/emulators/python/stdlib/re/match-span.js
//
// Emulator for the Match.start / end / span demo tabs, on the engine port
// in _pyre.js.

import * as re from './_pyre.js';
import { PyException } from '../../../../py-exceptions.js';

const found = (m, attr) => {
  if (m === null) throw new PyException('AttributeError', `'NoneType' object has no attribute '${attr}'`);
  return m;
};
const cp = (s) => Array.from(s);

export default {
  span: (pattern, text, group) => {
    const m = found(re.search(pattern, text), 'start');
    return { __pyTuple: [m.start(group), m.end(group), m.span(group)] };
  },
  // (s[:m.start()], s[m.start():m.end()], s[m.end():]) — indexes are code points
  slice: (pattern, text) => {
    const m = found(re.search(pattern, text), 'start');
    const s = cp(text);
    return { __pyTuple: [s.slice(0, m.start()).join(''), s.slice(m.start(), m.end()).join(''), s.slice(m.end()).join('')] };
  },
};
