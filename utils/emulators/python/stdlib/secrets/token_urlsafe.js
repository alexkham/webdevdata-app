// utils/emulators/python/stdlib/secrets/token_urlsafe.js
//
// Emulator for the secrets.token_urlsafe demo tabs. The token is really
// generated (Web Crypto, see _pysecrets.js) and really decoded again with
// the base64 port; the tabs show only what is the same for every draw.

import { tokenUrlsafe } from './_pysecrets.js';
import { urlsafeB64decode } from '../base64/_pybase64.js';

export default {
  // t = secrets.token_urlsafe(nbytes)
  // (len(t), set(t) <= set(string.ascii_letters + string.digits + '-_'))
  length: (nbytes) => {
    const t = tokenUrlsafe(nbytes);
    return { __pyTuple: [t.length, /^[A-Za-z0-9_-]*$/.test(t)] };
  },

  // padded = t + '=' * (-len(t) % 4)
  // (len(t), len(padded), len(base64.urlsafe_b64decode(padded)))
  decode: (nbytes) => {
    const t = tokenUrlsafe(nbytes);
    const padded = t + '='.repeat((4 - (t.length % 4)) % 4);
    return { __pyTuple: [t.length, padded.length, urlsafeB64decode(padded).length] };
  },
};
