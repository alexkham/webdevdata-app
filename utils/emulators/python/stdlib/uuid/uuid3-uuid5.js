// utils/emulators/python/stdlib/uuid/uuid3-uuid5.js
//
// Emulator for the uuid.uuid3 / uuid.uuid5 demo tabs (MD5 and SHA-1 are
// implemented in _pyuuid.js).

import { fromStr, uuid3, uuid5, NAMESPACE_DNS, NAMESPACE_URL } from './_pyuuid.js';

export default {
  // (uuid.uuid3(NAMESPACE_DNS, name), uuid.uuid5(NAMESPACE_DNS, name))
  dns: (name) => ({ __pyTuple: [uuid3(NAMESPACE_DNS, name).toPy(), uuid5(NAMESPACE_DNS, name).toPy()] }),
  // ns = uuid.UUID(namespace); uuid.uuid5(ns, name)
  ns: (namespace, name) => uuid5(fromStr(namespace), name).toPy(),
  // uuid.uuid5(NAMESPACE_URL, a) == uuid.uuid5(NAMESPACE_URL, b)
  same: (a, b) => uuid5(NAMESPACE_URL, a).int === uuid5(NAMESPACE_URL, b).int,
};
