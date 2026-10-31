// utils/emulators/python/stdlib/struct/unpack.js
//
// Emulator for the struct.unpack demo tabs, on the Modules/_struct.c port
// in _pystruct.js.

import { unpack, fromhex, show, reprOf } from './_pystruct.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  // struct.unpack(fmt, bytes.fromhex(hex))
  unpack: (fmt, hex) => show(unpack(fmt, fromhex(hex))),

  // Point = namedtuple('Point', 'x y')
  // Point._make(struct.unpack(fmt, bytes.fromhex(hex)))
  named: (fmt, hex) => {
    const items = unpack(fmt, fromhex(hex)).items;
    if (items.length !== 2) throw new PyException('TypeError', `Expected 2 arguments, got ${items.length}`);
    return { __pyRaw: `Point(x=${reprOf(items[0])}, y=${reprOf(items[1])})` };
  },
};
