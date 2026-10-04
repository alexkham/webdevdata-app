// utils/emulators/python/stdlib/math/_pymath.js
//
// CPython's math module (Modules/mathmodule.c, Python 3.13) for the snippet
// demos, on top of _libm.js — the C library as Linux CPython sees it.
//
// Python values:  { int: bigint } | { float: number } | true/false (bool)
//                 | string (str) | array (list) | { tuple: [...] }
// Every function takes and returns Python values and raises the exact
// CPython exception (type and message) through py-exceptions.raise.
//
// What is exact here and why:
//   - integer functions (factorial, comb, perm, gcd, lcm, isqrt, prod and
//     sumprod over ints, floor/ceil/trunc of floats) use BigInt;
//   - fsum, hypot/dist (vector_norm), sumprod's extended-precision float
//     path, remainder, fmod, modf, frexp, ldexp, nextafter, ulp, fma,
//     isclose, gamma/lgamma (CPython's own Lanczos code) are ports of
//     mathmodule.c and give CPython's bits on every platform;
//   - the libm functions (exp, log, sin, pow, erf, cbrt, …) are glibc's
//     results — bit-identical to Linux CPython (see _libm.js); asin, acos,
//     atan and atan2 are correctly rounded, which glibc matches for about
//     999 inputs in 1000. Windows and macOS CPython can differ in the last
//     digit for some inputs.

import * as L from './_libm.js';
import { pyFloatRepr, pyReprExact } from '../../../../demo-coerce.js';
import { raise } from '../../../../py-exceptions.js';
import { pyRepr } from '../../../../code-highlight.js';

// ── value helpers ─────────────────────────────────────────────
export const F = (x) => ({ float: x });
export const I = (n) => ({ int: BigInt(n) });
export const isInt = (v) => v !== null && typeof v === 'object' && v.int !== undefined;
export const isFloat = (v) => v !== null && typeof v === 'object' && v.float !== undefined;
export const isBool = (v) => typeof v === 'boolean';
export const isTuple = (v) => v !== null && typeof v === 'object' && Array.isArray(v.tuple);
export const isComplex = (v) => v !== null && typeof v === 'object' && Array.isArray(v.complex);

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (isBool(v)) return 'bool';
  if (isInt(v)) return 'int';
  if (isFloat(v)) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (isTuple(v)) return 'tuple';
  if (isComplex(v)) return 'complex';
  if (v && v.pyObject) return v.pyObject;
  if (typeof v === 'function') return 'builtin_function_or_method';
  return 'object';
}

