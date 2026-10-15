// utils/emulators/python/stdlib/pickle/_pypickle.js
//
// Port of CPython 3.13's C pickler and unpickler (Modules/_pickle.c — what
// pickle.dumps / pickle.loads actually run) for the pickle demos, plus
// pickletools.genops / dis for the pickles it writes. Shared by every pickle
// emulator. Not a content page (leading underscore), so the catalog
// generator never maps it.
//
// Python value model — identity matters, because the pickler's memo is
// keyed by object identity:
//   None → null · bool → true/false · int → bigint · float → PyFloat
//   str → PyStr · bytes → PyBytes · list → PyList · tuple → PyTuple
//   dict → PyDict (insertion order, Python key equality: 1 == 1.0 == True)
//   set / frozenset → PySet (CPython's hash table is emulated, so the
//     iteration order — and with it the pickled order — is exact)
//   the four globals a pickle of these values can name (set, frozenset,
//     bytes, _codecs.encode) → PyBuiltin
// Singletons exactly where CPython has them: '' and one-character latin-1
// strings, b'' and one-byte bytes, the empty tuple. Strings never contain
// lone surrogates (inputs that would create one stop with a DemoLimit).
//
// Inputs outside what the demos reproduce raise DemoLimit (shown as "not
// reproduced in the browser", never as a Python error): sets whose order
// depends on str/bytes hash randomization, globals other than the four
// above, the Python 2 string opcodes, objects with __reduce__ state, etc.
// Exact against CPython on the fuzz corpus described in the module notes.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export function limit(msg) {
  const e = new Error(msg);
  e.name = 'DemoLimit';
  throw e;
}
const raise = (type, msg) => { throw new PyException(type, msg); };
export const unpicklingError = (msg) => new PyException('_pickle.UnpicklingError', msg);
const truncated = () => { throw unpicklingError('pickle data was truncated'); };

// ─── value model ────────────────────────────────────────────

export class PyFloat { constructor(v) { this.v = v; } }
export class PyStr { constructor(v) { this.v = v; } }
export class PyBytes { constructor(b) { this.b = b; } }
export class PyList { constructor(items = []) { this.items = items; } }
export class PyTuple { constructor(items = []) { this.items = items; } }
export class PyBuiltin {
  constructor(module, name, isType) { Object.assign(this, { module, name, isType }); }
}

const strCache = new Map();
export function pyStr(v) {
  if (v.length === 0 || (v.length === 1 && v.charCodeAt(0) < 256)) {
    let s = strCache.get(v);
    if (!s) { s = new PyStr(v); strCache.set(v, s); }
    return s;
  }
  return new PyStr(v);
}
const byteCache = [];
let emptyBytes = null;
export function pyBytes(arr) {
  const b = arr instanceof Uint8Array ? arr : Uint8Array.from(arr);
  if (b.length === 0) return emptyBytes || (emptyBytes = new PyBytes(b));
  if (b.length === 1) return byteCache[b[0]] || (byteCache[b[0]] = new PyBytes(b));
  return new PyBytes(b);
}
export const EMPTY_TUPLE = new PyTuple([]);
export const pyTuple = (items) => (items.length === 0 ? EMPTY_TUPLE : new PyTuple(items));
export const pyFloat = (v) => new PyFloat(v);

export const SET_TYPE = new PyBuiltin('builtins', 'set', true);
export const FROZENSET_TYPE = new PyBuiltin('builtins', 'frozenset', true);
export const BYTES_TYPE = new PyBuiltin('builtins', 'bytes', true);
export const CODECS_ENCODE = new PyBuiltin('_codecs', 'encode', false);
// _Py_ID(latin1): the interned 'latin1' the pickler passes to codecs.encode
// — never the same object as a str in the data
const LATIN1 = new PyStr('latin1');

export function typeName(v) {
  if (v === null) return 'NoneType';
  if (v === true || v === false) return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof PyStr) return 'str';
  if (v instanceof PyBytes) return 'bytes';
  if (v instanceof PyList) return 'list';
  if (v instanceof PyTuple) return 'tuple';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof PySet) return v.frozen ? 'frozenset' : 'set';
  if (v instanceof PyBuiltin) return v.isType ? 'type' : 'builtin_function_or_method';
  return 'object';
}

// ─── equality and hashing ───────────────────────────────────

// A string key that two values share exactly when Python's == says they
// are equal (for hashable values). NaN is only equal to itself (identity).
const nanIds = new WeakMap();
let nanSeq = 0;
function eqKey(v) {
  if (v === null) return 'N';
  if (v === true) return 'i1';
  if (v === false) return 'i0';
  if (typeof v === 'bigint') return 'i' + v;
  if (v instanceof PyFloat) {
    const f = v.v;
    if (Number.isNaN(f)) {
      if (!nanIds.has(v)) nanIds.set(v, ++nanSeq);
      return 'n' + nanIds.get(v);
    }
    if (Number.isInteger(f)) return 'i' + BigInt(f);
    return 'f' + f;
  }
  if (v instanceof PyStr) return 's' + v.v.length + ':' + v.v;
  if (v instanceof PyBytes) return 'b' + v.b.length + ':' + latin1Text(v.b);
  if (v instanceof PyTuple) return 't' + v.items.length + '(' + v.items.map(eqKey).join(',') + ')';
  if (v instanceof PySet) {
    if (!v.frozen) raise('TypeError', "unhashable type: 'set'");
    return 'F' + v.size + '{' + [...v.byKey.keys()].sort().join(',') + '}';
  }
  if (v instanceof PyBuiltin) return 'G' + v.module + '.' + v.name;
  raise('TypeError', `unhashable type: '${typeName(v)}'`);
  return null;
}
export const pyEq = (a, b) => a === b || eqKey(a) === eqKey(b);

const M64 = (1n << 64n) - 1n;
const MOD = (1n << 61n) - 1n;
const RANDOM = 'random'; // hash depends on PYTHONHASHSEED (str, bytes) or on an address
const signed = (x) => BigInt.asIntN(64, x);
const unsigned = (x) => BigInt.asUintN(64, x);

function hashInt(n) {
  let r = (n < 0n ? -n : n) % MOD;
  if (n < 0n) r = -r;
  return r === -1n ? -2n : r;
}
function frexp(v) {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, v);
  const hi = dv.getUint32(0);
  const exp = (hi >>> 20) & 0x7ff;
  if (exp === 0) {
    const [m, e] = frexp(v * 2 ** 64);
    return [m, e - 64];
  }
  dv.setUint32(0, (hi & 0x800fffff) | (1022 << 20));
  return [dv.getFloat64(0), exp - 1022];
}
// _Py_HashDouble
function hashDouble(v) {
  if (Number.isNaN(v)) return RANDOM;
  if (!Number.isFinite(v)) return v > 0 ? 314159n : -314159n;
  if (v === 0) return 0n;
  let [m, e] = frexp(v);
  let sign = 1n;
  if (m < 0) { sign = -1n; m = -m; }
  let x = 0n;
  while (m) {
    x = ((x << 28n) & MOD) | (x >> 33n);
    m *= 268435456.0;
    e -= 28;
    const y = Math.floor(m);
    m -= y;
    x += BigInt(y);
    if (x >= MOD) x -= MOD;
  }
  e = e >= 0 ? e % 61 : 61 - 1 - ((-1 - e) % 61);
  x = ((x << BigInt(e)) & MOD) | (x >> BigInt(61 - e));
  x *= sign;
  return x === -1n ? -2n : x;
}
const XXP1 = 11400714785074694791n;
const XXP2 = 14029467366897019727n;
const XXP5 = 2870177450012600261n;
function tupleHash(items) {
  let acc = XXP5;
  for (const it of items) {
    const h = pyHash(it);
    if (h === RANDOM) return RANDOM;
    acc = (acc + unsigned(h) * XXP2) & M64;
    acc = ((acc << 31n) | (acc >> 33n)) & M64;
    acc = (acc * XXP1) & M64;
  }
  acc = (acc + (BigInt(items.length) ^ (XXP5 ^ 3527539n))) & M64;
  if (acc === M64) return 1546275796n;
  return signed(acc);
}
const shuffleBits = (h) => (((h ^ 89869747n) ^ (h << 16n)) * 3644798167n) & M64;
function frozensetHash(s) {
  if (s.random) return RANDOM;
  // null entries cancel out pairwise (plus the odd-count correction),
  // there are no dummies: only the active entries remain
  let h = 0n;
  for (const e of s.table) if (e) h ^= shuffleBits(unsigned(e.hash));
  h ^= ((BigInt(s.size) + 1n) * 1927868237n) & M64;
  h ^= (h >> 11n) ^ (h >> 25n);
  h = (h * 69069n + 907133923n) & M64;
  if (h === M64) h = 590923713n;
  return signed(h);
}
function pyHash(v) {
  if (v === null) return 4238894112n; // constant since 3.12
  if (v === true) return 1n;
  if (v === false) return 0n;
  if (typeof v === 'bigint') return hashInt(v);
  if (v instanceof PyFloat) return hashDouble(v.v);
  if (v instanceof PyStr) return v.v.length === 0 ? 0n : RANDOM;
  if (v instanceof PyBytes) return v.b.length === 0 ? 0n : RANDOM;
  if (v instanceof PyTuple) return tupleHash(v.items);
  if (v instanceof PySet) return frozensetHash(v);
  return RANDOM;
}

