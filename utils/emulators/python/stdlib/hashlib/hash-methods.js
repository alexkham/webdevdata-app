// utils/emulators/python/stdlib/hashlib/hash-methods.js
//
// Emulator for the hash-object methods demo tabs (update / digest /
// hexdigest / copy), on the CPython port in _pyhashlib.js.

import { hashNew, construct, utf8, hex } from './_pyhashlib.js';

export default {
  // h = hashlib.new(name); h.update(part.encode()) for each part
  // (h.hexdigest()[:16], h.hexdigest() == hashlib.new(name, ''.join(parts).encode()).hexdigest())
  parts: (name, parts) => {
    const h = hashNew(name);
    for (const part of parts) h.update(utf8(part));
    const first = h.hexdigest().slice(0, 16);
    return { __pyTuple: [first, h.hexdigest() === hashNew(name, utf8(parts.join(''))).hexdigest()] };
  },

  // base = sha256(prefix); per suffix: copy, update, (s, hex[:12], equal to fresh hash)
  copy: (prefix, suffixes) => {
    const base = construct('sha256', utf8(prefix));
    return suffixes.map((s) => {
      const h = base.copy();
      h.update(utf8(s));
      const full = construct('sha256', utf8(prefix + s)).hexdigest();
      return { __pyTuple: [s, h.hexdigest().slice(0, 12), h.hexdigest() === full] };
    });
  },

  // (len(h.digest()), len(h.hexdigest()), h.hexdigest() == h.digest().hex())
  forms: (name, text) => {
    const h = hashNew(name, utf8(text));
    const d = h.digest();
    const hx = h.hexdigest();
    return { __pyTuple: [d.length, hx.length, hx === hex(d)] };
  },
};
