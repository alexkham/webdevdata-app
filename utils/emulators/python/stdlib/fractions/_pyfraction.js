// utils/emulators/python/stdlib/fractions/_pyfraction.js
//
// A port of CPython 3.13's Lib/fractions.py for the snippet demos, plus the
// small part of the numeric tower around it that the demos need:
//
//   * Fraction — constructor (int, bool, Fraction, float, Decimal, str with
//     the exact _RATIONAL_FORMAT rules: Unicode digits and whitespace,
//     underscores, exponents), from_float / from_decimal, limit_denominator,
//     as_integer_ratio, is_integer, numerator / denominator, str / repr,
//     __format__ (3.13: general and float-style specs), round / floor /
//     ceil / trunc / int, every arithmetic operator with int, float and
//     Fraction on either side (the _operator_fallbacks dispatch), exact
//     comparisons with int, float and Fraction.
//   * Decimal — only what Fraction needs: Decimal(str) parsing (libmpdec's
//     rules after _decimal's numeric_as_ascii), repr, as_integer_ratio.
//   * Python int/float arithmetic for mixed expressions (true division of
//     ints is correctly rounded, like long_true_divide), delegated to the
//     math module port in ../math/_pymath.js where it already exists.
//
// Values follow _pymath.js: { int: bigint } | { float: number } | true/false
// | string | array (list) | { tuple: [...] } | null (None), plus Fraction
// and PyDecimal instances defined here. out() turns a value into what the
// snippet demo prints (its repr).
//
// Every error is CPython's exception type and message; str(int) and int(str)
// enforce the 4300-digit limit (sys.int_info.default_max_str_digits).

import * as M from '../math/_pymath.js';
import * as L from '../math/_libm.js';
import { raise } from '../../../../py-exceptions.js';
import { pyFloatRepr, pyStrRepr } from '../../../../demo-coerce.js';

export const { F, I, isInt, isFloat, isBool } = M;
export const isTuple = (v) => v !== null && typeof v === 'object' && Array.isArray(v.tuple);
export const T = (...items) => ({ tuple: items });

const absBig = (n) => (n < 0n ? -n : n);

// inputs the browser demo deliberately does not reproduce (huge exponents,
// widths, powers — CPython would take very long or run out of memory)
export function demoLimit(what) {
  const e = new Error(`not emulated: ${what} is too large for the in-browser demo`);
  e.name = 'DemoLimit';
  throw e;
}

