// utils/emulators/python/stdlib/shlex/shlex-push_source.js
//
// Emulator for the push_source / pop_source / sourcehook demo tabs, on
// the CPython port in _pyshlex.js. The 'source' tab's snippet writes
// extra.txt first; the port's sourcehook opens it from that one-file map
// (any other name is FileNotFoundError, as in the empty temp folder).

import { Shlex } from './_pyshlex.js';

export default {
  // first = lex.get_token(); lex.push_source(inserted); [first] + list(lex)
  push: (text, inserted) => {
    const lex = new Shlex(text, null, true);
    const first = lex.get_token();
    lex.push_source(inserted);
    return [first, ...lex];
  },

  // lex.push_source(inner); first = lex.get_token(); lex.pop_source(); [first] + list(lex)
  pop: (outer, inner) => {
    const lex = new Shlex(outer, null, true);
    lex.push_source(inner);
    const first = lex.get_token();
    lex.pop_source();
    return [first, ...lex];
  },

  // extra.txt holds `included`; lex.source = 'source'; list(lex)
  source: (included, text) => {
    const lex = new Shlex(text, null, true, false, { files: { 'extra.txt': included } });
    lex.whitespace_split = true;
    lex.source = 'source';
    return [...lex];
  },
};
