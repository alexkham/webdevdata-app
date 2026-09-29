// utils/emulators/python/stdlib/collections/chainmap.js
//
// Emulator for the collections.ChainMap demo tabs, on _pycollections.js.

import { ChainMap, PyDict, asPy, dictFromkeys, tuple } from './_pycollections.js';

export default {
  // settings = ChainMap(dict.fromkeys(user, 'user'), dict.fromkeys(defaults, 'default'))
  // (dict(settings), len(settings))
  lookup: (user, defaults) => {
    const settings = new ChainMap(dictFromkeys(user, 'user'), dictFromkeys(defaults, 'default'));
    return asPy(tuple(settings.toDict(), BigInt(settings.size)));
  },

  // cm = ChainMap({}, dict.fromkeys(base, 0)); cm[key] = 1; cm.maps
  write: (base, key) => {
    const cm = new ChainMap(new PyDict(), dictFromkeys(base, 0n));
    cm.setItem(key, 1n);
    return asPy(cm.maps);
  },

  // cm = ChainMap(dict.fromkeys(a, 1), dict.fromkeys(b, 2)); (cm.get(key), cm[key])
  get: (a, b, key) => {
    const cm = new ChainMap(dictFromkeys(a, 1n), dictFromkeys(b, 2n));
    const g = cm.get(key);
    return asPy(tuple(g, cm.getItem(key)));
  },
};
