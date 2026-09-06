// Emulator for Python bytes.decode(encoding) — bytes back into text.
//
// The demo always builds its source with bytes(s, 'utf-8'), so the bytes are
// valid UTF-8. Decoding them as latin-1 therefore never fails — it produces
// mojibake instead, which is exactly the point the page makes.

class UnicodeDecodeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'UnicodeDecodeError'; }
}
class LookupErrorLike extends Error {
  constructor(message) { super(message); this.name = 'LookupError'; }
}

export default function bytesDecode(s, encoding) {
  if (typeof s !== 'string') throw new TypeError('decode() demo source must be str');

  const bytes = new TextEncoder().encode(s);
  const enc = String(encoding).toLowerCase().replace(/[-_\s]/g, '');

  if (enc === 'utf8') {
    // Round trip: the bytes came from this very string.
    return s;
  }

  if (enc === 'ascii') {
    for (let i = 0; i < bytes.length; i += 1) {
      if (bytes[i] >= 128) {
        throw new UnicodeDecodeErrorLike(
          "'ascii' codec can't decode byte 0x" + bytes[i].toString(16).padStart(2, '0') +
          ' in position ' + i + ': ordinal not in range(128)'
        );
      }
    }
    return s;
  }

  if (enc === 'latin1' || enc === 'iso88591') {
    // Every byte maps to the code point of the same value — never fails,
    // which is why latin-1 silently turns UTF-8 into mojibake.
    let out = '';
    for (const b of bytes) out += String.fromCharCode(b);
    return out;
  }

  throw new LookupErrorLike('unknown encoding: ' + encoding);
}
