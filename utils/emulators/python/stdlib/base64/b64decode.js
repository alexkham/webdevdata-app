// utils/emulators/python/stdlib/base64/b64decode.js
//
// Emulator for the base64.b64decode demo tabs, on the CPython port in
// _pybase64.js.

import * as B from './_pybase64.js';

const attempt = (data, validate) => {
  try {
    return B.asBytes(B.b64decode(data, null, validate));
  } catch (e) {
    if (e.name !== 'binascii.Error') throw e;
    return `binascii.Error: ${e.message}`;
  }
};

export default {
  // base64.b64decode(data).decode()
  tostring: (data) => B.dec(B.b64decode(data)),

  // (attempt(False), attempt(True))
  validate: (data) => ({ __pyTuple: [attempt(data, false), attempt(data, true)] }),

  // s = data; base64.b64decode(s + '=' * (-len(s) % 4))
  fixpad: (data) => {
    const n = [...data].length; // len() counts code points
    return B.asBytes(B.b64decode(data + '='.repeat((4 - (n % 4)) % 4)));
  },
};
