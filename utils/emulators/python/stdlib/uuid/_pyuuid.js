// utils/emulators/python/stdlib/uuid/_pyuuid.js
//
// Port of CPython 3.13 Lib/uuid.py for the uuid demos: the UUID class
// (every constructor form, every property, str/repr, comparisons), uuid1
// with an explicit node and clock_seq (the timestamp part is shown by no
// demo), uuid3 (MD5), uuid4 from given bytes, uuid5 (SHA-1), the four
// NAMESPACE_* constants and SafeUUID. MD5 and SHA-1 are implemented here
// (RFC 1321 / FIPS 180-4) so namespace-based UUIDs are exact.
//
// The hex-string constructor follows uuid.py literally: remove 'urn:' and
// 'uuid:' anywhere, strip '{' / '}' from both ends, remove every '-', then
// demand exactly 32 characters and parse them with int(hex, 16) — whose
// rules (whitespace, sign, 0x prefix, underscores, non-ASCII decimal
// digits) are ported too, because they decide what is accepted.

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

const raise = (type, msg) => { throw new PyException(type, msg); };

// ── str → UTF-8 bytes (str.encode('utf-8'): lone surrogates fail) ──
export function utf8(s) {
  const out = [];
  let i = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      const hex = cp.toString(16).padStart(4, '0');
      raise('UnicodeEncodeError', `'utf-8' codec can't encode character '\\u${hex}' in position ${i}: surrogates not allowed`);
    }
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    i += 1;
  }
  return Uint8Array.from(out);
}

// ── MD5 (RFC 1321) ───────────────────────────────────────────
const MD5_S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
const MD5_K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

function pad(msg, bigEndian) {
  const n = msg.length;
  const total = ((n + 8) >> 6) * 64 + 64;
  const buf = new Uint8Array(total);
  buf.set(msg);
  buf[n] = 0x80;
  const bits = BigInt(n) * 8n;
  for (let i = 0; i < 8; i++) {
    const byte = Number((bits >> BigInt(8 * i)) & 0xffn);
    buf[bigEndian ? total - 1 - i : total - 8 + i] = byte;
  }
  return buf;
}

