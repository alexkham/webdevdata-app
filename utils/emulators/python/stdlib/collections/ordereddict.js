// utils/emulators/python/stdlib/collections/ordereddict.js
//
// Emulator for the collections.OrderedDict demo tabs, on _pycollections.js.

import { OrderedDict, PyDict, asPy, odFromkeys, pyEq, tuple } from './_pycollections.js';

export default {
  // a = OrderedDict.fromkeys(x); b = OrderedDict.fromkeys(y)
  // (a == b, dict(a) == dict(b), a == dict(b))
  eq: (x, y) => {
    const a = odFromkeys(x);
    const b = odFromkeys(y);
    const da = new PyDict(a.items());
    const db = new PyDict(b.items());
    return asPy(tuple(pyEq(a, b), pyEq(da, db), pyEq(a, db)));
  },

  // LRU: touch each key, evict the oldest beyond `size`
  lru: (keys, size) => {
    const cache = new OrderedDict();
    for (const key of keys) {
      cache.setItem(key, true);
      cache.moveToEnd(key);
      if (cache.size > size) cache.popitem(false);
    }
    return asPy(cache.keys());
  },
};
