// utils/emulators/python/stdlib/pickle/highest_protocol-default_protocol.js
//
// Emulator for the protocol-constants demo tabs: one value pickled with
// every protocol 0 … HIGHEST_PROTOCOL (5). On the _pickle.c port in
// _pypickle.js and _pyliteral.js.

import { literalEval } from './_pyliteral.js';
import { dumps, bytesRepr } from './_pypickle.js';

const PROTOCOLS = [0, 1, 2, 3, 4, 5];

export default {
  // value = ast.literal_eval(value)
  // {p: len(pickle.dumps(value, protocol=p)) for p in range(pickle.HIGHEST_PROTOCOL + 1)}
  sizes: (text) => {
    const value = literalEval(text);
    return { __pyRaw: '{' + PROTOCOLS.map((p) => `${p}: ${dumps(value, p).length}`).join(', ') + '}' };
  },

  // {p: pickle.dumps(value, protocol=p) for p in range(pickle.HIGHEST_PROTOCOL + 1)}
  bytes: (text) => {
    const value = literalEval(text);
    return { __pyRaw: '{' + PROTOCOLS.map((p) => `${p}: ${bytesRepr(dumps(value, p))}`).join(', ') + '}' };
  },
};
