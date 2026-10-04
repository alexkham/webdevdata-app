// utils/emulators/python/stdlib/base64/standard-b64.js
//
// Emulator for the standard_b64encode / standard_b64decode demo, on the
// CPython port in _pybase64.js.

import * as B from './_pybase64.js';

export default {
  // base64.standard_b64encode(text.encode())
  encode: (text) => B.asBytes(B.standardB64encode(B.enc(text))),

  // base64.standard_b64decode(data)
  decode: (data) => B.asBytes(B.standardB64decode(data)),
};
