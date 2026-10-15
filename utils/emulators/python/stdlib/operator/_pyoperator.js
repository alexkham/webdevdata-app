// utils/emulators/python/stdlib/operator/_pyoperator.js
//
// Port of the CPython 3.13 behaviour the operator demos show — shared by
// the module hub and every member emulator. Not a content page (leading
// underscore), so the catalog generator never maps it.
//
// The operator module is a thin layer over the object protocol, so this
// is mostly a port of that protocol for the built-in types a demo can
// produce:
//   binop / unop / compare     Objects/abstract.c (PyNumber_*), longobject.c,
//                              floatobject.c (float_pow, _float_div_mod),
//                              unicodeobject.c (concat, repeat, % format)
//   concat / contains / …      Modules/_operator.c → PySequence_*, PyObject_*Item
//   itemgetter / attrgetter /  Modules/_operator.c (reprs, argument checks)
//   methodcaller / call
//   suggestions                Python/suggestions.c (the "Did you mean" hint
//                              the 3.13 traceback adds to AttributeError)
//
// Value model: None → null · bool → true/false · int → bigint ·
// float → JS number · str → string · list → Array · tuple → PyTuple ·
// dict → PyDict · set → PySet · dataclass instance → PyRecord.
// Demo inputs are Python literals decided by their text (py-num
// fromLiteral): num() / auto() turn them into the value model.
//
// Floats are exact: int/int true division and every float ** float are
// correctly rounded (exact rationals, or a 128/256-bit computation whose
// rounding is certified — CPython calls the C library pow(), which gives
// the correctly rounded result on Windows and glibc for every case the
// fuzz tried). Results the browser cannot reproduce honestly raise a
// 'DemoLimit' (shown as "not reproduced", never as a Python exception).

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { fromLiteral } from '../../../../py-num.js';

export const raise = (type, msg = '') => { throw new PyException(type, msg); };
export const limit = (msg) => { throw new PyException('DemoLimit', msg); };

// browser guard: results larger than this are not built
const MAX_ITEMS = 1000000;
const MAX_BITS = 1000000;
const SSIZE_MAX = 9223372036854775807n;
const SSIZE_MIN = -9223372036854775808n;

// ─── values ─────────────────────────────────────────────────

export class PyTuple {
  constructor(items) { this.items = items; }
}
export const tuple = (...items) => new PyTuple(items);
export const EMPTY_TUPLE = new PyTuple([]);
// tuple(iterable): an empty result is the () singleton, as in CPython
export const toTuple = (items) => (items.length === 0 ? EMPTY_TUPLE : new PyTuple(items));

export class PyDict {
  constructor(pairs = []) {
    this.keys = [];
    this.vals = [];
    for (const [k, v] of pairs) dictSet(this, k, v);
  }
}

export class PySet {
  constructor(items = []) {
    this.items = [];
    for (const x of items) {
      checkHashable(x);
      if (!this.items.some((y) => eq(x, y))) this.items.push(x);
    }
  }
}

// an instance of a @dataclass defined in the snippet (repr and fields)
export class PyRecord {
  constructor(cls, values) {
    this.cls = cls;
    this.attrs = new Map(cls.fields.map((f, i) => [f, values[i]]));
  }
}

// builtin callables the demos name: { name, repr, typeName, fn(args, kw) }
export class PyFunc {
  constructor(name, fn, { repr: r, typeName: t = 'builtin_function_or_method' } = {}) {
    this.name = name;
    this.fn = fn;
    this.reprText = r || `<built-in function ${name}>`;
    this.typeName = t;
  }
}

// an iterator over a snapshot: list/str/tuple iterators (with
// __length_hint__) and map/generator objects (without)
export class PyIter {
  constructor(items, typeName, hasHint) {
    this.items = items;
    this.pos = 0;
    this.typeName = typeName;
    this.hasHint = hasHint;
  }
}

export class PyItemgetter {
  constructor(items) { this.items = items; }
}
export class PyAttrgetter {
  constructor(names) { this.names = names; } // each: list of dotted parts
}
export class PyMethodcaller {
  constructor(name, args, kwargs) {
    this.name = name;
    this.args = args;
    this.kwargs = kwargs; // [[name, value], ...]
  }
}

const isNum = (v) => typeof v === 'bigint' || typeof v === 'number' || typeof v === 'boolean';
const isIntLike = (v) => typeof v === 'bigint' || typeof v === 'boolean';
const big = (v) => (typeof v === 'boolean' ? (v ? 1n : 0n) : v);

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  switch (typeof v) {
    case 'boolean': return 'bool';
    case 'bigint': return 'int';
    case 'number': return 'float';
    case 'string': return 'str';
    default: break;
  }
  if (Array.isArray(v)) return 'list';
  if (v instanceof PyTuple) return 'tuple';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof PySet) return 'set';
  if (v instanceof PyRecord) return v.cls.name;
  if (v instanceof PyFunc) return v.typeName;
  if (v instanceof PyIter) return v.typeName;
  if (v instanceof PyItemgetter) return 'operator.itemgetter';
  if (v instanceof PyAttrgetter) return 'operator.attrgetter';
  if (v instanceof PyMethodcaller) return 'operator.methodcaller';
  if (v === OPERATOR_MODULE) return 'module';
  return 'object';
}

// ─── demo inputs ────────────────────────────────────────────

// a number typed into a demo → int (bigint) or float, by its literal text
export function num(n) {
  const v = fromLiteral(n);
  return v.int !== undefined ? v.int : v.float;
}
// an 'auto' input: numbers by their literal text, anything else is a str
export const auto = (x) => (typeof x === 'number' ? num(x) : x);
// the snippet's final value, exactly as repr() shows it
export const out = (v) => ({ __pyRaw: repr(v) });

// the demos' record type:  @dataclass class User: name: str; age: int
export const USER = { name: 'User', fields: ['name', 'age'] };
// zip(names, ages) over a csv list of str and a csv list of numbers: the
// shorter list decides the length (the ages literal is evaluated first,
// so an inf in it raises before anything is built)
export function zipRows(names, ages) {
  const a = ages.map(num);
  const n = Math.min(names.length, a.length);
  return names.slice(0, n).map((x, i) => [x, a[i]]);
}

// ─── repr / str / ascii ─────────────────────────────────────

export const INT_MAX_STR_DIGITS = 4300;

export function bitLen(n) {
  if (n < 0n) n = -n;
  if (n === 0n) return 0;
  const h = n.toString(16);
  return (h.length - 1) * 4 + (32 - Math.clz32(parseInt(h[0], 16)));
}