// ── ints ──────────────────────────────────────────────────────
const MAX_STR_DIGITS = 4300;
let TEN_LIMIT = null;
// str(int): refuses more than 4300 digits
export function intStr(n) {
  if (TEN_LIMIT === null) TEN_LIMIT = 10n ** BigInt(MAX_STR_DIGITS);
  if (absBig(n) >= TEN_LIMIT) {
    raise('ValueError', `Exceeds the limit (${MAX_STR_DIGITS} digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return n.toString();
}

// Unicode decimal digits as CPython 3.13 (Unicode 15.1) knows them: 68 runs
// of 0..9, listed by their zero so the result does not depend on the
// browser's Unicode version.
const ND_ZEROS = [
  0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xde6, 0xe50, 0xed0, 0xf20,
  0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0, 0x1c40, 0x1c50, 0xa620, 0xa8d0,
  0xa900, 0xa9d0, 0xa9f0, 0xaa50, 0xabf0, 0xff10, 0x104a0, 0x10d30, 0x11066, 0x110f0, 0x11136, 0x111d0, 0x112f0,
  0x11450, 0x114d0, 0x11650, 0x116c0, 0x11730, 0x118e0, 0x11950, 0x11c50, 0x11d50, 0x11da0, 0x11f50, 0x16a60,
  0x16ac0, 0x16b50, 0x1d7ce, 0x1d7d8, 0x1d7e2, 0x1d7ec, 0x1d7f6, 0x1e140, 0x1e2f0, 0x1e4f0, 0x1e950, 0x1fbf0,
];
// digit value of one code point, or -1 (Py_UNICODE_TODECIMAL)
export function digitValue(cp) {
  for (const z of ND_ZEROS) if (cp >= z && cp <= z + 9) return cp - z;
  return -1;
}
const hex = (n) => n.toString(16);
const ND_CLASS = ND_ZEROS.map((z) => `\\u{${hex(z)}}-\\u{${hex(z + 9)}}`).join('');
// str.isspace(): what \s matches in a str pattern
const WS_CLASS = '\\t\\n\\v\\f\\r\\x1c-\\x20\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000';
const WS_RE = new RegExp(`^[${WS_CLASS}]$`, 'u');
export const isPySpace = (ch) => WS_RE.test(ch);

// int() of a run of (Unicode) digits with optional sign and underscores, as
// matched by the regex — so only the digit limit can fail
function intOfDigits(text) {
  let neg = false;
  let s = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (ch === '-') neg = true;
    else if (ch === '+' || ch === '_') continue;
    else s += String(digitValue(cp));
  }
  if (s.length > MAX_STR_DIGITS) {
    raise('ValueError', `Exceeds the limit (${MAX_STR_DIGITS} digits) for integer string conversion: value has ${s.length} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  const n = BigInt(s);
  return neg ? -n : n;
}

export function gcd(a, b) {
  a = absBig(a);
  b = absBig(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
export function floorDiv(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'integer division or modulo by zero');
  let q = a / b;
  if (a % b !== 0n && ((a < 0n) !== (b < 0n))) q -= 1n;
  return q;
}
export function floorMod(a, b) {
  if (b === 0n) raise('ZeroDivisionError', 'integer modulo by zero');
  let r = a % b;
  if (r !== 0n && ((r < 0n) !== (b < 0n))) r += b;
  return r;
}
const BIG_POW_BITS = 4000000;
function bigPow(base, exp) {
  // exp >= 0n
  if (exp > 1n && absBig(base) > 1n && BigInt(L.bitLen(absBig(base))) * exp > BigInt(BIG_POW_BITS)) {
    demoLimit('this power');
  }
  return base ** exp;
}
const TEN_MAX_EXP = 100000n;
function pow10(k) {
  if (k > TEN_MAX_EXP) demoLimit('an exponent beyond 100000');
  return 10n ** k;
}

// ── floats ────────────────────────────────────────────────────
// float.as_integer_ratio()
export function floatRatio(x) {
  if (Number.isNaN(x)) raise('ValueError', 'cannot convert NaN to integer ratio');
  if (!Number.isFinite(x)) raise('OverflowError', 'cannot convert Infinity to integer ratio');
  if (x === 0) return [0n, 1n];
  const d = L.decompose(x);
  let m = d.m;
  let e = d.e;
  while (e < 0 && (m & 1n) === 0n) { m >>= 1n; e += 1; }
  if (e >= 0) return [(d.neg ? -m : m) << BigInt(e), 1n];
  return [d.neg ? -m : m, 1n << BigInt(-e)];
}

// n / d for ints, correctly rounded (long_true_divide); d > 0
export function ratioToFloat(n, d) {
  if (n === 0n) return 0;
  const r = L.roundFrac(absBig(n), d, 0, n < 0n);
  if (!Number.isFinite(r)) raise('OverflowError', 'integer division result too large for a float');
  return r;
}

// ── Decimal (only what Fraction needs) ───────────────────────
export class PyDecimal {
  // kind: 'finite' | 'inf' | 'nan' | 'snan'; coeff/payload: bigint digits
  constructor(sign, kind, coeff = 0n, exp = 0n, digits = null) {
    this.sign = sign;
    this.kind = kind;
    this.coeff = coeff;
    this.exp = exp;
    this.digits = digits === null ? coeff.toString() : digits;
  }
}

const decSyntax = () => {
  const e = new Error("[<class 'decimal.ConversionSyntax'>]");
  e.name = 'decimal.InvalidOperation';
  throw e;
};

// decimal.Decimal(str)
export function decimalFromStr(s) {
  // numeric_as_ascii(u, strip_ws=1, ignore_underscores=1): strip Unicode
  // whitespace at both ends first, then drop every underscore
  const chars = [...s];
  let lo = 0;
  let hi = chars.length;
  while (hi > 0 && isPySpace(chars[hi - 1])) hi -= 1;
  while (lo < hi && isPySpace(chars[lo])) lo += 1;
  let a = '';
  for (const ch of chars.slice(lo, hi)) {
    const cp = ch.codePointAt(0);
    if (ch === '_') continue;
    if (cp > 0 && cp <= 127) { a += ch; continue; }
    if (isPySpace(ch)) { a += ' '; continue; }
    const d = digitValue(cp);
    if (d < 0) decSyntax();
    a += String(d);
  }
  const m = /^([+-]?)(?:(inf|infinity)|(s?nan)(\d*)|(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?)$/i.exec(a);
  if (!m) decSyntax();
  const sign = m[1] === '-' ? 1 : 0;
  if (m[2]) return new PyDecimal(sign, 'inf');
  if (m[3]) {
    const payload = m[4] ? BigInt(m[4]) : 0n;
    return new PyDecimal(sign, m[3].toLowerCase() === 'snan' ? 'snan' : 'nan', payload);
  }
  const intPart = m[5] || '';
  const fracPart = m[6] || '';
  if (intPart === '' && fracPart === '') decSyntax();
  let exp = m[7] ? BigInt(m[7]) : 0n;
  if (absBig(exp) > 1000000n) demoLimit('a Decimal exponent beyond 1000000');
  exp -= BigInt(fracPart.length);
  let digits = (intPart + fracPart).replace(/^0+(?=\d)/, '');
  return new PyDecimal(sign, 'finite', BigInt(digits), exp, digits);
}

// str(Decimal) — to-scientific-string
export function decimalStr(v) {
  const sgn = v.sign ? '-' : '';
  if (v.kind === 'inf') return `${sgn}Infinity`;
  if (v.kind === 'nan' || v.kind === 'snan') {
    return `${sgn}${v.kind === 'snan' ? 'sNaN' : 'NaN'}${v.coeff ? v.coeff.toString() : ''}`;
  }
  const digits = v.digits;
  const e = Number(v.exp);
  const adjusted = e + digits.length - 1;
  if (e <= 0 && adjusted >= -6) {
    if (e === 0) return sgn + digits;
    const k = digits.length + e;
    if (k > 0) return `${sgn}${digits.slice(0, k)}.${digits.slice(k)}`;
    return `${sgn}0.${'0'.repeat(-k)}${digits}`;
  }
  const rest = digits.slice(1);
  return `${sgn}${digits[0]}${rest ? '.' + rest : ''}E${adjusted >= 0 ? '+' : '-'}${Math.abs(adjusted)}`;
}
export const decimalRepr = (v) => `Decimal('${decimalStr(v)}')`;

export function decimalRatio(v) {
  if (v.kind === 'nan' || v.kind === 'snan') raise('ValueError', 'cannot convert NaN to integer ratio');
  if (v.kind === 'inf') raise('OverflowError', 'cannot convert Infinity to integer ratio');
  let n = v.coeff;
  let d = 1n;
  if (v.exp >= 0n) n *= pow10(v.exp);
  else d = pow10(-v.exp);
  const g = gcd(n, d);
  if (n === 0n) return [0n, 1n];
  n /= g;
  d /= g;
  return [v.sign ? -n : n, d];
}

// ── Fraction ──────────────────────────────────────────────────
export class Fraction {
  // _from_coprime_ints: n and d coprime, d > 0
  constructor(n, d) {
    this.n = n;
    this.d = d;
  }
}
export const isFrac = (v) => v instanceof Fraction;
export const isDec = (v) => v instanceof PyDecimal;
const intOf = (v) => (isBool(v) ? (v ? 1n : 0n) : v.int);
const isIntegral = (v) => isInt(v) || isBool(v);
// numbers.Rational: int, bool, Fraction
const isRational = (v) => isIntegral(v) || isFrac(v);
const ratioOf = (v) => (isFrac(v) ? [v.n, v.d] : [intOf(v), 1n]);

export function typeName(v) {
  if (isFrac(v)) return 'Fraction';
  if (isDec(v)) return 'Decimal';
  if (v && typeof v === 'object' && v.pyType) return v.pyType;
  return M.typeName(v);
}

// _RATIONAL_FORMAT, with Python's \s and \d (Unicode 15.1)
const S = `[${WS_CLASS}]`;
const D = `[${ND_CLASS}]`;
const RATIONAL_RE = new RegExp(
  `^${S}*(?<sign>[-+]?)(?=${D}|\\.${D})(?<num>${D}*|${D}+(?:_${D}+)*)`
  + `(?:(?:${S}*/${S}*(?<denom>${D}+(?:_${D}+)*))?|(?:\\.(?<decimal>${D}*|${D}+(?:_${D}+)*))?(?:E(?<exp>[-+]?${D}+(?:_${D}+)*))?)${S}*$`,
  'iu',
);

function normalize(numerator, denominator) {
  if (denominator === 0n) raise('ZeroDivisionError', `Fraction(${intStr(numerator)}, 0)`);
  let g = gcd(numerator, denominator);
  if (denominator < 0n) g = -g;
  return new Fraction(numerator / g, denominator / g);
}

// Fraction(numerator=0, denominator=None)
export function fraction(numerator = I(0), denominator = null) {
  let n;
  let d;
  if (denominator === null) {
    if (isInt(numerator)) return new Fraction(numerator.int, 1n);
    if (isRational(numerator)) {
      const [a, b] = ratioOf(numerator);
      return new Fraction(a, b);
    }
    if (isFloat(numerator)) {
      const [a, b] = floatRatio(numerator.float);
      return new Fraction(a, b);
    }
    if (isDec(numerator)) {
      const [a, b] = decimalRatio(numerator);
      return new Fraction(a, b);
    }
    if (typeof numerator === 'string') {
      const m = RATIONAL_RE.exec(numerator);
      if (m === null) raise('ValueError', `Invalid literal for Fraction: ${pyStrRepr(numerator)}`);
      const g = m.groups;
      n = intOfDigits(g.num || '0');
      if (g.denom) d = intOfDigits(g.denom);
      else {
        d = 1n;
        if (g.decimal) {
          const dec = g.decimal.replace(/_/g, '');
          const scale = pow10(BigInt([...dec].length));
          n = n * scale + intOfDigits(dec);
          d *= scale;
        }
        if (g.exp) {
          const e = intOfDigits(g.exp);
          if (e >= 0n) n *= pow10(e);
          else d *= pow10(-e);
        }
      }
      if (g.sign === '-') n = -n;
    } else {
      raise('TypeError', 'argument should be a string or a Rational instance');
    }
  } else if (isInt(numerator) && isInt(denominator)) {
    n = numerator.int;
    d = denominator.int;
  } else if (isRational(numerator) && isRational(denominator)) {
    const [a, b] = ratioOf(numerator);
    const [c, e] = ratioOf(denominator);
    n = a * e;
    d = c * b;
  } else {
    raise('TypeError', 'both arguments should be Rational instances');
  }
  return normalize(n, d);
}

// Fraction.from_float(f)
export function fromFloat(f) {
  if (isIntegral(f)) return fraction(f);
  if (!isFloat(f)) raise('TypeError', `Fraction.from_float() only takes floats, not ${reprOf(f)} (${typeName(f)})`);
  const [a, b] = floatRatio(f.float);
  return new Fraction(a, b);
}

// Fraction.from_decimal(dec)
export function fromDecimal(dec) {
  if (isIntegral(dec)) {
    const n = intOf(dec);
    dec = new PyDecimal(n < 0n ? 1 : 0, 'finite', absBig(n), 0n);
  } else if (!isDec(dec)) {
    raise('TypeError', `Fraction.from_decimal() only takes Decimals, not ${reprOf(dec)} (${typeName(dec)})`);
  }
  const [a, b] = decimalRatio(dec);
  return new Fraction(a, b);
}

export const isInteger = (f) => f.d === 1n;
export const asIntegerRatio = (f) => T(I(f.n), I(f.d));

// Fraction.limit_denominator(max_denominator=1000000)
export function limitDenominator(f, maxDen = I(1000000)) {
  if (!isIntegral(maxDen)) demoLimit('a non-int max_denominator');
  const M_ = intOf(maxDen);
  if (M_ < 1n) raise('ValueError', 'max_denominator should be at least 1');
  if (f.d <= M_) return new Fraction(f.n, f.d);
  let p0 = 0n; let q0 = 1n; let p1 = 1n; let q1 = 0n;
  let n = f.n; let d = f.d;
  for (;;) {
    const a = floorDiv(n, d);
    const q2 = q0 + a * q1;
    if (q2 > M_) break;
    [p0, q0, p1, q1] = [p1, q1, p0 + a * p1, q2];
    [n, d] = [d, n - a * d];
  }
  const k = floorDiv(M_ - q0, q1);
  if (2n * d * (q0 + k * q1) <= f.d) return new Fraction(p1, q1);
  return new Fraction(p0 + k * p1, q0 + k * q1);
}

export const fracRepr = (f) => `Fraction(${intStr(f.n)}, ${intStr(f.d)})`;
export const fracStr = (f) => (f.d === 1n ? intStr(f.n) : `${intStr(f.n)}/${intStr(f.d)}`);
// float(fraction) — numbers.Rational.__float__: int / int
export const fracToFloat = (f) => ratioToFloat(f.n, f.d);

// ── generic repr / out ────────────────────────────────────────
export function reprOf(v) {
  if (isFrac(v)) return fracRepr(v);
  if (isDec(v)) return decimalRepr(v);
  if (isInt(v)) return intStr(v.int);
  if (isFloat(v)) return pyFloatRepr(v.float);
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (v === null || v === undefined) return 'None';
  if (typeof v === 'string') return pyStrRepr(v);
  if (Array.isArray(v)) return `[${v.map(reprOf).join(', ')}]`;
  if (isTuple(v)) return `(${v.tuple.map(reprOf).join(', ')}${v.tuple.length === 1 ? ',' : ''})`;
  if (v && typeof v === 'object' && v.complex) return M.reprOf(v);
  if (v && typeof v === 'object' && typeof v.repr === 'function') return v.repr();
  if (v && typeof v === 'object' && v.pyObject) return v.repr;
  return String(v);
}
// Python value → what the snippet demo prints (pyReprExact input)
export function out(v) {
  if (isFrac(v) || isDec(v) || isFloat(v)) return { __pyRaw: reprOf(v) };
  if (isInt(v)) return BigInt(intStr(v.int));
  if (isTuple(v)) return { __pyTuple: v.tuple.map(out) };
  if (Array.isArray(v)) return v.map(out);
  if (v && typeof v === 'object' && (typeof v.repr === 'function' || v.complex)) {
    return v.complex ? M.out(v) : { __pyRaw: v.repr() };
  }
  return v;
}

// A number typed into a demo, read the way CPython reads its literal text
export const lit = M.lit;
export const litFloat = M.litFloat;

// ── arithmetic ────────────────────────────────────────────────
const toDouble = (v) => (isFrac(v) ? fracToFloat(v) : M.asDouble(v));
const numeric = (v) => isIntegral(v) || isFloat(v) || isFrac(v);

function fAdd(a, b) {
  const g = gcd(a.d, b.d);
  if (g === 1n) return new Fraction(a.n * b.d + a.d * b.n, a.d * b.d);
  const s = a.d / g;
  const t = a.n * (b.d / g) + b.n * s;
  const g2 = gcd(t, g);
  if (g2 === 1n) return new Fraction(t, s * b.d);
  return new Fraction(t / g2, s * (b.d / g2));
}
function fSub(a, b) {
  return fAdd(a, new Fraction(-b.n, b.d));
}
function fMul(a, b) {
  let na = a.n; let da = a.d; let nb = b.n; let db = b.d;
  const g1 = gcd(na, db);
  if (g1 > 1n) { na /= g1; db /= g1; }
  const g2 = gcd(nb, da);
  if (g2 > 1n) { nb /= g2; da /= g2; }
  return new Fraction(na * nb, db * da);
}
function fDiv(a, b) {
  let nb = b.n; let db = b.d;
  if (nb === 0n) raise('ZeroDivisionError', `Fraction(${intStr(db)}, 0)`);
  let na = a.n; let da = a.d;
  const g1 = gcd(na, nb);
  if (g1 > 1n) { na /= g1; nb /= g1; }
  const g2 = gcd(db, da);
  if (g2 > 1n) { da /= g2; db /= g2; }
  let n = na * db;
  let d = nb * da;
  if (d < 0n) { n = -n; d = -d; }
  return new Fraction(n, d);
}
const fFloorDiv = (a, b) => I(floorDiv(a.n * b.d, a.d * b.n));
function fDivmod(a, b) {
  const da = a.d; const db = b.d;
  const x = a.n * db; const y = da * b.n;
  const div = floorDiv(x, y);
  return T(I(div), normalize(x - div * y, da * db));
}
const fMod = (a, b) => normalize(floorMod(a.n * b.d, b.n * a.d), a.d * b.d);
function fPow(a, b) {
  // b: a Rational (Fraction or int) or float
  if (isRational(b)) {
    const [bn, bd] = ratioOf(b);
    if (bd === 1n) {
      const power = bn;
      if (power >= 0n) return new Fraction(bigPow(a.n, power), bigPow(a.d, power));
      if (a.n > 0n) return new Fraction(bigPow(a.d, -power), bigPow(a.n, -power));
      if (a.n === 0n) raise('ZeroDivisionError', `Fraction(${intStr(bigPow(a.d, -power))}, 0)`);
      return new Fraction(bigPow(-a.d, -power), bigPow(-a.n, -power));
    }
    return M.pyPow(F(fracToFloat(a)), F(ratioToFloat(bn, bd)));
  }
  return M.pyPow(F(fracToFloat(a)), b);
}
// b ** a where a is a Fraction and b is not (Fraction.__rpow__)
function fRpow(a, b) {
  if (a.d === 1n && a.n >= 0n) return pyPow(b, I(a.n));
  if (isRational(b)) return fPow(fraction(b), a);
  if (a.d === 1n) return pyPow(b, I(a.n));
  return pyPow(b, F(fracToFloat(a)));
}

const OPS = {
  '+': { frac: fAdd, num: M.pyAdd, fallback: (x, y) => F(x + y), complexOk: true },
  '-': { frac: fSub, num: (x, y) => M.pyAdd(x, neg(y)), fallback: (x, y) => F(x - y), complexOk: true },
  '*': { frac: fMul, num: M.pyMul, fallback: (x, y) => F(x * y), complexOk: true },
  '/': { frac: fDiv, num: M.pyTrueDiv, fallback: (x, y) => M.pyTrueDiv(F(x), F(y)), complexOk: true },
  '//': { frac: fFloorDiv, num: (x, y) => numFloorDiv(x, y), fallback: (x, y) => numFloorDiv(F(x), F(y)) },
  '%': { frac: fMod, num: (x, y) => numMod(x, y), fallback: (x, y) => numMod(F(x), F(y)) },
  divmod: { frac: fDivmod, num: numDivmod, fallback: (x, y) => numDivmod(F(x), F(y)) },
};

// _float_div_mod (Objects/floatobject.c). C truthiness: a NaN is "true",
// so `if (mod)` is written mod !== 0 (NaN !== 0) — JS `if (NaN)` is false.
function floatDivMod(vx, wx) {
  let mod = vx % wx; // C fmod
  let div = (vx - mod) / wx;
  if (mod !== 0) {
    if ((wx < 0) !== (mod < 0)) { mod += wx; div -= 1.0; }
  } else mod = L.copysign(0.0, wx);
  let fd;
  if (div !== 0) {
    fd = Math.floor(div);
    if (div - fd > 0.5) fd += 1.0;
  } else fd = L.copysign(0.0, vx / wx);
  return [fd, mod];
}
// x // y, x % y, divmod(x, y) for ints and floats (long_* / float_*)
function numFloorDiv(a, b) {
  if (isIntegral(a) && isIntegral(b)) return I(floorDiv(intOf(a), intOf(b)));
  const vx = M.asDouble(a);
  const wx = M.asDouble(b);
  if (wx === 0) raise('ZeroDivisionError', 'float floor division by zero');
  return F(floatDivMod(vx, wx)[0]);
}
function numMod(a, b) {
  if (isIntegral(a) && isIntegral(b)) return I(floorMod(intOf(a), intOf(b)));
  const vx = M.asDouble(a);
  const wx = M.asDouble(b);
  if (wx === 0) raise('ZeroDivisionError', 'float modulo by zero');
  let mod = vx % wx;
  if (mod !== 0) {
    if ((wx < 0) !== (mod < 0)) mod += wx;
  } else mod = L.copysign(0.0, wx);
  return F(mod);
}
function numDivmod(a, b) {
  if (isIntegral(a) && isIntegral(b)) {
    const x = intOf(a);
    const y = intOf(b);
    return T(I(floorDiv(x, y)), I(floorMod(x, y)));
  }
  const vx = M.asDouble(a);
  const wx = M.asDouble(b);
  if (wx === 0) raise('ZeroDivisionError', 'float divmod()');
  const [fd, mod] = floatDivMod(vx, wx);
  return T(F(fd), F(mod));
}

const opName = { '+': '+', '-': '-', '*': '*', '/': '/', '//': '//', '%': '%', divmod: 'divmod()' };
function unsupported(op, a, b) {
  raise('TypeError', `unsupported operand type(s) for ${opName[op]}: '${typeName(a)}' and '${typeName(b)}'`);
}

// a <op> b with Python's dispatch
export function binop(op, a, b) {
  const o = OPS[op];
  if (isFrac(a)) {
    if (isFrac(b)) return o.frac(a, b);
    if (isIntegral(b)) return o.frac(a, fraction(b));
    if (isFloat(b)) return o.fallback(fracToFloat(a), b.float);
    // other types: their reflected method decides; none of ours handle it
    if (op === '*' && (typeof b === 'string' || Array.isArray(b))) raise('TypeError', `can't multiply sequence by non-int of type 'Fraction'`);
    return unsupported(op, a, b);
  }
  if (isFrac(b)) {
    if (isRational(a)) return o.frac(fraction(a), b);
    if (isFloat(a)) return o.fallback(a.float, fracToFloat(b));
    if (op === '*' && (typeof a === 'string' || Array.isArray(a))) raise('TypeError', `can't multiply sequence by non-int of type 'Fraction'`);
    if (op === '+' && typeof a === 'string') raise('TypeError', 'can only concatenate str (not "Fraction") to str');
    return unsupported(op, a, b);
  }
  if (numeric(a) && numeric(b)) return o.num(a, b);
  if (op === '+' || op === '*') return o.num(a, b); // str/list behaviour and errors
  return unsupported(op, a, b);
}
export const add = (a, b) => binop('+', a, b);
export const sub = (a, b) => binop('-', a, b);
export const mul = (a, b) => binop('*', a, b);
export const truediv = (a, b) => binop('/', a, b);
export const floordiv = (a, b) => binop('//', a, b);
export const mod = (a, b) => binop('%', a, b);
export const divmod = (a, b) => binop('divmod', a, b);

export function pyPow(a, b) {
  if (isFrac(a)) {
    if (isRational(b) || isFloat(b)) return fPow(a, b);
    raise('TypeError', `unsupported operand type(s) for ** or pow(): 'Fraction' and '${typeName(b)}'`);
  }
  if (isFrac(b)) {
    if (isRational(a) || isFloat(a)) return fRpow(b, a);
    raise('TypeError', `unsupported operand type(s) for ** or pow(): '${typeName(a)}' and 'Fraction'`);
  }
  if (isIntegral(a) && isIntegral(b) && intOf(b) >= 0n) return I(bigPow(intOf(a), intOf(b)));
  return M.pyPow(a, b);
}

export function neg(v) {
  if (isFrac(v)) return new Fraction(-v.n, v.d);
  if (isIntegral(v)) return I(-intOf(v));
  if (isFloat(v)) return F(-v.float);
  raise('TypeError', `bad operand type for unary -: '${typeName(v)}'`);
}
export function pyAbs(v) {
  if (isFrac(v)) return new Fraction(absBig(v.n), v.d);
  if (isIntegral(v)) return I(absBig(intOf(v)));
  if (isFloat(v)) return F(Math.abs(v.float));
  raise('TypeError', `bad operand type for abs(): '${typeName(v)}'`);
}

// float(x) for int, bool, float, Fraction
export function toFloat(v) {
  if (isFloat(v)) return v.float;
  if (isFrac(v)) return fracToFloat(v);
  if (isIntegral(v)) return M.intToFloat(intOf(v));
  raise('TypeError', `float() argument must be a string or a real number, not '${typeName(v)}'`);
}
export const asDouble = toDouble;

// ── comparisons (exact, as CPython does them) ─────────────────
// exact rational of a finite number value; null for nan/inf
function exactOf(v) {
  if (isFrac(v)) return [v.n, v.d];
  if (isIntegral(v)) return [intOf(v), 1n];
  if (isFloat(v)) return Number.isFinite(v.float) ? floatRatio(v.float) : null;
  return undefined;
}
// -1 / 0 / 1, or NaN when unordered (a NaN is involved); TypeError for
// non-numbers (str with str compares as text)
// str comparison by code point (JS < compares UTF-16 code units)
function strCmp(a, b) {
  const x = [...a];
  const y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (x[i] !== y[i]) return x[i].codePointAt(0) < y[i].codePointAt(0) ? -1 : 1;
  }
  return x.length < y.length ? -1 : x.length > y.length ? 1 : 0;
}

export function cmp(a, b, opText = '<') {
  if (typeof a === 'string' && typeof b === 'string') return strCmp(a, b);
  const ea = exactOf(a);
  const eb = exactOf(b);
  if (ea === undefined || eb === undefined) {
    raise('TypeError', `'${opText}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
  }
  if (ea === null || eb === null) {
    const x = ea === null ? a.float : 0;
    const y = eb === null ? b.float : 0;
    if (Number.isNaN(x) || Number.isNaN(y)) return NaN;
    return x < y ? -1 : x > y ? 1 : 0;
  }
  const l = ea[0] * eb[1];
  const r = eb[0] * ea[1];
  return l < r ? -1 : l > r ? 1 : 0;
}
export const lt = (a, b) => cmp(a, b, '<') === -1;
export const le = (a, b) => { const c = cmp(a, b, '<='); return c === -1 || c === 0; };
export const gt = (a, b) => cmp(a, b, '>') === 1;
export const ge = (a, b) => { const c = cmp(a, b, '>='); return c === 1 || c === 0; };
// a == b (never raises for mixed types)
export function eq(a, b) {
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  const ea = exactOf(a);
  const eb = exactOf(b);
  if (ea === undefined || eb === undefined) return a === b;
  return cmp(a, b) === 0;
}
export const truthy = (v) => {
  if (isFrac(v)) return v.n !== 0n;
  if (isIntegral(v)) return intOf(v) !== 0n;
  if (isFloat(v)) return v.float !== 0;
  if (v === null) return false;
  if (typeof v === 'string' || Array.isArray(v)) return v.length > 0;
  return true;
};

// ── rounding ──────────────────────────────────────────────────
export const fracFloor = (f) => I(floorDiv(f.n, f.d));
export const fracCeil = (f) => I(-floorDiv(-f.n, f.d));
export const fracTrunc = (f) => I(f.n < 0n ? -floorDiv(-f.n, f.d) : floorDiv(f.n, f.d));

// round(fraction) / round(fraction, ndigits)
export function fracRound(f, ndigits = null) {
  if (ndigits === null) {
    const d = f.d;
    const floor = floorDiv(f.n, d);
    const rem = f.n - floor * d;
    if (rem * 2n < d) return I(floor);
    if (rem * 2n > d) return I(floor + 1n);
    return I(floor % 2n === 0n ? floor : floor + 1n);
  }
  const nd = intOf(ndigits);
  if (absBig(nd) > TEN_MAX_EXP) demoLimit('ndigits beyond 100000');
  const shift = 10n ** absBig(nd);
  if (nd > 0n) return normalize(fracRound(fMul(f, new Fraction(shift, 1n))).int, shift);
  const r = fracRound(fDiv(f, new Fraction(shift, 1n))).int * shift;
  return new Fraction(r, 1n);
}

// ── __format__ (3.13) ─────────────────────────────────────────
const GENERAL_SPEC = /^(?:(?<fill>[\s\S])?(?<align>[<>=^]))?(?<sign>[-+ ]?)(?<alt>#)?(?<minimumwidth>0|[1-9][0-9]*)?(?<thousands_sep>[,_])?$/u;
const FLOAT_SPEC = /^(?:(?<fill>[\s\S])?(?<align>[<>=^]))?(?<sign>[-+ ]?)(?<no_neg_zero>z)?(?<alt>#)?(?<zeropad>0(?=[0-9]))?(?<minimumwidth>0|[1-9][0-9]*)?(?<thousands_sep>[,_])?(?:\.(?<precision>0|[1-9][0-9]*))?(?<presentation_type>[eEfFgG%])$/u;

const cps = (s) => [...s];
function group3(digits, sep) {
  if (!sep) return digits;
  const first = 1 + ((digits.length - 1) % 3);
  let out = digits.slice(0, first);
  for (let p = first; p < digits.length; p += 3) out += sep + digits.slice(p, p + 3);
  return out;
}
function widthOf(spec) {
  const w = Number(spec || '0');
  if (w > 100000) demoLimit('a width beyond 100000');
  return w;
}
function pad(fill, align, minimumwidth, sign, body) {
  const n = minimumwidth - cps(sign).length - cps(body).length;
  const padding = n > 0 ? fill.repeat(n) : '';
  if (align === '>') return padding + sign + body;
  if (align === '<') return sign + body + padding;
  if (align === '^') {
    const p = cps(padding);
    const half = Math.floor(p.length / 2);
    return p.slice(0, half).join('') + sign + body + p.slice(half).join('');
  }
  return sign + padding + body;
}

function roundToExponent(n, d, exponent, noNegZero = false) {
  if (exponent >= 0) d *= pow10(BigInt(exponent));
  else n *= pow10(BigInt(-exponent));
  let q = floorDiv(n + (d >> 1n), d);
  const r = n + (d >> 1n) - q * d;
  if (r === 0n && (d & 1n) === 0n) q &= -2n;
  const sign = noNegZero ? q < 0n : n < 0n;
  return [sign, absBig(q)];
}
function roundToFigures(n, d, figures) {
  if (n === 0n) return [false, 0n, 1 - figures];
  const strN = intStr(absBig(n));
  const strD = intStr(d);
  const m = strN.length - strD.length + (strD <= strN ? 1 : 0);
  let exponent = m - figures;
  let [sign, significand] = roundToExponent(n, d, exponent);
  if (intStr(significand).length === figures + 1) {
    significand /= 10n;
    exponent += 1;
  }
  return [sign, significand, exponent];
}

function formatGeneral(f, g) {
  const fill = g.fill || ' ';
  const align = g.align || '>';
  const posSign = g.sign === '-' ? '' : g.sign;
  const alternate = Boolean(g.alt);
  const minimumwidth = widthOf(g.minimumwidth);
  const sep = g.thousands_sep || '';
  const body = f.d > 1n || alternate
    ? `${group3(intStr(absBig(f.n)), sep)}/${group3(intStr(f.d), sep)}`
    : group3(intStr(absBig(f.n)), sep);
  const sign = f.n < 0n ? '-' : posSign;
  return pad(fill, align, minimumwidth, sign, body);
}

function formatFloatStyle(f, g) {
  const fill = g.fill || ' ';
  const align = g.align || '>';
  const posSign = g.sign === '-' ? '' : g.sign;
  const noNegZero = Boolean(g.no_neg_zero);
  const alternate = Boolean(g.alt);
  const zeropad = Boolean(g.zeropad);
  const minimumwidth = widthOf(g.minimumwidth);
  const sep = g.thousands_sep;
  const precision = Number(g.precision || '6');
  if (precision > 20000) demoLimit('a precision beyond 20000');
  const type = g.presentation_type;
  const trimZeros = 'gG'.includes(type) && !alternate;
  const trimPoint = !alternate;
  const expIndicator = 'EFG'.includes(type) ? 'E' : 'e';

  let negative; let significand; let exponent; let scientific; let pointPos;
  if ('fF%'.includes(type)) {
    exponent = -precision;
    if (type === '%') exponent -= 2;
    [negative, significand] = roundToExponent(f.n, f.d, exponent, noNegZero);
    scientific = false;
    pointPos = precision;
  } else {
    const figures = 'gG'.includes(type) ? Math.max(precision, 1) : precision + 1;
    [negative, significand, exponent] = roundToFigures(f.n, f.d, figures);
    scientific = 'eE'.includes(type) || exponent > 0 || exponent + figures <= -4;
    pointPos = scientific ? figures - 1 : -exponent;
  }
  let suffix = '';
  if (type === '%') suffix = '%';
  else if (scientific) {
    const e = exponent + pointPos;
    suffix = `${expIndicator}${e < 0 ? '-' : '+'}${String(Math.abs(e)).padStart(2, '0')}`;
  }
  const digits = intStr(significand).padStart(pointPos + 1, '0');
  const sign = negative ? '-' : posSign;
  let leading = digits.slice(0, digits.length - pointPos);
  let fracPart = digits.slice(digits.length - pointPos);
  if (trimZeros) fracPart = fracPart.replace(/0+$/, '');
  const separator = trimPoint && !fracPart ? '' : '.';
  const trailing = separator + fracPart + suffix;
  if (zeropad) {
    const minLeading = minimumwidth - cps(sign).length - trailing.length;
    const width = sep ? Math.floor((3 * minLeading) / 4) + 1 : minLeading;
    leading = leading.padStart(width, '0');
  }
  if (sep) leading = group3(leading, sep);
  return pad(fill, align, minimumwidth, sign, leading + trailing);
}

// format(fraction, spec)
export function fracFormat(f, spec) {
  let m = GENERAL_SPEC.exec(spec);
  if (m) return formatGeneral(f, m.groups);
  m = FLOAT_SPEC.exec(spec);
  if (m && (m.groups.align === undefined || m.groups.zeropad === undefined)) return formatFloatStyle(f, m.groups);
  raise('ValueError', `Invalid format specifier ${pyStrRepr(spec)} for object of type 'Fraction'`);
}
