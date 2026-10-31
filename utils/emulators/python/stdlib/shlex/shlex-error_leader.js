// utils/emulators/python/stdlib/shlex/shlex-error_leader.js
//
// Emulator for the shlex.error_leader demo tabs, on the CPython port in
// _pyshlex.js.

import { Shlex } from './_pyshlex.js';
import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // for tok in lex: if tok == bad: break
  // lex.error_leader() + f'unexpected {tok!r}'
  leader: (text, bad) => {
    const lex = new Shlex(text.replaceAll('|', '\n'), 'config.txt', true);
    let tok;
    let seen = false;
    for (const t of lex) {
      tok = t;
      seen = true;
      if (t === bad) break;
    }
    if (!seen) throw new PyException('NameError', "name 'tok' is not defined");
    return `${lex.error_leader()}unexpected ${pyStrRepr(tok)}`;
  },

  // [(tok, lex.lineno) for tok in lex]
  lineno: (text) => {
    const lex = new Shlex(text.replaceAll('|', '\n'), null, true);
    const out = [];
    for (const t of lex) out.push(tuple(t, lex.lineno));
    return out;
  },

  // shlex.shlex('').error_leader(name, line)
  explicit: (name, line) => new Shlex('').error_leader(name, line),
};