// repr(int) with the 4300-digit str conversion limit (sign not counted)
export function intRepr(n) {
  const a = n < 0n ? -n : n;
  const tooMany = () => raise('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit`);
  if (bitLen(a) > 14300) tooMany(); // > 4304 digits for sure
  const s = a.toString();
  if (s.length > INT_MAX_STR_DIGITS) tooMany();
  return (n < 0n ? '-' : '') + s;
}

export function repr(v) {
  if (v === null || v === undefined) return 'None';
  switch (typeof v) {
    case 'boolean': return v ? 'True' : 'False';
    case 'bigint': return intRepr(v);
    case 'number': return pyFloatRepr(v);
    case 'string': return pyStrRepr(v);
    default: break;
  }
  if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
  if (v instanceof PyTuple) {
    const items = v.items.map(repr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v instanceof PyDict) return '{' + v.keys.map((k, i) => `${repr(k)}: ${repr(v.vals[i])}`).join(', ') + '}';
  if (v instanceof PySet) {
    if (v.items.length === 0) return 'set()';
    // CPython's order follows the hash table (and str hashes are salted
    // per process) — never shown
    return limit('a set prints in hash order, which differs from run to run for strings — the demos sort sets first');
  }
  if (v instanceof PyRecord) return `${v.cls.name}(${v.cls.fields.map((f) => `${f}=${repr(v.attrs.get(f))}`).join(', ')})`;
  if (v instanceof PyFunc) return v.reprText;
  if (v instanceof PyItemgetter) return `operator.itemgetter(${v.items.map(repr).join(', ')})`;
  if (v instanceof PyAttrgetter) return `operator.attrgetter(${v.names.map((p) => pyStrRepr(p.join('.'))).join(', ')})`;
  if (v instanceof PyMethodcaller) {
    const parts = [pyStrRepr(v.name), ...v.args.map(repr), ...v.kwargs.map(([k, x]) => `${k}=${repr(x)}`)];
    return `operator.methodcaller(${parts.join(', ')})`;
  }
  if (v === OPERATOR_MODULE) return limit("the module repr contains the file's path on your machine");
  return limit('this object prints with its memory address, which changes from run to run');
}

export const str = (v) => (typeof v === 'string' ? v : repr(v));

// ascii(): repr with every non-ASCII character backslash-escaped
export function ascii(v) {
  let s = '';
  for (const ch of repr(v)) {
    const cp = ch.codePointAt(0);
    if (cp < 128) s += ch;
    else if (cp < 0x100) s += '\\x' + cp.toString(16).padStart(2, '0');
    else if (cp < 0x10000) s += '\\u' + cp.toString(16).padStart(4, '0');
    else s += '\\U' + cp.toString(16).padStart(8, '0');
  }
  return s;
}

// ─── exact float helpers ────────────────────────────────────

const F64 = new Float64Array(1);
const U64 = new BigUint64Array(F64.buffer);

// x > 0, finite → [m, e] with x = m · 2^e exactly (m < 2^53)
function decompose(x) {
  F64[0] = x;
  const bits = U64[0];
  const ex = Number((bits >> 52n) & 0x7ffn);
  const m = bits & 0xfffffffffffffn;
  if (ex === 0) return [m, -1074];
  return [m | 0x10000000000000n, ex - 1075];
}

// the double nearest to N / D (N, D > 0n), ties to even; Infinity when
// it rounds past the largest double. roundRatNear also returns how far the
// exact value is from the nearest rounding midpoint, in ulps (0 = exactly
// halfway between two doubles, 0.5 = exactly on a double).
function roundRatNear(N, D) {
  if (N === 0n) return [0, 0.5];
  let E = bitLen(N) - bitLen(D);
  if (E >= 0 ? N < D << BigInt(E) : N << BigInt(-E) < D) E -= 1;
  if (E >= 1024) return [Infinity, 0.5];
  const lsb = Math.max(E - 52, -1074);
  let num = N;
  let den = D;
  if (lsb >= 0) den = D << BigInt(lsb);
  else num = N << BigInt(-lsb);
  let q = num / den;
  const r2 = 2n * (num - q * den);
  const off = r2 > den ? r2 - den : den - r2; // |2r - den|
  const near = Number((off << 32n) / den) / 2 ** 33;
  if (r2 > den || (r2 === den && (q & 1n) === 1n)) q += 1n;
  return [Number(q) * 2 ** lsb, near];
}
const roundRat = (N, D) => roundRatNear(N, D)[0];
// nearest double to M · 2^s (M > 0n)
const roundScaledNear = (M, s) => (s >= 0 ? roundRatNear(M << BigInt(s), 1n) : roundRatNear(M, 1n << BigInt(-s)));
const roundScaled = (M, s) => roundScaledNear(M, s)[0];

// C library pow() (Windows UCRT, glibc) is correctly rounded except when
// the exact result lies within a few thousandths of an ulp of a rounding
// midpoint — there the platforms disagree with each other in the last
// digit. Results inside this band are not shown.
const LIBM_SAFE_NEAR = 0.01;
const libmTooClose = () => limit("this power's exact value lies almost exactly halfway between two floats; CPython uses the C library pow(), whose last digit differs between platforms for such inputs — not reproduced");

// int → float (PyLong_AsDouble: correctly rounded, OverflowError past max)
export function toF(v) {
  if (typeof v === 'number') return v;
  const f = Number(big(v));
  if (!Number.isFinite(f)) raise('OverflowError', 'int too large to convert to float');
  return f;
}

// exact comparison of two numbers (an int is never rounded to compare
// with a float): -1 / 0 / 1, NaN when a NaN is involved
export function numCmp(a, b) {
  if (typeof a !== 'number' && typeof b !== 'number') {
    const x = big(a);
    const y = big(b);
    return x < y ? -1 : x > y ? 1 : 0;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
    return a < b ? -1 : a > b ? 1 : 0;
  }
  const flip = typeof a === 'number';
  const i = big(flip ? b : a);
  const f = flip ? a : b;
  if (Number.isNaN(f)) return NaN;
  let r;
  if (f === Infinity) r = -1;
  else if (f === -Infinity) r = 1;
  else {
    const fl = BigInt(Math.floor(f));
    if (i < fl) r = -1;
    else if (i > fl) r = 1;
    else r = Number.isInteger(f) ? 0 : -1;
  }
  return flip ? -r : r;
}

// ─── high-precision pow for positive finite x, finite y ──────

const lnCache = new Map();
function ln2Fixed(P) {
  if (!lnCache.has(P)) lnCache.set(P, 2n * atanhFixed(1n, 3n, P));
  return lnCache.get(P);
}
// atanh(a/b) · 2^P, 0 < a/b < 1/2
function atanhFixed(a, b, P) {
  const z = (a << P) / b;
  const z2 = (z * z) >> P;
  let term = z;
  let sum = 0n;
  for (let k = 1n; term !== 0n; k += 2n) {
    sum += term / k;
    term = (term * z2) >> P;
  }
  return sum;
}
// ln(x) · 2^P
function lnFixed(x, P) {
  let [m, e] = decompose(x);
  while (m < 0x10000000000000n) { m <<= 1n; e -= 1; }
  let k = e + 52;
  let lo = 0x10000000000000n; // f = m / 2^52 in [1, 2)
  if (m > 6369051672525772n) { lo = 0x20000000000000n; k += 1; } // f > √2: use f/2
  const zn = m - lo;
  const zd = m + lo;
  const s = zn < 0n ? -1n : 1n;
  return s * 2n * atanhFixed(s * zn, zd, P) + BigInt(k) * ln2Fixed(P);
}
// floor division for BigInt
const fdiv = (a, b) => {
  const q = a / b;
  return (a % b !== 0n) && ((a < 0n) !== (b < 0n)) ? q - 1n : q;
};
// x ** y for x > 0 (x != 1), y finite nonzero → correctly rounded double,
// Infinity on overflow, or null when the rounding cannot be certified
function powHP(x, y, P) {
  const lnx = lnFixed(x, P);
  const [my, ey] = decompose(Math.abs(y));
  let t = lnx * my;
  t = ey >= 0 ? t << BigInt(ey) : t >> BigInt(-ey);
  if (y < 0) t = -t;
  const ONE = 1n << P;
  // far outside the double range: decide without the series
  if (t > 712n * ONE) return Infinity;
  if (t < -760n * ONE) return 0;
  const LN2 = ln2Fixed(P);
  const k = fdiv(2n * t + LN2, 2n * LN2);
  const r = t - k * LN2;
  let sum = ONE;
  let term = ONE;
  for (let i = 1n; term !== 0n; i++) {
    term = ((term * r) >> P) / i;
    sum += term;
  }
  const ERR = 1n << 12n; // generous bound on the accumulated truncation error
  const s = Number(k) - Number(P);
  const [v, near] = roundScaledNear(sum, s);
  // the error band is ~2^-100 ulp: far inside the libm-safety band
  if (v !== Infinity && near < LIBM_SAFE_NEAR) return libmTooClose();
  const lo = roundScaled(sum - ERR, s);
  const hi = roundScaled(sum + ERR, s);
  return lo === hi ? v : libmTooClose();
}

function powPositive(x, y) {
  // integer exponent of moderate size: exact rational
  if (Number.isInteger(y) && Math.abs(y) <= 1100) {
    const n = BigInt(Math.abs(y));
    const [m, e] = decompose(x);
    const est = Math.log2(x) * y;
    if (est > 1030) return Infinity;
    if (est < -1100) return 0;
    const mn = m ** n;
    const en = BigInt(e) * BigInt(y);
    let r;
    if (y > 0) r = en >= 0n ? roundRatNear(mn << en, 1n) : roundRatNear(mn, 1n << -en);
    // x^-n = 2^(e·-n) / m^n
    else r = en >= 0n ? roundRatNear(1n << en, mn) : roundRatNear(1n, mn << -en);
    if (r[0] !== Infinity && r[1] < LIBM_SAFE_NEAR) return libmTooClose();
    return r[0];
  }
  return powHP(x, y, 128n);
}

const isOddInteger = (w) => Math.abs(w) % 2 === 1;

// float_pow (Objects/floatobject.c) on two doubles
export function floatPow(iv, iw) {
  if (iw === 0) return 1;
  if (Number.isNaN(iv)) return iv;
  if (Number.isNaN(iw)) return iv === 1 ? 1 : iw;
  if (!Number.isFinite(iw)) {
    const a = Math.abs(iv);
    if (a === 1) return 1;
    if ((iw > 0) === (a > 1)) return Math.abs(iw);
    return 0;
  }
  if (!Number.isFinite(iv)) {
    const odd = isOddInteger(iw);
    if (iw > 0) return odd ? iv : Math.abs(iv);
    return odd ? (iv < 0 ? -0 : 0) : 0;
  }
  if (iv === 0) {
    const odd = isOddInteger(iw);
    if (iw < 0) raise('ZeroDivisionError', '0.0 cannot be raised to a negative power');
    return odd ? iv : 0;
  }
  let negate = false;
  if (iv < 0) {
    if (iw !== Math.floor(iw)) {
      return limit('a negative number to a fractional power gives a complex number, computed with the C library — not reproduced in the browser');
    }
    iv = -iv;
    negate = isOddInteger(iw);
  }
  if (iv === 1) return negate ? -1 : 1;
  const r = powPositive(iv, iw);
  if (r === Infinity) {
    return limit("the result overflows: CPython raises OverflowError with the C library's ERANGE text, which differs by platform — (34, 'Result too large') on Windows and macOS, (34, 'Numerical result out of range') on Linux");
  }
  return negate ? -r : r;
}

// ─── int helpers ────────────────────────────────────────────

const floorDiv = (a, b) => fdiv(a, b);
function floorMod(a, b) {
  const r = a % b;
  return r !== 0n && ((r < 0n) !== (b < 0n)) ? r + b : r;
}

// long_true_divide: correctly rounded
function intTrueDiv(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'division by zero');
  const neg = (a < 0n) !== (b < 0n);
  const x = a < 0n ? -a : a;
  const y = b < 0n ? -b : b;
  const r = roundRat(x, y);
  if (r === Infinity) raise('OverflowError', 'integer division result too large for a float');
  return neg ? -r : r;
}

// _float_div_mod
function floatDivMod(vx, wx) {
  let mod = vx % wx;
  let div = (vx - mod) / wx;
  if (mod !== 0) { // C truth: NaN counts as nonzero
    if ((wx < 0) !== (mod < 0)) {
      mod += wx;
      div -= 1;
    }
  } else {
    mod = wx < 0 || Object.is(wx, -0) ? -0 : 0;
  }
  let floordiv;
  if (div !== 0) {
    floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1;
  } else {
    const q = vx / wx;
    floordiv = q < 0 || Object.is(q, -0) ? -0 : 0;
  }
  return [floordiv, mod];
}
function floatRem(vx, wx) {
  let mod = vx % wx;
  if (mod !== 0) {
    if ((wx < 0) !== (mod < 0)) mod += wx;
  } else {
    mod = wx < 0 || Object.is(wx, -0) ? -0 : 0;
  }
  return mod;
}

function intPow(a, b) {
  // b >= 0n
  if (b === 0n) return 1n;
  if (a === 0n || a === 1n) return a;
  if (a === -1n) return b % 2n === 0n ? 1n : -1n;
  const bits = bitLen(a) * Number(b);
  if (bits > MAX_BITS) return limit('the result has millions of digits — too large for the browser demo');
  return a ** b;
}

// ─── arithmetic and bitwise operators ───────────────────────

export const OPSYM = {
  add: '+', sub: '-', mul: '*', truediv: '/', floordiv: '//', mod: '%', pow: '**', matmul: '@',
  and_: '&', or_: '|', xor: '^', lshift: '<<', rshift: '>>',
};

const NOT_IMPL = Symbol('NotImplemented');

function numBinop(name, a, b) {
  const fl = typeof a === 'number' || typeof b === 'number';
  if (fl) {
    if (['and_', 'or_', 'xor', 'lshift', 'rshift', 'matmul'].includes(name)) return NOT_IMPL;
    const x = toF(a);
    const y = toF(b);
    switch (name) {
      case 'add': return x + y;
      case 'sub': return x - y;
      case 'mul': return x * y;
      case 'truediv':
        if (y === 0) raise('ZeroDivisionError', 'float division by zero');
        return x / y;
      case 'floordiv':
        if (y === 0) raise('ZeroDivisionError', 'float floor division by zero');
        return floatDivMod(x, y)[0];
      case 'mod':
        if (y === 0) raise('ZeroDivisionError', 'float modulo by zero');
        return floatRem(x, y);
      case 'pow': return floatPow(x, y);
      default: return NOT_IMPL;
    }
  }
  const bothBool = typeof a === 'boolean' && typeof b === 'boolean';
  const x = big(a);
  const y = big(b);
  switch (name) {
    case 'add': return x + y;
    case 'sub': return x - y;
    case 'mul':
      if (bitLen(x) + bitLen(y) > MAX_BITS) return limit('the result has millions of digits — too large for the browser demo');
      return x * y;
    case 'truediv': return intTrueDiv(x, y);
    case 'floordiv':
      if (y === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
      return floorDiv(x, y);
    case 'mod':
      if (y === 0n) raise('ZeroDivisionError', 'integer modulo by zero');
      return floorMod(x, y);
    case 'pow':
      if (y < 0n) return floatPow(toF(x), toF(y));
      return intPow(x, y);
    case 'and_': return bothBool ? a && b : x & y;
    case 'or_': return bothBool ? a || b : x | y;
    case 'xor': return bothBool ? a !== b : x ^ y;
    case 'lshift':
      if (y < 0n) raise('ValueError', 'negative shift count');
      if (x === 0n) return 0n;
      if (y + BigInt(bitLen(x)) > BigInt(MAX_BITS)) return limit('a shift this large needs more memory than the browser demo allows (CPython raises MemoryError or OverflowError)');
      return x << y;
    case 'rshift':
      if (y < 0n) raise('ValueError', 'negative shift count');
      if (y >= BigInt(bitLen(x) + 1)) return x < 0n ? -1n : 0n;
      return x >> y;
    default: return NOT_IMPL;
  }
}

const isSeq = (v) => typeof v === 'string' || Array.isArray(v) || v instanceof PyTuple;
// push without spreading (a spread of 100k+ items overflows the call stack)
function pushAll(target, items) {
  for (let i = 0; i < items.length; i++) target.push(items[i]);
}
export const seqLen = (v) => (typeof v === 'string' ? [...v].length : Array.isArray(v) ? v.length : v.items.length);

// PyNumber_AsSsize_t(n, exc): an index-sized integer or exc
function asSsize(n, exc) {
  const v = big(n);
  if (v > SSIZE_MAX || v < SSIZE_MIN) raise(exc, "cannot fit 'int' into an index-sized integer");
  return v;
}

// seq * n (sequence_repeat → unicode_repeat / list_repeat / tuple_repeat)
function seqRepeat(seq, n) {
  if (!isIntLike(n)) raise('TypeError', `can't multiply sequence by non-int of type '${typeName(n)}'`);
  const count = asSsize(n, 'OverflowError');
  const len = BigInt(seqLen(seq));
  if (typeof seq === 'string') {
    if (count < 1n) return '';
    if (count === 1n) return seq;
    if (len > SSIZE_MAX / count) raise('OverflowError', 'repeated string is too long');
  } else {
    if (len === 0n || count <= 0n) return Array.isArray(seq) ? [] : EMPTY_TUPLE;
    if (count === 1n && seq instanceof PyTuple) return seq;
    if (len > SSIZE_MAX / count) raise('MemoryError', '');
  }
  if (len * count > BigInt(MAX_ITEMS)) return limit('the repeated sequence would have more than a million items — too large for the browser demo');
  const k = Number(count);
  if (typeof seq === 'string') return seq.repeat(k);
  const items = Array.isArray(seq) ? seq : seq.items;
  const res = [];
  for (let i = 0; i < k; i++) pushAll(res, items);
  return Array.isArray(seq) ? res : new PyTuple(res);
}

// a + b for sequences: sq_concat of the left operand
function seqConcat(a, b) {
  if (typeof a === 'string') {
    if (typeof b !== 'string') raise('TypeError', `can only concatenate str (not "${typeName(b)}") to str`);
    return a + b;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) raise('TypeError', `can only concatenate list (not "${typeName(b)}") to list`);
    if (a.length + b.length > MAX_ITEMS) limit('too many items for the browser demo');
    return [...a, ...b];
  }
  // tupleconcat: () + t returns t, t + () returns t (the same objects)
  if (a.items.length === 0 && b instanceof PyTuple) return b;
  if (!(b instanceof PyTuple)) raise('TypeError', `can only concatenate tuple (not "${typeName(b)}") to tuple`);
  if (b.items.length === 0) return a;
  return new PyTuple([...a.items, ...b.items]);
}

function setOp(name, a, b) {
  const has = (s, x) => s.items.some((y) => eq(x, y));
  switch (name) {
    case 'and_': return new PySet(a.items.filter((x) => has(b, x)));
    case 'or_': return new PySet([...a.items, ...b.items]);
    case 'xor': return new PySet([...a.items.filter((x) => !has(b, x)), ...b.items.filter((x) => !has(a, x))]);
    case 'sub': return new PySet(a.items.filter((x) => !has(b, x)));
    default: return NOT_IMPL;
  }
}

function binopTypeError(name, a, b, inplace) {
  if (name === 'pow' && !inplace) {
    raise('TypeError', `unsupported operand type(s) for ** or pow(): '${typeName(a)}' and '${typeName(b)}'`);
  }
  raise('TypeError', `unsupported operand type(s) for ${OPSYM[name]}${inplace ? '=' : ''}: '${typeName(a)}' and '${typeName(b)}'`);
}

// a <op> b — PyNumber_Add & co.; inplace=true for the i* functions
// (PyNumber_InPlaceAdd & co.: lists are changed in place and returned)
export function binop(name, a, b, inplace = false) {
  if (inplace && Array.isArray(a)) {
    if (name === 'add') return listExtend(a, b);
    if (name === 'mul') {
      const r = seqRepeat(a, b);
      a.length = 0;
      pushAll(a, r);
      return a;
    }
  }
  if (inplace && a instanceof PySet && b instanceof PySet && ['and_', 'or_', 'xor', 'sub'].includes(name)) {
    a.items = setOp(name, a, b).items;
    return a;
  }
  // dict | dict (3.9+); d |= x accepts any mapping or iterable of pairs
  if (name === 'or_' && a instanceof PyDict) {
    if (b instanceof PyDict) {
      const d = inplace ? a : new PyDict(a.keys.map((k, i) => [k, a.vals[i]]));
      b.keys.forEach((k, i) => dictSet(d, k, b.vals[i]));
      return d;
    }
    if (inplace) return limit('dict |= with a non-dict right operand (dict.update rules) is not reproduced in the browser demo');
  }
  if (isNum(a) && isNum(b)) {
    const r = numBinop(name, a, b);
    if (r !== NOT_IMPL) return r;
    return binopTypeError(name, a, b, inplace);
  }
  if (name === 'mod' && typeof a === 'string') return strFormat(a, b);
  if (a instanceof PySet && b instanceof PySet) {
    const r = setOp(name, a, b);
    if (r !== NOT_IMPL) return r;
  }
  if (name === 'add' && isSeq(a)) return seqConcat(a, b);
  if (name === 'mul') {
    if (isSeq(a)) return seqRepeat(a, b);
    // PyNumber_InPlaceMultiply only tries the right operand's repeat when
    // the left type has no sequence slots at all (dict, set and classes
    // defined in Python do have them)
    const leftHasSeqSlots = a instanceof PyDict || a instanceof PySet || a instanceof PyRecord;
    if (isSeq(b) && !(inplace && leftHasSeqSlots)) return seqRepeat(b, a);
  }
  return binopTypeError(name, a, b, inplace);
}

// list += iterable
function listExtend(a, b) {
  const items = iterItems(b, (t) => `'${t}' object is not iterable`);
  if (a.length + items.length > MAX_ITEMS) limit('too many items for the browser demo');
  pushAll(a, items);
  return a;
}

// ─── unary ──────────────────────────────────────────────────

export function unop(name, a) {
  switch (name) {
    case 'neg':
      if (typeof a === 'number') return -a;
      if (isIntLike(a)) return -big(a);
      return raise('TypeError', `bad operand type for unary -: '${typeName(a)}'`);
    case 'pos':
      if (typeof a === 'number') return a;
      if (isIntLike(a)) return big(a);
      return raise('TypeError', `bad operand type for unary +: '${typeName(a)}'`);
    case 'abs':
      if (typeof a === 'number') return Math.abs(a);
      if (isIntLike(a)) {
        const x = big(a);
        return x < 0n ? -x : x;
      }
      return raise('TypeError', `bad operand type for abs(): '${typeName(a)}'`);
    case 'invert':
    case 'inv':
      if (isIntLike(a)) return ~big(a);
      return raise('TypeError', `bad operand type for unary ~: '${typeName(a)}'`);
    case 'index':
      if (isIntLike(a)) return big(a);
      return raise('TypeError', `'${typeName(a)}' object cannot be interpreted as an integer`);
    default:
      throw new Error(`unknown unary ${name}`);
  }
}

// bool(v)
export function truth(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (typeof v === 'bigint') return v !== 0n;
  if (typeof v === 'number') return v !== 0; // NaN is true
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof PyTuple || v instanceof PySet) return v.items.length > 0;
  if (v instanceof PyDict) return v.keys.length > 0;
  return true;
}