// The Python value of a number typed into a demo, decided by the text the
// demo code shows (pyRepr): '16' is an int, '2.5' / '1e+21' are floats,
// 'inf' is a NameError.
export function lit(n) {
  if (typeof n !== 'number') return n;
  const text = pyRepr(n);
  if (text === 'inf' || text === '-inf' || text === 'nan') {
    raise('NameError', `name '${text.replace('-', '')}' is not defined. Did you mean: 'int'?`);
  }
  if (/[.eE]/.test(text)) return F(n);
  return { int: BigInt(text) };
}
// A 'float'-input value: always shown as a float literal.
export function litFloat(x) {
  if (!Number.isFinite(x)) raise('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
  return F(x);
}
export const litList = (arr) => arr.map(lit);

// repr() of an int refuses more than 4300 digits (sys.int_info.default_max_str_digits)
const INT_DIGITS_LIMIT = 4300;
function intRepr(n) {
  if (n >= 10n ** 4300n || n <= -(10n ** 4300n)) {
    const s = (n < 0n ? -n : n).toString();
    if (s.length > INT_DIGITS_LIMIT) raise('ValueError', `Exceeds the limit (${INT_DIGITS_LIMIT} digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return n;
}

// Python value → what the demo prints (repr)
export function out(v) {
  if (isFloat(v)) return { __pyRaw: pyFloatRepr(v.float) };
  if (isInt(v)) return intRepr(v.int);
  if (isTuple(v)) return { __pyTuple: v.tuple.map(out) };
  if (Array.isArray(v)) return v.map(out);
  if (isComplex(v)) return { __pyRaw: complexRepr(v.complex[0], v.complex[1]) };
  if (v && typeof v === 'object' && v.pyObject) return { __pyRaw: v.repr };
  if (typeof v === 'function') return { __pyRaw: `<built-in function ${FN_NAMES.get(v)}>` };
  return v;
}

// complex.__repr__: parts in repr style without a trailing '.0'
function complexRepr(re, im) {
  const part = (x, sign) => {
    let t = pyFloatRepr(x);
    if (t.endsWith('.0')) t = t.slice(0, -2);
    if (sign && t[0] !== '-') t = '+' + t;
    return t;
  };
  if (re === 0 && !Object.is(re, -0)) return `${part(im, false)}j`;
  return `(${part(re, false)}${part(im, true)}j)`;
}
export const reprOf = (v) => pyReprExact(out(v));

const intOf = (v) => (isBool(v) ? (v ? 1n : 0n) : v.int);

// int → float, correctly rounded (PyLong_AsDouble)
export function intToFloat(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) raise('OverflowError', 'int too large to convert to float');
  return x;
}

// PyFloat_AsDouble
export function asDouble(v) {
  if (isFloat(v)) return v.float;
  if (isInt(v) || isBool(v)) return intToFloat(intOf(v));
  raise('TypeError', `must be real number, not ${typeName(v)}`);
}

// PyNumber_Index
export function asIndex(v) {
  if (isInt(v) || isBool(v)) return intOf(v);
  raise('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);
}

// int() / float() of a str: non-ASCII Unicode whitespace becomes a space
// and non-ASCII decimal digits (category Nd) their ASCII digit
// (_PyUnicode_TransformDecimalAndSpaceToASCII); then only ASCII
// whitespace is stripped.
const UNI_SPACE = /[\x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/u;
const ND = /\p{Nd}/u;
function digitValue(ch) {
  // Nd characters come in runs of complete 0..9 sequences
  let cp = ch.codePointAt(0);
  let start = cp;
  while (ND.test(String.fromCodePoint(start - 1))) start -= 1;
  return (cp - start) % 10;
}
function asciiNumberText(s) {
  let out = '';
  for (const ch of s) {
    if (ch.codePointAt(0) < 128) out += ch;
    else if (UNI_SPACE.test(ch)) out += ' ';
    else if (ND.test(ch)) out += String(digitValue(ch));
    else out += '?';
  }
  return out.replace(/^[ \t\n\v\f\r]+|[ \t\n\v\f\r]+$/g, '');
}

// Python int(str) for text inputs (base 10)
export function intFromStr(s) {
  const t = asciiNumberText(s);
  if (!/^[+-]?\d(_?\d)*$/.test(t)) raise('ValueError', `invalid literal for int() with base 10: ${pyReprExact(s)}`);
  const digits = t.replace(/_/g, '').replace(/^\+/, '');
  if (digits.replace('-', '').length > 4300) raise('ValueError', 'Exceeds the limit (4300 digits) for integer string conversion: value has ' + digits.replace('-', '').length + ' digits; use sys.set_int_max_str_digits() to increase the limit');
  return { int: BigInt(digits) };
}

// Python float(str) for text inputs
export function floatFromStr(s) {
  const t = asciiNumberText(s);
  const low = t.toLowerCase();
  const m = /^([+-]?)(inf|infinity|nan)$/.exec(low);
  if (m) {
    if (m[2] === 'nan') return F(NaN);
    return F(m[1] === '-' ? -Infinity : Infinity);
  }
  const ok = /^[+-]?((\d(_?\d)*)(\.(\d(_?\d)*)?)?|\.\d(_?\d)*)([eE][+-]?\d(_?\d)*)?$/.test(t);
  if (!ok) raise('ValueError', `could not convert string to float: ${pyReprExact(s)}`);
  return F(Number(t.replace(/_/g, '')));
}

// ── Python arithmetic used by prod / sumprod / sum ─────────────
const numeric = (v) => isInt(v) || isFloat(v) || isBool(v);
export function pyMul(a, b) {
  if (numeric(a) && numeric(b)) {
    if (isFloat(a) || isFloat(b)) return F(asDouble(a) * asDouble(b));
    return { int: intOf(a) * intOf(b) };
  }
  const seq = (s, n) => (typeof s === 'string' ? s.repeat(Math.max(0, Number(n))) : Array.from({ length: Math.max(0, Number(n)) }, () => s).flat());
  if ((typeof a === 'string' || Array.isArray(a)) && (isInt(b) || isBool(b))) return seq(a, intOf(b));
  if ((typeof b === 'string' || Array.isArray(b)) && (isInt(a) || isBool(a))) return seq(b, intOf(a));
  raise('TypeError', `unsupported operand type(s) for *: '${typeName(a)}' and '${typeName(b)}'`);
}
export function pyAdd(a, b) {
  if (numeric(a) && numeric(b)) {
    if (isFloat(a) || isFloat(b)) return F(asDouble(a) + asDouble(b));
    return { int: intOf(a) + intOf(b) };
  }
  if (typeof a === 'string' && typeof b === 'string') return a + b;
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  if (typeof a === 'string') raise('TypeError', `can only concatenate str (not "${typeName(b)}") to str`);
  raise('TypeError', `unsupported operand type(s) for +: '${typeName(a)}' and '${typeName(b)}'`);
}
// x % y for ints and floats (long_mod / float_rem)
export function pyMod(a, b) {
  if ((isInt(a) || isBool(a)) && (isInt(b) || isBool(b))) {
    const x = intOf(a);
    const y = intOf(b);
    if (y === 0n) raise('ZeroDivisionError', 'integer modulo by zero');
    let r = x % y;
    if (r !== 0n && (r < 0n) !== (y < 0n)) r += y;
    return { int: r };
  }
  const vx = asDouble(a);
  const wx = asDouble(b);
  if (wx === 0) raise('ZeroDivisionError', 'float modulo by zero');
  let mod = vx % wx;
  if (mod) { if ((wx < 0) !== (mod < 0)) mod += wx; } else mod = L.copysign(0.0, wx);
  return F(mod);
}

// x ** y for ints and floats (long_pow / float_pow; a negative base with a
// fractional exponent goes to complex_pow → _Py_c_pow, as in CPython)
const oddInt = (w) => Number.isFinite(w) && Math.abs(w) % 2.0 === 1.0;
function floatPow(iv, iw) {
  if (iw === 0) return F(1.0);
  if (Number.isNaN(iv)) return F(iv);
  if (Number.isNaN(iw)) return F(iv === 1.0 ? 1.0 : iw);
  if (!Number.isFinite(iw)) {
    const av = Math.abs(iv);
    if (av === 1.0) return F(1.0);
    if ((iw > 0.0) === (av > 1.0)) return F(Math.abs(iw));
    return F(0.0);
  }
  if (!Number.isFinite(iv)) {
    if (iw > 0.0) return F(oddInt(iw) ? iv : Math.abs(iv));
    return F(oddInt(iw) ? L.copysign(0.0, iv) : 0.0);
  }
  if (iv === 0.0) {
    if (iw < 0.0) raise('ZeroDivisionError', '0.0 cannot be raised to a negative power');
    return F(oddInt(iw) ? iv : 0.0);
  }
  let neg = false;
  if (iv < 0.0) {
    if (iw !== Math.floor(iw)) {
      // _Py_c_pow((iv, 0), (iw, 0)): hypot(iv, 0) = |iv|, atan2(0, iv) = pi
      const len = L.pow(-iv, iw);
      const phase = Math.PI * iw;
      const re = len * L.cos(phase);
      const im = len * L.sin(phase);
      if (!Number.isFinite(re) || !Number.isFinite(im)) raise('OverflowError', 'complex exponentiation');
      return { complex: [re, im] };
    }
    iv = -iv;
    neg = oddInt(iw);
  }
  if (iv === 1.0) return F(neg ? -1.0 : 1.0);
  const ix = L.pow(iv, iw);
  if (ix === Infinity) raise('OverflowError', "(34, 'Numerical result out of range')");
  return F(neg ? -ix : ix);
}
export function pyPow(a, b) {
  if ((isInt(a) || isBool(a)) && (isInt(b) || isBool(b))) {
    const x = intOf(a);
    const y = intOf(b);
    if (y >= 0n) return { int: x ** y };
    return floatPow(intToFloat(x), intToFloat(y));
  }
  if (!numeric(a) || !numeric(b)) raise('TypeError', `unsupported operand type(s) for ** or pow(): '${typeName(a)}' and '${typeName(b)}'`);
  return floatPow(asDouble(a), asDouble(b));
}

export function pyTrueDiv(a, b) {
  if ((isInt(a) || isBool(a)) && (isInt(b) || isBool(b))) {
    const x = intOf(a);
    const y = intOf(b);
    if (y === 0n) raise('ZeroDivisionError', 'division by zero');
    if (x === 0n) return F(y < 0n ? -0 : 0);
    // long_true_divide: correctly rounded
    const r = L.roundFrac(x < 0n ? -x : x, y < 0n ? -y : y, 0, (x < 0n) !== (y < 0n));
    if (!Number.isFinite(r)) raise('OverflowError', 'integer division result too large for a float');
    return F(r);
  }
  const x = asDouble(a);
  const y = asDouble(b);
  if (y === 0) raise('ZeroDivisionError', 'float division by zero');
  return F(x / y);
}

// x // y (long_div / float_floor_div)
export function pyFloorDiv(a, b) {
  if ((isInt(a) || isBool(a)) && (isInt(b) || isBool(b))) {
    const x = intOf(a);
    const y = intOf(b);
    if (y === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
    let q = x / y;
    if ((x % y !== 0n) && ((x < 0n) !== (y < 0n))) q -= 1n;
    return { int: q };
  }
  const vx = asDouble(a);
  const wx = asDouble(b);
  if (wx === 0) raise('ZeroDivisionError', 'float floor division by zero');
  let mod = vx % wx;
  let div = (vx - mod) / wx;
  if (mod) { if ((wx < 0) !== (mod < 0)) { mod += wx; div -= 1.0; } }
  let fd;
  if (div) { fd = Math.floor(div); if (div - fd > 0.5) fd += 1.0; } else fd = L.copysign(0.0, vx / wx);
  return F(fd);
}

// builtin sum() (Python 3.12+: Neumaier-compensated float path)
const LONG_MAX = (1n << 63n) - 1n;
const LONG_MIN = -(1n << 63n);
const fitsLong = (n) => n >= LONG_MIN && n <= LONG_MAX;
export function pySum(items, start = { int: 0n }) {
  if (typeof start === 'string') raise('TypeError', "sum() can't sum strings [use ''.join(seq) instead]");
  let result = start;
  let i = 0;
  if (isInt(result) && fitsLong(result.int)) {
    let acc = result.int;
    result = null;
    while (result === null) {
      if (i >= items.length) return { int: acc };
      const item = items[i++];
      if ((isInt(item) || isBool(item)) && fitsLong(intOf(item)) && fitsLong(acc + intOf(item))) { acc += intOf(item); continue; }
      result = pyAdd({ int: acc }, item);
    }
  }
  if (isFloat(result)) {
    let f = result.float;
    let c = 0.0;
    result = null;
    while (result === null) {
      if (i >= items.length) {
        if (c && Number.isFinite(c)) f += c;
        return F(f);
      }
      const item = items[i++];
      if (isFloat(item)) {
        const x = item.float;
        const t = f + x;
        if (Math.abs(f) >= Math.abs(x)) c += (f - t) + x; else c += (x - t) + f;
        f = t;
        continue;
      }
      if ((isInt(item) || isBool(item)) && fitsLong(intOf(item))) { f += Number(intOf(item)); continue; }
      if (c && Number.isFinite(c)) f += c;
      result = pyAdd(F(f), item);
    }
  }
  for (; i < items.length; i++) result = pyAdd(result, items[i]);
  return result;
}

// builtin round(x[, ndigits]) for ints and floats
export function pyRound(v, nd = null) {
  if (nd === null) {
    if (isInt(v) || isBool(v)) return { int: intOf(v) };
    const x = asDouble(v);
    if (Number.isNaN(x)) raise('ValueError', 'cannot convert float NaN to integer');
    if (!Number.isFinite(x)) raise('OverflowError', 'cannot convert float infinity to integer');
    let r = Math.round(x);
    if (r - x === 0.5 && r % 2 !== 0) r -= 1; // ties to even
    return { int: BigInt(r) };
  }
  const n = Number(asIndex(nd));
  if (isInt(v) || isBool(v)) {
    const a = intOf(v);
    if (n >= 0) return { int: a };
    const p = 10n ** BigInt(-n);
    const neg = a < 0n;
    const m = neg ? -a : a;
    let q = m / p;
    const r = m - q * p;
    if (2n * r > p || (2n * r === p && (q & 1n) === 1n)) q += 1n;
    return { int: (neg ? -q : q) * p };
  }
  const x = asDouble(v);
  if (x === 0 || !Number.isFinite(x)) return F(x);
  if (n > 323) return F(x);
  if (n < -308) return F(0 * x);
  // exact: x = m * 2**e; y = x * 10**n rounded half-even to an integer
  const { neg, m, e } = L.decompose(x);
  let num = m;
  let den = 1n;
  if (e >= 0) num <<= BigInt(e); else den <<= BigInt(-e);
  if (n >= 0) num *= 10n ** BigInt(n); else den *= 10n ** BigInt(-n);
  let q = num / den;
  const r = num - q * den;
  if (2n * r > den || (2n * r === den && (q & 1n) === 1n)) q += 1n;
  if (q === 0n) return F(neg ? -0 : 0);
  let res;
  if (n >= 0) res = L.roundFrac(q, 10n ** BigInt(n), 0);
  else res = L.roundScaled(q * 10n ** BigInt(-n), 0);
  if (!Number.isFinite(res)) raise('OverflowError', 'rounded value too large to represent');
  return F(neg ? -res : res);
}

// ── error plumbing (math_1 / math_2 / is_error) ───────────────
const domain = () => raise('ValueError', 'math domain error');
const range = () => raise('OverflowError', 'math range error');

function math1(v, fn, canOverflow) {
  const x = asDouble(v);
  const r = fn(x);
  if (Number.isNaN(r) && !Number.isNaN(x)) domain();
  if (r === Infinity || r === -Infinity) {
    if (Number.isFinite(x)) { if (canOverflow) range(); else domain(); }
  }
  return F(r);
}
function math2(a, b, fn) {
  const x = asDouble(a);
  const y = asDouble(b);
  const r = fn(x, y);
  if (Number.isNaN(r) && !Number.isNaN(x) && !Number.isNaN(y)) domain();
  if ((r === Infinity || r === -Infinity) && Number.isFinite(x) && Number.isFinite(y)) range();
  return F(r);
}
// math_1a: errno decides (EDOM → ValueError, ERANGE → OverflowError
// unless the result is below 1.5 in magnitude: an underflow)
function math1a(v, fn) {
  const x = asDouble(v);
  const [r, errno] = fn(x);
  if (errno === 'EDOM') domain();
  if (errno === 'ERANGE' && !(Math.abs(r) < 1.5)) range();
  return F(r);
}

// ── constants ─────────────────────────────────────────────────
export const pi = F(Math.PI);
export const e = F(Math.E);
export const tau = F(2 * Math.PI);
export const inf = F(Infinity);
export const nan = F(NaN);

// ── libm one-argument functions ───────────────────────────────
const m_log1p = (x) => (x === 0 ? x : L.log1p(x));
export const acos = (v) => math1(v, L.acos, false);
export const acosh = (v) => math1(v, L.acosh, false);
export const asin = (v) => math1(v, L.asin, false);
export const asinh = (v) => math1(v, L.asinh, false);
export const atan = (v) => math1(v, L.atan, false);
export const atanh = (v) => math1(v, L.atanh, false);
export const cbrt = (v) => math1(v, L.cbrt, false);
export const cos = (v) => math1(v, L.cos, false);
export const cosh = (v) => math1(v, L.cosh, true);
export const exp = (v) => math1(v, L.exp, true);
export const exp2 = (v) => math1(v, L.exp2, true);
export const expm1 = (v) => math1(v, L.expm1, true);
export const fabs = (v) => math1(v, Math.abs, false);
export const log1p = (v) => math1(v, m_log1p, false);
export const sin = (v) => math1(v, L.sin, false);
export const sinh = (v) => math1(v, L.sinh, true);
export const sqrt = (v) => math1(v, Math.sqrt, false);
export const tan = (v) => math1(v, L.tan, false);
export const tanh = (v) => math1(v, L.tanh, false);
export const erf = (v) => math1a(v, (x) => [L.erf(x), null]);
export const erfc = (v) => math1a(v, (x) => { const r = L.erfc(x); return [r, r === 0 && x > 0 ? 'ERANGE' : null]; });

// m_atan2: special values handled here, the rest by libm
function m_atan2(y, x) {
  if (Number.isNaN(x) || Number.isNaN(y)) return NaN;
  if (!Number.isFinite(y)) {
    if (!Number.isFinite(x)) return L.copysign(L.copysign(1, x) === 1 ? 0.25 * Math.PI : 0.75 * Math.PI, y);
    return L.copysign(0.5 * Math.PI, y);
  }
  if (!Number.isFinite(x) || y === 0) {
    if (L.copysign(1, x) === 1) return L.copysign(0, y);
    return L.copysign(Math.PI, y);
  }
  return L.atan2(y, x);
}
export const atan2 = (y, x) => math2(y, x, m_atan2);
export const copysign = (x, y) => math2(x, y, L.copysign);

// m_remainder (exact)
function m_remainder(x, y) {
  if (Number.isFinite(x) && Number.isFinite(y)) {
    if (y === 0) return NaN;
    const absx = Math.abs(x);
    const absy = Math.abs(y);
    const m = absx % absy;
    const c = absy - m;
    let r;
    if (m < c) r = m;
    else if (m > c) r = -c;
    else r = m - 2.0 * ((0.5 * (absx - m)) % absy);
    return L.copysign(1.0, x) * r;
  }
  if (Number.isNaN(x)) return x;
  if (Number.isNaN(y)) return y;
  if (!Number.isFinite(x)) return NaN;
  return x;
}
export const remainder = (x, y) => math2(x, y, m_remainder);

export function fmod(a, b) {
  const x = asDouble(a);
  const y = asDouble(b);
  if (!Number.isFinite(y) && !Number.isNaN(y) && Number.isFinite(x)) return F(x);
  const r = x % y;
  if (Number.isNaN(r) && !Number.isNaN(x) && !Number.isNaN(y)) domain();
  return F(r);
}

export function pow(a, b) {
  const x = asDouble(a);
  const y = asDouble(b);
  let r;
  let errno = null;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    if (Number.isNaN(x)) r = y === 0 ? 1 : x;
    else if (Number.isNaN(y)) r = x === 1 ? 1 : y;
    else if (!Number.isFinite(x)) {
      const oddY = Number.isFinite(y) && Math.abs(y) % 2 === 1;
      if (y > 0) r = oddY ? x : Math.abs(x);
      else if (y === 0) r = 1;
      else r = oddY ? L.copysign(0, x) : 0;
    } else {
      if (Math.abs(x) === 1) r = 1;
      else if (y > 0 && Math.abs(x) > 1) r = y;
      else if (y < 0 && Math.abs(x) < 1) r = -y;
      else r = 0;
    }
  } else {
    r = L.pow(x, y);
    if (!Number.isFinite(r)) {
      if (Number.isNaN(r)) errno = 'EDOM';
      else errno = x === 0 ? 'EDOM' : 'ERANGE';
    }
  }
  if (errno === 'EDOM') domain();
  if (errno === 'ERANGE' && !(Math.abs(r) < 1.5)) range();
  return F(r);
}

// ── logarithms (loghelper: ints of any size) ──────────────────
const m_log = (x) => L.log(x);
function longFrexp(n) {
  const bits = L.bitLen(n);
  let x = L.roundScaled(n, -bits);
  let e = bits;
  if (x === 1.0) { x = 0.5; e += 1; }
  return [x, e];
}
function logHelper(v, fn) {
  if (isInt(v) || isBool(v)) {
    const n = intOf(v);
    if (n <= 0n) domain();
    const x = Number(n);
    if (Number.isFinite(x)) return F(fn(x));
    const [m, ex] = longFrexp(n);
    return F(fn(m) + fn(2.0) * ex);
  }
  return math1(v, fn, false);
}
export function log(v, base) {
  const num = logHelper(v, m_log);
  if (base === undefined) return num;
  const den = logHelper(base, m_log);
  return pyTrueDiv(num, den);
}
export const log2 = (v) => logHelper(v, L.log2);
export const log10 = (v) => logHelper(v, L.log10);

// ── rounding to int ───────────────────────────────────────────
function floatToInt(x) {
  if (Number.isNaN(x)) raise('ValueError', 'cannot convert float NaN to integer');
  if (!Number.isFinite(x)) raise('OverflowError', 'cannot convert float infinity to integer');
  return { int: BigInt(x) };
}
export function floor(v) {
  if (isInt(v) || isBool(v)) return { int: intOf(v) };
  return floatToInt(Math.floor(asDouble(v)));
}
export function ceil(v) {
  if (isInt(v) || isBool(v)) return { int: intOf(v) };
  return floatToInt(Math.ceil(asDouble(v)));
}
export function trunc(v) {
  if (isFloat(v)) return floatToInt(Math.trunc(v.float));
  if (isInt(v) || isBool(v)) return { int: intOf(v) };
  raise('TypeError', `type ${typeName(v)} doesn't define __trunc__ method`);
}

// ── float decomposition ───────────────────────────────────────
export function frexp(v) {
  const x = asDouble(v);
  if (Number.isNaN(x) || !Number.isFinite(x) || x === 0) return { tuple: [F(x), I(0)] };
  const [m, ex] = L.frexp(x);
  return { tuple: [F(m), I(ex)] };
}
export function ldexp(v, i) {
  const x = asDouble(v);
  if (!(isInt(i) || isBool(i))) raise('TypeError', 'Expected an int as second argument to ldexp.');
  const ex = intOf(i);
  let r;
  let errno = null;
  if (x === 0 || !Number.isFinite(x)) r = x;
  else if (ex > 2147483647n) { r = L.copysign(Infinity, x); errno = 'ERANGE'; }
  else if (ex < -2147483648n) r = L.copysign(0, x);
  else {
    r = L.ldexp(x, Number(ex));
    if (!Number.isFinite(r)) errno = 'ERANGE';
  }
  if (errno && !(Math.abs(r) < 1.5)) range();
  return F(r);
}
export function modf(v) {
  const x = asDouble(v);
  if (x === Infinity || x === -Infinity) return { tuple: [F(L.copysign(0, x)), F(x)] };
  if (Number.isNaN(x)) return { tuple: [F(x), F(x)] };
  const ip = Math.trunc(x);
  return { tuple: [F(L.copysign(x - ip, x)), F(ip)] };
}

// nextafter(x, y, *, steps=None)
export function nextafter(a, b, steps = null) {
  const x = asDouble(a);
  const y = asDouble(b);
  if (steps === null) return F(L.nextafter(x, y));
  let n = asIndex(steps);
  if (n < 0n) raise('ValueError', 'steps must be a non-negative integer');
  const U64MAX = (1n << 64n) - 1n;
  if (n > U64MAX) n = U64MAX;
  if (n === 0n) return F(x);
  if (Number.isNaN(x)) return F(x);
  if (Number.isNaN(y)) return F(y);
  const ux = L.toBits(x);
  const uy = L.toBits(y);
  if (ux === uy) return F(x);
  const SIGNB = 1n << 63n;
  const ax = ux & ~SIGNB;
  const ay = uy & ~SIGNB;
  if ((ux ^ uy) & SIGNB) {
    if (ax + ay <= n) return F(y);
    if (ax < n) return F(L.fromBits((uy & SIGNB) | (n - ax)));
    return F(L.fromBits(ux - n));
  }
  if (ax > ay) {
    if (ax - ay >= n) return F(L.fromBits(ux - n));
    return F(y);
  }
  if (ay - ax >= n) return F(L.fromBits(ux + n));
  return F(y);
}
export function ulp(v) {
  let x = asDouble(v);
  if (Number.isNaN(x)) return F(x);
  x = Math.abs(x);
  if (x === Infinity) return F(x);
  const x2 = L.nextafter(x, Infinity);
  if (x2 === Infinity) return F(x - L.nextafter(x, -Infinity));
  return F(x2 - x);
}

export function fma(a, b, c) {
  const x = asDouble(a);
  const y = asDouble(b);
  const z = asDouble(c);
  const r = L.fma(x, y, z);
  if (Number.isFinite(r)) return F(r);
  if (Number.isNaN(r)) {
    if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) raise('ValueError', 'invalid operation in fma');
  } else if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) raise('OverflowError', 'overflow in fma');
  return F(r);
}

// ── classification / comparison ───────────────────────────────
export const isfinite = (v) => Number.isFinite(asDouble(v));
export const isinf = (v) => { const x = asDouble(v); return x === Infinity || x === -Infinity; };
export const isnan = (v) => Number.isNaN(asDouble(v));
export function isclose(av, bv, relTol = F(1e-9), absTol = F(0.0)) {
  const a = asDouble(av);
  const b = asDouble(bv);
  const rt = asDouble(relTol);
  const at = asDouble(absTol);
  if (rt < 0.0 || at < 0.0) raise('ValueError', 'tolerances must be non-negative');
  if (a === b) return true;
  if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) return false;
  const diff = Math.abs(b - a);
  return diff <= Math.abs(rt * b) || diff <= Math.abs(rt * a) || diff <= at;
}

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;
export const degrees = (v) => F(asDouble(v) * RAD_TO_DEG);
export const radians = (v) => F(asDouble(v) * DEG_TO_RAD);

