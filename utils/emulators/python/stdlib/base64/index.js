// utils/emulators/python/stdlib/base64/index.js
//
// Emulator for the base64 module hub demo, on the CPython port in
// _pybase64.js.

import * as B from './_pybase64.js';

export default {
  // encoded = base64.b64encode(text.encode())
  // (encoded, base64.b64decode(encoded).decode())
  roundtrip: (text) => {
    const encoded = B.b64encode(B.enc(text));
    return { __pyTuple: [B.asBytes(encoded), B.dec(B.b64decode(encoded))] };
  },

  // [b16, b32, b64, urlsafe b64, b85, a85] of text.encode()
  compare: (text) => {
    const data = B.enc(text);
    return [
      B.b16encode(data), B.b32encode(data), B.b64encode(data),
      B.urlsafeB64encode(data), B.b85encode(data), B.a85encode(data),
    ].map(B.asBytes);
  },
};
