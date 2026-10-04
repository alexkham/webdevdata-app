// utils/emulators/python/stdlib/base64/a85-b85-z85.js
//
// Emulator for the Ascii85 / Base85 / Z85 demo tabs, on the CPython port
// in _pybase64.js.

import * as B from './_pybase64.js';

const attempt = (decode, data) => {
  try {
    return B.asBytes(decode(data));
  } catch (e) {
    // binascii.Error is a ValueError subclass, but the 85 family raises
    // plain ValueError — the f-string shows str(e) only
    if (e.name !== 'ValueError' && e.name !== 'binascii.Error') throw e;
    return `ValueError: ${e.message}`;
  }
};

export default {
  // [a85encode(data), b85encode(data), z85encode(data)]
  encode: (text) => {
    const data = B.enc(text);
    return [B.a85encode(data), B.b85encode(data), B.z85encode(data)].map(B.asBytes);
  },

  // [a85encode(data, adobe=True, wrapcol=wrapcol),
  //  a85encode(bytes(4) + b"    " + data, foldspaces=True)]
  ascii85: (text, wrapcol) => {
    const data = B.enc(text);
    return [
      B.a85encode(data, { adobe: true, wrapcol }),
      B.a85encode([0, 0, 0, 0, 32, 32, 32, 32, ...data], { foldspaces: true }),
    ].map(B.asBytes);
  },

  // [attempt(a85decode), attempt(b85decode), attempt(z85decode)]
  decode: (data) => [B.a85decode, B.b85decode, B.z85decode].map((f) => attempt(f, data)),
};
