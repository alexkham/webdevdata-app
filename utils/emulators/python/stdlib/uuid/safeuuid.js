// utils/emulators/python/stdlib/uuid/safeuuid.js
//
// Emulator for the uuid.SafeUUID demo tabs.

import { SafeUUID, fromStr } from './_pyuuid.js';

export default {
  // uuid.SafeUUID(value)
  value: (value) => SafeUUID.call(value).toPy(),
  // uuid.SafeUUID[name]
  name: (name) => SafeUUID.item(name).toPy(),
  // uuid.UUID(text).is_safe — always unknown unless is_safe= is passed
  attr: (text) => fromStr(text).is_safe.toPy(),
};