// ── fsum (msum + exact rounding, Shewchuk / Hettinger / Dickinson) ──
export function fsum(items) {
  const p = [];
  let specialSum = 0.0;
  let infSum = 0.0;
  for (const item of items) {
    let x = asDouble(item);
    const xsave = x;
    let i = 0;
    for (let j = 0; j < p.length; j++) {
      let y = p[j];
      if (Math.abs(x) < Math.abs(y)) { const t = x; x = y; y = t; }
      const hi = x + y;
      const yr = hi - x;
      const lo = y - yr;
      if (lo !== 0.0) p[i++] = lo;
      x = hi;
    }
    p.length = i;
    if (x !== 0.0) {
      if (!Number.isFinite(x)) {
        if (Number.isFinite(xsave)) raise('OverflowError', 'intermediate overflow in fsum');
        if (xsave === Infinity || xsave === -Infinity) infSum += xsave;
        specialSum += xsave;
        p.length = 0;
      } else p.push(x);
    }
  }
  if (specialSum !== 0.0) {
    if (Number.isNaN(infSum)) raise('ValueError', '-inf + inf in fsum');
    return F(specialSum);
  }
  let hi = 0.0;
  let n = p.length;
  if (n > 0) {
    let lo = 0.0;
    hi = p[--n];
    while (n > 0) {
      const x = hi;
      const y = p[--n];
      hi = x + y;
      const yr = hi - x;
      lo = y - yr;
      if (lo !== 0.0) break;
    }
    if (n > 0 && ((lo < 0.0 && p[n - 1] < 0.0) || (lo > 0.0 && p[n - 1] > 0.0))) {
      const y = lo * 2.0;
      const x = hi + y;
      const yr = x - hi;
      if (y === yr) hi = x;
    }
  }
  return F(hi);
}

