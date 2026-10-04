// utils/emulators/python/stdlib/base64/_pybase64.js
//
// Port of CPython 3.13's base64 module (Lib/base64.py) and the binascii
// functions it calls (Modules/binascii.c: b2a_base64, a2b_base64 with
// strict_mode, hexlify, unhexlify) for the base64 demos — shared by the
// module hub and every member emulator. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// Value model:
//   bytes → plain JS Array of ints 0..255
//   str   → JS string
// Errors are PyExceptions named the way a traceback's last line shows
// them: 'binascii.Error', 'ValueError', 'TypeError', 'AssertionError'.

import { PyException } from '../../../../py-exceptions.js';
import { bytesRepr, utf8Decode, utf8Encode } from '../../exceptions/unicodedecodeerror.js';

export { bytesRepr, utf8Decode, utf8Encode };

const binErr = (msg) => new PyException('binascii.Error', msg);
const valErr = (msg) => new PyException('ValueError', msg);

const isBytes = (v) => Array.isArray(v) || v instanceof Uint8Array;
const typeName = (v) => {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (isBytes(v)) return 'bytes';
  return 'object';
};

// repr(bytes) wrapped for the demo output
export const asBytes = (b) => ({ __pyRaw: bytesRepr(b) });

// b'...' / 'text' helpers
export const ascii = (s) => Array.from(s, (c) => c.charCodeAt(0));
const ASCII_DECODE = (b) => String.fromCharCode(...b);

// bytes.decode('ascii') for output that is always ASCII
export const toAscii = (b) => {
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return s;
};

// _bytes_from_decode_data
export function bytesFromDecodeData(s) {
  if (typeof s === 'string') {
    for (const ch of s) {
      if (ch.codePointAt(0) > 0x7f) throw valErr('string argument should contain only ASCII characters');
    }
    return ascii(s);
  }
  if (isBytes(s)) return Array.from(s);
  throw new PyException('TypeError', `argument should be a bytes-like object or ASCII string, not '${typeName(s)}'`);
}

// encoders accept bytes-like objects only (binascii / memoryview errors)
function needBytes(s) {
  if (isBytes(s)) return Array.from(s);
  throw new PyException('TypeError', `a bytes-like object is required, not '${typeName(s)}'`);
}

// bytes.translate(bytes.maketrans(from, to))
function translate(b, from, to) {
  const table = [];
  for (let i = 0; i < 256; i++) table.push(i);
  for (let i = 0; i < from.length; i++) table[from[i]] = to[i];
  return b.map((x) => table[x]);
}

// bytes.upper(): ASCII only
const upper = (b) => b.map((x) => (x >= 0x61 && x <= 0x7a ? x - 32 : x));

// ─── binascii ────────────────────────────────────────────────

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64REV = new Array(256).fill(64);
for (let i = 0; i < 64; i++) B64REV[B64.charCodeAt(i)] = i;

export function b2aBase64(data, newline = true) {
  const b = needBytes(data);
  const out = [];
  let i = 0;
  for (; i + 3 <= b.length; i += 3) {
    const n = (b[i] << 16) | (b[i + 1] << 8) | b[i + 2];
    out.push(B64.charCodeAt(n >> 18), B64.charCodeAt((n >> 12) & 63), B64.charCodeAt((n >> 6) & 63), B64.charCodeAt(n & 63));
  }
  const rest = b.length - i;
  if (rest === 1) {
    const n = b[i] << 16;
    out.push(B64.charCodeAt(n >> 18), B64.charCodeAt((n >> 12) & 63), 61, 61);
  } else if (rest === 2) {
    const n = (b[i] << 16) | (b[i + 1] << 8);
    out.push(B64.charCodeAt(n >> 18), B64.charCodeAt((n >> 12) & 63), B64.charCodeAt((n >> 6) & 63), 61);
  }
  if (newline) out.push(10);
  return out;
}

