// utils/emulators/python/stdlib/base64/b64encode.js
//
// Emulator for the base64.b64encode demo tabs, on the CPython port in
// _pybase64.js.

import * as B from './_pybase64.js';

export default {
  // base64.b64encode(text.encode()).decode('ascii')
  string: (text) => B.toAscii(B.b64encode(B.enc(text))),

  // data = text.encode(); (len(data), base64.b64encode(data))
  padding: (text) => {
    const data = B.enc(text);
    return { __pyTuple: [data.length, B.asBytes(B.b64encode(data))] };
  },

  // base64.b64encode(b'\xfb\xff\xbf', altchars=alt.encode())
  altchars: (alt) => B.asBytes(B.b64encode([0xfb, 0xff, 0xbf], B.enc(alt))),
};
