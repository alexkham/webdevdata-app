// utils/emulators/python/stdlib/uuid/uuid4.js
//
// Emulator for the uuid.uuid4 demo tabs. uuid4() is
// UUID(bytes=os.urandom(16), version=4); the 'build' tab takes the 16
// bytes from the reader, so its result is exact. The 'many' tab only
// shows values that are the same for every random draw.

import { UUID, bytesFromHex } from './_pyuuid.js';

export default {
  // uuid.UUID(bytes=bytes.fromhex(hex), version=4)
  build: (hex) => new UUID({ bytes: bytesFromHex(hex), version: 4n }).toPy(),
  // ids = [uuid4() for _ in range(n)]
  // (len(set(ids)), {u.version for u in ids}, {len(str(u)) for u in ids})
  // — 122 random bits each: a repeat is not a realistic outcome
  many: (n) => {
    const k = Math.max(0, n);
    return { __pyTuple: [k, { __pySet: k ? [4] : [] }, { __pySet: k ? [36] : [] }] };
  },
};
