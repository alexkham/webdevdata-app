// utils/emulators/python/stdlib/secrets/token_bytes.js
//
// Emulator for the secrets.token_bytes demo tabs. The bytes are really
// generated (Web Crypto, see _pysecrets.js); the tabs show only what is
// the same for every draw.

import { tokenBytes } from './_pysecrets.js';
import { pbkdf2Hmac, utf8 } from '../hashlib/_pyhashlib.js';

export default {
  // t = secrets.token_bytes(nbytes); (type(t).__name__, len(t))
  size: (nbytes) => ({ __pyTuple: ['bytes', tokenBytes(nbytes).length] }),

  // salt = token_bytes(nbytes); key = pbkdf2_hmac('sha256', b'hunter2', salt, 1000)
  salt: (nbytes) => {
    const salt = tokenBytes(nbytes);
    const key = pbkdf2Hmac('sha256', utf8('hunter2'), salt, 1000);
    return { __pyTuple: [salt.length, key.length] };
  },
};