// ─── comparisons ────────────────────────────────────────────

const CMPSYM = { lt: '<', le: '<=', gt: '>', ge: '>=' };

// str ordering is by code point (JS < compares UTF-16 units)
export function strCmp(a, b) {
  const x = [...a];
  const y = [...b];
  const n = Math.min(x.length, y.length);
  for (let i = 0; i < n; i++) {
    const p = x[i].codePointAt(0);
    const q = y[i].codePointAt(0);
    if (p !== q) return p < q ? -1 : 1;
  }
  return x.length < y.length ? -1 : x.length > y.length ? 1 : 0;
}

const test = (op, c) => (op === 'lt' ? c < 0 : op === 'le' ? c <= 0 : op === 'gt' ? c > 0 : c >= 0);
// identity of two values of the model (only objects have one we know)
const same = (a, b) => a === b && a !== null && typeof a === 'object';

function seqEq(x, y) {
  if (x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) if (!(same(x[i], y[i]) || eq(x[i], y[i]))) return false;
  return true;
}

export function eq(a, b) {
  if (isNum(a) && isNum(b)) return numCmp(a, b) === 0;
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return a === b;
  if (Array.isArray(a) && Array.isArray(b)) return seqEq(a, b);
  if (a instanceof PyTuple && b instanceof PyTuple) return seqEq(a.items, b.items);
  if (a instanceof PyDict && b instanceof PyDict) {
    if (a.keys.length !== b.keys.length) return false;
    return a.keys.every((k, i) => {
      const j = dictIndex(b, k);
      return j !== -1 && (same(a.vals[i], b.vals[j]) || eq(a.vals[i], b.vals[j]));
    });
  }
  if (a instanceof PySet && b instanceof PySet) {
    return a.items.length === b.items.length && a.items.every((x) => b.items.some((y) => eq(x, y)));
  }
  if (a instanceof PyRecord && b instanceof PyRecord && a.cls === b.cls) {
    return seqEq(a.cls.fields.map((f) => a.attrs.get(f)), b.cls.fields.map((f) => b.attrs.get(f)));
  }
  return a === b;
}

