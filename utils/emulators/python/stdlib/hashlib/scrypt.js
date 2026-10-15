// utils/emulators/python/stdlib/hashlib/scrypt.js
//
// Emulator for the hashlib.scrypt demo, on the RFC 7914 port in
// _pyhashlib.js (OpenSSL 3.0's parameter checks; n × r × p capped by a
// DemoLimit so the page stays responsive).

import { scrypt, utf8, hex, numArg } from './_pyhashlib.js';

export default {
  // hashlib.scrypt(password.encode(), salt=salt.encode(), n=n, r=r, p=p, dklen=dklen).hex()
  derive: (password, salt, n, r, p, dklen) => {
    const [N, R, P, dk] = [n, r, p, dklen].map(numArg);
    return hex(scrypt(utf8(password), { salt: utf8(salt), n: N, r: R, p: P, dklen: dk }));
  },
};
