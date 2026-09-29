// utils/emulators/python/exceptions/unicodeerror.js
//
// Emulator for the UnicodeError demo modes. The trigger and handle modes
// encode the text to real UTF-8 bytes and decode them as ASCII, so the
// reported position is a BYTE offset (which is the lesson: 'naïve' fails
// at position 2, 'día' too, '日本' at 0). The raise mode reimplements
// UnicodeTranslateError.__str__.

import { raise } from '../../../py-exceptions.js';
import { utf8Encode, asciiDecode, bytesRepr } from './unicodedecodeerror.js';
import { pyValue, raw, strRepr, codePoints, escapeCodePoint } from './valueerror.js';

const SSIZE_MAX = 2n ** 63n - 1n;
const SSIZE_MIN = -(2n ** 63n);

// the C ssize_t conversion done by the constructor ("UnnU")
function ssize(v) {
  const p = pyValue(v);
  if (p.t !== 'int') raise('TypeError', `'${p.t}' object cannot be interpreted as an integer`);
  if (p.v > SSIZE_MAX || p.v < SSIZE_MIN) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  return p.v;
}

function translateErrorStr(text, start, end, reason) {
  const cps = codePoints(text);
  if (start >= 0n && start < BigInt(cps.length) && end === start + 1n) {
    return `can't translate character '${escapeCodePoint(cps[Number(start)])}' in position ${start}: ${reason}`;
  }
  return `can't translate characters in position ${start}-${end - 1n}: ${reason}`;
}

export default {
  trigger: (text) => raw(strRepr(asciiDecode(utf8Encode(text)))),

  handle: (text) => {
    const data = utf8Encode(text);
    try {
      return raw(strRepr(asciiDecode(data)));
    } catch (e) {
      if (e.name !== 'UnicodeDecodeError') throw e;
      return { __pyTuple: ['UnicodeDecodeError', e.start, e.end, raw(bytesRepr(data.slice(e.start, e.end)))] };
    }
  },

  raise: (text, start, end) => {
    const s = ssize(start);
    const e = ssize(end);
    return raise('UnicodeTranslateError', translateErrorStr(text, s, e, 'not allowed here'));
  },
};
