// utils/emulators/python/stdlib/base64/b32encode-b32decode.js
//
// Emulator for the Base32 / Base32hex demo tabs, on the CPython port in
// _pybase64.js.

import * as B from './_pybase64.js';

const attempt = (data, casefold) => {
  try {
    return B.asBytes(B.b32decode(data, casefold));
  } catch (e) {
    if (e.name !== 'binascii.Error') throw e;
    return `binascii.Error: ${e.message}`;
  }
};

// str.upper() for the demo (ASCII and the common Latin letters behave
// like Python's; the result only feeds the ASCII check anyway)
const pyUpper = (s) => s.toUpperCase();

export default {
  // data = text.encode(); (b32encode(data), b32hexencode(data))
  encode: (text) => {
    const data = B.enc(text);
    return { __pyTuple: [B.asBytes(B.b32encode(data)), B.asBytes(B.b32hexencode(data))] };
  },

  // (attempt(False), attempt(True))
  decode: (data) => ({ __pyTuple: [attempt(data, false), attempt(data, true)] }),

  // s = secret.replace(' ', '').upper(); b32decode(s + '=' * (-len(s) % 8))
  secret: (secret) => {
    const s = pyUpper(secret.replace(/ /g, ''));
    const n = [...s].length;
    return B.asBytes(B.b32decode(s + '='.repeat((8 - (n % 8)) % 8)));
  },
};