// ── hypot / dist (vector_norm) ────────────────────────────────
const dlMul = (x, y) => { const z = x * y; return [z, L.fma(x, y, -z)]; };
const dlFastSum = (a, b) => { const x = a + b; return [x, (a - x) + b]; };
const dlSum = (a, b) => { const x = a + b; const z = x - a; return [x, (a - (x - z)) + (b - z)]; };
const DBL_MIN = 2 ** -1022;

function vectorNorm(vec, max, foundNan) {
  if (max === Infinity) return max;
  if (foundNan) return NaN;
  if (max === 0.0 || vec.length <= 1) return max;
  const [, maxE] = L.frexp(max);
  if (maxE < -1023) {
    return DBL_MIN * vectorNorm(vec.map((v) => v / DBL_MIN), max / DBL_MIN, foundNan);
  }
  const scale = L.ldexp(1.0, -maxE);
  let csum = 1.0;
  let frac1 = 0.0;
  let frac2 = 0.0;
  for (let x of vec) {
    x *= scale;
    const [ph, pl] = dlMul(x, x);
    const [sh, sl] = dlFastSum(csum, ph);
    csum = sh;
    frac1 += pl;
    frac2 += sl;
  }
  let h = Math.sqrt(csum - 1.0 + (frac1 + frac2));
  const [ph, pl] = dlMul(-h, h);
  const [sh, sl] = dlFastSum(csum, ph);
  csum = sh;
  frac1 += pl;
  frac2 += sl;
  const x = csum - 1.0 + (frac1 + frac2);
  h += x / (2.0 * h);
  return h / scale;
}
export function hypot(...coords) {
  let max = 0.0;
  let foundNan = false;
  const vec = coords.map((c) => {
    const x = Math.abs(asDouble(c));
    if (Number.isNaN(x)) foundNan = true;
    if (x > max) max = x;
    return x;
  });
  return F(vectorNorm(vec, max, foundNan));
}
const seqItems = (v) => {
  if (Array.isArray(v)) return v;
  if (isTuple(v)) return v.tuple;
  if (typeof v === 'string') return [...v];
  raise('TypeError', `'${typeName(v)}' object is not iterable`);
};
export function dist(p, q) {
  const P = seqItems(p);
  const Q = seqItems(q);
  if (P.length !== Q.length) raise('ValueError', 'both points must have the same number of dimensions');
  let max = 0.0;
  let foundNan = false;
  const vec = P.map((pv, i) => {
    const x = Math.abs(asDouble(pv) - asDouble(Q[i]));
    if (Number.isNaN(x)) foundNan = true;
    if (x > max) max = x;
    return x;
  });
  return F(vectorNorm(vec, max, foundNan));
}

