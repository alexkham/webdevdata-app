// utils/emulators/python/stdlib/secrets/token_hex.js
//
// Emulator for the secrets.token_hex demo tabs. The token is really
// generated (Web Crypto, see _pysecrets.js); the tabs show only what is
// the same for every draw.

import { tokenHex } from './_pysecrets.js';

// bytes.fromhex(t) for the lowercase, even-length hex token_hex produces
const fromHex = (t) => Uint8Array.from(t.match(/[0-9a-f]{2}/g) || [], (h) => parseInt(h, 16));

export default {
  // t = secrets.token_hex(nbytes); (len(t), set(t) <= set('0123456789abcdef'))
  length: (nbytes) => {
    const t = tokenHex(nbytes);
    return { __pyTuple: [t.length, /^[0-9a-f]*$/.test(t)] };
  },

  // (len(t), len(t) * 4, len(bytes.fromhex(t)))
  bits: (nbytes) => {
    const t = tokenHex(nbytes);
    return { __pyTuple: [t.length, t.length * 4, fromHex(t).length] };
  },
};
