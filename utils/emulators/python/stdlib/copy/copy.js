// utils/emulators/python/stdlib/copy/copy.js
//
// Emulator for the copy.copy demo tabs, on _pycopy.js.

import { copy, nums, num, show, tuple, PyDict } from './_pycopy.js';

export default {
  // c = copy.copy([a, b]); c[0].append(0); c.append([]); (original, c)
  nested: (a, b) => {
    const original = [nums(a), nums(b)];
    const c = copy(original);
    c[0].push(0n);
    c.push([]);
    return show(tuple(original, c));
  },

  // shallow copy of a dict: rebinding a key vs mutating a shared list
  dict: (ports, x) => {
    const config = new PyDict([['name', 'app'], ['ports', nums(ports)]]);
    const c = copy(config);
    c.set('name', 'test');
    c.entries[c.indexOf('ports')][1].push(num(x)); // c['ports'].append(x)
    return show(tuple(config, c));
  },
};
