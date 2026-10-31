// utils/emulators/python/stdlib/struct/_pystruct.js
//
// Port of CPython 3.13's Modules/_struct.c — what the struct module runs —
// for the struct demos: format parsing (prepare_s: byte-order prefix,
// repeat counts, whitespace, native alignment, the size-overflow check),
// pack / unpack / pack_into / unpack_from / iter_unpack / calcsize and the
// Struct object, with CPython's exact error messages. Also bytes.fromhex
// and bytearray(n), which the demo snippets use to build buffers. Not a
// content page (leading underscore), so the catalog generator never maps it.
//
// Values use the literal model of ../pickle/_pypickle.js — what
// ast.literal_eval (../pickle/_pyliteral.js) builds: int → bigint, float →
// PyFloat, bytes → PyBytes, str → PyStr, bool, None → null, tuple / list /
// dict / set → PyTuple / PyList / PyDict / PySet. A bytearray is a
// ByteArray (below).
//
// Native mode ('@' or no prefix) is Linux x86-64 (LP64, little-endian):
// 'l' and 'L' are 8 bytes there. On 64-bit Windows they are 4 — the only
// native difference between the two for these formats (verified on CPython
// 3.13.3 Windows and 3.12.3 Linux).
//
// Differentially fuzzed against CPython: 40,000 random cases (formats with
// every code, prefix, count and whitespace form; in- and out-of-range
// values of every type; short/long/odd buffers; positive, negative and
// huge offsets) identical on Windows 3.13.3 and 10,000 on Linux 3.12.3
// (native mode included; '0p' excluded there, see below), including what
// pack_into leaves in the buffer after an error. 3.13 behaviour is modelled
// where the versions differ: unpacking '0p' gives b'' (3.12: SystemError)
// and packing it writes its length byte.

import { PyFloat, PyStr, PyBytes, PyList, PyTuple, PyDict, PySet, pyBytes, pyStr, pyTuple, typeName, limit, pyRepr } from '../pickle/_pypickle.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

const structError = (msg) => new PyException('struct.error', msg);
const raise = (type, msg) => { throw new PyException(type, msg); };

// bytearray — mutable bytes (the value model has none)
export class ByteArray { constructor(b) { this.b = b; } }

// buffers in the demos stay small; formats may describe huge ones (calcsize)
const MAX_BUFFER = 1 << 16;

// ─── format tables ──────────────────────────────────────────

// [code, size, alignment, kind, signed]
const STANDARD = [
  ['x', 1, 0, 'pad'], ['b', 1, 0, 'int', true], ['B', 1, 0, 'int', false], ['c', 1, 0, 'char'],
  ['s', 1, 0, 'str'], ['p', 1, 0, 'pascal'], ['h', 2, 0, 'int', true], ['H', 2, 0, 'int', false],
  ['i', 4, 0, 'int', true], ['I', 4, 0, 'int', false], ['l', 4, 0, 'int', true], ['L', 4, 0, 'int', false],
  ['q', 8, 0, 'int', true], ['Q', 8, 0, 'int', false], ['?', 1, 0, 'bool'], ['e', 2, 0, 'half'],
  ['f', 4, 0, 'float'], ['d', 8, 0, 'double'],
];
// Linux x86-64: every type aligned to its size
const NATIVE = [
  ['x', 1, 0, 'pad'], ['b', 1, 0, 'int', true], ['B', 1, 0, 'int', false], ['c', 1, 0, 'char'],
  ['s', 1, 0, 'str'], ['p', 1, 0, 'pascal'], ['h', 2, 2, 'int', true], ['H', 2, 2, 'int', false],
  ['i', 4, 4, 'int', true], ['I', 4, 4, 'int', false], ['l', 8, 8, 'int', true], ['L', 8, 8, 'int', false],
  ['n', 8, 8, 'int', true], ['N', 8, 8, 'int', false], ['q', 8, 8, 'int', true], ['Q', 8, 8, 'int', false],
  ['?', 1, 1, 'bool'], ['e', 2, 2, 'half'], ['f', 4, 4, 'float'], ['d', 8, 8, 'double'], ['P', 8, 8, 'voidp'],
];
let tables = null;
function getTables() {
  if (!tables) {
    const build = (rows, little, native) => new Map(rows.map(([format, size, alignment, kind, signed]) => [format, { format, size, alignment, kind, signed, little, native }]));
    tables = {
      native: build(NATIVE, true, true),
      little: build(STANDARD, true, false),
      big: build(STANDARD, false, false),
    };
  }
  return tables;
}

