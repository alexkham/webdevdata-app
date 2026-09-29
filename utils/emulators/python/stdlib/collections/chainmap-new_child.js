// utils/emulators/python/stdlib/collections/chainmap-new_child.js
//
// Emulator for the ChainMap.new_child / parents demo tabs.

import { ChainMap, asPy, dictFromkeys, tuple } from './_pycollections.js';

export default {
  // outer = ChainMap(dict.fromkeys(a, 'outer'))
  // inner = outer.new_child(dict.fromkeys(b, 'inner')); (dict(inner), inner.parents)
  scopes: (a, b) => {
    const outer = new ChainMap(dictFromkeys(a, 'outer'));
    const inner = outer.newChild(dictFromkeys(b, 'inner'));
    return asPy(tuple(inner.toDict(), inner.parents));
  },

  // cm = ChainMap(dict.fromkeys(a, 0)).new_child(); cm[key] = 1; (cm, cm.parents)
  child: (a, key) => {
    const cm = new ChainMap(dictFromkeys(a, 0n)).newChild();
    cm.setItem(key, 1n);
    return asPy(tuple(cm, cm.parents));
  },
};
