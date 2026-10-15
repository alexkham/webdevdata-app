// utils/emulators/python/stdlib/hashlib/sha224-sha384-sha512.js
//
// Emulator for the SHA-2 family demo tabs, on the CPython port in
// _pyhashlib.js.

import { hashNew, utf8 } from './_pyhashlib.js';

export default {
  // {name: hashlib.new(name, data).hexdigest()[:16] for name in [...]}
  compare: (text) => {
    const data = utf8(text);
    const out = {};
    for (const name of ['sha224', 'sha256', 'sha384', 'sha512']) out[name] = hashNew(name, data).hexdigest().slice(0, 16);
    return out;
  },

  // h = hashlib.new(name, text.encode()); (len(h.hexdigest()), h.hexdigest())
  full: (name, text) => {
    const h = hashNew(name, utf8(text));
    const hx = h.hexdigest();
    return { __pyTuple: [hx.length, hx] };
  },
};
