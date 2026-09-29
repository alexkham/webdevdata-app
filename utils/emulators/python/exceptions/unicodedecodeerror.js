// utils/emulators/python/exceptions/unicodedecodeerror.js
//
// Emulator for the UnicodeDecodeError demo modes, plus the byte-level
// codec helpers the unicode pages share (unicodeencodeerror.js and
// unicodeerror.js import them from here). Everything works on real byte
// arrays and code-point positions, so the positions in the messages are
// the ones CPython reports:
//   utf8Decode(bytes, errors) — CPython's UTF-8 decoder: maximal-subpart
//                               error ranges, "invalid start byte" /
//                               "invalid continuation byte" /
//                               "unexpected end of data"
//   asciiDecode(bytes)        — strict 'ascii' decode
//   encodeLimited(s, codec, limit, errors) — 'ascii' (128) / 'latin-1'
//                               (256) encoders with the standard handlers
//   utf8Encode(s)             — strict UTF-8 encode (TextEncoder), with
//                               CPython's "surrogates not allowed" error
//   fromHex(s)                — bytes.fromhex() with its ValueError
//   bytesRepr(bytes)          — repr(bytes)

import { raise, PyException } from '../../../py-exceptions.js';
import { codePoints, escapeCodePoint, strRepr, raw } from './valueerror.js';

const hex2 = (n) => n.toString(16).padStart(2, '0');

// ── repr(bytes) ────────────────────────────────────────────────
export function bytesRepr(bytes) {
  const has = (c) => bytes.includes(c.charCodeAt(0));
  const useDouble = has("'") && !has('"');
  const q = useDouble ? '"' : "'";
  let body = '';
  for (const b of bytes) {
    const ch = String.fromCharCode(b);
    if (ch === '\\') body += '\\\\';
    else if (ch === q) body += '\\' + q;
    else if (ch === '\t') body += '\\t';
    else if (ch === '\n') body += '\\n';
    else if (ch === '\r') body += '\\r';
    else if (b >= 0x20 && b < 0x7f) body += ch;
    else body += '\\x' + hex2(b);
  }
  return 'b' + q + body + q;
}

// ── bytes.fromhex ──────────────────────────────────────────────
const ASCII_SPACE = new Set([0x20, 0x09, 0x0a, 0x0d, 0x0b, 0x0c]);
const hexVal = (cp) => {
  if (cp >= 0x30 && cp <= 0x39) return cp - 0x30;
  if (cp >= 0x61 && cp <= 0x66) return cp - 0x61 + 10;
  if (cp >= 0x41 && cp <= 0x46) return cp - 0x41 + 10;
  return -1;
};

export function fromHex(s) {
  const cps = codePoints(s);
  const out = [];
  const bad = (pos) => raise('ValueError', `non-hexadecimal number found in fromhex() arg at position ${pos}`);
  // A non-ASCII str is rejected up front, at its first non-ASCII
  // character — even when an earlier ASCII character is not hex either.
  const firstNonAscii = cps.findIndex((cp) => cp > 0x7f);
  if (firstNonAscii >= 0) bad(firstNonAscii);
  let i = 0;
  while (i < cps.length) {
    if (ASCII_SPACE.has(cps[i])) { i += 1; continue; }
    const hi = hexVal(cps[i]);
    if (hi < 0) bad(i);
    const lo = i + 1 < cps.length ? hexVal(cps[i + 1]) : -1;
    if (lo < 0) bad(i + 1);
    out.push(hi * 16 + lo);
    i += 2;
  }
  return out;
}

// ── decoding ───────────────────────────────────────────────────
function decodeErrorMessage(codec, bytes, start, end, reason) {
  if (start < bytes.length && end === start + 1) {
    return `'${codec}' codec can't decode byte 0x${hex2(bytes[start])} in position ${start}: ${reason}`;
  }
  return `'${codec}' codec can't decode bytes in position ${start}-${end - 1}: ${reason}`;
}

const isCont = (b) => b !== undefined && b >= 0x80 && b <= 0xbf;

