// utils/emulators/python/stdlib/hashlib/index.js
//
// Emulator for the hashlib module hub demo, on the CPython port in
// _pyhashlib.js.

import { hashNew, construct, utf8 } from './_pyhashlib.js';

export default {
  // data = text.encode()
  // {name: hashlib.new(name, data).hexdigest() for name in ['md5', 'sha1', 'sha256']}
  compare: (text) => {
    const data = utf8(text);
    const out = {};
    for (const name of ['md5', 'sha1', 'sha256']) out[name] = hashNew(name, data).hexdigest();
    return out;
  },

  // a, b = sha256 hexdigests; (a[:16], b[:16], number of differing positions)
  avalanche: (a, b) => {
    const x = construct('sha256', utf8(a)).hexdigest();
    const y = construct('sha256', utf8(b)).hexdigest();
    let diff = 0;
    for (let i = 0; i < x.length; i += 1) if (x[i] !== y[i]) diff += 1;
    return { __pyTuple: [x.slice(0, 16), y.slice(0, 16), diff] };
  },

  // h = hashlib.new(name); (h.name, h.digest_size, h.block_size)
  sizes: (name) => {
    const h = hashNew(name);
    return { __pyTuple: [h.name, h.digest_size, h.block_size] };
  },
};
