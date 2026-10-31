// utils/emulators/python/stdlib/shlex/shlex-get_token.js
//
// Emulator for the get_token / push_token / read_token demo tabs, on the
// CPython port in _pyshlex.js.

import { Shlex } from './_pyshlex.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // while (tok := lex.get_token()) is not None: tokens.append(tok)
  loop: (text) => {
    const lex = new Shlex(text, null, true);
    const tokens = [];
    for (let tok = lex.get_token(); tok !== null; tok = lex.get_token()) tokens.push(tok);
    return tokens;
  },

  // first = get_token(); next_tok = get_token(); push_token(next_tok); (first, next_tok, list(lex))
  peek: (text) => {
    const lex = new Shlex(text, null, true);
    const first = lex.get_token();
    const nextTok = lex.get_token();
    lex.push_token(nextTok);
    return tuple(first, nextTok, [...lex]);
  },

  // lex.push_token(token); list(lex)
  push: (text, token) => {
    const lex = new Shlex(text, null, true);
    lex.push_token(token);
    return [...lex];
  },

  // lex = shlex.shlex(text); lex.push_token('pushed'); (read_token(), get_token(), get_token())
  read: (text) => {
    const lex = new Shlex(text);
    lex.push_token('pushed');
    const a = lex.read_token();
    const b = lex.get_token();
    const c = lex.get_token();
    return tuple(a, b, c);
  },
};
