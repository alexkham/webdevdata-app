// utils/emulators/python/stdlib/hashlib/pbkdf2_hmac.js
//
// Emulator for the hashlib.pbkdf2_hmac demo tabs, on the PBKDF2 / HMAC
// port in _pyhashlib.js (bounded by a DemoLimit work budget).

import { pbkdf2Hmac, utf8, hex, numArg } from './_pyhashlib.js';

const SALT = utf8('per-user-salt-16');

export default {
  // hashlib.pbkdf2_hmac(hash, password.encode(), salt.encode(), iterations).hex()
  derive: (hash, password, salt, iterations) => hex(pbkdf2Hmac(hash, utf8(password), utf8(salt), numArg(iterations))),

  // stored = pbkdf2('sha256', b'hunter2', salt, 10_000); compare with the attempt
  verify: (attempt) => {
    const stored = pbkdf2Hmac('sha256', utf8('hunter2'), SALT, 10000);
    const tried = pbkdf2Hmac('sha256', utf8(attempt), SALT, 10000);
    return stored.length === tried.length && stored.every((b, i) => b === tried[i]);
  },

  // hashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000, dklen=dklen).hex()
  dklen: (dklen) => hex(pbkdf2Hmac('sha256', utf8('pw'), utf8('salt'), 1000, numArg(dklen))),
};
