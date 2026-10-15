// utils/emulators/python/stdlib/hashlib/shake.js
//
// Emulator for the shake_128 / shake_256 demo tabs, on the Keccak port in
// _pyhashlib.js.

import { construct, utf8, numArg } from './_pyhashlib.js';

export default {
  // hashlib.shake_128(text.encode()).hexdigest(length)
  length: (text, length) => construct('shake_128', utf8(text)).hexdigest(numArg(length)),

  // (shake_128(data).hexdigest(length), shake_256(data).hexdigest(length))
  both: (text, length) => {
    const data = utf8(text);
    const n = numArg(length);
    return { __pyTuple: [construct('shake_128', data).hexdigest(n), construct('shake_256', data).hexdigest(n)] };
  },
};
