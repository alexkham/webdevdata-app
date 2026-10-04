// utils/emulators/python/stdlib/uuid/namespaces.js
//
// Emulator for the NAMESPACE_* demo tabs.

import { moduleAttr, uuid5, NAMESPACE_URL } from './_pyuuid.js';

export default {
  // ns = getattr(uuid, name); (str(ns), ns.version)
  lookup: (name) => {
    const ns = moduleAttr(name);
    return { __pyTuple: [ns.str(), ns.version] };
  },
  // uuid.uuid5(uuid.NAMESPACE_URL, url)
  url: (url) => uuid5(NAMESPACE_URL, url).toPy(),
};
