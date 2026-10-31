// utils/emulators/python/stdlib/struct/iter_unpack.js
//
// Emulator for the struct.iter_unpack demo, on the Modules/_struct.c port
// in _pystruct.js.

import { iterUnpack, fromhex, reprOf } from './_pystruct.js';

export default {
  // list(struct.iter_unpack(fmt, bytes.fromhex(hex)))
  iter: (fmt, hex) => ({ __pyRaw: '[' + iterUnpack(fmt, fromhex(hex)).map(reprOf).join(', ') + ']' }),
};
