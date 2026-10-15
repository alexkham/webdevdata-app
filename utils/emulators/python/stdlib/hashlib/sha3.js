// utils/emulators/python/stdlib/hashlib/sha3.js
//
// Emulator for the SHA-3 family demo tabs, on the Keccak port in
// _pyhashlib.js.

import { hashNew, construct, utf8 } from './_pyhashlib.js';

export default {
  // {name: hashlib.new(name, data).hexdigest()[:16] for name in ['sha3_224', ...]}
  compare: (text) => {
    const data = utf8(text);
    const out = {};
    for (const name of ['sha3_224', 'sha3_256', 'sha3_384', 'sha3_512']) out[name] = hashNew(name, data).hexdigest().slice(0, 16);
    return out;
  },

  // (sha256(data).hexdigest()[:16], sha3_256(data).hexdigest()[:16])
  vs: (text) => {
    const data = utf8(text);
    return { __pyTuple: [construct('sha256', data).hexdigest().slice(0, 16), construct('sha3_256', data).hexdigest().slice(0, 16)] };
  },
};