export function compare(op, a, b) {
  if (op === 'eq') return eq(a, b);
  if (op === 'ne') return !eq(a, b);
  if (isNum(a) && isNum(b)) {
    const c = numCmp(a, b);
    return Number.isNaN(c) ? false : test(op, c);
  }
  if (typeof a === 'string' && typeof b === 'string') return test(op, strCmp(a, b));
  const lists = Array.isArray(a) && Array.isArray(b);
  const tuples = a instanceof PyTuple && b instanceof PyTuple;
  if (lists || tuples) {
    const x = lists ? a : a.items;
    const y = lists ? b : b.items;
    let i = 0;
    while (i < x.length && i < y.length && (same(x[i], y[i]) || eq(x[i], y[i]))) i++;
    if (i >= x.length || i >= y.length) return test(op, x.length - y.length);
    return truth(compare(op, x[i], y[i]));
  }
  if (a instanceof PySet && b instanceof PySet) {
    const sub = (s, t) => s.items.every((x) => t.items.some((y) => eq(x, y)));
    if (op === 'le') return sub(a, b);
    if (op === 'ge') return sub(b, a);
    if (op === 'lt') return a.items.length < b.items.length && sub(a, b);
    return b.items.length < a.items.length && sub(b, a);
  }
  return raise('TypeError', `'${CMPSYM[op]}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
}

// ─── hashing (dict / set membership) ────────────────────────

function checkHashable(k) {
  if (Array.isArray(k) || k instanceof PyDict || k instanceof PySet || k instanceof PyRecord) {
    raise('TypeError', `unhashable type: '${typeName(k)}'`);
  }
  if (k instanceof PyTuple) k.items.forEach(checkHashable);
}
function dictIndex(d, k) {
  checkHashable(k);
  return d.keys.findIndex((x) => same(x, k) || eq(x, k));
}
export function dictSet(d, k, v) {
  const i = dictIndex(d, k);
  if (i === -1) {
    d.keys.push(k);
    d.vals.push(v);
  } else d.vals[i] = v;
}

// ─── iteration ──────────────────────────────────────────────

// the items iter(v) yields (consuming an iterator); `msg` builds the
// TypeError for a non-iterable from its type name
export function iterItems(v, msg = (t) => `'${t}' object is not iterable`) {
  if (typeof v === 'string') return [...v];
  if (Array.isArray(v)) return [...v];
  if (v instanceof PyTuple || v instanceof PySet) return [...v.items];
  if (v instanceof PyDict) return [...v.keys];
  if (v instanceof PyIter) {
    const rest = v.items.slice(v.pos);
    v.pos = v.items.length;
    return rest;
  }
  return raise('TypeError', msg(typeName(v)));
}

// iter(x)
export function iter(v) {
  if (v instanceof PyIter) return v;
  const items = iterItems(v);
  const t = typeof v === 'string'
    ? ([...v].every((c) => c.codePointAt(0) < 128) ? 'str_ascii_iterator' : 'str_iterator')
    : v instanceof PyDict ? 'dict_keyiterator' : `${typeName(v)}_iterator`;
  return new PyIter(items, t, true);
}

// next(it[, default])
export function next(it, ...dflt) {
  if (it.pos < it.items.length) return it.items[it.pos++];
  if (dflt.length > 0) return dflt[0];
  return raise('StopIteration', '');
}

// ─── sequence functions of the operator module ──────────────

const NOT_ITERABLE = (t) => `argument of type '${t}' is not iterable`;

// a in b → operator.contains(b, a)
export function contains(a, b) {
  if (typeof a === 'string') {
    if (typeof b !== 'string') raise('TypeError', `'in <string>' requires string as left operand, not ${typeName(b)}`);
    return a.includes(b);
  }
  if (a instanceof PyDict) return dictIndex(a, b) !== -1;
  if (a instanceof PySet) {
    checkHashable(b);
    return a.items.some((x) => same(x, b) || eq(x, b));
  }
  if (a instanceof PyIter) {
    while (a.pos < a.items.length) {
      const x = a.items[a.pos++];
      if (same(x, b) || eq(x, b)) return true;
    }
    return false;
  }
  return iterItems(a, NOT_ITERABLE).some((x) => same(x, b) || eq(x, b));
}

export function countOf(a, b) {
  return BigInt(iterItems(a, NOT_ITERABLE).filter((x) => same(x, b) || eq(x, b)).length);
}

export function indexOf(a, b) {
  const items = a instanceof PyIter ? null : iterItems(a, NOT_ITERABLE);
  if (items === null) {
    for (let i = 0; a.pos < a.items.length; i++) {
      const x = a.items[a.pos++];
      if (same(x, b) || eq(x, b)) return BigInt(i);
    }
  } else {
    const i = items.findIndex((x) => same(x, b) || eq(x, b));
    if (i !== -1) return BigInt(i);
  }
  return raise('ValueError', 'sequence.index(x): x not in sequence');
}

// normalise an index for a sequence of length n (or null when out of range)
function seqIndex(k, n) {
  let i = asSsize(k, 'IndexError');
  if (i < 0n) i += BigInt(n);
  return i < 0n || i >= BigInt(n) ? null : Number(i);
}

export function getitem(a, k) {
  if (typeof a === 'string') {
    if (!isIntLike(k)) raise('TypeError', `string indices must be integers, not '${typeName(k)}'`);
    const cps = [...a];
    const i = seqIndex(k, cps.length);
    if (i === null) raise('IndexError', 'string index out of range');
    return cps[i];
  }
  if (Array.isArray(a) || a instanceof PyTuple) {
    const t = Array.isArray(a) ? 'list' : 'tuple';
    if (!isIntLike(k)) raise('TypeError', `${t} indices must be integers or slices, not ${typeName(k)}`);
    const items = Array.isArray(a) ? a : a.items;
    const i = seqIndex(k, items.length);
    if (i === null) raise('IndexError', `${t} index out of range`);
    return items[i];
  }
  if (a instanceof PyDict) {
    const i = dictIndex(a, k);
    if (i === -1) raise('KeyError', repr(k));
    return a.vals[i];
  }
  return raise('TypeError', `'${typeName(a)}' object is not subscriptable`);
}

export function setitem(a, k, v) {
  if (Array.isArray(a)) {
    if (!isIntLike(k)) raise('TypeError', `list indices must be integers or slices, not ${typeName(k)}`);
    const i = seqIndex(k, a.length);
    if (i === null) raise('IndexError', 'list assignment index out of range');
    a[i] = v;
    return null;
  }
  if (a instanceof PyDict) {
    dictSet(a, k, v);
    return null;
  }
  if ((typeof a === 'string' || a instanceof PyTuple) && isIntLike(k)) asSsize(k, 'IndexError');
  return raise('TypeError', `'${typeName(a)}' object does not support item assignment`);
}

export function delitem(a, k) {
  if (Array.isArray(a)) {
    if (!isIntLike(k)) raise('TypeError', `list indices must be integers or slices, not ${typeName(k)}`);
    const i = seqIndex(k, a.length);
    if (i === null) raise('IndexError', 'list assignment index out of range');
    a.splice(i, 1);
    return null;
  }
  if (a instanceof PyDict) {
    const i = dictIndex(a, k);
    if (i === -1) raise('KeyError', repr(k));
    a.keys.splice(i, 1);
    a.vals.splice(i, 1);
    return null;
  }
  if ((typeof a === 'string' || a instanceof PyTuple) && isIntLike(k)) {
    asSsize(k, 'IndexError');
    raise('TypeError', `'${typeName(a)}' object doesn't support item deletion`);
  }
  return raise('TypeError', `'${typeName(a)}' object does not support item deletion`);
}

// operator.length_hint(obj, default=0)
export function lengthHint(obj, dflt = 0n) {
  if (!isIntLike(dflt)) raise('TypeError', `'${typeName(dflt)}' object cannot be interpreted as an integer`);
  const d = big(dflt);
  if (d > SSIZE_MAX || d < SSIZE_MIN) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  if (isSeq(obj)) return BigInt(seqLen(obj));
  if (obj instanceof PyDict) return BigInt(obj.keys.length);
  if (obj instanceof PySet) return BigInt(obj.items.length);
  if (obj instanceof PyIter && obj.hasHint) return BigInt(obj.items.length - obj.pos);
  return d;
}

// operator.concat / iconcat (PySequence_Concat / PySequence_InPlaceConcat)
export function concat(a, b, inplace = false) {
  if (inplace && Array.isArray(a)) return listExtend(a, b);
  if (isSeq(a)) return seqConcat(a, b);
  return raise('TypeError', `'${typeName(a)}' object can't be concatenated`);
}

// ─── str % args (PyUnicode_Format) ──────────────────────────

const F_LJUST = 1;
const F_SIGN = 2;
const F_BLANK = 4;
const F_ALT = 8;
const F_ZERO = 16;

