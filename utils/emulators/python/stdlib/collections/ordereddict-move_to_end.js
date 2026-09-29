// utils/emulators/python/stdlib/collections/ordereddict-move_to_end.js
//
// Emulator for the OrderedDict.move_to_end demo tabs.

import { asPy, odFromkeys } from './_pycollections.js';

const run = (keys, key, last) => {
  const od = odFromkeys(keys);
  od.moveToEnd(key, last);
  return asPy(od.keys());
};

export default {
  end: (keys, key) => run(keys, key, true),
  front: (keys, key) => run(keys, key, false),
};