// binascii.a2b_base64(data, strict_mode=...) — the 3.13 state machine
export function a2bBase64(data, strict = false) {
  const b = typeof data === 'string' ? bytesFromDecodeData(data) : needBytes(data);
  const out = [];
  if (strict && b.length > 0 && b[0] === 61) throw binErr('Leading padding not allowed');
  let quadPos = 0;
  let leftchar = 0;
  let pads = 0;
  let paddingStarted = false;
  for (let i = 0; i < b.length; i++) {
    let ch = b[i];
    if (ch === 61) { // '='
      paddingStarted = true;
      if (strict && quadPos === 0) throw binErr('Excess padding not allowed');
      if (quadPos >= 2 && quadPos + ++pads >= 4) {
        if (strict && i + 1 < b.length) throw binErr('Excess data after padding');
        return out;
      }
      continue;
    }
    ch = B64REV[ch];
    if (ch >= 64) {
      if (strict) throw binErr('Only base64 data is allowed');
      continue;
    }
    if (strict && paddingStarted) throw binErr('Discontinuous padding not allowed');
    pads = 0;
    switch (quadPos) {
      case 0: quadPos = 1; leftchar = ch; break;
      case 1: quadPos = 2; out.push(((leftchar << 2) | (ch >> 4)) & 0xff); leftchar = ch & 0x0f; break;
      case 2: quadPos = 3; out.push(((leftchar << 4) | (ch >> 2)) & 0xff); leftchar = ch & 0x03; break;
      default: quadPos = 0; out.push(((leftchar << 6) | ch) & 0xff); leftchar = 0; break;
    }
  }
  if (quadPos === 1) {
    const n = Math.floor(out.length / 3) * 4 + 1;
    throw binErr(`Invalid base64-encoded string: number of data characters (${n}) cannot be 1 more than a multiple of 4`);
  }
  if (quadPos !== 0) throw binErr('Incorrect padding');
  return out;
}

const HEX = '0123456789abcdef';
export const hexlify = (data) => needBytes(data).flatMap((x) => [HEX.charCodeAt(x >> 4), HEX.charCodeAt(x & 15)]);

function unhexlify(b) {
  if (b.length % 2) throw binErr('Odd-length string');
  const v = (c) => {
    if (c >= 48 && c <= 57) return c - 48;
    if (c >= 65 && c <= 70) return c - 55;
    if (c >= 97 && c <= 102) return c - 87;
    return -1;
  };
  const out = [];
  for (let i = 0; i < b.length; i += 2) {
    const hi = v(b[i]);
    const lo = v(b[i + 1]);
    if (hi < 0 || lo < 0) throw binErr('Non-hexadecimal digit found');
    out.push(hi * 16 + lo);
  }
  return out;
}

// ─── Base64 ──────────────────────────────────────────────────

function assertLen(alt, n) {
  if (alt.length !== n) throw new PyException('AssertionError', bytesRepr(alt));
}

export function b64encode(s, altchars = null) {
  const encoded = b2aBase64(s, false);
  if (altchars !== null) {
    if (!isBytes(altchars)) throw new PyException('TypeError', `a bytes-like object is required, not '${typeName(altchars)}'`);
    assertLen(altchars, 2);
    return translate(encoded, [43, 47], Array.from(altchars));
  }
  return encoded;
}

export function b64decode(s, altchars = null, validate = false) {
  let b = bytesFromDecodeData(s);
  if (altchars !== null) {
    const alt = bytesFromDecodeData(altchars);
    assertLen(alt, 2);
    b = translate(b, alt, [43, 47]);
  }
  return a2bBase64(b, validate);
}

export const standardB64encode = (s) => b64encode(s);
export const standardB64decode = (s) => b64decode(s);
export const urlsafeB64encode = (s) => translate(b64encode(s), [43, 47], [45, 95]);
export function urlsafeB64decode(s) {
  const b = translate(bytesFromDecodeData(s), [45, 95], [43, 47]);
  return b64decode(b);
}

// ─── Base32 ──────────────────────────────────────────────────