// exact decimal digits of a double, rounded half-even
// fixed(x, p): round(|x| · 10^p) as BigInt
function fixedDigits(x, p) {
  if (x === 0) return 0n;
  const [m, e] = decompose(Math.abs(x));
  const tp = 10n ** BigInt(p);
  if (e >= 0) return (m << BigInt(e)) * tp;
  const num = m * tp;
  const den = 1n << BigInt(-e);
  let q = num / den;
  const r2 = 2n * (num - q * den);
  if (r2 > den || (r2 === den && (q & 1n) === 1n)) q += 1n;
  return q;
}
// significant digits: [digits (BigInt with n digits), decimal exponent]
function sigDigits(x, n) {
  const ax = Math.abs(x);
  if (ax === 0) return [0n, 0];
  let k = Math.floor(Math.log10(ax));
  const [m, e] = decompose(ax);
  // exact value as num/den
  const N0 = e >= 0 ? m << BigInt(e) : m;
  const D0 = e >= 0 ? 1n : 1n << BigInt(-e);
  const ge10k = (kk) => (kk >= 0 ? N0 >= D0 * 10n ** BigInt(kk) : N0 * 10n ** BigInt(-kk) >= D0);
  while (!ge10k(k)) k -= 1;
  while (ge10k(k + 1)) k += 1;
  const s = k - n + 1;
  let num = N0;
  let den = D0;
  if (s >= 0) den *= 10n ** BigInt(s);
  else num *= 10n ** BigInt(-s);
  let q = num / den;
  const r2 = 2n * (num - q * den);
  if (r2 > den || (r2 === den && (q & 1n) === 1n)) q += 1n;
  if (q === 10n ** BigInt(n)) {
    q = 10n ** BigInt(n - 1);
    k += 1;
  }
  return [q, k];
}

// PyOS_double_to_string(x, type, prec, flags) for type in eEfFgG
function formatFloatC(x, type, prec, alt) {
  const upper = type === 'E' || type === 'F' || type === 'G';
  const t = type.toLowerCase();
  if (Number.isNaN(x)) return upper ? 'NAN' : 'nan';
  const neg = x < 0 || Object.is(x, -0);
  if (!Number.isFinite(x)) return (neg ? '-' : '') + (upper ? 'INF' : 'inf');
  if (prec > 10000) limit('a precision this large is not reproduced in the browser demo');
  let body;
  const expStr = (k) => (upper ? 'E' : 'e') + (k < 0 ? '-' : '+') + String(Math.abs(k)).padStart(2, '0');
  const fixed = (p) => {
    const q = fixedDigits(x, p).toString().padStart(p + 1, '0');
    const ip = q.slice(0, q.length - p);
    const fp = q.slice(q.length - p);
    return p > 0 ? `${ip}.${fp}` : ip + (alt ? '.' : '');
  };
  const expo = (p) => {
    const [d, k] = sigDigits(x, p + 1);
    const ds = d.toString().padStart(p + 1, '0');
    const mant = p > 0 ? `${ds[0]}.${ds.slice(1)}` : ds + (alt ? '.' : '');
    return mant + expStr(k);
  };
  if (t === 'f') body = fixed(prec);
  else if (t === 'e') body = expo(prec);
  else {
    const P = prec === 0 ? 1 : prec;
    const [, X] = x === 0 ? [0n, 0] : sigDigits(x, P);
    if (X >= -4 && X < P) {
      body = fixed(P - 1 - X);
    } else {
      body = expo(P - 1);
    }
    if (!alt) {
      // strip trailing zeros (and a bare point) from the mantissa
      const ei = body.search(/[eE]/);
      let mant = ei === -1 ? body : body.slice(0, ei);
      const tail = ei === -1 ? '' : body.slice(ei);
      if (mant.includes('.')) mant = mant.replace(/0+$/, '').replace(/\.$/, '');
      body = mant + tail;
    } else if (!body.includes('.')) {
      const ei = body.search(/[eE]/);
      body = ei === -1 ? body + '.' : body.slice(0, ei) + '.' + body.slice(ei);
    }
  }
  if (upper) body = body.toUpperCase();
  return (neg ? '-' : '') + body;
}

// %d %i %u %o %x %X of an int
function formatLong(v, type, flags, prec) {
  const n = big(v);
  const neg = n < 0n;
  const a = neg ? -n : n;
  let digits;
  let prefix = '';
  if (type === 'o') {
    digits = a.toString(8);
    prefix = '0o';
  } else if (type === 'x' || type === 'X') {
    digits = a.toString(16);
    prefix = '0x';
  } else {
    digits = intRepr(a);
  }
  if (prec > digits.length) digits = '0'.repeat(prec - digits.length) + digits;
  let s = (neg ? '-' : '') + ((flags & F_ALT) && prefix ? prefix : '') + digits;
  if (type === 'X') s = s.toUpperCase();
  return s;
}

function formatArg(v, spec) {
  const { ch } = spec;
  switch (ch) {
    case 's': return { s: str(v), sign: false };
    case 'r': return { s: repr(v), sign: false };
    case 'a': return { s: ascii(v), sign: false };
    case 'i': case 'd': case 'u': case 'o': case 'x': case 'X': {
      if (!isNum(v)) {
        const what = ch === 'o' || ch === 'x' || ch === 'X' ? 'an integer' : 'a real number';
        raise('TypeError', `%${ch} format: ${what} is required, not ${typeName(v)}`);
      }
      let iv = v;
      if (typeof v === 'number') {
        if (ch === 'o' || ch === 'x' || ch === 'X') raise('TypeError', `%${ch} format: an integer is required, not float`);
        if (Number.isNaN(v)) raise('ValueError', 'cannot convert float NaN to integer');
        if (!Number.isFinite(v)) raise('OverflowError', 'cannot convert float infinity to integer');
        iv = BigInt(Math.trunc(v));
      }
      return { s: formatLong(iv, ch, spec.flags, spec.prec), sign: true };
    }
    case 'e': case 'E': case 'f': case 'F': case 'g': case 'G': {
      if (!isNum(v)) raise('TypeError', `must be real number, not ${typeName(v)}`);
      const x = toF(v);
      return { s: formatFloatC(x, ch, spec.prec < 0 ? 6 : spec.prec, (spec.flags & F_ALT) !== 0), sign: true };
    }
    case 'c': {
      let cp;
      if (typeof v === 'string') {
        if ([...v].length !== 1) raise('TypeError', '%c requires int or char');
        cp = v.codePointAt(0);
      } else if (isIntLike(v)) {
        const x = big(v);
        if (x < 0n || x > 0x10ffffn) raise('OverflowError', '%c arg not in range(0x110000)');
        cp = Number(x);
      } else raise('TypeError', '%c requires int or char');
      return { s: String.fromCodePoint(cp), sign: false };
    }
    default: {
      const c = ch.codePointAt(0);
      raise('ValueError', `unsupported format character '${c >= 32 && c <= 126 ? ch : '?'}' (0x${c.toString(16)}) at index ${spec.index}`);
    }
  }
  return null;
}

// unicode_format_arg_output
function outputArg(res, spec) {
  const chars = [...res.s];
  let { width } = spec;
  const { flags } = spec;
  let p = 0;
  let len = chars.length;
  if ((spec.ch === 's' || spec.ch === 'r' || spec.ch === 'a') && spec.prec >= 0 && len > spec.prec) len = spec.prec;
  let sign = false;
  let signchar = '';
  if (res.sign) {
    if (chars[0] === '-' || chars[0] === '+') {
      sign = true;
      signchar = chars[0];
      len -= 1;
      p += 1;
    } else if (flags & F_SIGN) {
      sign = true;
      signchar = '+';
    } else if (flags & F_BLANK) {
      sign = true;
      signchar = ' ';
    }
  }
  if (width < len) width = len;
  const fill = res.sign && (flags & F_ZERO) ? '0' : ' ';
  let o = '';
  if (sign) {
    if (fill !== ' ') o += signchar;
    if (width > len) width -= 1;
  }
  const altPrefix = (flags & F_ALT) && (spec.ch === 'x' || spec.ch === 'X' || spec.ch === 'o');
  if (altPrefix) {
    if (fill !== ' ') {
      o += chars[p] + chars[p + 1];
      p += 2;
    }
    width -= 2;
    if (width < 0) width = 0;
    len -= 2;
  }
  if (width > len && !(flags & F_LJUST)) {
    o += fill.repeat(width - len);
    width = len;
  }
  if (fill === ' ') {
    if (sign) o += signchar;
    if (altPrefix) {
      o += chars[p] + chars[p + 1];
      p += 2;
    }
  }
  o += chars.slice(p, p + len).join('');
  if (width > len) o += ' '.repeat(width - len);
  return o;
}

// fmt % args
export function strFormat(fmt, args) {
  const f = [...fmt];
  const isTup = args instanceof PyTuple;
  const arglen = isTup ? args.items.length : -1;
  let argidx = isTup ? 0 : -2;
  // PyMapping_Check(args) && !tuple && !str: lists and dicts count
  const dict = !isTup && typeof args !== 'string' && (Array.isArray(args) || args instanceof PyDict);
  const nextArg = () => {
    if (isTup && argidx < arglen) return args.items[argidx++];
    if (arglen < 0 && argidx === -2) {
      argidx = -1;
      return args;
    }
    return raise('TypeError', 'not enough arguments for format string');
  };
  let o = '';
  let pos = 0;
  if (f.length > 100000) limit('the format string is too long for the browser demo');
  while (pos < f.length) {
    if (f[pos] !== '%') {
      o += f[pos++];
      continue;
    }
    pos++;
    if (f[pos] === '%') {
      o += '%';
      pos++;
      continue;
    }
    const spec = { flags: 0, width: -1, prec: -1, ch: '' };
    if (f[pos] === '(') {
      if (!dict) raise('TypeError', 'format requires a mapping');
      limit('%(name)s mapping keys are not reproduced in the browser demo');
    }
    let ch = f[pos];
    // flags
    for (;;) {
      if (pos >= f.length) break;
      ch = f[pos++];
      if (ch === '-') spec.flags |= F_LJUST;
      else if (ch === '+') spec.flags |= F_SIGN;
      else if (ch === ' ') spec.flags |= F_BLANK;
      else if (ch === '#') spec.flags |= F_ALT;
      else if (ch === '0') spec.flags |= F_ZERO;
      else break;
      ch = undefined;
    }
    if (ch === undefined) raise('ValueError', 'incomplete format');
    // width
    if (ch === '*') {
      const v = nextArg();
      if (!isIntLike(v)) raise('TypeError', '* wants int');
      limit('* widths are not reproduced in the browser demo');
    } else if (ch >= '0' && ch <= '9') {
      spec.width = ch.charCodeAt(0) - 48;
      ch = undefined;
      while (pos < f.length) {
        ch = f[pos++];
        if (ch < '0' || ch > '9') break;
        spec.width = spec.width * 10 + (ch.charCodeAt(0) - 48);
        if (spec.width > 1000000) limit('a width this large is not reproduced in the browser demo');
        ch = undefined;
      }
      if (ch === undefined) raise('ValueError', 'incomplete format');
    }
    // precision
    if (ch === '.') {
      spec.prec = 0;
      ch = pos < f.length ? f[pos++] : undefined;
      if (ch === '*') {
        const v = nextArg();
        if (!isIntLike(v)) raise('TypeError', '* wants int');
        limit('* precisions are not reproduced in the browser demo');
      } else if (ch !== undefined && ch >= '0' && ch <= '9') {
        spec.prec = ch.charCodeAt(0) - 48;
        ch = undefined;
        while (pos < f.length) {
          ch = f[pos++];
          if (ch < '0' || ch > '9') break;
          spec.prec = spec.prec * 10 + (ch.charCodeAt(0) - 48);
          if (spec.prec > 1000000) limit('a precision this large is not reproduced in the browser demo');
          ch = undefined;
        }
      }
      if (ch === undefined) raise('ValueError', 'incomplete format');
    }
    // length modifiers are ignored
    if (ch === 'h' || ch === 'l' || ch === 'L') {
      ch = pos < f.length ? f[pos++] : undefined;
      if (ch === undefined) raise('ValueError', 'incomplete format');
    }
    spec.ch = ch;
    spec.index = pos - 1;
    const v = nextArg();
    const res = formatArg(v, spec);
    o += outputArg(res, spec);
    if (o.length > MAX_ITEMS) limit('the formatted text is too long for the browser demo');
  }
  if (argidx < arglen && !dict) raise('TypeError', 'not all arguments converted during string formatting');
  return o;
}

