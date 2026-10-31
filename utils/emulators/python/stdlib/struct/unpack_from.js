// utils/emulators/python/stdlib/struct/unpack_from.js
//
// Emulator for the struct.unpack_from demo tabs, on the Modules/_struct.c
// port in _pystruct.js.

import { unpackFrom, fromhex, show, numArg } from './_pystruct.js';

export default {
  // struct.unpack_from(fmt, bytes.fromhex(hex), offset=offset)
  from: (fmt, hex, offset) => show(unpackFrom(fmt, fromhex(hex), numArg(offset))),

  // data = bytes.fromhex(hex); (n,) = struct.unpack_from('<B', data, 0)
  // struct.unpack_from(f'<{n}s', data, 1)
  walk: (hex) => {
    const data = fromhex(hex);
    const [n] = unpackFrom('<B', data, 0n).items;
    return show(unpackFrom(`<${n}s`, data, 1n));
  },
};