export function md5(msg) {
  const buf = pad(msg, false);
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const M = new Uint32Array(16);
  for (let off = 0; off < buf.length; off += 64) {
    for (let j = 0; j < 16; j++) {
      const p = off + 4 * j;
      M[j] = buf[p] | (buf[p + 1] << 8) | (buf[p + 2] << 16) | (buf[p + 3] << 24);
    }
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + MD5_K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      const s = MD5_S[(i >> 4) * 4 + (i % 4)];
      B = (B + ((F << s) | (F >>> (32 - s)))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const out = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((w, k) => { for (let i = 0; i < 4; i++) out[4 * k + i] = (w >>> (8 * i)) & 0xff; });
  return out;
}

// ── SHA-1 (FIPS 180-4) ───────────────────────────────────────
export function sha1(msg) {
  const buf = pad(msg, true);
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
  const W = new Uint32Array(80);
  const rol = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
  for (let off = 0; off < buf.length; off += 64) {
    for (let j = 0; j < 16; j++) {
      const p = off + 4 * j;
      W[j] = ((buf[p] << 24) | (buf[p + 1] << 16) | (buf[p + 2] << 8) | buf[p + 3]) >>> 0;
    }
    for (let j = 16; j < 80; j++) W[j] = rol(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
      else if (j < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
      else { f = b ^ c ^ d; k = 0xca62c1d6; }
      const t = (rol(a, 5) + (f >>> 0) + e + k + W[j]) >>> 0;
      e = d; d = c; c = rol(b, 30); b = a; a = t;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
  }
  const out = new Uint8Array(20);
  [h0, h1, h2, h3, h4].forEach((w, k) => { for (let i = 0; i < 4; i++) out[4 * k + i] = (w >>> (24 - 8 * i)) & 0xff; });
  return out;
}

// ── int(s, 16) and bytes.fromhex(s), CPython rules ───────────
// Non-ASCII whitespace (str.isspace) and Unicode decimal digits are first
// mapped to ASCII, like _PyUnicode_TransformDecimalAndSpaceToASCII.
const UNI_SPACE = new Set([0x85, 0xa0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
  0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000]);
const ND = /\p{Nd}/u;
function decimalValue(cp) {
  // Nd characters come in runs of complete 0..9 sets
  let start = cp;
  while (start > 0 && ND.test(String.fromCodePoint(start - 1))) start -= 1;
  return (cp - start) % 10;
}
function toAscii(s) {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp < 128) out += ch;
    else if (UNI_SPACE.has(cp)) out += ' ';
    else if (ND.test(ch)) out += String(decimalValue(cp));
    else out += '?';
  }
  return out;
}
const isAsciiSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\v' || c === '\f' || c === '\r';
const hexVal = (c) => {
  if (c === undefined) return 99;
  const v = parseInt(c, 36);
  return Number.isNaN(v) || c.length !== 1 ? 99 : v;
};

export function pyIntHex(s) {
  const bad = () => raise('ValueError', `invalid literal for int() with base 16: ${pyStrRepr(s)}`);
  const t = toAscii(s);
  let i = 0;
  while (i < t.length && isAsciiSpace(t[i])) i++;
  let neg = false;
  if (t[i] === '+' || t[i] === '-') { neg = t[i] === '-'; i++; }
  if (t[i] === '0' && (t[i + 1] === 'x' || t[i + 1] === 'X')) {
    i += 2;
    if (t[i] === '_') i++;
  }
  let digits = '';
  let prevUnderscore = false;
  const startDigits = i;
  while (i < t.length) {
    const c = t[i];
    if (c === '_') {
      if (prevUnderscore || i === startDigits) bad();
      prevUnderscore = true;
      i++;
      continue;
    }
    if (hexVal(c) >= 16) break;
    digits += c;
    prevUnderscore = false;
    i++;
  }
  if (digits === '' || prevUnderscore) bad();
  while (i < t.length && isAsciiSpace(t[i])) i++;
  if (i !== t.length) bad();
  const v = BigInt('0x' + digits);
  return neg ? -v : v;
}

export function bytesFromHex(s) {
  const bad = (pos) => raise('ValueError', `non-hexadecimal number found in fromhex() arg at position ${pos}`);
  // a non-ASCII string fails at its first non-ASCII character, before any
  // other check (_PyBytes_FromHex)
  const cps = [...s];
  const firstNonAscii = cps.findIndex((ch) => ch.codePointAt(0) >= 128);
  if (firstNonAscii !== -1) bad(firstNonAscii);
  const t = s;
  const out = [];
  let i = 0;
  while (i < t.length) {
    if (isAsciiSpace(t[i])) {
      while (i < t.length && isAsciiSpace(t[i])) i++;
      if (i >= t.length) break;
    }
    const top = hexVal(t[i]);
    if (top >= 16) bad(i);
    const bot = hexVal(t[i + 1]);
    if (bot >= 16) bad(i + 1);
    out.push(top * 16 + bot);
    i += 2;
  }
  return Uint8Array.from(out);
}

// ── reprs ────────────────────────────────────────────────────
export function bytesRepr(b) {
  let hasSq = false, hasDq = false;
  for (const x of b) { if (x === 0x27) hasSq = true; if (x === 0x22) hasDq = true; }
  const q = hasSq && !hasDq ? '"' : "'";
  let out = 'b' + q;
  for (const x of b) {
    if (x === 0x5c) out += '\\\\';
    else if (String.fromCharCode(x) === q) out += '\\' + q;
    else if (x === 0x09) out += '\\t';
    else if (x === 0x0a) out += '\\n';
    else if (x === 0x0d) out += '\\r';
    else if (x < 0x20 || x >= 0x7f) out += '\\x' + x.toString(16).padStart(2, '0');
    else out += String.fromCharCode(x);
  }
  return out + q;
}
export const raw = (s) => ({ __pyRaw: s });
export const pyBytes = (b) => raw(bytesRepr(b));
export const pyHex = (n) => (n < 0n ? '-0x' + (-n).toString(16) : '0x' + n.toString(16));

// ── SafeUUID ─────────────────────────────────────────────────
export class SafeUUIDMember {
  constructor(name, value) { this.name = name; this.value = value; }
  repr() { return `<SafeUUID.${this.name}: ${this.value === null ? 'None' : this.value}>`; }
  toPy() { return raw(this.repr()); }
}
export const SafeUUID = {
  safe: new SafeUUIDMember('safe', 0),
  unsafe: new SafeUUIDMember('unsafe', -1),
  unknown: new SafeUUIDMember('unknown', null),
  members() { return [this.safe, this.unsafe, this.unknown]; },
  // SafeUUID(value)
  call(value) {
    const m = this.members().find((x) => x.value === value);
    if (!m) raise('ValueError', `${typeof value === 'string' ? pyStrRepr(value) : value} is not a valid SafeUUID`);
    return m;
  },
  // SafeUUID[name]
  item(name) {
    const m = this.members().find((x) => x.name === name);
    if (!m) raise('KeyError', pyStrRepr(name));
    return m;
  },
};

// ── UUID ─────────────────────────────────────────────────────
export const RESERVED_NCS = 'reserved for NCS compatibility';
export const RFC_4122 = 'specified in RFC 4122';
export const RESERVED_MICROSOFT = 'reserved for Microsoft compatibility';
export const RESERVED_FUTURE = 'reserved for future definition';

const M128 = 1n << 128n;

const bytesToInt = (b) => b.reduce((acc, x) => (acc << 8n) | BigInt(x), 0n);
const reorderLe = (b) => Uint8Array.from([b[3], b[2], b[1], b[0], b[5], b[4], b[7], b[6], ...b.slice(8)]);

export class UUID {
  // opts: { hex, bytes, bytes_le, fields, int, version, is_safe } —
  // bytes/bytes_le are Uint8Array, fields an array of BigInt, int a BigInt
  constructor(opts) {
    const { hex = null, bytes_le = null, fields = null, version = null } = opts;
    let { bytes = null, int = null } = opts;
    if ([hex, bytes, bytes_le, fields, int].filter((x) => x === null).length !== 4) {
      raise('TypeError', 'one of the hex, bytes, bytes_le, fields, or int arguments must be given');
    }
    if (hex !== null) {
      let h = hex.split('urn:').join('').split('uuid:').join('');
      h = h.replace(/^[{}]+/, '').replace(/[{}]+$/, '').split('-').join('');
      if ([...h].length !== 32) raise('ValueError', 'badly formed hexadecimal UUID string');
      int = pyIntHex(h);
    }
    if (bytes_le !== null) {
      if (bytes_le.length !== 16) raise('ValueError', 'bytes_le is not a 16-char string');
      bytes = reorderLe(bytes_le);
    }
    if (bytes !== null) {
      if (bytes.length !== 16) raise('ValueError', 'bytes is not a 16-char string');
      int = bytesToInt(bytes);
    }
    if (fields !== null) {
      if (fields.length !== 6) raise('ValueError', 'fields is not a 6-tuple');
      const [tl, tm, thv, cshv, csl, node] = fields.map(BigInt);
      const check = (v, bits, n, w) => {
        if (!(v >= 0n && v < (1n << BigInt(bits)))) raise('ValueError', `field ${n} out of range (need a${w} value)`);
      };
      check(tl, 32, 1, ' 32-bit'); check(tm, 16, 2, ' 16-bit'); check(thv, 16, 3, ' 16-bit');
      check(cshv, 8, 4, 'n 8-bit'); check(csl, 8, 5, 'n 8-bit'); check(node, 48, 6, ' 48-bit');
      const clockSeq = (cshv << 8n) | csl;
      int = (tl << 96n) | (tm << 80n) | (thv << 64n) | (clockSeq << 48n) | node;
    }
    if (int !== null) {
      int = BigInt(int);
      if (!(int >= 0n && int < M128)) raise('ValueError', 'int is out of range (need a 128-bit value)');
    }
    if (version !== null) {
      const v = BigInt(version);
      if (!(v >= 1n && v <= 5n)) raise('ValueError', 'illegal version number');
      int &= ~(0xc000n << 48n);
      int |= 0x8000n << 48n;
      int &= ~(0xf000n << 64n);
      int |= v << 76n;
    }
    this.int = int;
    this.is_safe = opts.is_safe || SafeUUID.unknown;
  }

  get hex() { return this.int.toString(16).padStart(32, '0'); }
  str() { const h = this.hex; return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`; }
  repr() { return `UUID(${pyStrRepr(this.str())})`; }
  toPy() { return raw(this.repr()); }
  get urn() { return 'urn:uuid:' + this.str(); }
  get bytes() {
    const out = new Uint8Array(16);
    let v = this.int;
    for (let i = 15; i >= 0; i--) { out[i] = Number(v & 0xffn); v >>= 8n; }
    return out;
  }
  get bytes_le() { return reorderLe(this.bytes); }
  get time_low() { return this.int >> 96n; }
  get time_mid() { return (this.int >> 80n) & 0xffffn; }
  get time_hi_version() { return (this.int >> 64n) & 0xffffn; }
  get clock_seq_hi_variant() { return (this.int >> 56n) & 0xffn; }
  get clock_seq_low() { return (this.int >> 48n) & 0xffn; }
  get node() { return this.int & 0xffffffffffffn; }
  get fields() { return [this.time_low, this.time_mid, this.time_hi_version, this.clock_seq_hi_variant, this.clock_seq_low, this.node]; }
  get time() { return ((this.time_hi_version & 0x0fffn) << 48n) | (this.time_mid << 32n) | this.time_low; }
  get clock_seq() { return ((this.clock_seq_hi_variant & 0x3fn) << 8n) | this.clock_seq_low; }
  get variant() {
    if (!(this.int & (0x8000n << 48n))) return RESERVED_NCS;
    if (!(this.int & (0x4000n << 48n))) return RFC_4122;
    if (!(this.int & (0x2000n << 48n))) return RESERVED_MICROSOFT;
    return RESERVED_FUTURE;
  }
  get version() { return this.variant === RFC_4122 ? Number((this.int >> 76n) & 0xfn) : null; }
}

export const fromStr = (s) => new UUID({ hex: s });

export const NAMESPACE_DNS = fromStr('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
export const NAMESPACE_URL = fromStr('6ba7b811-9dad-11d1-80b4-00c04fd430c8');
export const NAMESPACE_OID = fromStr('6ba7b812-9dad-11d1-80b4-00c04fd430c8');
export const NAMESPACE_X500 = fromStr('6ba7b814-9dad-11d1-80b4-00c04fd430c8');
export const NAMESPACES = { NAMESPACE_DNS, NAMESPACE_URL, NAMESPACE_OID, NAMESPACE_X500 };

const nameBytes = (name) => (typeof name === 'string' ? utf8(name) : name);
const concat = (a, b) => { const out = new Uint8Array(a.length + b.length); out.set(a); out.set(b, a.length); return out; };

export function uuid3(namespace, name) {
  return new UUID({ bytes: md5(concat(namespace.bytes, nameBytes(name))).slice(0, 16), version: 3 });
}
export function uuid5(namespace, name) {
  return new UUID({ bytes: sha1(concat(namespace.bytes, nameBytes(name))).slice(0, 16), version: 5 });
}
// uuid4() is UUID(bytes=os.urandom(16), version=4): the demos pass the bytes
export const uuid4From = (bytes) => new UUID({ bytes, version: 4 });

// uuid1(node, clock_seq) with a given timestamp (100-ns intervals since
// 1582-10-15); the demos only read the parts that do not depend on it
export function uuid1At(timestamp, node, clockSeq) {
  const ts = BigInt(timestamp), cs = BigInt(clockSeq);
  return new UUID({
    fields: [ts & 0xffffffffn, (ts >> 32n) & 0xffffn, (ts >> 48n) & 0x0fffn, (cs >> 8n) & 0x3fn, cs & 0xffn, BigInt(node)],
    version: 1,
  });
}