// ─── attribute lookup and the "Did you mean" suggestion ─────

// Python/suggestions.c, on the UTF-8 bytes of the names
const MOVE_COST = 2;
const CASE_COST = 1;
const MAX_STRING_SIZE = 40;
const enc = new TextEncoder();
function substitutionCost(a, b) {
  if ((a & 31) !== (b & 31)) return MOVE_COST;
  if (a === b) return 0;
  const la = a >= 65 && a <= 90 ? a + 32 : a;
  const lb = b >= 65 && b <= 90 ? b + 32 : b;
  return la === lb ? CASE_COST : MOVE_COST;
}
function levenshtein(a0, b0, maxCost) {
  let a = a0;
  let b = b0;
  let s = 0;
  while (s < a.length && s < b.length && a[s] === b[s]) s++;
  a = a.subarray(s);
  b = b.subarray(s);
  let ea = a.length;
  let eb = b.length;
  while (ea && eb && a[ea - 1] === b[eb - 1]) { ea--; eb--; }
  a = a.subarray(0, ea);
  b = b.subarray(0, eb);
  if (a.length === 0 || b.length === 0) return (a.length + b.length) * MOVE_COST;
  if (a.length > MAX_STRING_SIZE || b.length > MAX_STRING_SIZE) return maxCost + 1;
  if (b.length < a.length) [a, b] = [b, a];
  if ((b.length - a.length) * MOVE_COST > maxCost) return maxCost + 1;
  const buffer = [];
  for (let i = 0, t = MOVE_COST; i < a.length; i++, t += MOVE_COST) buffer[i] = t;
  let result = 0;
  for (let bi = 0; bi < b.length; bi++) {
    const code = b[bi];
    let distance = bi * MOVE_COST;
    result = distance;
    let minimum = Infinity;
    for (let i = 0; i < a.length; i++) {
      const substitute = distance + substitutionCost(code, a[i]);
      distance = buffer[i];
      const insertDelete = Math.min(result, distance) + MOVE_COST;
      result = Math.min(insertDelete, substitute);
      buffer[i] = result;
      if (result < minimum) minimum = result;
    }
    if (minimum > maxCost) return maxCost + 1;
  }
  return result;
}
// _Py_CalculateSuggestions(dir, name)
export function suggest(candidates, name) {
  if (candidates.length >= 750) return null;
  const nb = enc.encode(name);
  let best = Infinity;
  let suggestion = null;
  for (const item of candidates) {
    if (item === name) continue;
    const ib = enc.encode(item);
    let maxDistance = Math.floor((nb.length + ib.length + 3) * MOVE_COST / 6);
    maxDistance = Math.min(maxDistance, best - 1);
    const d = levenshtein(nb, ib, maxDistance);
    if (d > maxDistance) continue;
    if (suggestion === null || d < best) {
      suggestion = item;
      best = d;
    }
  }
  return suggestion;
}

// the public names dir() lists for the types the demos look up on
export const STR_ATTRS = ['capitalize', 'casefold', 'center', 'count', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'format_map', 'index', 'isalnum', 'isalpha', 'isascii', 'isdecimal', 'isdigit', 'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'removeprefix', 'removesuffix', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill'];
const INT_ATTRS = ['as_integer_ratio', 'bit_count', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 'is_integer', 'numerator', 'real', 'to_bytes'];
const FLOAT_ATTRS = ['as_integer_ratio', 'conjugate', 'fromhex', 'hex', 'imag', 'is_integer', 'real'];
const LIST_ATTRS = ['append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort'];
const TUPLE_ATTRS = ['count', 'index'];

function noAttr(obj, name, candidates, what) {
  const hint = name.startsWith('_') ? null : suggest(candidates, name);
  raise('AttributeError', `${what} has no attribute ${pyStrRepr(name)}${hint ? `. Did you mean: ${pyStrRepr(hint)}?` : ''}`);
}

// getattr(obj, name) for the objects the demos reach. Data attributes are
// returned; methods are returned as { method, self } for callMethod.
export function getattr(obj, name) {
  if (typeof name !== 'string') raise('TypeError', `attribute name must be string, not '${typeName(name)}'`);
  if (name.startsWith('_')) {
    if (obj === OPERATOR_MODULE && DUNDER_ALIAS[name]) return OPERATOR_FUNCS.get(DUNDER_ALIAS[name]);
    return limit(`underscore names such as ${pyStrRepr(name)} are not reproduced in the browser demo`);
  }
  const what = `'${typeName(obj)}' object`;
  if (obj instanceof PyRecord) {
    if (obj.attrs.has(name)) return obj.attrs.get(name);
    return noAttr(obj, name, [...obj.cls.fields].sort(strCmp), what);
  }
  if (obj === OPERATOR_MODULE) {
    if (OPERATOR_FUNCS.has(name)) return OPERATOR_FUNCS.get(name);
    return noAttr(obj, name, OPERATOR_PUBLIC, "module 'operator'");
  }
  if (typeof obj === 'string') {
    if (STR_ATTRS.includes(name)) return { method: name, self: obj };
    return noAttr(obj, name, STR_ATTRS, what);
  }
  if (isIntLike(obj)) {
    const x = big(obj);
    if (name === 'real' || name === 'numerator') return x;
    if (name === 'imag') return 0n;
    if (name === 'denominator') return 1n;
    if (INT_ATTRS.includes(name)) return limit(`int.${name} is a method — calling it is not reproduced in this demo`);
    return noAttr(obj, name, INT_ATTRS, what);
  }
  if (typeof obj === 'number') {
    if (name === 'real') return obj;
    if (name === 'imag') return 0;
    if (FLOAT_ATTRS.includes(name)) return limit(`float.${name} is a method — calling it is not reproduced in this demo`);
    return noAttr(obj, name, FLOAT_ATTRS, what);
  }
  if (Array.isArray(obj)) {
    if (LIST_ATTRS.includes(name)) return limit(`list.${name} is not reproduced in this demo`);
    return noAttr(obj, name, LIST_ATTRS, what);
  }
  if (obj instanceof PyTuple) {
    if (TUPLE_ATTRS.includes(name)) return limit(`tuple.${name} is not reproduced in this demo`);
    return noAttr(obj, name, TUPLE_ATTRS, what);
  }
  if (obj === null) return noAttr(obj, name, [], what);
  return limit(`attribute lookups on ${typeName(obj)} objects are not reproduced in the browser demo`);
}

// ─── str methods (for methodcaller / call) ──────────────────

