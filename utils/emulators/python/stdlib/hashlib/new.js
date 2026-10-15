// utils/emulators/python/stdlib/hashlib/new.js
//
// Emulator for the hashlib.new demo tabs, on the CPython port in
// _pyhashlib.js (name resolution probed against CPython + OpenSSL 3.0;
// names of non-guaranteed OpenSSL algorithms raise DemoLimit, because
// whether they exist depends on the reader's build).

import { hashNew, utf8 } from './_pyhashlib.js';

export default {
  // h = hashlib.new(name, text.encode()); (h.name, h.hexdigest()[:16])
  byname: (name, text) => {
    const h = hashNew(name, utf8(text));
    return { __pyTuple: [h.name, h.hexdigest().slice(0, 16)] };
  },

  // [(n, hashlib.new(n).digest_size) for n in names]
  sizes: (names) => names.map((n) => ({ __pyTuple: [n, hashNew(n).digest_size] })),
};
