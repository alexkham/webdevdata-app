// utils/emulators/python/stdlib/hashlib/sha256.js
//
// Emulator for the hashlib.sha256 demo tabs, on the CPython port in
// _pyhashlib.js.

import { construct, utf8, asBytes, hex } from './_pyhashlib.js';

export default {
  // hashlib.sha256(text.encode()).hexdigest()
  hex: (text) => construct('sha256', utf8(text)).hexdigest(),

  // d = hashlib.sha256(text.encode()).digest(); (len(d), d[:8], d.hex()[:16])
  bytes: (text) => {
    const d = construct('sha256', utf8(text)).digest();
    return { __pyTuple: [d.length, asBytes(d.subarray(0, 8)), hex(d).slice(0, 16)] };
  },

  // h.update(part.encode()) for each part; compare with the joined text
  chunks: (parts) => {
    const h = construct('sha256');
    for (const part of parts) h.update(utf8(part));
    const whole = construct('sha256', utf8(parts.join(''))).hexdigest();
    return { __pyTuple: [h.hexdigest() === whole, h.hexdigest().slice(0, 16)] };
  },
};
