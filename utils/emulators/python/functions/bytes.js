// utils/emulators/python/bytes.js
//
// Emulator for Python bytes(source, encoding). Handles the three call
// shapes the demo needs:
//
//   1. Integer source → that many zero bytes
//   2. Comma-separated ints in source → those bytes
//   3. String source + encoding → bytes via str.encode
//
// Renders the result in Python's b'...' literal form.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
class TypeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'TypeError'; }
}

function renderByte(b) {
  if (b >= 0x20 && b < 0x7f && b !== 0x5c && b !== 0x27) {
    return String.fromCharCode(b);
  }
  if (b === 0x5c) return '\\\\';
  if (b === 0x27) return "\\'";
  if (b === 0x09) return '\\t';
  if (b === 0x0a) return '\\n';
  if (b === 0x0d) return '\\r';
  return '\\x' + b.toString(16).padStart(2, '0');
}

function bytesToLiteral(bytes) {
  return "b'" + bytes.map(renderByte).join('') + "'";
}

function encodeUtf8(s) {
  const bytes = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) bytes.push(cp);
    else if (cp < 0x800) { bytes.push(0xc0 | (cp >> 6)); bytes.push(0x80 | (cp & 0x3f)); }
    else if (cp < 0x10000) { bytes.push(0xe0 | (cp >> 12)); bytes.push(0x80 | ((cp >> 6) & 0x3f)); bytes.push(0x80 | (cp & 0x3f)); }
    else { bytes.push(0xf0 | (cp >> 18)); bytes.push(0x80 | ((cp >> 12) & 0x3f)); bytes.push(0x80 | ((cp >> 6) & 0x3f)); bytes.push(0x80 | (cp & 0x3f)); }
  }
  return bytes;
}
function encodeAscii(s) {
  const bytes = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x80) throw new ValueErrorLike(`'ascii' codec can't encode character '\\x${cp.toString(16).padStart(2, '0')}'`);
    bytes.push(cp);
  }
  return bytes;
}
function encodeLatin1(s) {
  const bytes = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x100) throw new ValueErrorLike(`'latin-1' codec can't encode character '\\u${cp.toString(16).padStart(4, '0')}'`);
    bytes.push(cp);
  }
  return bytes;
}

export default function pyBytes(source, encoding) {
  const src = source === null || source === undefined ? '' : String(source).trim();

  // Empty source with no encoding → empty bytes.
  if (src === '' && (!encoding || encoding === '')) {
    return bytesToLiteral([]);
  }

  // Look for pure integer → n zero bytes.
  if (/^-?\d+$/.test(src)) {
    const n = parseInt(src, 10);
    if (n < 0) throw new ValueErrorLike('negative count');
    return bytesToLiteral(new Array(n).fill(0));
  }

  // Look for comma-separated ints → from those bytes.
  if (src.includes(',') && /^[\d,\s]+$/.test(src)) {
    const parts = src.split(',').map(s => s.trim()).filter(s => s !== '');
    const bytes = [];
    for (const p of parts) {
      const n = parseInt(p, 10);
      if (!Number.isFinite(n) || n < 0 || n > 255) {
        throw new ValueErrorLike('bytes must be in range(0, 256)');
      }
      bytes.push(n);
    }
    return bytesToLiteral(bytes);
  }

  // Otherwise treat as a string — requires encoding.
  if (!encoding || encoding === '') {
    throw new TypeErrorLike('string argument without an encoding');
  }
  const enc = String(encoding).toLowerCase();
  let bytes;
  if (enc === 'utf-8' || enc === 'utf8') bytes = encodeUtf8(src);
  else if (enc === 'ascii') bytes = encodeAscii(src);
  else if (enc === 'latin-1' || enc === 'latin1' || enc === 'iso-8859-1') bytes = encodeLatin1(src);
  else throw new Error(`LookupError: unknown encoding: ${enc}`);
  return bytesToLiteral(bytes);
}