const PY_SPACE = new Set([0x9, 0xa, 0xb, 0xc, 0xd, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x85, 0xa0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000]);
const isSpaceCh = (c) => PY_SPACE.has(c.codePointAt(0));
const LINE_BREAKS = new Set(['\n', '\r', '\v', '\f', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029']);

const isAscii = (s) => [...s].every((c) => c.codePointAt(0) < 128);
const asciiOnly = (s, m) => {
  if (!isAscii(s)) limit(`str.${m}() on non-ASCII text uses Unicode tables that differ between browsers and Python 3.13 — the demo reproduces ASCII text only`);
};

function stripChars(s, chars, left, right) {
  const cps = [...s];
  const set = chars === null ? null : new Set([...chars]);
  const strip = set === null ? isSpaceCh : (c) => set.has(c);
  let i = 0;
  let j = cps.length;
  if (left) while (i < j && strip(cps[i])) i++;
  if (right) while (j > i && strip(cps[j - 1])) j--;
  return cps.slice(i, j).join('');
}

// str.split() / rsplit() with no separator (and no maxsplit): runs of
// whitespace separate, leading/trailing whitespace gives no empty strings
function splitWhitespace(s) {
  const parts = [];
  let cur = null;
  for (const c of s) {
    if (isSpaceCh(c)) {
      if (cur !== null) parts.push(cur);
      cur = null;
    } else cur = (cur || '') + c;
  }
  if (cur !== null) parts.push(cur);
  return parts;
}

// find of a substring by code point index
function cpIndexOf(s, sub, fromRight) {
  const i = fromRight ? s.lastIndexOf(sub) : s.indexOf(sub);
  if (i === -1) return -1;
  return [...s.slice(0, i)].length;
}

function countSub(s, sub) {
  if (sub === '') return [...s].length + 1;
  let n = 0;
  let i = s.indexOf(sub);
  while (i !== -1) {
    n++;
    i = s.indexOf(sub, i + sub.length);
  }
  return n;
}

const ARG_INT = (v) => {
  if (!isIntLike(v)) raise('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);
  const x = big(v);
  if (x > SSIZE_MAX || x < SSIZE_MIN) raise('OverflowError', 'Python int too large to convert to C ssize_t');
  return x;
};
const padLimit = (n) => {
  if (n > BigInt(MAX_ITEMS)) limit('the padded text would have more than a million characters — too large for the browser demo');
  return Number(n);
};

const NO_ARGS = ['upper', 'lower', 'title', 'capitalize', 'swapcase', 'casefold', 'isdigit', 'isalpha', 'isalnum',
  'isspace', 'islower', 'isupper', 'isdecimal', 'isnumeric', 'isascii', 'istitle', 'isidentifier', 'isprintable'];

function asciiPredicate(m, s) {
  const cs = [...s];
  const up = (c) => c >= 'A' && c <= 'Z';
  const lo = (c) => c >= 'a' && c <= 'z';
  const dg = (c) => c >= '0' && c <= '9';
  switch (m) {
    case 'isascii': return true;
    case 'isdigit': case 'isdecimal': case 'isnumeric': return cs.length > 0 && cs.every(dg);
    case 'isalpha': return cs.length > 0 && cs.every((c) => up(c) || lo(c));
    case 'isalnum': return cs.length > 0 && cs.every((c) => up(c) || lo(c) || dg(c));
    case 'isspace': return cs.length > 0 && cs.every(isSpaceCh);
    case 'islower': return cs.some(lo) && !cs.some(up);
    case 'isupper': return cs.some(up) && !cs.some(lo);
    case 'isprintable': return cs.every((c) => c >= ' ' && c <= '~');
    case 'isidentifier': return /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
    case 'istitle': {
      let prevCased = false;
      let any = false;
      for (const c of cs) {
        if (up(c)) {
          if (prevCased) return false;
          prevCased = true;
          any = true;
        } else if (lo(c)) {
          if (!prevCased) return false;
          prevCased = true;
          any = true;
        } else prevCased = false;
      }
      return any;
    }
    default: return null;
  }
}

function asciiCase(m, s) {
  switch (m) {
    case 'upper': return s.toUpperCase();
    case 'lower': case 'casefold': return s.toLowerCase();
    case 'swapcase': return [...s].map((c) => (c >= 'a' && c <= 'z' ? c.toUpperCase() : c.toLowerCase())).join('');
    case 'capitalize': return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    case 'title': {
      let prev = false;
      let o = '';
      for (const c of s) {
        const cased = /[A-Za-z]/.test(c);
        o += cased ? (prev ? c.toLowerCase() : c.toUpperCase()) : c;
        prev = cased;
      }
      return o;
    }
    default: return null;
  }
}

// s.<m>(*args) for one str s
export function callStrMethod(s, m, args, kwargs = []) {
  if (kwargs.length > 0) return limit('keyword arguments to str methods are not reproduced in this demo');
  const n = args.length;
  const a = args[0];
  if (NO_ARGS.includes(m)) {
    if (n !== 0) raise('TypeError', `str.${m}() takes no arguments (${n} given)`);
    if (m === 'isascii') return isAscii(s); // needs no Unicode tables
    asciiOnly(s, m);
    return m.startsWith('is') ? asciiPredicate(m, s) : asciiCase(m, s);
  }
  switch (m) {
    case 'strip': case 'lstrip': case 'rstrip': {
      if (n > 1) raise('TypeError', `${m} expected at most 1 argument, got ${n}`);
      if (n === 1 && a !== null && typeof a !== 'string') raise('TypeError', `${m} arg must be None or str`);
      return stripChars(s, n === 1 ? a : null, m !== 'rstrip', m !== 'lstrip');
    }
    case 'split': case 'rsplit': {
      if (n > 2) raise('TypeError', `${m}() takes at most 2 arguments (${n} given)`);
      if (n === 2) return limit('maxsplit is not reproduced in this demo');
      if (n === 1 && a !== null && typeof a !== 'string') raise('TypeError', `must be str or None, not ${typeName(a)}`);
      if (n === 0 || a === null) return splitWhitespace(s);
      if (a === '') raise('ValueError', 'empty separator');
      return s.split(a);
    }
    case 'count': case 'find': case 'rfind': case 'index': case 'rindex': {
      if (n === 0) raise('TypeError', `${m} expected at least 1 argument, got 0`);
      if (n > 1) return limit('start and end arguments are not reproduced in this demo');
      if (typeof a !== 'string') raise('TypeError', `${m}() argument 1 must be str, not ${typeName(a)}`);
      if (m === 'count') return BigInt(countSub(s, a));
      const i = cpIndexOf(s, a, m.startsWith('r'));
      if (i === -1 && m.endsWith('index')) raise('ValueError', 'substring not found');
      return BigInt(i);
    }
    case 'startswith': case 'endswith': {
      if (n === 0) raise('TypeError', `${m} expected at least 1 argument, got 0`);
      if (n > 1) return limit('start and end arguments are not reproduced in this demo');
      const pre = m === 'startswith' ? 'startswith' : 'endswith';
      const check = (x) => (m === 'startswith' ? s.startsWith(x) : s.endsWith(x));
      if (typeof a === 'string') return check(a);
      if (a instanceof PyTuple) {
        for (const x of a.items) {
          if (typeof x !== 'string') raise('TypeError', `tuple for ${pre} must only contain str, not ${typeName(x)}`);
          if (check(x)) return true;
        }
        return false;
      }
      return raise('TypeError', `${pre} first arg must be str or a tuple of str, not ${typeName(a)}`);
    }
    case 'replace': {
      if (n < 2) raise('TypeError', `replace() takes at least 2 positional arguments (${n} given)`);
      return limit('str.replace is not reproduced in this demo');
    }
    case 'removeprefix': case 'removesuffix': {
      if (n !== 1) raise('TypeError', `str.${m}() takes exactly one argument (${n} given)`);
      if (typeof a !== 'string') raise('TypeError', `${m}() argument must be str, not ${typeName(a)}`);
      if (m === 'removeprefix') return a && s.startsWith(a) ? s.slice(a.length) : s;
      return a && s.endsWith(a) ? s.slice(0, s.length - a.length) : s;
    }
    case 'zfill': {
      if (n !== 1) raise('TypeError', `str.zfill() takes exactly one argument (${n} given)`);
      const w = ARG_INT(a);
      const cps = [...s];
      if (BigInt(cps.length) >= w) return s;
      const fill = padLimit(w) - cps.length;
      if (cps[0] === '+' || cps[0] === '-') return cps[0] + '0'.repeat(fill) + cps.slice(1).join('');
      return '0'.repeat(fill) + s;
    }
    case 'center': case 'ljust': case 'rjust': {
      if (n === 0) raise('TypeError', `${m} expected at least 1 argument, got 0`);
      if (n > 1) return limit('a fill character is not reproduced in this demo');
      const w = ARG_INT(a);
      const len = [...s].length;
      if (BigInt(len) >= w) return s;
      const marg = padLimit(w) - len;
      if (m === 'ljust') return s + ' '.repeat(marg);
      if (m === 'rjust') return ' '.repeat(marg) + s;
      // pad(): left = marg / 2 + (marg & width & 1)
      const left = Math.floor(marg / 2) + (marg & Number(w & 1n) & 1);
      return ' '.repeat(left) + s + ' '.repeat(marg - left);
    }
    case 'partition': case 'rpartition': {
      if (n !== 1) raise('TypeError', `str.${m}() takes exactly one argument (${n} given)`);
      if (typeof a !== 'string') raise('TypeError', `must be str, not ${typeName(a)}`);
      if (a === '') raise('ValueError', 'empty separator');
      const i = m === 'partition' ? s.indexOf(a) : s.lastIndexOf(a);
      if (i === -1) return m === 'partition' ? tuple(s, '', '') : tuple('', '', s);
      return tuple(s.slice(0, i), a, s.slice(i + a.length));
    }
    case 'join': {
      if (n !== 1) raise('TypeError', `str.join() takes exactly one argument (${n} given)`);
      const items = iterItems(a, () => 'can only join an iterable');
      items.forEach((x, i) => {
        if (typeof x !== 'string') raise('TypeError', `sequence item ${i}: expected str instance, ${typeName(x)} found`);
      });
      return items.join(s);
    }
    case 'splitlines': {
      if (n > 1) raise('TypeError', `splitlines() takes at most 1 argument (${n} given)`);
      const keep = n === 1 && truth(a);
      const lines = [];
      const cps = [...s];
      let start = 0;
      for (let i = 0; i < cps.length; i++) {
        if (LINE_BREAKS.has(cps[i])) {
          let end = i + 1;
          if (cps[i] === '\r' && cps[i + 1] === '\n') end = i + 2;
          lines.push(cps.slice(start, keep ? end : i).join(''));
          start = end;
          i = end - 1;
        }
      }
      if (start < cps.length) lines.push(cps.slice(start).join(''));
      return lines;
    }
    case 'expandtabs': {
      if (n > 1) raise('TypeError', `expandtabs() takes at most 1 argument (${n} given)`);
      let ts = 8n;
      if (n === 1) {
        if (!isIntLike(a)) raise('TypeError', `'${typeName(a)}' object cannot be interpreted as an integer`);
        ts = big(a);
        if (ts > 2147483647n || ts < -2147483648n) raise('OverflowError', 'Python int too large to convert to C int');
      }
      if (!s.includes('\t')) return s;
      if (ts > 1000n) limit('a tab size this large is not reproduced in this demo');
      const t = Number(ts);
      let o = '';
      let col = 0;
      for (const c of s) {
        if (c === '\t') {
          if (t > 0) {
            const k = t - (col % t);
            o += ' '.repeat(k);
            col += k;
          }
        } else {
          o += c;
          col = c === '\n' || c === '\r' ? 0 : col + 1;
        }
      }
      return o;
    }
    case 'format': {
      if (s.includes('{') || s.includes('}')) return limit('str.format with replacement fields is not reproduced in this demo');
      return s;
    }
    default:
      return limit(`str.${m}() is not reproduced in this demo`);
  }
}

// call a value returned by getattr (bound str method or builtin)
export function callValue(f, args, kwargs = []) {
  if (f && f.method !== undefined) return callStrMethod(f.self, f.method, args, kwargs);
  if (f instanceof PyFunc) return f.fn(args, kwargs);
  return raise('TypeError', `'${typeName(f)}' object is not callable`);
}

// ─── itemgetter / attrgetter / methodcaller / call ──────────

export function itemgetter(...items) {
  if (items.length === 0) raise('TypeError', 'itemgetter expected 1 argument, got 0');
  return new PyItemgetter(items);
}
export function attrgetter(...names) {
  if (names.length === 0) raise('TypeError', 'attrgetter expected 1 argument, got 0');
  for (const n of names) if (typeof n !== 'string') raise('TypeError', 'attribute name must be a string');
  return new PyAttrgetter(names.map((n) => n.split('.')));
}
export function methodcaller(...args) {
  if (args.length === 0) raise('TypeError', 'methodcaller needs at least one argument, the method name');
  if (typeof args[0] !== 'string') raise('TypeError', 'method name must be a string');
  return new PyMethodcaller(args[0], args.slice(1), []);
}

function lookupDotted(obj, parts) {
  let v = obj;
  for (const p of parts) {
    v = getattr(v, p);
    if (v && v.method !== undefined) {
      return limit(`${pyStrRepr(parts.join('.'))} is a bound method — its repr shows a memory address, so the demo stops here`);
    }
  }
  return v;
}

// calling the operator objects / a builtin with Python arguments
export function callObj(f, args, kwargs = []) {
  if (f instanceof PyItemgetter) {
    if (kwargs.length) raise('TypeError', 'itemgetter() takes no keyword arguments');
    if (args.length !== 1) raise('TypeError', `itemgetter expected 1 argument, got ${args.length}`);
    if (f.items.length === 1) return getitem(args[0], f.items[0]);
    return new PyTuple(f.items.map((k) => getitem(args[0], k)));
  }
  if (f instanceof PyAttrgetter) {
    if (kwargs.length) raise('TypeError', 'attrgetter() takes no keyword arguments');
    if (args.length !== 1) raise('TypeError', `attrgetter expected 1 argument, got ${args.length}`);
    if (f.names.length === 1) return lookupDotted(args[0], f.names[0]);
    return new PyTuple(f.names.map((p) => lookupDotted(args[0], p)));
  }
  if (f instanceof PyMethodcaller) {
    if (kwargs.length) raise('TypeError', 'methodcaller() takes no keyword arguments');
    if (args.length !== 1) raise('TypeError', `methodcaller expected 1 argument, got ${args.length}`);
    const m = getattr(args[0], f.name);
    return callValue(m, f.args, f.kwargs);
  }
  return callValue(f, args, kwargs);
}

// sorted(items, key=keyfn): all keys first (in order), then a stable sort
// by < — the same result as CPython's timsort whenever the keys are
// mutually comparable. An incomparable pair stops the demo: which pair
// timsort compares first decides CPython's message.
export function sorted(items, keyfn = (x) => x, reverse = false) {
  const keys = items.map((x) => keyfn(x));
  // reverse=True: reverse, stable sort, reverse again (list_sort_impl)
  const idx = items.map((_, i) => i);
  if (reverse) idx.reverse();
  try {
    idx.sort((i, j) => (compare('lt', keys[i], keys[j]) ? -1 : compare('lt', keys[j], keys[i]) ? 1 : 0));
  } catch (e) {
    if (e && e.name === 'TypeError') {
      return limit(`the keys cannot all be compared (${e.message}) — which pair Python's sort meets first decides its message, so the demo stops here`);
    }
    throw e;
  }
  if (reverse) idx.reverse();
  return idx.map((i) => items[i]);
}

// ─── the operator module as an object ───────────────────────

export const OPERATOR_MODULE = { module: 'operator' };

const arity2 = (name, impl) => (args, kw) => {
  if (kw.length) raise('TypeError', `${name}() takes no keyword arguments`);
  if (args.length !== 2) raise('TypeError', `${name} expected 2 arguments, got ${args.length}`);
  return impl(args[0], args[1]);
};
const arity1 = (name, impl) => (args, kw) => {
  if (kw.length) raise('TypeError', `_operator.${name}() takes no keyword arguments`);
  if (args.length !== 1) raise('TypeError', `_operator.${name}() takes exactly one argument (${args.length} given)`);
  return impl(args[0]);
};

const FUNCS = {};
for (const n of ['add', 'sub', 'mul', 'truediv', 'floordiv', 'mod', 'pow', 'matmul', 'and_', 'or_', 'xor', 'lshift', 'rshift']) {
  FUNCS[n] = arity2(n, (a, b) => binop(n, a, b));
  const i = 'i' + n.replace(/_$/, '');
  FUNCS[i] = arity2(i, (a, b) => binop(n, a, b, true));
}
for (const n of ['neg', 'pos', 'abs', 'invert', 'inv', 'index']) FUNCS[n] = arity1(n, (a) => unop(n, a));
for (const n of ['lt', 'le', 'eq', 'ne', 'ge', 'gt']) FUNCS[n] = arity2(n, (a, b) => compare(n, a, b));
FUNCS.not_ = arity1('not_', (a) => !truth(a));
FUNCS.truth = arity1('truth', (a) => truth(a));
FUNCS.is_ = arity2('is_', (a, b) => identity(a, b));
FUNCS.is_not = arity2('is_not', (a, b) => !identity(a, b));
FUNCS.concat = arity2('concat', (a, b) => concat(a, b));
FUNCS.iconcat = arity2('iconcat', (a, b) => concat(a, b, true));
FUNCS.contains = arity2('contains', contains);
FUNCS.countOf = arity2('countOf', countOf);
FUNCS.indexOf = arity2('indexOf', indexOf);
FUNCS.getitem = arity2('getitem', getitem);
FUNCS.delitem = arity2('delitem', delitem);
FUNCS.setitem = (args, kw) => {
  if (kw.length) raise('TypeError', 'setitem() takes no keyword arguments');
  if (args.length !== 3) raise('TypeError', `setitem expected 3 arguments, got ${args.length}`);
  return setitem(args[0], args[1], args[2]);
};
FUNCS.length_hint = (args, kw) => {
  if (kw.length) raise('TypeError', 'length_hint() takes no keyword arguments');
  if (args.length < 1) raise('TypeError', `length_hint expected at least 1 argument, got ${args.length}`);
  if (args.length > 2) raise('TypeError', `length_hint expected at most 2 arguments, got ${args.length}`);
  return lengthHint(args[0], args.length === 2 ? args[1] : 0n);
};
FUNCS.call = (args, kw) => {
  if (args.length < 1) raise('TypeError', `call expected at least 1 argument, got ${args.length}`);
  return callObj(args[0], args.slice(1), kw);
};
FUNCS.itemgetter = (args, kw) => {
  if (kw.length) raise('TypeError', 'itemgetter() takes no keyword arguments');
  return itemgetter(...args);
};
FUNCS.attrgetter = (args, kw) => {
  if (kw.length) raise('TypeError', 'attrgetter() takes no keyword arguments');
  return attrgetter(...args);
};
FUNCS.methodcaller = (args, kw) => {
  const m = methodcaller(...args);
  m.kwargs = kw;
  return m;
};

// operator.is_(a, b): only objects have an identity this model knows.
// Different values are never the same object; equal immutable values
// (two 300s, two 'ab's) may or may not be one object in CPython.
export function identity(a, b) {
  if (a === null || b === null || typeof a === 'boolean' || typeof b === 'boolean') return a === b;
  if (typeof a === 'object' || typeof b === 'object') return a === b;
  if (typeName(a) !== typeName(b) || !eq(a, b) || (typeof a === 'number' && Object.is(a, -0) !== Object.is(b, -0))) return false;
  if (typeof a === 'bigint' && a >= -5n && a <= 256n) return true; // small-int cache
  if (typeof a === 'string' && (a === '' || ([...a].length === 1 && a.codePointAt(0) < 256))) return true; // cached strs
  return limit('whether two equal immutable values are the same object depends on how CPython created them (constants in one code object are shared) — not reproduced');
}

const ALL_NAMES = ['abs', 'add', 'and_', 'attrgetter', 'call', 'concat', 'contains', 'countOf', 'delitem', 'eq', 'floordiv', 'ge', 'getitem', 'gt', 'iadd', 'iand', 'iconcat', 'ifloordiv', 'ilshift', 'imatmul', 'imod', 'imul', 'index', 'indexOf', 'inv', 'invert', 'ior', 'ipow', 'irshift', 'is_', 'is_not', 'isub', 'itemgetter', 'itruediv', 'ixor', 'le', 'length_hint', 'lshift', 'lt', 'matmul', 'methodcaller', 'mod', 'mul', 'ne', 'neg', 'not_', 'or_', 'pos', 'pow', 'rshift', 'setitem', 'sub', 'truediv', 'truth', 'xor'];
// dir(operator) without the underscore names, sorted
const OPERATOR_PUBLIC = ALL_NAMES;

const KIND = { itemgetter: 'type', attrgetter: 'type', methodcaller: 'type' };
export const OPERATOR_FUNCS = new Map(ALL_NAMES.map((n) => [n, new PyFunc(n, FUNCS[n], KIND[n]
  ? { repr: `<class 'operator.${n}'>`, typeName: 'type' }
  : {})]));

// operator.__add__ etc. are the same objects as add etc.
const DUNDER_ALIAS = {};
for (const n of ['abs', 'add', 'call', 'concat', 'contains', 'delitem', 'eq', 'floordiv', 'ge', 'getitem', 'gt', 'iadd', 'iconcat', 'ifloordiv', 'ilshift', 'imatmul', 'imod', 'imul', 'index', 'inv', 'invert', 'ior', 'ipow', 'irshift', 'isub', 'itruediv', 'ixor', 'le', 'lshift', 'lt', 'matmul', 'mod', 'mul', 'ne', 'neg', 'pos', 'pow', 'rshift', 'setitem', 'sub', 'truediv', 'xor']) {
  DUNDER_ALIAS[`__${n}__`] = n;
}
DUNDER_ALIAS.__and__ = 'and_';
DUNDER_ALIAS.__or__ = 'or_';
DUNDER_ALIAS.__not__ = 'not_';
DUNDER_ALIAS.__iand__ = 'iand';
DUNDER_ALIAS.__ior__ = 'ior';
DUNDER_ALIAS.__ixor__ = 'ixor';

// getattr(operator, name)(*args)
export function callOperator(name, args, kwargs = []) {
  return callValue(getattr(OPERATOR_MODULE, name), args, kwargs);
}