// ─── dict and set ───────────────────────────────────────────

export class PyDict {
  constructor() { this.index = new Map(); this.keys = []; this.vals = []; }
  get size() { return this.keys.length; }
  // first key object kept, value replaced — like dict.__setitem__
  set(k, v) {
    const key = eqKey(k);
    const i = this.index.get(key);
    if (i === undefined) {
      this.index.set(key, this.keys.length);
      this.keys.push(k);
      this.vals.push(v);
    } else this.vals[i] = v;
  }
}

// setobject.c: open addressing, 9 linear probes then perturbed jumps,
// resize when fill*5 >= mask*3. No deletions happen here, so fill == used.
export class PySet {
  constructor(frozen = false) {
    this.frozen = frozen;
    this.byKey = new Map();
    this.mask = 7;
    this.table = new Array(8).fill(null);
    this.random = false;
  }
  get size() { return this.byKey.size; }
  add(v) {
    const k = eqKey(v);
    if (this.byKey.has(k)) return;
    const entry = { key: v, hash: pyHash(v) };
    this.byKey.set(k, entry);
    if (entry.hash === RANDOM) this.random = true;
    if (this.random) return;
    const mask = this.mask;
    place(this.table, mask, entry);
    if (this.size * 5 >= mask * 3) this.resize(this.size > 50000 ? this.size * 2 : this.size * 4);
  }
  resize(minused) {
    let size = 8;
    while (size <= minused) size *= 2;
    const old = this.table;
    this.mask = size - 1;
    this.table = new Array(size).fill(null);
    for (const e of old) if (e) place(this.table, this.mask, e);
  }
  // iteration order = table order (what pickling and repr() walk)
  items() {
    if (this.random) {
      if (this.size > 1) {
        limit('the order of this set depends on str/bytes hash randomization (PYTHONHASHSEED), so CPython itself prints a different order from run to run');
      }
      return [...this.byKey.values()].map((e) => e.key);
    }
    return this.table.filter(Boolean).map((e) => e.key);
  }
}
function place(table, mask, entry) {
  const bmask = BigInt(mask);
  let perturb = unsigned(entry.hash);
  let i = Number(perturb & bmask);
  for (;;) {
    const probes = i + 9 <= mask ? 9 : 0;
    for (let j = 0; j <= probes; j++) {
      if (table[i + j] === null) { table[i + j] = entry; return; }
    }
    perturb >>= 5n;
    i = Number((BigInt(i * 5 + 1) + perturb) & bmask);
  }
}
export function pySetOf(items, frozen = false) {
  const s = new PySet(frozen);
  for (const it of items) s.add(it);
  return s;
}

// ─── repr ───────────────────────────────────────────────────

const hex2 = (n) => n.toString(16).padStart(2, '0');
export function latin1Text(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return s;
}
export function bytesRepr(b) {
  let sq = false;
  let dq = false;
  for (const c of b) {
    if (c === 0x27) sq = true;
    else if (c === 0x22) dq = true;
  }
  const q = sq && !dq ? 0x22 : 0x27;
  let out = '';
  for (const c of b) {
    if (c === q || c === 0x5c) out += '\\' + String.fromCharCode(c);
    else if (c === 0x09) out += '\\t';
    else if (c === 0x0a) out += '\\n';
    else if (c === 0x0d) out += '\\r';
    else if (c < 0x20 || c >= 0x7f) out += '\\x' + hex2(c);
    else out += String.fromCharCode(c);
  }
  const qc = String.fromCharCode(q);
  return 'b' + qc + out + qc;
}
export function intRepr(n) {
  const s = (n < 0n ? -n : n).toString();
  if (s.length > 4300) {
    raise('ValueError', 'Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit');
  }
  return n < 0n ? '-' + s : s;
}
// repr(), with CPython's recursion markers ([...], {...}, (...))
export function pyRepr(v) {
  const active = new Set();
  const go = (x, depth) => {
    if (x === null) return 'None';
    if (x === true) return 'True';
    if (x === false) return 'False';
    if (typeof x === 'bigint') return intRepr(x);
    if (x instanceof PyFloat) return pyFloatRepr(x.v);
    if (x instanceof PyStr) return pyStrRepr(x.v);
    if (x instanceof PyBytes) return bytesRepr(x.b);
    if (x instanceof PyBuiltin) return x.isType ? `<class '${x.name}'>` : `<built-in function ${x.name}>`;
    if (depth > 150) limit('the demo stops at 150 levels of nesting');
    if (active.has(x)) {
      if (x instanceof PyList) return '[...]';
      if (x instanceof PyDict) return '{...}';
      if (x instanceof PyTuple) return '(...)';
      return `${typeName(x)}(...)`;
    }
    active.add(x);
    let out;
    if (x instanceof PyList) out = '[' + x.items.map((i) => go(i, depth + 1)).join(', ') + ']';
    else if (x instanceof PyTuple) {
      const parts = x.items.map((i) => go(i, depth + 1));
      out = '(' + parts.join(', ') + (parts.length === 1 ? ',' : '') + ')';
    } else if (x instanceof PyDict) {
      out = '{' + x.keys.map((k, i) => `${go(k, depth + 1)}: ${go(x.vals[i], depth + 1)}`).join(', ') + '}';
    } else if (x instanceof PySet) {
      const items = x.items();
      if (items.length === 0) out = x.frozen ? 'frozenset()' : 'set()';
      else {
        const body = '{' + items.map((i) => go(i, depth + 1)).join(', ') + '}';
        out = x.frozen ? `frozenset(${body})` : body;
      }
    } else out = String(x);
    active.delete(x);
    return out;
  };
  return go(v, 0);
}
// for pyReprExact consumers (SnippetDemo, the audit)
export const asPy = (v) => ({ __pyRaw: pyRepr(v) });
export const rawTuple = (...parts) => ({ __pyRaw: '(' + parts.join(', ') + (parts.length === 1 ? ',' : '') + ')' });

