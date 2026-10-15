// utils/emulators/python/stdlib/secrets/compare_digest.js
//
// Emulator for the secrets.compare_digest demo tabs: hmac.compare_digest's
// rules (see _pysecrets.js) and, for the signature tab,
// HMAC-SHA256 from the hashlib engine (hmac.new(key, msg, sha256)).

import { compareDigest } from './_pysecrets.js';
import { hmacDigest, hex, utf8 } from '../hashlib/_pyhashlib.js';

const KEY = utf8('server-key');

export default {
  // secrets.compare_digest(a, b)
  compare: (a, b) => compareDigest(a, b),

  // expected = hmac.new(b'server-key', message.encode(), hashlib.sha256).hexdigest()
  // secrets.compare_digest(expected, signature)
  hmac: (message, signature) => compareDigest(hex(hmacDigest(KEY, utf8(message), 'sha256')), signature),

  // secrets.compare_digest(a.encode(), b.encode())
  bytes: (a, b) => compareDigest(utf8(a), utf8(b)),
};
