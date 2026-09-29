// utils/emulators/python/exceptions/buffererror.js
//
// Emulator for the BufferError demo modes. A bytearray with a live
// memoryview export may be modified in place, but any operation that
// would change its length raises BufferError. Slice assignment
// buf[0:1] = data keeps the length only when data is exactly one byte;
// str.encode() is UTF-8, so one non-ASCII character is 2–4 bytes.

import { raise } from '../../../py-exceptions.js';

const utf8 = (s) => Array.from(new TextEncoder().encode(s));

// repr() of a bytes object: printable ASCII as-is, \t \n \r and the
// quote/backslash escaped, everything else as \xhh. Quote choice follows
// the str rule: double quotes only when there is a ' and no ".
function bytesRepr(arr) {
  const hasSingle = arr.includes(0x27);
  const hasDouble = arr.includes(0x22);
  const q = hasSingle && !hasDouble ? '"' : "'";
  let body = '';
  for (const b of arr) {
    if (b === 0x5c) body += '\\\\';
    else if (b === 0x09) body += '\\t';
    else if (b === 0x0a) body += '\\n';
    else if (b === 0x0d) body += '\\r';
    else if (q === "'" && b === 0x27) body += "\\'";
    else if (b < 0x20 || b >= 0x7f) body += '\\x' + b.toString(16).padStart(2, '0');
    else body += String.fromCharCode(b);
  }
  return { __pyRaw: `b${q}${body}${q}` };
}

// buf[0:1] = data on a 3-byte buffer
function assignFirst(buf, data, exported) {
  if (exported && data.length !== 1) {
    raise('BufferError', 'Existing exports of data: object cannot be re-sized');
  }
  return [...data, ...buf.slice(1)];
}

export default {
  trigger: (text) => bytesRepr(assignFirst([0x61, 0x62, 0x63], utf8(text), true)),

  // the with block releases the view, so every length is fine afterwards
  handle: (text) => bytesRepr(assignFirst([0x61, 0x62, 0x63], utf8(text), false)),
};