// a == b (PyObject_RichCompare); inside containers identity is checked
// first, as PyObject_RichCompareBool does
export function pyEquals(a, b, depth = 0) {
  if (depth > 500) limit('the demo stops comparing at 500 levels of nesting');
  const num = (v) => (typeof v === 'bigint' ? v : v === true ? 1n : v === false ? 0n : v instanceof PyFloat ? v : undefined);
  const x = num(a);
  const y = num(b);
  if (x !== undefined || y !== undefined) {
    if (x === undefined || y === undefined) return false;
    if (typeof x === 'bigint' && typeof y === 'bigint') return x === y;
    if (x instanceof PyFloat && y instanceof PyFloat) return x.v === y.v;
    const f = x instanceof PyFloat ? x.v : y.v;
    const i = x instanceof PyFloat ? y : x;
    return Number.isFinite(f) && Number.isInteger(f) && BigInt(f) === i;
  }
  const inner = (p, q) => p === q || pyEquals(p, q, depth + 1);
  if (a === null || b === null) return a === b;
  if (a instanceof PyStr) return b instanceof PyStr && a.v === b.v;
  if (a instanceof PyBytes) return b instanceof PyBytes && a.b.length === b.b.length && a.b.every((c, i) => c === b.b[i]);
  if (a instanceof PyList || a instanceof PyTuple) {
    return b.constructor === a.constructor && a.items.length === b.items.length && a.items.every((v, i) => inner(v, b.items[i]));
  }
  if (a instanceof PyDict) {
    if (!(b instanceof PyDict) || a.size !== b.size) return false;
    return a.keys.every((k, i) => {
      const j = b.index.get(eqKey(k));
      return j !== undefined && inner(a.vals[i], b.vals[j]);
    });
  }
  if (a instanceof PySet) {
    return b instanceof PySet && a.size === b.size && [...a.byKey.keys()].every((k) => b.byKey.has(k));
  }
  return a === b;
}
// a is b for two values that were created separately (e.g. one by
// literal_eval, one by loads): only CPython's shared objects coincide —
// None, True, False, the small ints -5..256 and the model's singletons
export function pyIsSeparate(a, b) {
  if (typeof a === 'bigint' && typeof b === 'bigint') return a === b && a >= -5n && a <= 256n;
  return a === b;
}
export const pyBool = (b) => ({ __pyRaw: b ? 'True' : 'False' });
// the argument of loads / BytesIO(): bytes, else CPython's TypeError
export function bytesArg(v) {
  if (v instanceof PyBytes) return v.b;
  return raise('TypeError', `a bytes-like object is required, not '${typeName(v)}'`);
}
export const isPyException = (e) => e instanceof PyException;
// type(e).__name__ of an emulated exception ('_pickle.UnpicklingError' → 'UnpicklingError')
export const excName = (e) => e.name.split('.').pop();

// ─── bytes helpers ──────────────────────────────────────────

class ByteBuf {
  constructor() { this.a = new Uint8Array(256); this.n = 0; }
  ensure(k) {
    if (this.n + k <= this.a.length) return;
    let size = this.a.length * 2;
    while (size < this.n + k) size *= 2;
    const b = new Uint8Array(size);
    b.set(this.a.subarray(0, this.n));
    this.a = b;
  }
  push(bytes) {
    this.ensure(bytes.length);
    this.a.set(bytes, this.n);
    this.n += bytes.length;
  }
  toBytes() { return this.a.slice(0, this.n); }
}
const ascii = (s) => Uint8Array.from(s, (c) => c.charCodeAt(0));
const le = (n, size) => {
  const out = new Uint8Array(size);
  let x = BigInt(n);
  for (let i = 0; i < size; i++) { out[i] = Number(x & 0xffn); x >>= 8n; }
  return out;
};
const readLE = (b) => {
  let x = 0n;
  for (let i = b.length - 1; i >= 0; i--) x = (x << 8n) | BigInt(b[i]);
  return x;
};
const utf8Encoder = new TextEncoder();
export const utf8 = (s) => utf8Encoder.encode(s);
function utf8Decode(bytes) {
  let s;
  try {
    s = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    limit('these bytes are not valid UTF-8 (CPython raises UnicodeDecodeError or decodes lone surrogates — not reproduced here)');
  }
  return s;
}
const hasSurrogate = (s) => /[\uD800-\uDFFF]/.test(s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''));

// _pickle.c raw_unicode_escape(): like the raw-unicode-escape codec, but
// backslash, NUL, \n, \r and \x1a are \u-escaped too
function rawUnicodeEscape(s) {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x10000) out += '\\U' + cp.toString(16).padStart(8, '0');
    else if (cp >= 256 || cp === 0x5c || cp === 0 || cp === 0x0a || cp === 0x0d || cp === 0x1a) {
      out += '\\u' + cp.toString(16).padStart(4, '0');
    } else out += ch;
  }
  return Uint8Array.from(out, (c) => c.charCodeAt(0));
}
function decodeRawUnicodeEscape(b) {
  let out = '';
  let i = 0;
  while (i < b.length) {
    const c = b[i++];
    if (c !== 0x5c || i >= b.length) { out += String.fromCharCode(c); continue; }
    const e = b[i++];
    if (e !== 0x75 && e !== 0x55) { out += '\\' + String.fromCharCode(e); continue; }
    const count = e === 0x75 ? 4 : 8;
    const digits = latin1Text(b.subarray(i, i + count));
    if (digits.length < count || !/^[0-9a-fA-F]+$/.test(digits)) {
      limit("this \\u escape is malformed (CPython raises UnicodeDecodeError from the 'rawunicodeescape' codec)");
    }
    i += count;
    const cp = parseInt(digits, 16);
    if (cp > 0x10ffff) limit('this \\U escape is out of range (CPython raises UnicodeDecodeError)');
    if (cp >= 0xd800 && cp <= 0xdfff) limit('this escape makes a lone surrogate, which the demo does not model');
    out += String.fromCodePoint(cp);
  }
  return out;
}

// ─── Pickler (Modules/_pickle.c) ────────────────────────────

const FRAME_SIZE_TARGET = 64 * 1024;
const BATCHSIZE = 1000;

export function checkProtocol(protocol) {
  if (protocol === null || protocol === undefined) return 4;
  if (typeof protocol === 'bigint') protocol = Number(protocol);
  // a C long: 32 bits on Windows, 64 on Linux — beyond 32 bits the two disagree
  if (!Number.isSafeInteger(protocol) || protocol > 2147483647 || protocol < -2147483648) {
    limit('a protocol this large overflows a C long on some platforms (Windows) but not others');
  }
  if (protocol < 0) return 5;
  if (protocol > 5) raise('ValueError', 'pickle protocol must be <= 5');
  return protocol;
}

export class Pickler {
  constructor(protocol = null, { fixImports = true } = {}) {
    this.proto = checkProtocol(protocol);
    this.bin = this.proto > 0;
    this.fixImports = fixImports && this.proto < 3;
    this.memo = new Map();
    this.fast = false;
  }

  clearMemo() { this.memo = new Map(); }

  // one dump() call: the bytes it writes (the memo carries over)
  dump(obj) {
    this.out = new ByteBuf();
    this.framing = false;
    this.frameStart = -1;
    try {
      if (this.proto >= 2) {
        this.write([0x80, this.proto]);
        if (this.proto >= 4) this.framing = true;
      }
      this.save(obj);
      this.write([0x2e]);
      this.commitFrame();
    } finally {
      this.framing = false;
    }
    return this.out.toBytes();
  }

  write(bytes) {
    if (this.framing && this.frameStart === -1) {
      this.frameStart = this.out.n;
      this.out.push(new Uint8Array(9));
    }
    this.out.push(bytes);
  }
  commitFrame() {
    if (!this.framing || this.frameStart === -1) return;
    const start = this.frameStart;
    const len = this.out.n - start - 9;
    if (len >= 4) {
      this.out.a[start] = 0x95;
      this.out.a.set(le(len, 8), start + 1);
    } else {
      this.out.a.copyWithin(start, start + 9, this.out.n);
      this.out.n -= 9;
    }
    this.frameStart = -1;
  }
  opcodeBoundary() {
    if (!this.framing || this.frameStart === -1) return;
    if (this.out.n - this.frameStart - 9 >= FRAME_SIZE_TARGET) this.commitFrame();
  }
  // _Pickler_write_bytes: payloads of 64 KiB or more go outside any frame
  writeBytes(header, data) {
    const framing = this.framing;
    if (data.length >= FRAME_SIZE_TARGET) {
      this.commitFrame();
      this.framing = false;
    }
    this.write(header);
    this.write(data);
    this.framing = framing;
  }