// ── prod / sumprod ────────────────────────────────────────────
export function prod(items, start = { int: 1n }) {
  let r = start;
  for (const it of items) r = pyMul(r, it);
  return r;
}

const tlFma = (x, y, t) => {
  const [ph, pl] = dlMul(x, y);
  const [sh, sl] = dlSum(t.hi, ph);
  const [r1h, r1l] = dlSum(t.lo, pl);
  const [r2h, r2l] = dlSum(r1h, sl);
  return { hi: sh, lo: r2h, tiny: t.tiny + r1l + r2l };
};
const tlToD = (t) => { const [lh, ll] = dlSum(t.lo, t.hi); return t.tiny + ll + lh; };

export function sumprod(pv, qv) {
  const P = seqItems(pv);
  const Q = seqItems(qv);
  let total = { int: 0n };
  let intPath = true;
  let intTotal = 0n;
  let intInUse = false;
  let fltPath = true;
  let flt = { hi: 0, lo: 0, tiny: 0 };
  let fltInUse = false;
  for (let i = 0; ; i++) {
    const pStop = i >= P.length;
    const qStop = i >= Q.length;
    if (pStop !== qStop) raise('ValueError', 'Inputs are not the same length');
    const finished = pStop && qStop;
    const p = P[i];
    const q = Q[i];
    let done = false;
    if (intPath) {
      if (!finished && isInt(p) && isInt(q) && fitsLong(p.int) && fitsLong(q.int)
          && fitsLong(p.int * q.int) && fitsLong(intTotal + p.int * q.int)) {
        intTotal += p.int * q.int;
        intInUse = true;
        done = true;
      } else {
        intPath = false;
        if (intInUse) { total = pyAdd(total, { int: intTotal }); intTotal = 0n; intInUse = false; }
      }
    }
    if (!done && fltPath) {
      let fp = null;
      let fq = null;
      if (!finished) {
        const pf = isFloat(p);
        const qf = isFloat(q);
        const intish = (v) => isInt(v) || isBool(v);
        const conv = (v) => { const x = Number(intOf(v)); return Number.isFinite(x) ? x : null; };
        if (pf && qf) { fp = p.float; fq = q.float; } else if (pf && intish(q)) { fp = p.float; fq = conv(q); } else if (qf && intish(p)) { fq = q.float; fp = conv(p); }
      }
      if (fp !== null && fq !== null) {
        const nt = tlFma(fp, fq, flt);
        if (Number.isFinite(nt.hi)) { flt = nt; fltInUse = true; done = true; }
      }
      if (!done) {
        fltPath = false;
        if (fltInUse) { total = pyAdd(total, F(tlToD(flt))); flt = { hi: 0, lo: 0, tiny: 0 }; fltInUse = false; }
      }
    }
    if (done) continue;
    if (finished) return total;
    total = pyAdd(total, pyMul(p, q));
  }
}

