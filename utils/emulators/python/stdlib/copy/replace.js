// utils/emulators/python/stdlib/copy/replace.js
//
// Emulator for the copy.replace demo tabs, on _pycopy.js.

import { replace, NamedTuple, DataclassObj, num, show, tuple } from './_pycopy.js';

export default {
  // Point = namedtuple('Point', 'x y'); (p, copy.replace(p, x=nx))
  namedtuple: (x, y, nx) => {
    const p = new NamedTuple('Point', ['x', 'y'], [num(x), num(y)]);
    return show(tuple(p, replace(p, [['x', num(nx)]])));
  },

  // frozen dataclass Item(name, qty=1); (item, copy.replace(item, qty=qty))
  dataclass: (name, qty) => {
    const item = new DataclassObj('Item', ['name', 'qty'], [name, 1n]);
    return show(tuple(item, replace(item, [['qty', num(qty)]])));
  },

  // copy.replace(p, **{field: 0}) — unknown names are rejected
  field: (field) => {
    const p = new NamedTuple('Point', ['x', 'y'], [1n, 2n]);
    return show(replace(p, [[field, 0n]]));
  },
};
