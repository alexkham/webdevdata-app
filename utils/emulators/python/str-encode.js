// utils/emulators/python/str-encode.js
//
// Emulator for Python str.encode(encoding). Supports three encodings for
// the demo — utf-8, ascii, latin-1 (aka iso-8859-1) — under errors=strict.
//
// Returns a Python-style bytes repr like "b'caf\xc3\xa9'" so users see
// the result the way it would print in a Python REPL.

class UnicodeEncodeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'UnicodeEncodeError'; }
}

// Render a single byte as it would appear inside a bytes repr.
function renderByte(b) {
  // Printable ASCII (except backslash and quote) → literal char.
  if (b >= 0x20 && b < 0x7f && b !== 0x5c && b !== 0x27) {
    return String.fromCharCode(b);
  }
  // Common escapes.
  if (b === 0x5c) return '\\\\';
  if (b === 0x27) return "\\'";
  if (b === 0x09) return '\\t';
  if (b === 0x0a) return '\\n';
  if (b === 0x0d) return '\\r';
  return '\\x' + b.toString(16).padStart(2, '0');
}

function encodeUtf8(s) {
  const bytes = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) {
      bytes.push(cp);
    } else if (cp < 0x800) {
      bytes.push(0xc0 | (cp >> 6));
      bytes.push(0x80 | (cp & 0x3f));
    } else if (cp < 0x10000) {
      bytes.push(0xe0 | (cp >> 12));
      bytes.push(0x80 | ((cp >> 6) & 0x3f));
      bytes.push(0x80 | (cp & 0x3f));
    } else {
      bytes.push(0xf0 | (cp >> 18));
      bytes.push(0x80 | ((cp >> 12) & 0x3f));
      bytes.push(0x80 | ((cp >> 6) & 0x3f));
      bytes.push(0x80 | (cp & 0x3f));
    }
  }
  return bytes;
}

function encodeAscii(s) {
  const bytes = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x80) {
      throw new UnicodeEncodeErrorLike(
        `'ascii' codec can't encode character '\\x${cp.toString(16).padStart(2, '0')}' in position ${bytes.length}: ordinal not in range(128)`
      );
    }
    bytes.push(cp);
  }
  return bytes;
}

function encodeLatin1(s) {
  const bytes = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x100) {
      throw new UnicodeEncodeErrorLike(
        `'latin-1' codec can't encode character '\\u${cp.toString(16).padStart(4, '0')}' in position ${bytes.length}: ordinal not in range(256)`
      );
    }
    bytes.push(cp);
  }
  return bytes;
}

export default function strEncode(string, encoding) {
  const s = String(string == null ? '' : string);
  const enc = String(encoding == null || encoding === '' ? 'utf-8' : encoding).toLowerCase();

  let bytes;
  if (enc === 'utf-8' || enc === 'utf8') {
    bytes = encodeUtf8(s);
  } else if (enc === 'ascii') {
    bytes = encodeAscii(s);
  } else if (enc === 'latin-1' || enc === 'latin1' || enc === 'iso-8859-1') {
    bytes = encodeLatin1(s);
  } else {
    throw new Error(`LookupError: unknown encoding: ${enc}`);
  }

  // Render as Python bytes literal.
  return "b'" + bytes.map(renderByte).join('') + "'";
}