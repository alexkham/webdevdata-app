// utils/emulators/python/stdlib/collections/ordereddict-popitem.js
//
// Emulator for the OrderedDict.popitem demo tabs.

import { asPy, odFromkeys, tuple } from './_pycollections.js';

const run = (keys, last) => {
  const od = odFromkeys(keys, 0n);
  const item = od.popitem(last);
  return asPy(tuple(item, od.keys()));
};

export default {
  lifo: (keys) => run(keys, true),
  fifo: (keys) => run(keys, false),
};
