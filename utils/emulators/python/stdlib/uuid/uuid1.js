// utils/emulators/python/stdlib/uuid/uuid1.js
//
// Emulator for the uuid.uuid1 demo: with node and clock_seq given, every
// part except the timestamp is fixed, and the demo reads only those.

import { uuid1At, pyHex } from './_pyuuid.js';

export default {
  // u = uuid.uuid1(node=node, clock_seq=seq)
  // (hex(u.node), u.clock_seq, u.version, u.variant)
  parts: (node, seq) => {
    // any valid 60-bit timestamp: the fields read below do not depend on it
    const u = uuid1At(0x1f0a0b0c0d0e0f0n, BigInt(node), BigInt(seq));
    return { __pyTuple: [pyHex(u.node), u.clock_seq, u.version, u.variant] };
  },
};