  memoPut(obj) {
    if (this.fast) return;
    const idx = this.memo.size;
    this.memo.set(obj, idx);
    if (this.proto >= 4) this.write([0x94]);
    else if (!this.bin) this.write(ascii(`p${idx}\n`));
    else if (idx < 256) this.write([0x71, idx]);
    else this.write([0x72, ...le(idx, 4)]);
  }
  memoGet(obj) {
    const idx = this.memo.get(obj);
    if (!this.bin) this.write(ascii(`g${idx}\n`));
    else if (idx < 256) this.write([0x68, idx]);
    else this.write([0x6a, ...le(idx, 4)]);
  }

  save(obj) {
    this.opcodeBoundary();
    if (obj === null) return this.write([0x4e]);
    if (obj === true || obj === false) {
      if (this.proto >= 2) return this.write([obj ? 0x88 : 0x89]);
      return this.write(ascii(obj ? 'I01\n' : 'I00\n'));
    }
    if (typeof obj === 'bigint') return this.saveLong(obj);
    if (obj instanceof PyFloat) return this.saveFloat(obj.v);
    if (this.memo.has(obj)) return this.memoGet(obj);
    if (obj instanceof PyBytes) return this.saveBytes(obj);
    if (obj instanceof PyStr) return this.saveUnicode(obj);
    if (obj instanceof PyDict) return this.saveDict(obj);
    if (obj instanceof PySet) return obj.frozen ? this.saveFrozenset(obj) : this.saveSet(obj);
    if (obj instanceof PyList) return this.saveList(obj);
    if (obj instanceof PyTuple) return this.saveTuple(obj);
    if (obj instanceof PyBuiltin) return this.saveGlobal(obj);
    return limit('the demo only pickles None, bool, int, float, str, bytes, list, tuple, dict, set and frozenset');
  }

  saveLong(n) {
    if (n >= -0x80000000n && n <= 0x7fffffffn) {
      const v = Number(n);
      if (this.bin) {
        const b = [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
        if (b[3] !== 0 || b[2] !== 0) return this.write([0x4a, ...b]);
        if (b[1] !== 0) return this.write([0x4d, b[0], b[1]]);
        return this.write([0x4b, b[0]]);
      }
      return this.write(ascii(`I${v}\n`));
    }
    if (this.proto >= 2) {
      const nbits = (n < 0n ? -n : n).toString(2).length;
      let nbytes = (nbits >> 3) + 1;
      const data = le(BigInt.asUintN(nbytes * 8, n), nbytes);
      if (n < 0n && nbytes > 1 && data[nbytes - 1] === 0xff && (data[nbytes - 2] & 0x80) !== 0) nbytes -= 1;
      const header = nbytes < 256 ? [0x8a, nbytes] : [0x8b, ...le(nbytes, 4)];
      this.write(header);
      return this.write(data.subarray(0, nbytes));
    }
    this.write([0x4c]);
    this.write(ascii(intRepr(n)));
    return this.write(ascii('L\n'));
  }

  saveFloat(v) {
    if (this.bin) {
      const dv = new DataView(new ArrayBuffer(9));
      dv.setUint8(0, 0x47);
      dv.setFloat64(1, v);
      return this.write(new Uint8Array(dv.buffer));
    }
    return this.write(ascii(`F${pyFloatRepr(v)}\n`));
  }

  saveBytes(obj) {
    if (this.proto < 3) {
      // fake the copy protocol: bytes() or _codecs.encode(text, 'latin1')
      if (obj.b.length === 0) return this.saveReduce(BYTES_TYPE, EMPTY_TUPLE, obj);
      const text = pyStr(latin1Text(obj.b));
      return this.saveReduce(CODECS_ENCODE, new PyTuple([text, LATIN1]), obj);
    }
    const size = obj.b.length;
    let header;
    if (size <= 0xff) header = [0x43, size];
    else if (size <= 0xffffffff) header = [0x42, ...le(size, 4)];
    else header = [0x8e, ...le(size, 8)];
    this.writeBytes(header, obj.b);
    return this.memoPut(obj);
  }

  saveUnicode(obj) {
    if (this.bin) {
      const data = utf8(obj.v);
      const size = data.length;
      let header;
      if (size <= 0xff && this.proto >= 4) header = [0x8c, size];
      else if (size <= 0xffffffff) header = [0x58, ...le(size, 4)];
      else header = [0x8d, ...le(size, 8)];
      this.writeBytes(header, data);
    } else {
      this.write([0x56]);
      this.write(rawUnicodeEscape(obj.v));
      this.write([0x0a]);
    }
    return this.memoPut(obj);
  }

  saveTuple(t) {
    const n = t.items.length;
    if (n === 0) return this.write(this.proto ? [0x29] : [0x28, 0x74]);
    if (n <= 3 && this.proto >= 2) {
      for (const it of t.items) this.save(it);
      if (this.memo.has(t)) {
        // recursive tuple: drop what was pushed, fetch it from the memo
        for (let i = 0; i < n; i++) this.write([0x30]);
        return this.memoGet(t);
      }
      this.write([[0x85, 0x86, 0x87][n - 1]]);
      return this.memoPut(t);
    }
    this.write([0x28]);
    for (const it of t.items) this.save(it);
    if (this.memo.has(t)) {
      if (this.bin) this.write([0x31]);
      else for (let i = 0; i <= n; i++) this.write([0x30]);
      return this.memoGet(t);
    }
    this.write([0x74]);
    return this.memoPut(t);
  }

  saveList(l) {
    this.write(this.bin ? [0x5d] : [0x28, 0x6c]);
    this.memoPut(l);
    const items = l.items;
    if (items.length === 0) return;
    if (this.proto === 0) {
      for (const it of items) { this.save(it); this.write([0x61]); }
      return;
    }
    if (items.length === 1) {
      this.save(items[0]);
      this.write([0x61]);
      return;
    }
    let total = 0;
    do {
      let batch = 0;
      this.write([0x28]);
      while (total < items.length) {
        this.save(items[total]);
        total += 1;
        if (++batch === BATCHSIZE) break;
      }
      this.write([0x65]);
    } while (total < items.length);
  }

  saveDict(d) {
    this.write(this.bin ? [0x7d] : [0x28, 0x64]);
    this.memoPut(d);
    const size = d.size;
    if (size === 0) return;
    if (this.proto === 0) {
      for (let i = 0; i < size; i++) { this.save(d.keys[i]); this.save(d.vals[i]); this.write([0x73]); }
      return;
    }
    if (size === 1) {
      this.save(d.keys[0]);
      this.save(d.vals[0]);
      this.write([0x73]);
      return;
    }
    let pos = 0;
    let batch;
    do {
      batch = 0;
      this.write([0x28]);
      while (pos < d.size) {
        this.save(d.keys[pos]);
        this.save(d.vals[pos]);
        pos += 1;
        if (++batch === BATCHSIZE) break;
      }
      this.write([0x75]);
    } while (batch === BATCHSIZE);
  }

  saveSet(s) {
    if (this.proto < 4) return this.saveReduce(SET_TYPE, new PyTuple([new PyList(s.items())]), s);
    this.write([0x8f]);
    this.memoPut(s);
    const items = s.items();
    if (items.length === 0) return;
    let pos = 0;
    let batch;
    do {
      batch = 0;
      this.write([0x28]);
      while (pos < items.length) {
        this.save(items[pos]);
        pos += 1;
        if (++batch === BATCHSIZE) break;
      }
      this.write([0x90]);
    } while (batch === BATCHSIZE);
  }

  saveFrozenset(s) {
    if (this.proto < 4) return this.saveReduce(FROZENSET_TYPE, new PyTuple([new PyList(s.items())]), s);
    this.write([0x28]);
    for (const it of s.items()) this.save(it);
    if (this.memo.has(s)) {
      this.write([0x31]);
      return this.memoGet(s);
    }
    this.write([0x91]);
    return this.memoPut(s);
  }

  saveReduce(callable, argTuple, obj) {
    this.save(callable);
    this.save(argTuple);
    this.write([0x52]);
    if (this.memo.has(obj)) {
      this.write([0x30]);
      return this.memoGet(obj);
    }
    return this.memoPut(obj);
  }

  saveGlobal(g) {
    if (this.proto >= 4) limit('pickling a class or function itself (STACK_GLOBAL) is not part of this demo');
    let module = g.module;
    // protocols 0-2 write the Python 2 module name (_compat_pickle)
    if (this.proto < 3 && this.fixImports && module === 'builtins') module = '__builtin__';
    this.write([0x63]);
    this.write(ascii(module));
    this.write([0x0a]);
    this.write(ascii(g.name));
    this.write([0x0a]);
    return this.memoPut(g);
  }
}

export function dumps(obj, protocol = null) {
  return new Pickler(protocol).dump(obj);
}

// ─── Unpickler (Modules/_pickle.c) ──────────────────────────

// a binary file object over bytes (io.BytesIO): read / readinto / readline
export class BytesFile {
  constructor(data) { this.data = data; this.pos = 0; }
  read(n) {
    const out = this.data.subarray(this.pos, Math.min(this.data.length, this.pos + n));
    this.pos += out.length;
    return out;
  }
  readline() {
    let end = this.data.indexOf(0x0a, this.pos);
    end = end === -1 ? this.data.length : end + 1;
    const out = this.data.subarray(this.pos, end);
    this.pos = end;
    return out;
  }
}

const isCallable = (v) => v instanceof PyBuiltin;
const MEMO_LIMIT = 1 << 20;

export class Unpickler {
  // source: Uint8Array (pickle.loads) or a BytesFile (pickle.load / Unpickler(file))
  constructor(source, { findClass = null, fixImports = true } = {}) {
    if (source instanceof BytesFile) {
      this.file = source;
      this.buf = new Uint8Array(0);
    } else {
      this.file = null;
      this.buf = source;
    }
    this.idx = 0;
    this.len = this.buf.length;
    this.memo = new Map();
    this.findClassHook = findClass;
    this.fixImports = fixImports;
  }