// Py_ISSPACE: the six ASCII whitespace characters
const isSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\x0b' || c === '\x0c' || c === '\r';
const SSIZE_MAX = (1n << 63n) - 1n;

// \xNN / \uNNNN / \UNNNNNNNN as UnicodeEncodeError.__str__ writes a character
function escChar(cp) {
  if (cp < 0x100) return '\\x' + cp.toString(16).padStart(2, '0');
  if (cp < 0x10000) return '\\u' + cp.toString(16).padStart(4, '0');
  return '\\U' + cp.toString(16).padStart(8, '0');
}

// str.encode('ascii') — strict: the first run of non-ASCII code points
function asciiEncode(text) {
  const cps = [...text].map((ch) => ch.codePointAt(0));
  const start = cps.findIndex((cp) => cp > 0x7f);
  if (start === -1) return text;
  let end = start + 1;
  while (end < cps.length && cps[end] > 0x7f) end++;
  const what = end - start === 1
    ? `character '${escChar(cps[start])}' in position ${start}`
    : `characters in position ${start}-${end - 1}`;
  return raise('UnicodeEncodeError', `'ascii' codec can't encode ${what}: ordinal not in range(128)`);
}

// ─── Struct(format): prepare_s ──────────────────────────────

export class Struct {
  constructor(format) {
    let text;
    if (typeof format === 'string') text = asciiEncode(format);
    else if (format instanceof PyStr) text = asciiEncode(format.v);
    else if (format instanceof PyBytes) {
      text = '';
      for (const c of format.b) text += String.fromCharCode(c);
      if (/[^\x00-\x7f]/.test(text)) limit('non-ASCII bytes in a bytes format are not part of the demo');
    } else {
      raise('TypeError', `Struct() argument 1 must be a str or bytes object, not ${typeName(format)}`);
    }
    this.format = text;
    if (text.includes('\0')) throw structError('embedded null character');

    // whichtable: an optional byte-order character first
    const t = getTables();
    let table = t.native;
    let i = 0;
    const first = text[0];
    if (first === '<' || first === '=') { table = t.little; i = 1; } // '=' : native order, standard sizes (little-endian machine)
    else if (first === '>' || first === '!') { table = t.big; i = 1; }
    else if (first === '@') i = 1;

    const overflow = () => { throw structError('total struct size too long'); };
    let size = 0n;
    let len = 0n;
    const codes = [];
    const n = text.length;
    while (i < n) {
      let c = text[i++];
      if (isSpace(c)) continue;
      let num;
      if (c >= '0' && c <= '9') {
        num = BigInt(c);
        for (;;) {
          c = i < n ? text[i] : '\0';
          i++;
          if (!(c >= '0' && c <= '9')) break;
          const d = BigInt(c);
          if (num >= SSIZE_MAX / 10n && (num > SSIZE_MAX / 10n || d > SSIZE_MAX % 10n)) overflow();
          num = num * 10n + d;
        }
        if (c === '\0') throw structError('repeat count given without format specifier');
      } else num = 1n;

      const e = table.get(c);
      if (!e) throw structError('bad char in struct format');

      // align(): native entries pad up to a multiple of their alignment
      if (e.alignment && size > 0n) {
        const a = BigInt(e.alignment);
        const extra = (a - 1n) - ((size - 1n) % a);
        if (extra > SSIZE_MAX - size) overflow();
        size += extra;
      }
      const itemsize = BigInt(e.size);
      if (num > (SSIZE_MAX - size) / itemsize) overflow();

      if (c === 's' || c === 'p') {
        codes.push({ e, offset: size, size: num, repeat: 1n });
        len += 1n;
      } else if (c !== 'x' && num > 0n) {
        codes.push({ e, offset: size, size: itemsize, repeat: num });
        len += num;
      }
      size += num * itemsize;
    }
    this.size = size;
    this.len = len;
    this.codes = codes;
  }

  // repr (3.13+): Struct('<hi')
  repr(strRepr) { return `Struct(${strRepr(this.format)})`; }

  pack(args) {
    if (BigInt(args.length) !== this.len) {
      throw structError(`pack expected ${this.len} items for packing (got ${args.length})`);
    }
    const buf = new Uint8Array(bufferSize(this.size));
    this.packInto(buf, 0, args);
    return pyBytes(buf);
  }

