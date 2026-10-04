// utils/emulators/python/stdlib/base64/urlsafe-b64.js
//
// Emulator for the urlsafe_b64encode / urlsafe_b64decode demo tabs, on
// the CPython port in _pybase64.js.

import * as B from './_pybase64.js';

export default {
  // data = text.encode(); (b64encode(data), urlsafe_b64encode(data))
  compare: (text) => {
    const data = B.enc(text);
    return { __pyTuple: [B.asBytes(B.b64encode(data)), B.asBytes(B.urlsafeB64encode(data))] };
  },

  // urlsafe_b64decode(segment + '=' * (-len(segment) % 4)).decode()
  jwt: (segment) => {
    const n = [...segment].length;
    return B.dec(B.urlsafeB64decode(segment + '='.repeat((4 - (n % 4)) % 4)));
  },

  // base64.urlsafe_b64decode(segment)
  raw: (segment) => B.asBytes(B.urlsafeB64decode(segment)),
};