const B32 = ascii('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
const B32HEX = ascii('0123456789ABCDEFGHIJKLMNOPQRSTUV');

function b32enc(alphabet, s) {
  let b = needBytes(s);
  const leftover = b.length % 5;
  if (leftover) b = b.concat(new Array(5 - leftover).fill(0));
  const out = [];
  for (let i = 0; i < b.length; i += 5) {
    let c = 0n;
    for (let k = 0; k < 5; k++) c = (c << 8n) | BigInt(b[i + k]);
    for (let k = 7; k >= 0; k--) out.push(alphabet[Number((c >> BigInt(5 * k)) & 31n)]);
  }
  const padN = { 1: 6, 2: 4, 3: 3, 4: 1 }[leftover] || 0;
  for (let k = 0; k < padN; k++) out[out.length - 1 - k] = 61;
  return out;
}

function b32dec(alphabet, s, casefold = false, map01 = null) {
  const rev = new Map(alphabet.map((c, i) => [c, i]));
  let b = bytesFromDecodeData(s);
  if (b.length % 8) throw binErr('Incorrect padding');
  if (map01 !== null) {
    const m = bytesFromDecodeData(map01);
    assertLen(m, 1);
    b = translate(b, [48, 49], [79, m[0]]);
  }
  if (casefold) b = upper(b);
  const l = b.length;
  let end = l;
  while (end > 0 && b[end - 1] === 61) end--;
  b = b.slice(0, end);
  const padchars = l - b.length;
  const decoded = [];
  let acc = 0n;
  for (let i = 0; i < b.length; i += 8) {
    acc = 0n;
    for (const c of b.slice(i, i + 8)) {
      if (!rev.has(c)) throw binErr('Non-base32 digit found');
      acc = (acc << 5n) + BigInt(rev.get(c));
    }
    // acc.to_bytes(5): fits unless the quantum was short
    decoded.push(...toBytes5(acc));
  }
  if (l % 8 || ![0, 1, 3, 4, 6].includes(padchars)) throw binErr('Incorrect padding');
  if (padchars && decoded.length) {
    acc <<= BigInt(5 * padchars);
    const last = toBytes5(acc);
    const leftover = Math.floor((43 - 5 * padchars) / 8);
    decoded.splice(decoded.length - 5, 5, ...last.slice(0, leftover));
  }
  return decoded;
}

function toBytes5(acc) {
  if (acc >= 1n << 40n) throw new PyException('OverflowError', 'int too big to convert');
  const out = [];
  for (let k = 4; k >= 0; k--) out.push(Number((acc >> BigInt(8 * k)) & 255n));
  return out;
}

export const b32encode = (s) => b32enc(B32, s);
export const b32decode = (s, casefold = false, map01 = null) => b32dec(B32, s, casefold, map01);
export const b32hexencode = (s) => b32enc(B32HEX, s);
export const b32hexdecode = (s, casefold = false) => b32dec(B32HEX, s, casefold);

// ─── Base16 ──────────────────────────────────────────────────

export const b16encode = (s) => upper(hexlify(s));

export function b16decode(s, casefold = false) {
  let b = bytesFromDecodeData(s);
  if (casefold) b = upper(b);
  if (b.some((c) => !((c >= 48 && c <= 57) || (c >= 65 && c <= 70)))) throw binErr('Non-base16 digit found');
  return unhexlify(b);
}

// ─── Ascii85 / Base85 / Z85 ──────────────────────────────────

const A85CHARS = [];
for (let i = 33; i < 118; i++) A85CHARS.push(i);
const B85 = ascii('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~');
const Z85 = ascii('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#');

function enc85(data, chars, pad = false, foldnuls = false, foldspaces = false) {
  let b = needBytes(data);
  const padding = (4 - (b.length % 4)) % 4;
  if (padding) b = b.concat(new Array(padding).fill(0));
  const chunks = [];
  for (let i = 0; i < b.length; i += 4) {
    const word = ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
    if (foldnuls && word === 0) chunks.push([122]);
    else if (foldspaces && word === 0x20202020) chunks.push([121]);
    else {
      const d = [];
      let w = word;
      for (let k = 0; k < 5; k++) { d.unshift(chars[w % 85]); w = Math.floor(w / 85); }
      chunks.push(d);
    }
  }
  if (padding && !pad) {
    if (chunks[chunks.length - 1].length === 1 && chunks[chunks.length - 1][0] === 122) {
      chunks[chunks.length - 1] = new Array(5).fill(chars[0]);
    }
    const last = chunks[chunks.length - 1];
    chunks[chunks.length - 1] = last.slice(0, Math.max(0, last.length - padding));
  }
  return chunks.flat();
}

export function a85encode(b, { foldspaces = false, wrapcol = 0, pad = false, adobe = false } = {}) {
  let result = enc85(b, A85CHARS, pad, true, foldspaces);
  if (adobe) result = [60, 126].concat(result);
  if (wrapcol) {
    wrapcol = Math.max(adobe ? 2 : 1, wrapcol);
    const chunks = [];
    for (let i = 0; i < result.length; i += wrapcol) chunks.push(result.slice(i, i + wrapcol));
    if (adobe && chunks[chunks.length - 1].length + 2 > wrapcol) chunks.push([]);
    result = chunks.flatMap((c, i) => (i ? [10, ...c] : c));
  }
  if (adobe) result = result.concat([126, 62]);
  return result;
}

const DEFAULT_IGNORE = [32, 9, 10, 13, 11];

export function a85decode(data, { foldspaces = false, adobe = false, ignorechars = DEFAULT_IGNORE } = {}) {
  let b = bytesFromDecodeData(data);
  if (adobe) {
    const n = b.length;
    if (!(n >= 2 && b[n - 2] === 126 && b[n - 1] === 62)) {
      throw valErr("Ascii85 encoded byte sequences must end with b'~>'");
    }
    if (b[0] === 60 && b[1] === 126) b = b.slice(2, n - 2);
    else b = b.slice(0, n - 2);
  }
  const ignore = new Set(ignorechars);
  const decoded = [];
  let curr = [];
  for (const x of b.concat([117, 117, 117, 117])) {
    if (x >= 33 && x <= 117) {
      curr.push(x);
      if (curr.length === 5) {
        let acc = 0;
        for (const c of curr) acc = 85 * acc + (c - 33);
        if (acc > 0xffffffff) throw valErr('Ascii85 overflow');
        decoded.push((acc >>> 24) & 255, (acc >>> 16) & 255, (acc >>> 8) & 255, acc & 255);
        curr = [];
      }
    } else if (x === 122) {
      if (curr.length) throw valErr('z inside Ascii85 5-tuple');
      decoded.push(0, 0, 0, 0);
    } else if (foldspaces && x === 121) {
      if (curr.length) throw valErr('y inside Ascii85 5-tuple');
      decoded.push(32, 32, 32, 32);
    } else if (ignore.has(x)) {
      continue;
    } else {
      throw valErr('Non-Ascii85 digit found: ' + String.fromCharCode(x));
    }
  }
  const padding = 4 - curr.length;
  // result[:-padding] (padding is 1..4 here, never 0)
  return padding ? decoded.slice(0, Math.max(0, decoded.length - padding)) : decoded;
}

export const b85encode = (b, pad = false) => enc85(b, B85, pad);

const B85DEC = new Array(256).fill(null);
B85.forEach((c, i) => { B85DEC[c] = i; });

export function b85decode(data) {
  let b = bytesFromDecodeData(data);
  const padding = (5 - (b.length % 5)) % 5;
  b = b.concat(new Array(padding).fill(126));
  const out = [];
  for (let i = 0; i < b.length; i += 5) {
    let acc = 0;
    for (let j = 0; j < 5; j++) {
      const v = B85DEC[b[i + j]];
      if (v === null) throw valErr(`bad base85 character at position ${i + j}`);
      acc = acc * 85 + v;
    }
    if (acc > 0xffffffff) throw valErr(`base85 overflow in hunk starting at byte ${i}`);
    out.push((acc >>> 24) & 255, (acc >>> 16) & 255, (acc >>> 8) & 255, acc & 255);
  }
  return padding ? out.slice(0, Math.max(0, out.length - padding)) : out;
}

const Z85_DECODE_FROM = Z85.concat(ascii(';_`|~'));
const Z85_DECODE_TO = B85.concat([0, 0, 0, 0, 0]);

export const z85encode = (s) => translate(b85encode(s), B85, Z85);

export function z85decode(s) {
  const b = translate(bytesFromDecodeData(s), Z85_DECODE_FROM, Z85_DECODE_TO);
  try {
    return b85decode(b);
  } catch (e) {
    if (e.name === 'ValueError') throw valErr(e.message.replace(/base85/g, 'z85'));
    throw e;
  }
}

// ─── Legacy: encodebytes / decodebytes / encode / decode ─────

const MAXBINSIZE = 57; // (76 // 4) * 3

function inputTypeCheck(s) {
  if (!isBytes(s)) throw new PyException('TypeError', `expected bytes-like object, not ${typeName(s)}`);
}

export function encodebytes(s) {
  inputTypeCheck(s);
  const b = Array.from(s);
  const out = [];
  for (let i = 0; i < b.length; i += MAXBINSIZE) out.push(...b2aBase64(b.slice(i, i + MAXBINSIZE)));
  return out;
}

export function decodebytes(s) {
  inputTypeCheck(s);
  return a2bBase64(Array.from(s));
}

// base64.encode(io.BytesIO(data), out) → out.getvalue()
export function encodeFile(data) {
  const b = needBytes(data);
  const out = [];
  for (let i = 0; i < b.length; i += MAXBINSIZE) out.push(...b2aBase64(b.slice(i, i + MAXBINSIZE)));
  return out;
}

// base64.decode(io.BytesIO(data), out) → out.getvalue(); a line at a time.
// Throws after the earlier lines were written — `written` on the error.
export function decodeFile(data) {
  const b = needBytes(data);
  const out = [];
  let i = 0;
  while (i < b.length) {
    let j = b.indexOf(10, i);
    j = j === -1 ? b.length : j + 1;
    try {
      out.push(...a2bBase64(b.slice(i, j)));
    } catch (e) {
      e.written = out.slice();
      throw e;
    }
    i = j;
  }
  return out;
}

// text → UTF-8 bytes (str.encode())
export const enc = (text) => utf8Encode(text);
export const dec = (bytes) => utf8Decode(bytes);
export { ASCII_DECODE };