  // s_pack_internal: zero the region, then write code by code (a failing
  // value leaves the earlier ones written)
  packInto(buf, base, args) {
    const size = Number(this.size);
    buf.fill(0, base, base + size);
    let k = 0;
    for (const code of this.codes) {
      const { e } = code;
      let at = base + Number(code.offset);
      const csize = Number(code.size);
      const repeat = Number(code.repeat);
      for (let j = 0; j < repeat; j++) {
        const v = args[k++];
        if (e.kind === 'str' || e.kind === 'pascal') {
          if (!(v instanceof PyBytes || v instanceof ByteArray)) {
            throw structError(`argument for '${e.format}' must be a bytes object`);
          }
          const src = v.b;
          if (e.kind === 'str') {
            buf.set(src.subarray(0, Math.min(src.length, csize)), at);
          } else {
            const m = csize === 0 ? 0 : Math.min(src.length, csize - 1);
            if (m > 0) buf.set(src.subarray(0, m), at + 1);
            // the length byte is written even for '0p', whose field is 0
            // bytes long: CPython 3.13 puts a 0 at the next byte of the
            // buffer (pack_into shows it; pack's bytes never include it;
            // past the end of the buffer it is invisible, here a no-op)
            if (at < buf.length) buf[at] = Math.min(m, 255);
          }
        } else {
          packOne(e, buf, at, v);
        }
        at += csize;
      }
    }
  }

  unpackAt(buf, base) {
    const out = [];
    for (const code of this.codes) {
      const { e } = code;
      let at = base + Number(code.offset);
      const csize = Number(code.size);
      const repeat = Number(code.repeat);
      for (let j = 0; j < repeat; j++) {
        if (e.kind === 'str') out.push(pyBytes(buf.slice(at, at + csize)));
        else if (e.kind === 'pascal') {
          let m = 0;
          if (csize > 0) {
            m = buf[at];
            if (m >= csize) m = csize - 1;
          }
          out.push(pyBytes(buf.slice(at + 1, at + 1 + m)));
        } else out.push(unpackOne(e, buf, at));
        at += csize;
      }
    }
    return pyTuple(out);
  }

  unpack(buffer) {
    const buf = readable(buffer);
    if (BigInt(buf.length) !== this.size) throw structError(`unpack requires a buffer of ${this.size} bytes`);
    return this.unpackAt(buf, 0);
  }

  unpackFrom(buffer, offset = 0n) {
    const buf = readable(buffer);
    let off = ssizeArg(offset, 'unpack_from');
    const blen = BigInt(buf.length);
    if (off < 0n) {
      if (off + this.size > 0n) throw structError(`not enough data to unpack ${this.size} bytes at offset ${off}`);
      if (off + blen < 0n) throw structError(`offset ${off} out of range for ${blen}-byte buffer`);
      off += blen;
    }
    if (blen - off < this.size) {
      throw structError(`unpack_from requires a buffer of at least ${this.size + off} bytes for unpacking ${this.size} bytes at offset ${off} (actual buffer size is ${blen})`);
    }
    return this.unpackAt(buf, Number(off));
  }

  iterUnpack(buffer) {
    if (this.size === 0n) throw structError(`cannot iteratively unpack with a struct of length ${this.size}`);
    const buf = readable(buffer);
    if (BigInt(buf.length) % this.size !== 0n) {
      throw structError(`iterative unpacking requires a buffer of a multiple of ${this.size} bytes`);
    }
    const out = [];
    const step = Number(this.size);
    for (let at = 0; at < buf.length; at += step) out.push(this.unpackAt(buf, at));
    return out;
  }

  // s_pack_into: argument count, writable buffer, offset, bounds, then pack
  packIntoBuffer(buffer, offset, args) {
    if (BigInt(args.length) !== this.len) {
      throw structError(`pack_into expected ${this.len} items for packing (got ${args.length})`);
    }
    if (!(buffer instanceof ByteArray)) {
      raise('TypeError', `argument must be read-write bytes-like object, not ${typeName(buffer)}`);
    }
    let off = ssizeArg(offset, 'pack_into');
    const blen = BigInt(buffer.b.length);
    if (off < 0n) {
      if (off + this.size > 0n) throw structError(`no space to pack ${this.size} bytes at offset ${off}`);
      if (off + blen < 0n) throw structError(`offset ${off} out of range for ${blen}-byte buffer`);
      off += blen;
    }
    if (blen - off < this.size) {
      throw structError(`pack_into requires a buffer of at least ${this.size + off} bytes for packing ${this.size} bytes at offset ${off} (actual buffer size is ${blen})`);
    }
    this.packInto(buffer.b, Number(off), args);
    return null;
  }
}

