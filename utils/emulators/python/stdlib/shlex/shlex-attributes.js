// utils/emulators/python/stdlib/shlex/shlex-attributes.js
//
// Emulator for the shlex attributes demo tabs (commenters, wordchars,
// quotes, whitespace, escape), on the CPython port in _pyshlex.js.

import { Shlex } from './_pyshlex.js';

function lexer(text, split, set) {
  const lex = new Shlex(text, null, true);
  if (split) lex.whitespace_split = true;
  set(lex);
  return [...lex];
}

export default {
  // whitespace_split = True; commenters = commenters
  commenters: (text, commenters) => lexer(text, true, (l) => { l.commenters = commenters; }),

  // wordchars += extra
  wordchars: (text, extra) => lexer(text, false, (l) => { l.wordchars += extra; }),

  // whitespace_split = True; quotes = quotes
  quotes: (text, quotes) => lexer(text, true, (l) => { l.quotes = quotes; }),

  // whitespace = ws; whitespace_split = True
  whitespace: (text, ws) => lexer(text, true, (l) => { l.whitespace = ws; }),

  // whitespace_split = True; escape = escape
  escape: (text, escape) => lexer(text, true, (l) => { l.escape = escape; }),
};
