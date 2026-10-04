// utils/emulators/python/stdlib/base64/encodebytes-decodebytes.js
//
// Emulator for the encodebytes / decodebytes demo tabs, on the CPython
// port in _pybase64.js.

import * as B from './_pybase64.js';

// bytes.splitlines() — encodebytes output only contains b'\n' breaks
const splitLines = (b) => {
  const lines = [];
  let start = 0;
  for (let i = 0; i < b.length; i++) {
    if (b[i] === 10) { lines.push(b.slice(start, i)); start = i + 1; }
  }
  if (start < b.length) lines.push(b.slice(start));
  return lines;
};

export default {
  // base64.encodebytes(text.encode() * n).splitlines()
  lines: (text, n) => {
    const one = B.enc(text);
    const data = [];
    for (let k = 0; k < n; k++) data.push(...one);
    return splitLines(B.encodebytes(data)).map(B.asBytes);
  },

  // base64.decodebytes(data.encode())
  decode: (data) => B.asBytes(B.decodebytes(B.enc(data))),
};
