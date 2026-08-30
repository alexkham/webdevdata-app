// Emulator for Python bytes(source, encoding) from a string source.
// A string source REQUIRES an encoding, exactly like Python.

class UnicodeEncodeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'UnicodeEncodeError'; }
}
class LookupErrorLike extends Error {
  constructor(message) { super(message); this.name = 'LookupError'; }
}
function pyCharEscape(cp) {
  if (cp < 0x100) return '\\x' + cp.toString(16).padStart(2, '0');
  if (cp < 0x10000) return '\\u' + cp.toString(16).padStart(4, '0');
  return '\\U' + cp.toString(16).padStart(8, '0');
}
function encodeBytes(s, encoding) {
  const enc = String(encoding).toLowerCase().replace(/[-_\s]/g, '');
  if (enc === 'utf8') return Array.from(new TextEncoder().encode(s));
  if (enc === 'ascii' || enc === 'latin1' || enc === 'iso88591') {
    const limit = enc === 'ascii' ? 128 : 256;
    const label = enc === 'ascii' ? 'ascii' : 'latin-1';
    const chars = Array.from(s);
    return chars.map((ch, i) => {
      const cp = ch.codePointAt(0);
      if (cp >= limit) {
        throw new UnicodeEncodeErrorLike(
          "'" + label + "' codec can't encode character '" + pyCharEscape(cp) +
          "' in position " + i + ': ordinal not in range(' + limit + ')'
        );
      }
      return cp;
    });
  }
  throw new LookupErrorLike('unknown encoding: ' + encoding);
}
function bytesRepr(bytes) {
  let out = '';
  for (const b of bytes) {
    if (b === 9) out += '\\t';
    else if (b === 10) out += '\\n';
    else if (b === 13) out += '\\r';
    else if (b === 39) out += "\\'";
    else if (b === 92) out += '\\\\';
    else if (b >= 32 && b <= 126) out += String.fromCharCode(b);
    else out += '\\x' + b.toString(16).padStart(2, '0');
  }
  return "b'" + out + "'";
}

export default function pyBytes(source, encoding = null) {
  if (typeof source !== 'string') throw new TypeError('bytes() demo source must be str');
  if (encoding === null || encoding === undefined) {
    throw new TypeError('string argument without an encoding');
  }
  return { __pyRaw: bytesRepr(encodeBytes(source, encoding)) };
}
