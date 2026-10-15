// utils/emulators/python/stdlib/secrets/choice.js
//
// Emulator for the secrets.choice demo tabs. The picks are really made
// (Web Crypto randomness, CPython's choice / _randbelow algorithm — see
// _pysecrets.js); the tabs show only what is the same for every draw.

import { choice, numArg, PyFloat } from './_pysecrets.js';
import { PyException } from '../../../../py-exceptions.js';

const MAX_PICKS = 100000n;
function picks(nIn, seq) {
  // range(n): an int literal, or a float ('1e+21') that range() rejects
  const n = numArg(nIn);
  if (n instanceof PyFloat) throw new PyException('TypeError', "'float' object cannot be interpreted as an integer");
  const count = n > 0n ? n : 0n;
  // an empty sequence fails on the first pick, however many were asked for
  if (count > 0n) choice(seq);
  if (count > MAX_PICKS) {
    const e = new Error(`${count} picks is too many for the in-browser demo — run it in Python`);
    e.name = 'DemoLimit';
    throw e;
  }
  return Array.from({ length: Number(count) }, () => choice(seq));
}

export default {
  // password = ''.join(secrets.choice(alphabet) for _ in range(length))
  // (len(password), set(password) <= set(alphabet))
  password: (alphabet, length) => {
    const chars = picks(length, alphabet);
    const allowed = new Set([...alphabet]);
    return { __pyTuple: [chars.length, chars.every((c) => allowed.has(c))] };
  },

  // phrase = [secrets.choice(words) for _ in range(n)]
  // (len(phrase), all(w in words for w in phrase))
  passphrase: (words, n) => {
    const phrase = picks(n, words);
    return { __pyTuple: [phrase.length, phrase.every((w) => words.includes(w))] };
  },
};
