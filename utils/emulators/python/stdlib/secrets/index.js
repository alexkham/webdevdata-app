// utils/emulators/python/stdlib/secrets/index.js
//
// Emulator for the secrets module hub demo. Tokens are really generated
// (Web Crypto, see _pysecrets.js) and only their lengths are shown; the
// "why not random" tab runs the exact MT19937 port from the random engine.

import { tokenBytes, tokenHex, tokenUrlsafe, compareDigest } from './_pysecrets.js';
import { PyRandom, lit } from '../random/_pyrandom.js';

export default {
  // [len(token_bytes(n)), len(token_hex(n)), len(token_urlsafe(n))]
  tokens: (n) => [tokenBytes(n).length, tokenHex(n).length, tokenUrlsafe(n).length],

  // rng = random.Random(seed); [rng.randint(0, 999_999) for _ in range(3)]
  predictable: (seed) => {
    const rng = new PyRandom(lit(seed));
    return Array.from({ length: 3 }, () => rng.randint(0n, 999999n));
  },

  // secrets.compare_digest(a, b)
  compare: (a, b) => compareDigest(a, b),
};
