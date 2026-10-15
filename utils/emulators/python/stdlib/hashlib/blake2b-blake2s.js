// utils/emulators/python/stdlib/hashlib/blake2b-blake2s.js
//
// Emulator for the blake2b / blake2s demo tabs, on the BLAKE2 port in
// _pyhashlib.js (full parameter block and CPython's argument checks).

import { blake2, utf8, numArg } from './_pyhashlib.js';

export default {
  // hashlib.blake2b(msg.encode(), key=key.encode(), digest_size=size).hexdigest()
  keyed: (msg, key, size) => blake2('blake2b', utf8(msg), { key: utf8(key), digestSize: numArg(size) }).hexdigest(),

  // hashlib.blake2b(text.encode(), digest_size=16, person=person.encode()).hexdigest()
  person: (text, person) => blake2('blake2b', utf8(text), { digestSize: 16, person: utf8(person) }).hexdigest(),

  // (blake2s(data).hexdigest()[:16], blake2b(data, digest_size=32).hexdigest()[:16])
  bs: (text) => {
    const data = utf8(text);
    return { __pyTuple: [blake2('blake2s', data).hexdigest().slice(0, 16), blake2('blake2b', data, { digestSize: 32 }).hexdigest().slice(0, 16)] };
  },
};