  // _Unpickler_Read: from the buffer, else ONE read(n) from the file that
  // replaces the buffer
  read(n) {
    if (this.idx + n <= this.len) {
      const s = this.buf.subarray(this.idx, this.idx + n);
      this.idx += n;
      return s;
    }
    if (!this.file) truncated();
    if (n > 1e9) limit('the demo stops at reads of more than 10^9 bytes');
    const data = this.file.read(n);
    this.buf = data;
    this.len = data.length;
    this.idx = 0;
    if (data.length < n) truncated();
    this.idx = n;
    return data.subarray(0, n);
  }
  // _Unpickler_ReadInto: what is left in the buffer, then readinto() the rest
  readInto(n) {
    const out = new Uint8Array(n);
    let got = 0;
    const inBuffer = this.len - this.idx;
    if (inBuffer > 0) {
      got = Math.min(inBuffer, n);
      out.set(this.buf.subarray(this.idx, this.idx + got));
      this.idx += got;
      if (got === n) return out;
    }
    if (!this.file) truncated();
    const data = this.file.read(n - got);
    if (data.length < n - got) truncated();
    out.set(data, got);
    return out;
  }
  readline() {
    for (let i = this.idx; i < this.len; i++) {
      if (this.buf[i] === 0x0a) {
        const line = this.buf.subarray(this.idx, i + 1);
        this.idx = i + 1;
        return line;
      }
    }
    if (!this.file) truncated();
    const data = this.file.readline();
    this.buf = data;
    this.len = data.length;
    this.idx = 0;
    if (data.length === 0 || data[data.length - 1] !== 0x0a) truncated();
    this.idx = data.length;
    return data;
  }
  lineText(minLen = 2) {
    const line = this.readline();
    if (line.length < minLen) truncated();
    // C parses these as NUL-terminated strings: a NUL byte ends the number early
    if (line.includes(0)) limit('this argument contains a NUL byte, where C stops reading the number');
    return latin1Text(line.subarray(0, line.length - 1));
  }

  push(v) { this.stack.push(v); }
  underflow() {
    throw unpicklingError(this.markSet ? 'unexpected MARK found' : 'unpickling stack underflow');
  }
  pop() {
    if (this.stack.length <= this.fence) this.underflow();
    return this.stack.pop();
  }
  top() {
    if (this.stack.length <= this.fence) this.underflow();
    return this.stack[this.stack.length - 1];
  }
  marker() {
    if (this.marks.length < 1) throw unpicklingError('could not find MARK');
    const mark = this.marks.pop();
    this.markSet = this.marks.length !== 0;
    this.fence = this.marks.length ? this.marks[this.marks.length - 1] : 0;
    return mark;
  }
  popTuple(start) {
    if (start < this.fence) this.underflow();
    return pyTuple(this.stack.splice(start));
  }
  clearTo(i) { if (this.stack.length > i) this.stack.length = i; }

  memoPut(idx, value) {
    if (idx > MEMO_LIMIT) limit('the demo stops at memo indexes above 2**20 (CPython would allocate a memo that large)');
    this.memo.set(idx, value);
  }
  memoGet(idx) {
    if (!this.memo.has(idx)) {
      // the message formats the index as a C long: 32 bits on Windows
      if (idx > 0x7fffffff) limit('CPython prints this index as a C long, which differs between Windows and Linux');
      throw unpicklingError(`Memo value not found at index ${idx}`);
    }
    this.push(this.memo.get(idx));
  }

  findClass(module, name) {
    if (this.findClassHook) return this.findClassHook(module, name, (m, n) => this.defaultFindClass(m, n));
    return this.defaultFindClass(module, name);
  }
  defaultFindClass(module, name) {
    // protocols 0-2: Python 2 names → Python 3 (_compat_pickle); of the
    // globals modelled here only the module rename matters
    if (this.proto < 3 && this.fixImports && module === '__builtin__') module = 'builtins';
    if (module === 'builtins') {
      if (name === 'set') return SET_TYPE;
      if (name === 'frozenset') return FROZENSET_TYPE;
      if (name === 'bytes') return BYTES_TYPE;
    }
    if (module === '_codecs' && name === 'encode') return CODECS_ENCODE;
    return limit(`this pickle imports ${module}.${name} — the demo only knows the globals a pickle of plain values uses (builtins.set, builtins.frozenset, builtins.bytes, _codecs.encode)`);
  }