// One step of CPython's UTF-8 decoder (Objects/stringlib/codecs.h) at
// position i. Returns { cp, len } for a valid character, or
// { error: reason, end } for an invalid one.
function utf8Step(bytes, i) {
  const n = bytes.length;
  const ch = bytes[i];
  const b1 = bytes[i + 1];
  const b2 = bytes[i + 2];
  const b3 = bytes[i + 3];
  const invStart = { error: 'invalid start byte', end: i + 1 };
  const invCont = (k) => ({ error: 'invalid continuation byte', end: i + k });
  const eod = { error: 'unexpected end of data', end: n };
  if (ch < 0x80) return { cp: ch, len: 1 };
  if (ch < 0xc2) return invStart;
  if (ch < 0xe0) {
    if (n - i < 2) return eod;
    if (!isCont(b1)) return invCont(1);
    return { cp: ((ch & 0x1f) << 6) | (b1 & 0x3f), len: 2 };
  }
  if (ch < 0xf0) {
    // E0 needs A0..BF (no overlongs), ED needs 80..9F (no surrogates)
    const badSecond = !isCont(b1) || (ch === 0xe0 && b1 < 0xa0) || (ch === 0xed && b1 >= 0xa0);
    if (n - i < 3) {
      if (n - i < 2) return eod;
      if (badSecond) return invCont(1);
      return eod;
    }
    if (badSecond) return invCont(1);
    if (!isCont(b2)) return invCont(2);
    return { cp: ((ch & 0x0f) << 12) | ((b1 & 0x3f) << 6) | (b2 & 0x3f), len: 3 };
  }
  if (ch < 0xf5) {
    // F0 needs 90..BF (no overlongs), F4 needs 80..8F (max U+10FFFF)
    const badSecond = !isCont(b1) || (ch === 0xf0 && b1 < 0x90) || (ch === 0xf4 && b1 >= 0x90);
    if (n - i < 4) {
      if (n - i < 2) return eod;
      if (badSecond) return invCont(1);
      if (n - i < 3) return eod;
      if (!isCont(b2)) return invCont(2);
      return eod;
    }
    if (badSecond) return invCont(1);
    if (!isCont(b2)) return invCont(2);
    if (!isCont(b3)) return invCont(3);
    return { cp: ((ch & 0x07) << 18) | ((b1 & 0x3f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f), len: 4 };
  }
  return invStart;
}

// errors: 'strict' | 'replace' | 'ignore' | 'backslashreplace'
export function utf8Decode(bytes, errors = 'strict') {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const step = utf8Step(bytes, i);
    if (step.error === undefined) {
      out += String.fromCodePoint(step.cp);
      i += step.len;
      continue;
    }
    const { end } = step;
    if (errors === 'strict') raise('UnicodeDecodeError', decodeErrorMessage('utf-8', bytes, i, end, step.error));
    else if (errors === 'replace') out += '�';
    else if (errors === 'backslashreplace') out += bytes.slice(i, end).map((b) => '\\x' + hex2(b)).join('');
    // 'ignore' drops the bad range
    i = end;
  }
  return out;
}

// Strict 'ascii' decode — every byte >= 0x80 is its own one-byte error.
// Returns the text, or throws with the first error's start/end attached.
export function asciiDecode(bytes) {
  for (let i = 0; i < bytes.length; i += 1) {
    if (bytes[i] >= 0x80) {
      const e = new PyException('UnicodeDecodeError', decodeErrorMessage('ascii', bytes, i, i + 1, 'ordinal not in range(128)'));
      Object.assign(e, { start: i, end: i + 1, reason: 'ordinal not in range(128)' });
      throw e;
    }
  }
  return String.fromCharCode(...bytes);
}

// ── encoding ───────────────────────────────────────────────────
function encodeErrorMessage(codec, cps, start, end, reason) {
  if (start < cps.length && end === start + 1) {
    return `'${codec}' codec can't encode character '${escapeCodePoint(cps[start])}' in position ${start}: ${reason}`;
  }
  return `'${codec}' codec can't encode characters in position ${start}-${end - 1}: ${reason}`;
}

function encodeError(codec, cps, start, end, reason) {
  const e = new PyException('UnicodeEncodeError', encodeErrorMessage(codec, cps, start, end, reason));
  Object.assign(e, { start, end, reason });
  throw e;
}

// 'ascii' (limit 128) and 'latin-1' (limit 256). A strict error covers
// the whole run of consecutive unencodable characters.
// errors: 'strict' | 'replace' | 'ignore' | 'xmlcharrefreplace' | 'backslashreplace'
export function encodeLimited(s, codec, limit, errors = 'strict') {
  const cps = codePoints(s);
  const out = [];
  for (let i = 0; i < cps.length; i += 1) {
    const cp = cps[i];
    if (cp < limit) { out.push(cp); continue; }
    if (errors === 'strict') {
      let end = i + 1;
      while (end < cps.length && cps[end] >= limit) end += 1;
      encodeError(codec, cps, i, end, `ordinal not in range(${limit})`);
    }
    let rep = '';
    if (errors === 'replace') rep = '?';
    else if (errors === 'xmlcharrefreplace') rep = `&#${cp};`;
    else if (errors === 'backslashreplace') rep = escapeCodePoint(cp);
    for (const c of rep) out.push(c.charCodeAt(0));
  }
  return out;
}

const isSurrogate = (cp) => cp >= 0xd800 && cp <= 0xdfff;

// Strict UTF-8 encode. Lone surrogates cannot be encoded; CPython reports
// the whole run of them.
export function utf8Encode(s) {
  const cps = codePoints(s);
  for (let i = 0; i < cps.length; i += 1) {
    if (isSurrogate(cps[i])) {
      let end = i + 1;
      while (end < cps.length && isSurrogate(cps[end])) end += 1;
      encodeError('utf-8', cps, i, end, 'surrogates not allowed');
    }
  }
  return Array.from(new TextEncoder().encode(s));
}

// ── the demo modes ─────────────────────────────────────────────
export default {
  // text.encode('latin-1').decode('utf-8') — the classic wrong-codec bug
  trigger: (text) => {
    const data = encodeLimited(text, 'latin-1', 256);
    return raw(strRepr(utf8Decode(data)));
  },

  handle: (hexText) => {
    const data = fromHex(hexText);
    return {
      __pyTuple: ['replace', 'ignore', 'backslashreplace'].map((h) => raw(strRepr(utf8Decode(data, h)))),
    };
  },
};
