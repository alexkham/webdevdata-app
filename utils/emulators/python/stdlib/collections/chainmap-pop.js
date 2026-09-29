// utils/emulators/python/stdlib/collections/chainmap-pop.js
//
// Emulator for the ChainMap pop / popitem / clear demo tabs.

import { ChainMap, asPy, dictFromkeys, tuple } from './_pycollections.js';

const make = (a, b) => new ChainMap(dictFromkeys(a, 1n), dictFromkeys(b, 2n));

export default {
  // (cm.pop(key), cm)
  pop: (a, b, key) => {
    const cm = make(a, b);
    return asPy(tuple(cm.pop(key), cm));
  },

  // (cm.popitem(), cm)
  popitem: (a, b) => {
    const cm = make(a, b);
    return asPy(tuple(cm.popitem(), cm));
  },

  // cm.clear(); (cm, dict(cm))
  clear: (a, b) => {
    const cm = make(a, b);
    cm.clear();
    return asPy(tuple(cm, cm.toDict()));
  },
};