  load() {
    this.stack = [];
    this.marks = [];
    this.fence = 0;
    this.markSet = false;
    this.proto = 0;
    for (;;) {
      let op;
      try {
        op = this.read(1)[0];
      } catch (e) {
        if (e.name === '_pickle.UnpicklingError') throw new PyException('EOFError', 'Ran out of input');
        throw e;
      }
      if (op === 0x2e) break;
      const fn = OPS[op];
      if (!fn) {
        const shown = op >= 0x20 && op <= 0x7e && op !== 0x27 && op !== 0x5c ? String.fromCharCode(op) : '\\x' + hex2(op);
        throw unpicklingError(`invalid load key, '${shown}'.`);
      }
      fn.call(this);
    }
    return this.pop();
  }
}

function countedLong(size) {
  const nb = this.read(size);
  const n = size === 1 ? nb[0] : new DataView(nb.buffer, nb.byteOffset, 4).getInt32(0, true);
  if (n < 0) throw unpicklingError('LONG pickle has negative byte count');
  if (n === 0) return this.push(0n);
  const data = this.read(n);
  return this.push(BigInt.asIntN(n * 8, readLE(data)));
}
function countedSize(b) {
  const n = readLE(b);
  if (n > 0x7fffffffffffffffn) limit('a size above 2**63 - 1 overflows Py_ssize_t (CPython raises OverflowError)');
  if (n > 1e9) limit('the demo stops at sizes above 10^9 bytes');
  return Number(n);
}
function countedUnicode(nbytes) {
  const size = countedSize(this.read(nbytes));
  const s = utf8Decode(this.read(size));
  if (hasSurrogate(s)) limit('this string holds a lone surrogate, which the demo does not model');
  this.push(pyStr(s));
}
function countedBytes(nbytes) {
  const size = countedSize(this.read(nbytes));
  if (size > 1e7 && size > this.len - this.idx + (this.file ? this.file.data.length - this.file.pos : 0)) {
    limit('CPython allocates the whole claimed size before reading — whether that fails depends on the machine');
  }
  this.push(pyBytes(this.readInto(size)));
}
function doAppend(x) {
  const len = this.stack.length;
  if (x > len || x <= this.fence) this.underflow();
  if (len === x) return;
  const list = this.stack[x - 1];
  if (!(list instanceof PyList)) {
    if (list instanceof PyBuiltin) limit('appending to a class or function is not part of the demo');
    raise('AttributeError', `'${typeName(list)}' object has no attribute 'append'`);
  }
  list.items.push(...this.stack.splice(x));
}
function setItem(target, key, value) {
  if (target instanceof PyDict) return target.set(key, value);
  if (target instanceof PyList) {
    let i;
    if (typeof key === 'bigint') i = key;
    else if (key === true || key === false) i = key ? 1n : 0n;
    else raise('TypeError', `list indices must be integers or slices, not ${typeName(key)}`);
    const n = BigInt(target.items.length);
    if (i < 0n) i += n;
    if (i < 0n || i >= n) {
      if (i > 0x7fffffffffffffffn || i < -0x8000000000000000n) limit('an index this large raises IndexError with a different message');
      raise('IndexError', 'list assignment index out of range');
    }
    target.items[Number(i)] = value;
    return undefined;
  }
  if (target instanceof PyBuiltin) limit('item assignment on a class or function is not part of the demo');
  return raise('TypeError', `'${typeName(target)}' object does not support item assignment`);
}
function doSetItems(x) {
  const len = this.stack.length;
  if (x > len || x <= this.fence) this.underflow();
  if (len === x) return;
  if ((len - x) % 2 !== 0) throw unpicklingError('odd number of items for SETITEMS');
  const target = this.stack[x - 1];
  try {
    for (let i = x + 1; i < len; i += 2) setItem(target, this.stack[i - 1], this.stack[i]);
  } finally {
    this.clearTo(x);
  }
}
function iterate(v) {
  if (v instanceof PyList || v instanceof PyTuple) return v.items;
  if (v instanceof PyStr) return [...v.v].map(pyStr);
  if (v instanceof PyBytes) return [...v.b].map((b) => BigInt(b));
  if (v instanceof PySet || v instanceof PyDict || v instanceof PyBuiltin) {
    return limit('building a set from a set, dict or class is not part of the demo');
  }
  return raise('TypeError', `'${typeName(v)}' object is not iterable`);
}
function call(fn, args) {
  if (fn === SET_TYPE || fn === FROZENSET_TYPE) {
    if (args.length > 1) raise('TypeError', `${fn.name} expected at most 1 argument, got ${args.length}`);
    return pySetOf(args.length ? iterate(args[0]) : [], fn === FROZENSET_TYPE);
  }
  if (fn === BYTES_TYPE) {
    if (args.length === 0) return pyBytes([]);
    return limit('bytes() with arguments is not part of the demo');
  }
  if (fn === CODECS_ENCODE && args.length === 2 && args[0] instanceof PyStr && args[1] instanceof PyStr && args[1].v === 'latin1') {
    const text = args[0].v;
    if (/[^\x00-\xff]/.test(text)) limit('this text cannot be encoded as latin-1 (CPython raises UnicodeEncodeError)');
    return pyBytes(Uint8Array.from(text, (c) => c.charCodeAt(0)));
  }
  return limit('this call is not part of the demo (only set(), frozenset(), bytes() and _codecs.encode(text, "latin1") are)');
}

const OPS = [];
const op = (ch, fn) => { OPS[typeof ch === 'number' ? ch : ch.charCodeAt(0)] = fn; };
op('(', function () {
  this.markSet = true;
  this.fence = this.stack.length;
  this.marks.push(this.stack.length);
});
op('0', function () {
  const len = this.stack.length;
  if (this.marks.length > 0 && this.marks[this.marks.length - 1] === len) {
    this.marks.pop();
    this.markSet = this.marks.length !== 0;
    this.fence = this.marks.length ? this.marks[this.marks.length - 1] : 0;
  } else if (len <= this.fence) this.underflow();
  else this.stack.pop();
});
op('1', function () { this.clearTo(this.marker()); });
op('2', function () { this.push(this.top()); });
op('N', function () { this.push(null); });
op(0x88, function () { this.push(true); });
op(0x89, function () { this.push(false); });
op('I', function () {
  const s = this.lineText();
  const lineLen = s.length + 1;
  let x;
  let m;
  if ((m = /^([+-]?)(0[0-7]*)$/.exec(s))) {
    // strtol with base 0: a leading zero means octal
    x = BigInt('0o' + (m[2].slice(1) || '0'));
    if (m[1] === '-') x = -x;
    if (x > 0x7fffffffn || x < -0x80000000n) limit('this octal INT overflows a 32-bit C long on Windows but not on Linux');
  } else if (/^[+-]?[1-9]\d*$/.test(s)) x = BigInt(s);
  else if (!/\d/.test(s)) raise('ValueError', 'could not convert string to int');
  else limit('the demo reads INT arguments written in plain decimal only');
  if (lineLen === 3 && (x === 0n || x === 1n)) this.push(x === 1n);
  else this.push(x);
});
op('J', function () {
  const b = this.read(4);
  this.push(BigInt(new DataView(b.buffer, b.byteOffset, 4).getInt32(0, true)));
});
op('K', function () { this.push(BigInt(this.read(1)[0])); });
op('M', function () { this.push(readLE(this.read(2))); });
op('L', function () {
  let s = this.lineText();
  if (s.endsWith('L')) s = s.slice(0, -1);
  if (!/^[+-]?([1-9]\d*|0+)$/.test(s)) limit('the demo reads LONG arguments written in plain decimal only');
  if (s.replace(/^[+-]/, '').length > 4300) limit('more than 4300 digits: CPython refuses the conversion (sys.set_int_max_str_digits)');
  this.push(BigInt(s));
});
op(0x8a, function () { countedLong.call(this, 1); });
op(0x8b, function () { countedLong.call(this, 4); });
op('F', function () {
  const s = this.lineText();
  if (!/^[+-]?(?:(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|inf(?:inity)?|nan)$/i.test(s)) {
    limit('the demo reads FLOAT arguments in Python float syntax only (CPython raises ValueError for the rest)');
  }
  let v;
  if (/inf/i.test(s)) v = s[0] === '-' ? -Infinity : Infinity;
  else if (/nan/i.test(s)) v = NaN;
  else {
    v = Number(s);
    if (!Number.isFinite(v)) limit('this FLOAT overflows (CPython raises OverflowError)');
  }
  this.push(new PyFloat(v));
});
op('G', function () {
  const b = this.read(8);
  this.push(new PyFloat(new DataView(b.buffer, b.byteOffset, 8).getFloat64(0)));
});
op('V', function () {
  const line = this.readline();
  this.push(pyStr(decodeRawUnicodeEscape(line.subarray(0, line.length - 1))));
});
op('X', function () { countedUnicode.call(this, 4); });
op(0x8c, function () { countedUnicode.call(this, 1); });
op(0x8d, function () { countedUnicode.call(this, 8); });
op('B', function () { countedBytes.call(this, 4); });
op('C', function () { countedBytes.call(this, 1); });
op(0x8e, function () { countedBytes.call(this, 8); });
op(']', function () { this.push(new PyList()); });
op(')', function () { this.push(EMPTY_TUPLE); });
op('}', function () { this.push(new PyDict()); });
op(0x8f, function () { this.push(new PySet(false)); });
op('l', function () {
  const i = this.marker();
  this.push(new PyList(this.stack.splice(i)));
});
op('t', function () {
  const i = this.marker();
  this.push(this.popTuple(i));
});
const countedTuple = (n) => function () {
  if (this.stack.length < n) this.underflow();
  this.push(this.popTuple(this.stack.length - n));
};
op(0x85, countedTuple(1));
op(0x86, countedTuple(2));
op(0x87, countedTuple(3));
op('d', function () {
  const i = this.marker();
  const j = this.stack.length;
  const d = new PyDict();
  if ((j - i) % 2 !== 0) throw unpicklingError('odd number of items for DICT');
  for (let k = i + 1; k < j; k += 2) d.set(this.stack[k - 1], this.stack[k]);
  this.clearTo(i);
  this.push(d);
});
op(0x91, function () {
  const i = this.marker();
  const items = this.popTuple(i);
  this.push(pySetOf(items.items, true));
});
op('a', function () { doAppend.call(this, this.stack.length - 1); });
op('e', function () { doAppend.call(this, this.marker()); });
op('s', function () { doSetItems.call(this, this.stack.length - 2); });
op('u', function () { doSetItems.call(this, this.marker()); });
op(0x90, function () {
  const mark = this.marker();
  const len = this.stack.length;
  if (mark > len || mark <= this.fence) this.underflow();
  if (len === mark) return;
  const target = this.stack[mark - 1];
  if (!(target instanceof PySet) || target.frozen) {
    if (target instanceof PyBuiltin) limit('adding to a class or function is not part of the demo');
    raise('AttributeError', `'${typeName(target)}' object has no attribute 'add'`);
  }
  const items = this.popTuple(mark);
  for (const it of items.items) target.add(it);
});
op('g', function () {
  const s = this.lineText();
  if (!/^\d+$/.test(s)) limit('the demo reads GET arguments written in plain decimal only');
  this.memoGet(Number(s));
});
op('h', function () { this.memoGet(this.read(1)[0]); });
op('j', function () { this.memoGet(Number(readLE(this.read(4)))); });
op('p', function () {
  const s = this.lineText();
  const value = this.top();
  if (/^-0*[1-9]\d*$/.test(s)) raise('ValueError', 'negative PUT argument');
  if (!/^[+-]?\d+$/.test(s)) limit('the demo reads PUT arguments written in plain decimal only');
  this.memoPut(Number(BigInt(s)), value);
});
op('q', function () {
  const idx = this.read(1)[0];
  this.memoPut(idx, this.top());
});
op('r', function () {
  const idx = Number(readLE(this.read(4)));
  this.memoPut(idx, this.top());
});
op(0x94, function () { this.memoPut(this.memo.size, this.top()); });
op('c', function () {
  const mline = this.readline();
  if (mline.length < 2) truncated();
  const module = utf8Decode(mline.subarray(0, mline.length - 1));
  const nline = this.readline();
  if (nline.length < 2) truncated();
  const name = utf8Decode(nline.subarray(0, nline.length - 1));
  if (this.proto >= 4 && name.includes('.')) limit('dotted global names are not part of the demo');
  this.push(this.findClass(module, name));
});
op(0x93, function () {
  const name = this.pop();
  const module = this.pop();
  if (!(module instanceof PyStr) || !(name instanceof PyStr)) throw unpicklingError('STACK_GLOBAL requires str');
  if (name.v.includes('.')) limit('dotted global names are not part of the demo');
  this.push(this.findClass(module.v, name.v));
});
op('R', function () {
  const args = this.pop();
  const fn = this.pop();
  if (!(args instanceof PyTuple)) raise('TypeError', 'argument list must be a tuple');
  if (!isCallable(fn)) raise('TypeError', `'${typeName(fn)}' object is not callable`);
  this.push(call(fn, args.items));
});
op(0x80, function () {
  const i = this.read(1)[0];
  if (i > 5) raise('ValueError', `unsupported pickle protocol: ${i}`);
  this.proto = i;
});
op(0x95, function () {
  const size = countedSize(this.read(8));
  this.read(size);
  this.idx -= size;
});
const NO_PERSISTENT_LOAD = 'A load persistent id instruction was encountered, but no persistent_load function was specified.';
// 3.13 reads the ID (line / stack item) before calling the default
// persistent_load; 3.12 raises at once. Only the cases where both agree are
// shown.
const VERSION_SPLIT = 'Python 3.12 and 3.13 report this persistent-ID error differently';
op('P', function () {
  if (this.file) limit(VERSION_SPLIT);
  const end = this.buf.indexOf(0x0a, this.idx);
  if (end === -1 || end >= this.len || /[^\x00-\x7f]/.test(latin1Text(this.buf.subarray(this.idx, end)))) limit(VERSION_SPLIT);
  throw unpicklingError(NO_PERSISTENT_LOAD);
});
op('Q', function () {
  if (this.stack.length <= this.fence) limit(VERSION_SPLIT);
  throw unpicklingError(NO_PERSISTENT_LOAD);
});
op(0x97, function () {
  throw unpicklingError('pickle stream refers to out-of-band data but no *buffers* argument was given');
});
op(0x98, function () {
  const obj = this.top();
  if (!(obj instanceof PyBytes)) {
    if (obj instanceof PyBuiltin || obj instanceof PySet) limit('READONLY_BUFFER on this object is not part of the demo');
    raise('TypeError', `memoryview: a bytes-like object is required, not '${typeName(obj)}'`);
  }
});
const unsupported = (name) => function () {
  limit(`the ${name} opcode is not part of the demo (it only reads what pickling None, bool, int, float, str, bytes, list, tuple, dict, set and frozenset produces)`);
};
for (const [ch, name] of [['S', 'STRING'], ['T', 'BINSTRING'], ['U', 'SHORT_BINSTRING'], [0x96, 'BYTEARRAY8'],
  ['b', 'BUILD'], ['i', 'INST'], ['o', 'OBJ'], [0x81, 'NEWOBJ'], [0x92, 'NEWOBJ_EX'],
  [0x82, 'EXT1'], [0x83, 'EXT2'], [0x84, 'EXT4']]) op(ch, unsupported(name));

export function loads(data, options) {
  return new Unpickler(data, options).load();
}

// ─── pickletools.genops / dis ───────────────────────────────

// name, code, argument reader, protocol, stack effect for dis():
// [items popped (or index of the mark among them, as 'mN'), items pushed
// ('M' = a mark)]. Built at first use from this compact table.
const OPCODE_TABLE = `INT I dnl 0 0 1|BININT J i4 1 0 1|BININT1 K u1 1 0 1|BININT2 M u2 1 0 1|LONG L dnll 0 0 1|LONG1 \x8a l1 2 0 1|LONG4 \x8b l4 2 0 1|STRING S snl 0 0 1|BINSTRING T s4 1 0 1|SHORT_BINSTRING U s1 1 0 1|BINBYTES B b4 3 0 1|SHORT_BINBYTES C b1 3 0 1|BINBYTES8 \x8e b8 4 0 1|BYTEARRAY8 \x96 ba8 5 0 1|NEXT_BUFFER \x97 - 5 0 1|READONLY_BUFFER \x98 - 5 1 1|NONE N - 0 0 1|NEWTRUE \x88 - 2 0 1|NEWFALSE \x89 - 2 0 1|UNICODE V unl 0 0 1|SHORT_BINUNICODE \x8c us1 4 0 1|BINUNICODE X us4 1 0 1|BINUNICODE8 \x8d us8 4 0 1|FLOAT F fnl 0 0 1|BINFLOAT G f8 1 0 1|EMPTY_LIST ] - 1 0 1|APPEND a - 0 2 1|APPENDS e - 1 m1 1|LIST l - 0 m0 1|EMPTY_TUPLE ) - 1 0 1|TUPLE t - 0 m0 1|TUPLE1 \x85 - 2 1 1|TUPLE2 \x86 - 2 2 1|TUPLE3 \x87 - 2 3 1|EMPTY_DICT } - 1 0 1|DICT d - 0 m0 1|SETITEM s - 0 3 1|SETITEMS u - 1 m1 1|EMPTY_SET \x8f - 4 0 1|ADDITEMS \x90 - 4 m1 1|FROZENSET \x91 - 4 m0 1|POP 0 - 0 1 0|DUP 2 - 0 1 2|MARK ( - 0 0 M|POP_MARK 1 - 1 m0 0|GET g dnl 0 0 1|BINGET h u1 1 0 1|LONG_BINGET j u4 1 0 1|PUT p dnl 0 0 0|BINPUT q u1 1 0 0|LONG_BINPUT r u4 1 0 0|MEMOIZE \x94 - 4 1 1|EXT1 \x82 u1 2 0 1|EXT2 \x83 u2 2 0 1|EXT4 \x84 i4 2 0 1|GLOBAL c snp 0 0 1|STACK_GLOBAL \x93 - 4 2 1|REDUCE R - 0 2 1|BUILD b - 0 2 1|INST i snp 0 m0 1|OBJ o - 1 m0 1|NEWOBJ \x81 - 2 2 1|NEWOBJ_EX \x92 - 4 3 1|PROTO \x80 u1 2 0 0|STOP . - 0 1 0|FRAME \x95 u8 4 0 0|PERSID P snl1 0 0 1|BINPERSID Q - 1 1 1`;
let opcodeInfo = null;
export function opcodes() {
  if (opcodeInfo) return opcodeInfo;
  opcodeInfo = new Map();
  for (const row of OPCODE_TABLE.split('|')) {
    const [name, code, arg, proto, before, after] = row.split(' ');
    opcodeInfo.set(code.charCodeAt(0), {
      name, code, arg: arg === '-' ? null : arg, proto: Number(proto),
      markAt: before[0] === 'm' ? Number(before.slice(1)) : -1,
      pops: before[0] === 'm' ? null : Number(before),
      pushesMark: after === 'M',
      pushes: after === 'M' ? 0 : Number(after),
    });
  }
  return opcodeInfo;
}

// genops(data): [{ info, arg, pos }] — arg as a model value (or null)
export function genops(data) {
  const ops = [];
  const f = new BytesFile(data);
  const info = opcodes();
  const need = (n) => {
    const b = f.read(n);
    if (b.length < n) limit('this pickle is truncated (pickletools raises ValueError)');
    return b;
  };
  const line = () => {
    const b = f.readline();
    if (b.length === 0 || b[b.length - 1] !== 0x0a) limit('this pickle is truncated (pickletools raises ValueError)');
    return b.subarray(0, b.length - 1);
  };
  for (;;) {
    const pos = f.pos;
    const code = f.read(1);
    if (code.length === 0) limit('pickle exhausted before seeing STOP (pickletools raises ValueError)');
    const op = info.get(code[0]);
    if (!op) limit(`at position ${pos}, opcode ${bytesRepr(code)} unknown (pickletools raises ValueError)`);
    let arg = null;
    switch (op.arg) {
      case null: break;
      case 'u1': arg = BigInt(need(1)[0]); break;
      case 'u2': arg = readLE(need(2)); break;
      case 'u4': arg = readLE(need(4)); break;
      case 'u8': arg = readLE(need(8)); break;
      case 'i4': arg = BigInt.asIntN(32, readLE(need(4))); break;
      case 'l1': case 'l4': {
        const n = op.arg === 'l1' ? need(1)[0] : Number(BigInt.asIntN(32, readLE(need(4))));
        if (n < 0) limit('negative LONG byte count');
        arg = n === 0 ? 0n : BigInt.asIntN(n * 8, readLE(need(n)));
        break;
      }
      case 'dnl': {
        const s = latin1Text(line());
        if (s === '00') arg = false;
        else if (s === '01') arg = true;
        else if (/^[+-]?\d+$/.test(s)) arg = BigInt(s);
        else limit('unexpected decimal argument');
        break;
      }
      case 'dnll': {
        let s = latin1Text(line());
        if (s.endsWith('L')) s = s.slice(0, -1);
        if (!/^[+-]?\d+$/.test(s)) limit('unexpected decimal argument');
        arg = BigInt(s);
        break;
      }
      case 'fnl': {
        const s = latin1Text(line());
        arg = new PyFloat(/inf/i.test(s) ? (s[0] === '-' ? -Infinity : Infinity) : /nan/i.test(s) ? NaN : Number(s));
        break;
      }
      case 'f8': {
        const b = need(8);
        arg = new PyFloat(new DataView(b.buffer, b.byteOffset, 8).getFloat64(0));
        break;
      }
      case 'unl': arg = pyStr(decodeRawUnicodeEscape(line())); break;
      case 'us1': case 'us4': case 'us8': {
        const n = Number(readLE(need({ us1: 1, us4: 4, us8: 8 }[op.arg])));
        arg = pyStr(utf8Decode(need(n)));
        break;
      }
      case 'b1': case 'b4': case 'b8': {
        const n = Number(readLE(need({ b1: 1, b4: 4, b8: 8 }[op.arg])));
        arg = pyBytes(need(n).slice());
        break;
      }
      case 'snp': {
        const m = utf8Decode(line());
        const n = utf8Decode(line());
        arg = pyStr(`${m} ${n}`);
        break;
      }
      default:
        limit(`pickletools argument ${op.arg} is not part of the demo`);
    }
    ops.push({ info: op, arg, pos });
    if (op.name === 'STOP') return ops;
  }
}

// pickletools.dis(data, out) → the printed lines
export function dis(data) {
  const lines = [];
  const MARKOBJ = {};
  const stack = [];
  const memo = new Set();
  const markstack = [];
  let maxproto = -1;
  for (const { info: op, arg, pos } of genops(data)) {
    const shownCode = op.code.charCodeAt(0) >= 0x20 && op.code.charCodeAt(0) < 0x7f ? op.code : '\\x' + hex2(op.code.charCodeAt(0));
    let line = `${String(pos).padStart(5)}: ${shownCode.padEnd(4)} ${' '.repeat(4 * markstack.length)}${op.name}`;
    maxproto = Math.max(maxproto, op.proto);
    let numtopop = op.markAt >= 0 ? op.markAt + 1 : op.pops;
    let markmsg = null;
    if (op.markAt >= 0 || (op.name === 'POP' && stack.length && stack[stack.length - 1] === MARKOBJ)) {
      if (!markstack.length) limit('no MARK exists on stack (pickletools raises ValueError)');
      markmsg = `(MARK at ${markstack.pop()})`;
      while (stack[stack.length - 1] !== MARKOBJ) stack.pop();
      stack.pop();
      numtopop = op.markAt >= 0 ? op.markAt : 0;
    }
    if (op.name === 'MEMOIZE') {
      markmsg = `(as ${memo.size})`;
      memo.add(memo.size);
    } else if (op.name === 'PUT' || op.name === 'BINPUT' || op.name === 'LONG_BINPUT') memo.add(Number(arg));
    if (arg !== null || markmsg) {
      line += ' '.repeat(Math.max(0, 10 - op.name.length));
      if (arg !== null) line += ' ' + pyRepr(arg);
      if (markmsg) line += ' ' + markmsg;
    }
    lines.push(line);
    if (stack.length < numtopop) limit('stack underflow (pickletools raises ValueError)');
    stack.length -= numtopop;
    if (op.pushesMark) {
      markstack.push(pos);
      stack.push(MARKOBJ);
    } else for (let i = 0; i < op.pushes; i++) stack.push(0);
  }
  lines.push(`highest protocol among opcodes = ${maxproto}`);
  return lines;
}