// ── integer functions ─────────────────────────────────────────
const absBig = (n) => (n < 0n ? -n : n);
function gcdBig(a, b) {
  a = absBig(a);
  b = absBig(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
export function gcd(...args) {
  if (args.length === 0) return I(0);
  let res = asIndex(args[0]);
  if (args.length === 1) return { int: absBig(res) };
  res = absBig(res);
  for (let i = 1; i < args.length; i++) {
    const x = asIndex(args[i]);
    if (res === 1n) continue;
    res = gcdBig(res, x);
  }
  return { int: res };
}
export function lcm(...args) {
  if (args.length === 0) return I(1);
  let res = asIndex(args[0]);
  if (args.length === 1) return { int: absBig(res) };
  for (let i = 1; i < args.length; i++) {
    const x = asIndex(args[i]);
    if (res === 0n) continue;
    if (x === 0n) { res = 0n; continue; }
    res = absBig((res / gcdBig(res, x)) * x);
  }
  return { int: res };
}
export function isqrt(v) {
  const n = asIndex(v);
  if (n < 0n) raise('ValueError', 'isqrt() argument must be nonnegative');
  return { int: L.isqrtBig(n) };
}
function factBig(n) {
  let r = 1n;
  for (let i = 2n; i <= n; i++) r *= i;
  return r;
}
export function factorial(v) {
  const n = asIndex(v);
  if (n > LONG_MAX) raise('OverflowError', `factorial() argument should not exceed ${LONG_MAX}`);
  if (n < 0n) raise('ValueError', 'factorial() not defined for negative values');
  return { int: factBig(n) };
}
function fallingFactorial(n, k) {
  let r = 1n;
  for (let i = 0n; i < k; i++) r *= n - i;
  return r;
}
const LLONG_MAX = (1n << 63n) - 1n;
export function perm(nv, kv = null) {
  if (kv === null) return factorial(nv);
  const n = asIndex(nv);
  const k = asIndex(kv);
  if (n < 0n) raise('ValueError', 'n must be a non-negative integer');
  if (k < 0n) raise('ValueError', 'k must be a non-negative integer');
  if (n < k) return I(0);
  if (k > LLONG_MAX) raise('OverflowError', `k must not exceed ${LLONG_MAX}`);
  return { int: fallingFactorial(n, k) };
}
export function comb(nv, kv) {
  const n = asIndex(nv);
  let k = asIndex(kv);
  if (n < 0n) raise('ValueError', 'n must be a non-negative integer');
  if (k < 0n) raise('ValueError', 'k must be a non-negative integer');
  if (k > n) return I(0);
  if (n - k < k) k = n - k;
  if (k > LLONG_MAX) raise('OverflowError', `min(n - k, k) must not exceed ${LLONG_MAX}`);
  return { int: fallingFactorial(n, k) / factBig(k) };
}

// ── gamma / lgamma (CPython's own Lanczos code, Modules/mathmodule.c) ──
const LANCZOS_G = 6.024680040776729583740234375;
const LANCZOS_G_MINUS_HALF = 5.524680040776729583740234375;
const LANCZOS_NUM = [
  23531376880.410759688572007674451636754734846804940,
  42919803642.649098768957899047001988850926355848959,
  35711959237.355668049440185451547166705960488635843,
  17921034426.037209699919755754458931112671403265390,
  6039542586.3520280050642916443072979210699388420708,
  1439720407.3117216736632230727949123939715485786772,
  248874557.86205415651146038641322942321632125127801,
  31426415.585400194380614231628318205362874684987640,
  2876370.6289353724412254090516208496135991145378768,
  186056.26539522349504029498971604569928220784236328,
  8071.6720023658162106380029022722506138218516325024,
  210.82427775157934587250973392071336271166969580291,
  2.5066282746310002701649081771338373386264310793408,
];
const LANCZOS_DEN = [0.0, 39916800.0, 120543840.0, 150917976.0, 105258076.0, 45995730.0,
  13339535.0, 2637558.0, 357423.0, 32670.0, 1925.0, 66.0, 1.0];
const GAMMA_INTEGRAL = [1.0, 1.0, 2.0, 6.0, 24.0, 120.0, 720.0, 5040.0, 40320.0, 362880.0,
  3628800.0, 39916800.0, 479001600.0, 6227020800.0, 87178291200.0, 1307674368000.0,
  20922789888000.0, 355687428096000.0, 6402373705728000.0, 121645100408832000.0,
  2432902008176640000.0, 51090942171709440000.0, 1124000727777607680000.0];
const LOGPI = 1.144729885849400174143427351353058711647;

const cRound = (x) => { const t = Math.trunc(x); return Math.abs(x - t) >= 0.5 ? t + Math.sign(x) : t; };
function m_sinpi(x) {
  const y = Math.abs(x) % 2.0;
  const n = cRound(2.0 * y);
  let r;
  switch (n) {
    case 0: r = L.sin(Math.PI * y); break;
    case 1: r = L.cos(Math.PI * (y - 0.5)); break;
    case 2: r = L.sin(Math.PI * (1.0 - y)); break;
    case 3: r = -L.cos(Math.PI * (y - 1.5)); break;
    default: r = L.sin(Math.PI * (y - 2.0)); break;
  }
  return L.copysign(1.0, x) * r;
}
function lanczosSum(x) {
  let num = 0.0;
  let den = 0.0;
  if (x < 5.0) {
    for (let i = 12; i >= 0; i--) { num = num * x + LANCZOS_NUM[i]; den = den * x + LANCZOS_DEN[i]; }
  } else {
    for (let i = 0; i < 13; i++) { num = num / x + LANCZOS_NUM[i]; den = den / x + LANCZOS_DEN[i]; }
  }
  return num / den;
}
function m_tgamma(x) {
  if (!Number.isFinite(x)) {
    if (Number.isNaN(x) || x > 0.0) return [x, null];
    return [NaN, 'EDOM'];
  }
  if (x === 0.0) return [L.copysign(Infinity, x), 'EDOM'];
  if (x === Math.floor(x)) {
    if (x < 0.0) return [NaN, 'EDOM'];
    if (x <= 23) return [GAMMA_INTEGRAL[x - 1], null];
  }
  const absx = Math.abs(x);
  if (absx < 1e-20) {
    const r = 1.0 / x;
    return [r, Number.isFinite(r) ? null : 'ERANGE'];
  }
  if (absx > 200.0) {
    if (x < 0.0) return [0.0 / m_sinpi(x), null];
    return [Infinity, 'ERANGE'];
  }
  const y = absx + LANCZOS_G_MINUS_HALF;
  let z;
  if (absx > LANCZOS_G_MINUS_HALF) { const q = y - absx; z = q - LANCZOS_G_MINUS_HALF; } else { const q = y - LANCZOS_G_MINUS_HALF; z = q - absx; }
  z = z * LANCZOS_G / y;
  let r;
  if (x < 0.0) {
    r = -Math.PI / m_sinpi(absx) / absx * L.exp(y) / lanczosSum(absx);
    r -= z * r;
    if (absx < 140.0) r /= L.pow(y, absx - 0.5);
    else { const sp = L.pow(y, absx / 2.0 - 0.25); r /= sp; r /= sp; }
  } else {
    r = lanczosSum(absx) / L.exp(y);
    r += z * r;
    if (absx < 140.0) r *= L.pow(y, absx - 0.5);
    else { const sp = L.pow(y, absx / 2.0 - 0.25); r *= sp; r *= sp; }
  }
  return [r, Number.isFinite(r) ? null : 'ERANGE'];
}
function m_lgamma(x) {
  if (!Number.isFinite(x)) return [Number.isNaN(x) ? x : Infinity, null];
  if (x === Math.floor(x) && x <= 2.0) {
    if (x <= 0.0) return [Infinity, 'EDOM'];
    return [0.0, null];
  }
  const absx = Math.abs(x);
  if (absx < 1e-20) return [-L.log(absx), null];
  let r = L.log(lanczosSum(absx)) - LANCZOS_G;
  r += (absx - 0.5) * (L.log(absx + LANCZOS_G - 0.5) - 1);
  if (x < 0.0) r = LOGPI - L.log(Math.abs(m_sinpi(absx))) - L.log(absx) - r;
  return [r, Number.isFinite(r) ? null : 'ERANGE'];
}
export const gamma = (v) => math1a(v, m_tgamma);
export const lgamma = (v) => math1a(v, m_lgamma);

// ── the module namespace ──────────────────────────────────────
export const MODULE = {
  acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, comb, copysign, cos, cosh, degrees, dist,
  e, erf, erfc, exp, exp2, expm1, fabs, factorial, floor, fma, fmod, frexp, fsum, gamma, gcd, hypot,
  inf, isclose, isfinite, isinf, isnan, isqrt, lcm, ldexp, lgamma, log, log10, log1p, log2, modf, nan,
  nextafter, perm, pi, pow, prod, radians, remainder, sin, sinh, sqrt, sumprod, tan, tanh, tau, trunc, ulp,
};
export const CONSTANTS = ['pi', 'e', 'tau', 'inf', 'nan'];
const FN_NAMES = new Map(Object.entries(MODULE).filter(([, f]) => typeof f === 'function').map(([k, f]) => [f, k]));

// the module's own dunder attributes (dir(math) on Windows and Linux)
const BUILTIN_IMPORTER = { pyObject: 'BuiltinImporter', repr: "<class '_frozen_importlib.BuiltinImporter'>", call: 'BuiltinImporter() takes no arguments' };
const DUNDERS = {
  __doc__: 'This module provides access to the mathematical functions\ndefined by the C standard.',
  __loader__: BUILTIN_IMPORTER,
  __name__: 'math',
  __package__: '',
  __spec__: { pyObject: 'ModuleSpec', repr: "ModuleSpec(name='math', loader=<class '_frozen_importlib.BuiltinImporter'>, origin='built-in')", call: "'ModuleSpec' object is not callable" },
};
export const DIR = [...Object.keys(DUNDERS), ...Object.keys(MODULE)].sort();

// Did-you-mean for AttributeError, as Python/suggestions.c computes it
// (Levenshtein distance over UTF-8 bytes, case change costs 1, any other
// edit 2; at most a third of the characters may change)
const MOVE_COST = 2;
const CASE_COST = 1;
const MAX_STRING_SIZE = 40;
const utf8 = (str) => [...new TextEncoder().encode(str)];
const lowerByte = (b) => (b >= 65 && b <= 90 ? b + 32 : b);
const substitutionCost = (a, b) => {
  if ((a & 31) !== (b & 31)) return MOVE_COST;
  if (a === b) return 0;
  return lowerByte(a) === lowerByte(b) ? CASE_COST : MOVE_COST;
};
function levenshtein(a, b, maxCost) {
  while (a.length && b.length && a[0] === b[0]) { a = a.slice(1); b = b.slice(1); }
  while (a.length && b.length && a[a.length - 1] === b[b.length - 1]) { a = a.slice(0, -1); b = b.slice(0, -1); }
  if (!a.length || !b.length) return MOVE_COST * (a.length + b.length);
  if (a.length > MAX_STRING_SIZE || b.length > MAX_STRING_SIZE) return maxCost + 1;
  if (b.length < a.length) [a, b] = [b, a];
  if ((b.length - a.length) * MOVE_COST > maxCost) return maxCost + 1;
  const row = a.map((_, i) => (i + 1) * MOVE_COST);
  let result = 0;
  for (let bi = 0; bi < b.length; bi++) {
    const bc = b[bi];
    let distance = bi * MOVE_COST;
    result = distance;
    let minimum = Infinity;
    for (let i = 0; i < a.length; i++) {
      const sub = distance + substitutionCost(bc, a[i]);
      distance = row[i];
      const insDel = Math.min(result, distance) + MOVE_COST;
      result = Math.min(insDel, sub);
      row[i] = result;
      if (result < minimum) minimum = result;
    }
    if (minimum > maxCost) return maxCost + 1;
  }
  return result;
}
export function suggest(wrong, candidates) {
  const w = utf8(wrong);
  let best = Infinity;
  let suggestion = null;
  for (const name of candidates) {
    if (name === wrong) continue;
    const c = utf8(name);
    let maxDistance = Math.floor(((c.length + w.length + 3) * MOVE_COST) / 6);
    maxDistance = Math.min(maxDistance, best - 1);
    const d = levenshtein(w, c, maxDistance);
    if (d > maxDistance) continue;
    if (!suggestion || d < best) { suggestion = name; best = d; }
  }
  return suggestion;
}

// getattr(math, name)
export function attr(name) {
  if (Object.prototype.hasOwnProperty.call(MODULE, name)) return MODULE[name];
  if (Object.prototype.hasOwnProperty.call(DUNDERS, name)) return DUNDERS[name];
  const candidates = name.startsWith('_') ? DIR : DIR.filter((n) => !n.startsWith('_'));
  const s = suggest(name, candidates);
  raise('AttributeError', `module 'math' has no attribute '${name}'${s ? `. Did you mean: '${s}'?` : ''}`);
}