function bufferSize(size) {
  if (size > BigInt(MAX_BUFFER)) limit(`the demo packs and unpacks up to ${MAX_BUFFER} bytes`);
  return Number(size);
}

// the buffer argument of unpack / unpack_from / iter_unpack (bytes-like)
function readable(v) {
  if (v instanceof PyBytes || v instanceof ByteArray) return v.b;
  return raise('TypeError', `a bytes-like object is required, not '${typeName(v)}'`);
}

// the offset argument: an index (int or bool), else TypeError; out of the
// C ssize_t range: OverflowError (unpack_from) / IndexError (pack_into)
function ssizeArg(v, fn) {
  let n;
  if (typeof v === 'bigint') n = v;
  else if (v === true || v === false) n = v ? 1n : 0n;
  else return raise('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);
  if (n > SSIZE_MAX || n < -SSIZE_MAX - 1n) {
    if (fn === 'pack_into') raise('IndexError', "cannot fit 'int' into an index-sized integer");
    raise('OverflowError', 'Python int too large to convert to C ssize_t');
  }
  return n;
}

// ─── one value ──────────────────────────────────────────────

// PyObject_IsTrue for the value model
export function truthy(v) {
  if (v === null || v === false) return false;
  if (v === true) return true;
  if (typeof v === 'bigint') return v !== 0n;
  if (v instanceof PyFloat) return v.v !== 0;
  if (v instanceof PyStr) return v.v.length > 0;
  if (v instanceof PyBytes || v instanceof ByteArray) return v.b.length > 0;
  if (v instanceof PyList || v instanceof PyTuple) return v.items.length > 0;
  if (v instanceof PyDict || v instanceof PySet) return v.size > 0;
  return true;
}

// get_pylong: ints (bool included); anything else is not an integer
function intArg(v) {
  if (typeof v === 'bigint') return v;
  if (v === true || v === false) return v ? 1n : 0n;
  throw structError('required argument is not an integer');
}

// PyFloat_AsDouble: floats, ints (correctly rounded; too large → error), bools
function floatArg(v) {
  if (v instanceof PyFloat) return v.v;
  if (v === true || v === false) return v ? 1 : 0;
  if (typeof v === 'bigint') {
    const x = Number(v);
    if (Number.isFinite(x)) return x;
  }
  throw structError('required argument is not a float');
}

function writeUint(buf, at, size, little, u) {
  for (let k = 0; k < size; k++) {
    const byte = Number(u & 0xffn);
    buf[little ? at + k : at + size - 1 - k] = byte;
    u >>= 8n;
  }
}
function readUint(buf, at, size, little) {
  let u = 0n;
  for (let k = 0; k < size; k++) u = (u << 8n) | BigInt(buf[little ? at + size - 1 - k : at + k]);
  return u;
}

// PyFloat_Pack2 → the 16 bits of an IEEE half, or null on overflow
function halfBits(x) {
  let sign;
  let e;
  let bits;
  if (x === 0) {
    sign = Object.is(x, -0) ? 1 : 0;
    e = 0;
    bits = 0;
  } else if (!Number.isFinite(x) && !Number.isNaN(x)) {
    sign = x < 0 ? 1 : 0;
    e = 0x1f;
    bits = 0;
  } else if (Number.isNaN(x)) {
    return limit('packing a NaN is not part of the demo');
  } else {
    sign = x < 0 ? 1 : 0;
    if (sign) x = -x;
    // 2**16 and above: e >= 16 below, i.e. too large (checked first, so the
    // frexp here never meets 2**1024)
    if (x >= 65536) return null;
    // frexp: x = f * 2**e with 0.5 <= f < 1
    e = Math.floor(Math.log2(x)) + 1;
    let f = x / 2 ** e;
    while (f >= 1) { f /= 2; e += 1; }
    while (f < 0.5) { f *= 2; e -= 1; }
    f *= 2;
    e -= 1;
    if (e >= 16) return null;
    if (e < -25) {
      f = 0;
      e = 0;
    } else if (e < -14) {
      f = f * 2 ** (14 + e);
      e = 0;
    } else {
      e += 15;
      f -= 1;
    }
    f *= 1024;
    bits = Math.trunc(f);
    if (f - bits > 0.5 || (f - bits === 0.5 && bits % 2 === 1)) {
      bits += 1;
      if (bits === 1024) {
        bits = 0;
        e += 1;
        if (e === 31) return null;
      }
    }
  }
  return bits | (e << 10) | (sign << 15);
}

// PyFloat_Unpack2
function halfValue(h) {
  const sign = (h >> 15) & 1;
  let e = (h >> 10) & 0x1f;
  const f = h & 0x3ff;
  if (e === 0x1f) return f === 0 ? (sign ? -Infinity : Infinity) : NaN;
  let x = f / 1024;
  if (e === 0) e = -14;
  else {
    x += 1;
    e -= 15;
  }
  x *= 2 ** e;
  return sign ? -x : x;
}

const tooLarge = (v, code) => (typeof v === 'bigint' || v === true || v === false
  ? structError('int too large to convert')
  : new PyException('OverflowError', `float too large to pack with ${code} format`));

function packOne(e, buf, at, v) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  switch (e.kind) {
    case 'char':
      if (v instanceof PyBytes && v.b.length === 1) { buf[at] = v.b[0]; return; }
      throw structError('char format requires a bytes object of length 1');
    case 'bool':
      buf[at] = truthy(v) ? 1 : 0;
      return;
    case 'int': {
      const x = intArg(v);
      const bitsN = BigInt(e.size * 8);
      const lo = e.signed ? -(1n << (bitsN - 1n)) : 0n;
      const hi = e.signed ? (1n << (bitsN - 1n)) - 1n : (1n << bitsN) - 1n;
      if (x < lo || x > hi) {
        // big-endian 'q' / 'Q' ('>', '!') go through _PyLong_AsByteArray,
        // which fills all 8 bytes with the low 64 bits before it notices the
        // overflow (a negative number for 'Q' is refused before writing).
        // On a little-endian machine '<' and '=' use the native packers
        // instead (_struct.c swaps them in when the sizes match), which
        // check first and write nothing.
        if (!e.native && !e.little && e.size === 8 && (e.signed || x >= 0n)) writeUint(buf, at, 8, false, BigInt.asUintN(64, x));
        throw structError(`'${e.format}' format requires ${lo} <= number <= ${hi}`);
      }
      writeUint(buf, at, e.size, e.little, BigInt.asUintN(e.size * 8, x));
      return;
    }
    case 'voidp': {
      // PyLong_AsVoidPtr: negative values as long long, others unsigned
      const x = intArg(v);
      if (x < -(1n << 63n) || x > (1n << 64n) - 1n) throw structError('int too large to convert');
      writeUint(buf, at, 8, true, BigInt.asUintN(64, x));
      return;
    }
    case 'half': {
      const x = floatArg(v);
      const h = halfBits(x);
      if (h === null) throw tooLarge(v, 'e');
      writeUint(buf, at, 2, e.little, BigInt(h));
      return;
    }
    case 'float': {
      const x = floatArg(v);
      if (Number.isNaN(x)) limit('packing a NaN is not part of the demo');
      const y = Math.fround(x);
      // standard sizes check for overflow; native mode is a plain C cast
      if (!e.native && !Number.isFinite(y) && Number.isFinite(x)) throw tooLarge(v, 'f');
      dv.setFloat32(at, y, e.little);
      return;
    }
    case 'double': {
      const x = floatArg(v);
      if (Number.isNaN(x)) limit('packing a NaN is not part of the demo');
      dv.setFloat64(at, x, e.little);
      return;
    }
    default:
      limit(`format '${e.format}' is not part of the demo`);
  }
}

