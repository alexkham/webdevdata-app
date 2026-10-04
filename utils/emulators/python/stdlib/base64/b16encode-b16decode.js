// utils/emulators/python/stdlib/base64/b16encode-b16decode.js
//
// Emulator for the Base16 demo tabs, on the CPython port in _pybase64.js.

import * as B from './_pybase64.js';

const attempt = (data, casefold) => {
  try {
    return B.asBytes(B.b16decode(data, casefold));
  } catch (e) {
    if (e.name !== 'binascii.Error') throw e;
    return `binascii.Error: ${e.message}`;
  }
};

export default {
  // data = text.encode(); (base64.b16encode(data), data.hex())
  encode: (text) => {
    const data = B.enc(text);
    return { __pyTuple: [B.asBytes(B.b16encode(data)), B.toAscii(B.hexlify(data))] };
  },

  // (attempt(False), attempt(True))
  decode: (data) => ({ __pyTuple: [attempt(data, false), attempt(data, true)] }),
};
