// utils/emulators/python/stdlib/uuid/index.js
//
// Emulator for the uuid module hub demo, on the CPython port in _pyuuid.js.

import { fromStr, uuid3, uuid5, NAMESPACE_DNS } from './_pyuuid.js';

export default {
  // u = uuid.UUID(text); (str(u), u.version, u.variant)
  parse: (text) => {
    const u = fromStr(text);
    return { __pyTuple: [u.str(), u.version, u.variant] };
  },
  // (uuid.uuid5(NAMESPACE_DNS, name), uuid.uuid3(NAMESPACE_DNS, name))
  name: (name) => ({ __pyTuple: [uuid5(NAMESPACE_DNS, name).toPy(), uuid3(NAMESPACE_DNS, name).toPy()] }),
};