function unpackOne(e, buf, at) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  switch (e.kind) {
    case 'char': return pyBytes(buf.slice(at, at + 1));
    case 'bool': return buf[at] !== 0;
    case 'int': {
      const u = readUint(buf, at, e.size, e.little);
      return e.signed ? BigInt.asIntN(e.size * 8, u) : u;
    }
    case 'voidp': return readUint(buf, at, 8, true);
    case 'half': return new PyFloat(halfValue(Number(readUint(buf, at, 2, e.little))));
    case 'float': return new PyFloat(dv.getFloat32(at, e.little));
    case 'double': return new PyFloat(dv.getFloat64(at, e.little));
    default: return limit(`format '${e.format}' is not part of the demo`);
  }
}

// ─── module-level functions ────────────────────────────────

export const calcsize = (format) => new Struct(format).size;
export const pack = (format, args) => new Struct(format).pack(args);
export const unpack = (format, buffer) => new Struct(format).unpack(buffer);
export const unpackFrom = (format, buffer, offset = 0n) => new Struct(format).unpackFrom(buffer, offset);
export const iterUnpack = (format, buffer) => new Struct(format).iterUnpack(buffer);
export const packInto = (format, buffer, offset, args) => new Struct(format).packIntoBuffer(buffer, offset, args);

