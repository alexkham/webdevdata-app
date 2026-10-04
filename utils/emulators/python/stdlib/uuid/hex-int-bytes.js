// utils/emulators/python/stdlib/uuid/hex-int-bytes.js
//
// Emulator for the UUID.hex / int / bytes / bytes_le / urn demo tabs.

import { UUID, fromStr, pyBytes } from './_pyuuid.js';

export default {
  // (str(u), u.hex, u.urn)
  strings: (text) => {
    const u = fromStr(text);
    return { __pyTuple: [u.str(), u.hex, u.urn] };
  },
  // (u.int, uuid.UUID(int=u.int) == u)
  int: (text) => {
    const u = fromStr(text);
    return { __pyTuple: [u.int, new UUID({ int: u.int }).int === u.int] };
  },
  // (u.bytes, u.bytes_le)
  bytes: (text) => {
    const u = fromStr(text);
    return { __pyTuple: [pyBytes(u.bytes), pyBytes(u.bytes_le)] };
  },
};
