// utils/emulators/python/stdlib/base64/encode-decode.js
//
// Emulator for the base64.encode / base64.decode demo tabs (io.BytesIO
// in and out), on the CPython port in _pybase64.js.

import * as B from './_pybase64.js';

export default {
  // out = io.BytesIO(); base64.encode(io.BytesIO(text.encode()), out)
  encode: (text) => B.asBytes(B.encodeFile(B.enc(text))),

  // src = io.BytesIO('\n'.join(lines).encode()); base64.decode(src, out)
  // — on binascii.Error: (message, what was written before the bad line)
  decode: (lines) => {
    try {
      return B.asBytes(B.decodeFile(B.enc(lines.join('\n'))));
    } catch (e) {
      if (e.name !== 'binascii.Error') throw e;
      return { __pyTuple: [`binascii.Error: ${e.message}`, B.asBytes(e.written)] };
    }
  },
};