// f(*value) — the positional arguments a starred value expands to.
// `who` is how CPython names the callee in the TypeError: '' for the
// module functions ("Value after * must be an iterable, not int"),
// 'Struct.pack()' for the method ("Struct.pack() argument after * …").
export function starArgs(v, who = '') {
  if (v instanceof PyTuple || v instanceof PyList) return v.items;
  if (v instanceof PyStr) return [...v.v].map(pyStr);
  if (v instanceof PyBytes || v instanceof ByteArray) return [...v.b].map(BigInt);
  if (v instanceof PyDict) return v.keys;
  if (v instanceof PySet) return v.items();
  const t = typeName(v);
  return raise('TypeError', who ? `${who} argument after * must be an iterable, not ${t}` : `Value after * must be an iterable, not ${t}`);
}

// bytes.fromhex(text): pairs of hex digits, ASCII whitespace between pairs
export function fromhex(text) {
  const cps = [...text];
  const nonAscii = cps.findIndex((ch) => ch.codePointAt(0) > 0x7f);
  const bad = (pos) => raise('ValueError', `non-hexadecimal number found in fromhex() arg at position ${pos}`);
  if (nonAscii !== -1) bad(nonAscii);
  const digit = (ch) => (ch !== undefined && /^[0-9a-fA-F]$/.test(ch) ? parseInt(ch, 16) : -1);
  const out = [];
  let i = 0;
  while (i < cps.length) {
    if (isSpace(cps[i])) {
      while (i < cps.length && isSpace(cps[i])) i++;
      if (i >= cps.length) break;
    }
    const top = digit(cps[i]);
    if (top < 0) bad(i);
    i++;
    const bot = digit(cps[i]);
    if (bot < 0) bad(i);
    i++;
    out.push((top << 4) | bot);
  }
  if (out.length > MAX_BUFFER) limit(`the demo reads up to ${MAX_BUFFER} bytes`);
  return pyBytes(Uint8Array.from(out));
}

// ─── demo glue ──────────────────────────────────────────────

// a number typed into a demo, as the Python literal the snippet shows
// ('8' → int, '1e+21' → float)
export function numArg(n) {
  const v = fromLiteral(n);
  return v.int !== undefined ? v.int : new PyFloat(v.float);
}

// repr(bytearray) — Objects/bytearrayobject.c bytearray_repr: the same
// quote choice as bytes, but a single quote is ALWAYS escaped, even inside
// double quotes: bytearray(b"\'") where bytes gives b"'"
function bytearrayRepr(b) {
  let dq = false;
  for (const c of b) {
    if (c === 0x22) { dq = false; break; }
    if (c === 0x27) dq = true;
  }
  const q = dq ? '"' : "'";
  let out = '';
  for (const c of b) {
    if (c === 0x27 || c === 0x5c) out += '\\' + String.fromCharCode(c);
    else if (c === 0x09) out += '\\t';
    else if (c === 0x0a) out += '\\n';
    else if (c === 0x0d) out += '\\r';
    else if (c < 0x20 || c >= 0x7f) out += '\\x' + c.toString(16).padStart(2, '0');
    else out += String.fromCharCode(c);
  }
  return `bytearray(b${q}${out}${q})`;
}

// repr() — the value model plus bytearray
export function reprOf(v) {
  if (v instanceof ByteArray) return bytearrayRepr(v.b);
  return pyRepr(v);
}
// for pyReprExact (SnippetDemo, the audit)
export const show = (v) => ({ __pyRaw: reprOf(v) });

// bytes.hex(sep)
export function hexOf(v, sep = '') {
  return [...v.b].map((c) => c.toString(16).padStart(2, '0')).join(sep);
}

// bytearray(n) — n zero bytes
export function bytearrayOf(n) {
  if (typeof n !== 'bigint') raise('TypeError', `cannot convert '${typeName(n)}' object to bytearray`);
  if (n < 0n) raise('ValueError', 'negative count');
  if (n > BigInt(MAX_BUFFER)) limit(`the demo makes buffers of up to ${MAX_BUFFER} bytes`);
  return new ByteArray(new Uint8Array(Number(n)));
}
