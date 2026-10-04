// utils/emulators/python/stdlib/random/_pyrandom.js
//
// A port of CPython's random module (3.12 / 3.13) for the snippet demos:
//
//   * Modules/_randommodule.c — MT19937 (genrand_uint32, init_genrand,
//     init_by_array), seed() for int (absolute value, 32-bit chunks from
//     the right), for other hashable objects (hash(x) cast to size_t — the
//     float case is ported), getstate/setstate, random() (53 bits from two
//     32-bit draws) and getrandbits(k).
//   * Lib/random.py — seed version 2 for str/bytes/bytearray (the bytes
//     plus their SHA-512 digest, read as one big-endian int), _randbelow
//     (getrandbits rejection), randrange/randint, choice, choices, shuffle,
//     sample (incl. counts=), randbytes, uniform, triangular, gauss (with its
//     cached second value), normalvariate, lognormvariate, expovariate,
//     vonmisesvariate, gammavariate, betavariate, paretovariate,
//     weibullvariate, binomialvariate — statement for statement, so a
//     seeded generator produces exactly CPython's sequence.
//
// Floating point. The distribution functions call math.log / exp / cos /
// sin / acos / log2 / lgamma and the float ** operator, i.e. the platform C
// library. glibc's (Linux) results are correctly rounded in practice, so
// this file computes those functions CORRECTLY ROUNDED with BigInt fixed
// point (160 bits; math.lgamma is CPython's own Lanczos code, ported, on
// top of the correctly rounded log). JS Math.* is not used for any of them.
// Arithmetic (+ - * /, sqrt, floor) is IEEE-754 and identical everywhere.
// Measured agreement is reported in the module hub's notes.
//
// Values: Python ints are BigInt, floats are JS numbers. Callers convert
// demo inputs with lit() / asFloat() and wrap float results with pyF().

import { pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

const raise = (type, msg = '') => { throw new PyException(type, msg); };

export const pyF = (x) => ({ __pyRaw: pyFloatRepr(x) });

// ── bit helpers ──────────────────────────────────────────────
export function bitLength(n) {
  if (n < 0n) n = -n;
  if (n === 0n) return 0;
  const h = n.toString(16);
  return (h.length - 1) * 4 + (32 - Math.clz32(parseInt(h[0], 16)));
}

const DV = new DataView(new ArrayBuffer(8));

// |x| = m * 2**e exactly (x finite, nonzero)
function decompose(x) {
  const dv = DV;
  dv.setFloat64(0, x);
  const hi = dv.getUint32(0);
  const lo = dv.getUint32(4);
  const bexp = (hi >>> 20) & 0x7ff;
  let m = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e;
  if (bexp === 0) e = -1074;
  else { m |= 1n << 52n; e = bexp - 1075; }
  return { m, e };
}

// x * 2**k without spurious intermediate overflow / underflow
function ldexp(x, k) {
  while (k > 1000) { x *= 2 ** 1000; k -= 1000; }
  while (k < -1000) { x *= 2 ** -1000; k += 1000; }
  return x * 2 ** k;
}

// Correctly rounded double nearest to M * 2**E (ties to even, subnormals,
// overflow → ±Infinity).
function roundToDouble(M, E) {
  if (M === 0n) return 0;
  const neg = M < 0n;
  if (neg) M = -M;
  const L = bitLength(M);
  const top = L - 1 + E; // exponent of the leading bit
  if (top > 1023) return neg ? -Infinity : Infinity;
  const shift = top >= -1022 ? L - 53 : -1074 - E;
  let q;
  let qe;
  if (shift <= 0) {
    q = M;
    qe = E;
  } else {
    q = M >> BigInt(shift);
    const rem = M & ((1n << BigInt(shift)) - 1n);
    const half = 1n << BigInt(shift - 1);
    if (rem > half || (rem === half && (q & 1n) === 1n)) q += 1n;
    qe = E + shift;
  }
  const r = ldexp(Number(q), qe);
  return neg ? -r : r;
}

// ── high-precision constants (fixed point, value = V / 2**P) ──
const P = 160n;
const F = 1n << P;
// product of two fixed-point values, truncated toward zero (a plain >> on
// a negative BigInt rounds toward -inf and a series would never reach 0)
const mulP = (a, b) => (a * b) / F;

function isqrt(n) {
  if (n < 2n) return n;
  let x = 1n << BigInt(Math.ceil(bitLength(n) / 2));
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (y >= x) return x;
    x = y;
  }
}

// atan(1/q) * 2**bits for integer q > 1
function atanInv(q, bits) {
  const one = 1n << bits;
  const q2 = q * q;
  let term = one / q;
  let sum = term;
  let n = 1n;
  let sign = -1n;
  while (term !== 0n) {
    term /= q2;
    n += 2n;
    sum += sign * (term / n);
    sign = -sign;
  }
  return sum;
}

const PI_BITS = 1400n;
// Machin: pi = 16 atan(1/5) - 4 atan(1/239), with 32 guard bits
const PI_BIG = (16n * atanInv(5n, PI_BITS + 32n) - 4n * atanInv(239n, PI_BITS + 32n)) >> 32n;
const PI_P = PI_BIG >> (PI_BITS - P);
const HALFPI_P = PI_P >> 1n;

// ln 2 = 2 atanh(1/3)
const LN2 = (() => {
  const bits = P + 32n;
  let term = (1n << bits) / 3n;
  let sum = 0n;
  let n = 1n;
  while (term !== 0n) {
    sum += term / n;
    term /= 9n;
    n += 2n;
  }
  return (2n * sum) >> 32n;
})();

function fixedFromDouble(x) {
  if (x === 0) return 0n;
  const { m, e } = decompose(x);
  const s = BigInt(e) + P;
  const v = s >= 0n ? m << s : m >> -s;
  return x < 0 ? -v : v;
}

// ln(x) * 2**P for finite x > 0
function lnFixed(x) {
  const { m, e } = decompose(x);
  const L = bitLength(m);
  let k = e + L - 1; // x = (m / 2**(L-1)) * 2**k, mantissa in [1, 2)
  let Y = m << (P - BigInt(L - 1));
  // mantissa > sqrt(2) → halve it: |t| stays below 0.172
  if (Y * Y > 2n * F * F) { Y >>= 1n; k += 1; }
  const t = ((Y - F) << P) / (Y + F);
  const t2 = (t * t) >> P;
  let sum = 0n;
  let term = t;
  let n = 1n;
  while (term !== 0n) {
    sum += term / n;
    term = mulP(term, t2);
    n += 2n;
  }
  return 2n * sum + BigInt(k) * LN2;
}

// exp(Z / 2**P) as { M, E } (value M * 2**E); |Z| / 2**P < 800
function expFixed(Z) {
  let k = Z / LN2;
  let r = Z - k * LN2;
  if (r > LN2 / 2n) { r -= LN2; k += 1n; }
  else if (r < -LN2 / 2n) { r += LN2; k -= 1n; }
  const S = 12n;
  const R = r >> S;
  let sum = F;
  let term = F;
  for (let i = 1n; term !== 0n; i += 1n) {
    term = mulP(term, R) / i;
    sum += term;
  }
  for (let i = 0n; i < S; i += 1n) sum = (sum * sum) >> P;
  return { M: sum, E: Number(k) - Number(P) };
}

const LIMIT_HI = 710n * F;  // exp overflows above ~709.78
const LIMIT_LO = -800n * F; // exp underflows to 0 below ~-745.13

function expOfFixed(Z) {
  if (Z > LIMIT_HI) return Infinity;
  if (Z < LIMIT_LO) return 0;
  const { M, E } = expFixed(Z);
  return roundToDouble(M, E);
}

// ── correctly rounded libm replacements ─────────────────────
// They return the C function's value; the Python-level checks (domain and
// range errors) are in the math* wrappers below.
export function crLog(x) {
  if (x === 1) return 0;
  const fast = lnFast(x, false);
  return fast !== null ? fast : crLogExact(x);
}
// the BigInt evaluation alone (also used to test the fast path)
export const crLogExact = (x) => roundToDouble(lnFixed(x), -Number(P));
export const crLog2Exact = (x) => roundToDouble((lnFixed(x) << P) / LN2, -Number(P));

export function crLog2(x) {
  if (x === 1) return 0;
  const fast = lnFast(x, true);
  return fast !== null ? fast : crLog2Exact(x);
}

// ── fast path for log / log2: double-double arithmetic ───────
// About 2**-90 relative accuracy. The result is returned only when that is
// provably enough to round correctly; otherwise null, and the caller uses
// the BigInt evaluation (needed for roughly one input in 2**30).
const SPLIT = 134217729; // 2**27 + 1, Dekker
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  return [s, (a - (s - bb)) + (b - bb)];
}
function quickTwoSum(a, b) {
  const s = a + b;
  return [s, b - (s - a)];
}
function twoProd(a, b) {
  const p = a * b;
  let t = SPLIT * a;
  const ah = t - (t - a);
  const al = a - ah;
  t = SPLIT * b;
  const bh = t - (t - b);
  const bl = b - bh;
  return [p, ((ah * bh - p) + ah * bl + al * bh) + al * bl];
}
function ddAdd(ah, al, bh, bl) {
  const [s, e] = twoSum(ah, bh);
  return quickTwoSum(s, e + al + bl);
}
function ddMul(ah, al, bh, bl) {
  const [p, e] = twoProd(ah, bh);
  return quickTwoSum(p, e + ah * bl + al * bh);
}
function ddFromFixed(V) {
  const hi = roundToDouble(V, -Number(P));
  const lo = roundToDouble(V - fixedFromDouble(hi), -Number(P));
  return [hi, lo];
}
// ln(i / 256) for i = 192 … 384 (mantissas 0.75 … 1.5)
const LN_TABLE = (() => {
  const t = [];
  for (let i = 192; i <= 384; i += 1) t[i] = i === 256 ? [0, 0] : ddFromFixed(lnFixed(i / 256));
  return t;
})();
const LN2_DD = ddFromFixed(LN2);
const INV_LN2_DD = ddFromFixed((F << P) / LN2);

function lnFast(x, base2) {
  if (!(x > 0) || x === Infinity) return null;
  DV.setFloat64(0, x);
  const hi = DV.getUint32(0);
  const bexp = (hi >>> 20) & 0x7ff;
  if (bexp === 0) return null; // subnormal
  let k = bexp - 1023;
  let y = 1 + ((hi & 0xfffff) * 4294967296 + DV.getUint32(4)) * 2 ** -52;
  if (y >= 1.5) { y /= 2; k += 1; }
  const i = Math.round(y * 256);
  const c = i / 256;
  const d = y - c; // exact
  // s = d / (y + c) in double-double; ln(y / c) = 2 atanh(s)
  const [Dh, Dl] = twoSum(y, c);
  const q = d / Dh;
  const [ph, pl] = twoProd(q, Dh);
  const sl = ((d - ph) - pl - q * Dl) / Dh;
  const sh = q;
  // 2s (1 + s^2/3 + s^4/5 + …): s^2/3 in double-double, the rest in double
  const [s2h, s2l0] = twoProd(sh, sh);
  const s2l = s2l0 + 2 * sh * sl;
  const t3h = s2h / 3;
  const [p3h, p3l] = twoProd(t3h, 3);
  const t3l = ((s2h - p3h) - p3l + s2l) / 3;
  const s2 = s2h;
  const rest = s2 * s2 * (1 / 5 + s2 * (1 / 7 + s2 * (1 / 9 + s2 * (1 / 11))));
  const [polyH, polyL] = ddAdd(1, 0, t3h, t3l + rest);
  let [rh, rl] = ddMul(2 * sh, 2 * sl, polyH, polyL);
  const L = LN_TABLE[i];
  [rh, rl] = ddAdd(L[0], L[1], rh, rl);
  if (k !== 0) {
    const [kh, kl] = twoProd(LN2_DD[0], k);
    [rh, rl] = ddAdd(kh, kl + LN2_DD[1] * k, rh, rl);
  }
  if (base2) [rh, rl] = ddMul(rh, rl, INV_LN2_DD[0], INV_LN2_DD[1]);
  const [S, Er] = quickTwoSum(rh, rl);
  if (S === 0 || !Number.isFinite(S)) return null;
  // S is the nearest double to S + Er; accept it if the error bound cannot
  // carry the true value across a rounding boundary
  DV.setFloat64(0, S);
  const sexp = (DV.getUint32(0) >>> 20) & 0x7ff;
  const mantZero = (DV.getUint32(0) & 0xfffff) === 0 && DV.getUint32(4) === 0;
  if (sexp === 0 || mantZero) return null;
  const halfUlp = 2 ** (sexp - 1023 - 53);
  const bound = (Math.abs(S) + Math.abs(k) + 1) * 2 ** -88;
  return halfUlp - Math.abs(Er) > bound ? S : null;
}

export function crExp(x) {
  if (Number.isNaN(x)) return x;
  if (x === 0) return 1;
  if (x > 800) return Infinity;
  if (x < -800) return 0;
  return expOfFixed(fixedFromDouble(x));
}

// x ** y for finite x > 0 and finite y
export function crPow(x, y) {
  if (x === 1 || y === 0) return 1;
  const L = lnFixed(x);
  if (L === 0n) return 1;
  const { m, e } = decompose(y);
  // |y * ln x| far beyond the exp range: decide by magnitude alone
  if (bitLength(L) + bitLength(m) + e - Number(P) > 12) {
    const positive = (L > 0n) === (y > 0);
    return positive ? Infinity : 0;
  }
  let Z = L * m;
  Z = e >= 0 ? Z << BigInt(e) : Z >> BigInt(-e);
  if (y < 0) Z = -Z;
  return expOfFixed(Z);
}

function sinCosFixed(R) {
  // Taylor series at scale P for |R| <= pi/4
  const r2 = (R * R) >> P;
  let s = R;
  let term = R;
  for (let i = 1n; term !== 0n; i += 1n) {
    term = -mulP(term, r2) / ((2n * i) * (2n * i + 1n));
    s += term;
  }
  let c = F;
  term = F;
  for (let i = 1n; term !== 0n; i += 1n) {
    term = -mulP(term, r2) / ((2n * i - 1n) * (2n * i));
    c += term;
  }
  return [s, c];
}

// [sin(x), cos(x)] as fixed point, for finite x
function sinCosOf(x) {
  if (x === 0) return [0n, F];
  const neg = x < 0;
  const { m, e } = decompose(Math.abs(x));
  const W = P + BigInt(Math.max(0, e + 53)) + 64n;
  const halfPiW = PI_BIG >> (PI_BITS - W + 1n);
  const sh = BigInt(e) + W;
  const XW = sh >= 0n ? m << sh : m >> -sh;
  const q = (XW + halfPiW / 2n) / halfPiW;
  const rW = XW - q * halfPiW;
  const r = rW >> (W - P);
  const [s, c] = sinCosFixed(r);
  let S;
  let C;
  switch (Number(q % 4n)) {
    case 0: S = s; C = c; break;
    case 1: S = c; C = -s; break;
    case 2: S = -s; C = -c; break;
    default: S = -c; C = s; break;
  }
  return [neg ? -S : S, C];
}

export function crSin(x) {
  if (x === 0) return x; // keeps -0.0
  if (!Number.isFinite(x)) return NaN;
  return roundToDouble(sinCosOf(x)[0], -Number(P));
}

export function crCos(x) {
  if (!Number.isFinite(x)) return NaN;
  return roundToDouble(sinCosOf(x)[1], -Number(P));
}

// atan(z) for 0 <= z <= 1 (fixed point)
function atanSmall(z) {
  let halvings = 0n;
  for (let i = 0; i < 4; i += 1) {
    // atan(z) = 2 atan(z / (1 + sqrt(1 + z^2)))
    const root = isqrt((F * F) + z * z); // sqrt(1 + z^2) at scale P
    z = (z << P) / (F + root);
    halvings += 1n;
  }
  const z2 = (z * z) >> P;
  let sum = 0n;
  let term = z;
  let n = 1n;
  let sign = 1n;
  while (term !== 0n) {
    sum += sign * (term / n);
    term = mulP(term, z2);
    n += 2n;
    sign = -sign;
  }
  return sum << halvings;
}

export function crAcos(x) {
  if (Number.isNaN(x) || x > 1 || x < -1) return NaN;
  if (x === 1) return 0;
  if (x === -1) return roundToDouble(PI_P, -Number(P));
  const X = fixedFromDouble(x);
  // acos(x) = 2 atan(sqrt((1 - x) / (1 + x)))
  const w = ((F - X) << P) / (F + X);
  const s = isqrt(w << P);
  const a = s <= F ? atanSmall(s) : HALFPI_P - atanSmall((F << P) / s);
  return roundToDouble(2n * a, -Number(P));
}

// ── Python-level math helpers ───────────────────────────────
export function mathLog(x) {
  if (Number.isNaN(x)) return x;
  if (x <= 0) raise('ValueError', 'math domain error');
  if (x === Infinity) return x;
  return crLog(x);
}

export function mathLog2(x) {
  if (Number.isNaN(x)) return x;
  if (x <= 0) raise('ValueError', 'math domain error');
  if (x === Infinity) return x;
  return crLog2(x);
}

export function mathExp(x) {
  const r = crExp(x);
  if (r === Infinity && Number.isFinite(x)) raise('OverflowError', 'math range error');
  return r;
}

export function mathAcos(x) {
  if (Number.isNaN(x)) return x;
  if (x > 1 || x < -1) raise('ValueError', 'math domain error');
  return crAcos(x);
}

// math.lgamma: CPython's own Lanczos implementation (Modules/mathmodule.c,
// m_lgamma), here for x > 0 — the only arguments random.py passes.
const LANCZOS_G = 6.024680040776729583740234375;
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
const LANCZOS_DEN = [
  0.0, 39916800.0, 120543840.0, 150917976.0, 105258076.0, 45995730.0,
  13339535.0, 2637558.0, 357423.0, 32670.0, 1925.0, 66.0, 1.0,
];

function lanczosSum(x) {
  let num = 0.0;
  let den = 0.0;
  if (x < 5.0) {
    for (let i = 12; i >= 0; i -= 1) {
      num = num * x + LANCZOS_NUM[i];
      den = den * x + LANCZOS_DEN[i];
    }
  } else {
    for (let i = 0; i < 13; i += 1) {
      num = num / x + LANCZOS_NUM[i];
      den = den / x + LANCZOS_DEN[i];
    }
  }
  return num / den;
}

export function mathLgamma(x) {
  if (Number.isNaN(x)) return x;
  if (!Number.isFinite(x)) return Infinity;
  if (x === Math.floor(x) && x <= 2.0) {
    if (x <= 0.0) raise('ValueError', 'math domain error');
    return 0.0;
  }
  if (x < 0) raise('NotImplementedError', 'lgamma of a negative number is not used by random');
  const absx = x;
  if (absx < 1e-20) return -crLog(absx);
  let r = crLog(lanczosSum(absx)) - LANCZOS_G;
  r += (absx - 0.5) * (crLog(absx + LANCZOS_G - 0.5) - 1);
  return r;
}

// float ** float, as Objects/floatobject.c float_pow does it, for the
// operands random.py produces (base >= 0 or -0.0, finite exponent).
// The overflow message is strerror(ERANGE), which is platform text: Windows
// prints "(34, 'Result too large')" (used here, as in the BSD/macOS libc),
// Linux/glibc "(34, 'Numerical result out of range')".
export const POW_OVERFLOW_MSG = "(34, 'Result too large')";
export function floatPow(iv, iw) {
  if (iw === 0) return 1.0;
  if (Number.isNaN(iv)) return iv === 1.0 ? 1.0 : iv;
  if (Number.isNaN(iw)) return iv === 1.0 ? 1.0 : iw;
  if (!Number.isFinite(iw)) {
    const a = Math.abs(iv);
    if (iv === 1.0) return 1.0;
    if ((iw > 0) === (a > 1.0)) return Infinity;
    return 0.0;
  }
  const iwOdd = Number.isInteger(iw) && Math.abs(iw % 2) === 1;
  if (!Number.isFinite(iv)) {
    if (iw > 0) return iwOdd ? iv : Math.abs(iv);
    return iwOdd ? (iv < 0 ? -0.0 : 0.0) : 0.0;
  }
  if (iv === 0) {
    if (iw < 0) raise('ZeroDivisionError', '0.0 cannot be raised to a negative power');
    return iwOdd ? iv : 0.0;
  }
  let neg = false;
  if (iv < 0) {
    if (!Number.isInteger(iw)) raise('NotImplementedError', 'negative base with a fractional power gives a complex number');
    iv = -iv;
    neg = iwOdd;
  }
  if (iv === 1.0) return neg ? -1.0 : 1.0;
  let r = crPow(iv, iw);
  if (r === Infinity) raise('OverflowError', POW_OVERFLOW_MSG);
  if (neg) r = -r;
  return r;
}

export function fdiv(a, b) {
  if (b === 0) raise('ZeroDivisionError', 'float division by zero');
  return a / b;
}

// Python float % float
export function fmod(vx, wx) {
  if (wx === 0) raise('ZeroDivisionError', 'float modulo by zero');
  let mod = vx % wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) mod += wx;
  } else {
    mod = wx < 0 ? -0.0 : 0.0;
  }
  return mod;
}

// Python int(math.floor(x)) for a finite float
export function floorInt(x) {
  if (!Number.isFinite(x)) raise(Number.isNaN(x) ? 'ValueError' : 'OverflowError', Number.isNaN(x) ? 'cannot convert float NaN to integer' : 'cannot convert float infinity to integer');
  const f = Math.floor(x);
  return Number.isSafeInteger(f) ? BigInt(f) : BigInt(pyIntText(f));
}
function pyIntText(f) {
  const { m, e } = decompose(Math.abs(f));
  const v = e >= 0 ? m << BigInt(e) : m >> BigInt(-e);
  return (f < 0 ? '-' : '') + v.toString();
}

export function ceilInt(x) {
  return -floorInt(-x);
}

// random.py's import-time constants. Every one is the correctly rounded
// value, identical on Windows (MSVC) and Linux (glibc) CPython.
export const TWOPI = 6.283185307179586;
export const PI = 3.141592653589793;
export const E = 2.718281828459045;
export const NV_MAGICCONST = 4 * crExp(-0.5) / Math.sqrt(2.0);
export const LOG4 = crLog(4.0);
export const SG_MAGICCONST = 1.0 + crLog(4.5);
export const BPF = 53;
export const RECIP_BPF = 2 ** -53;

// ── SHA-512 (FIPS 180-4), for seed(str / bytes) version 2 ───
const M64 = (1n << 64n) - 1n;
function icbrt(n) {
  let x = 1n << BigInt(Math.ceil(bitLength(n) / 3) + 1);
  for (;;) {
    const y = (2n * x + n / (x * x)) / 3n;
    if (y >= x) break;
    x = y;
  }
  while (x * x * x > n) x -= 1n;
  while ((x + 1n) ** 3n <= n) x += 1n;
  return x;
}
const PRIMES = (() => {
  const out = [];
  for (let n = 2; out.length < 80; n += 1) {
    if (out.every((p) => n % p !== 0)) out.push(n);
  }
  return out;
})();
// fractional parts of the cube roots of the first 80 primes …
const K512 = PRIMES.map((p) => icbrt(BigInt(p) << 192n) & M64);
// … and of the square roots of the first 8
const H512 = PRIMES.slice(0, 8).map((p) => isqrt(BigInt(p) << 128n) & M64);

const rotr = (x, n) => ((x >> n) | (x << (64n - n))) & M64;

export function sha512(bytes) {
  const len = bytes.length;
  const padLen = ((len + 17 + 127) >> 7) << 7;
  const msg = new Uint8Array(padLen);
  msg.set(bytes);
  msg[len] = 0x80;
  let bitLen = BigInt(len) * 8n;
  for (let i = padLen - 1; i >= padLen - 16; i -= 1) {
    msg[i] = Number(bitLen & 0xffn);
    bitLen >>= 8n;
  }
  const H = H512.slice();
  const W = new Array(80);
  for (let off = 0; off < padLen; off += 128) {
    for (let t = 0; t < 16; t += 1) {
      let w = 0n;
      for (let b = 0; b < 8; b += 1) w = (w << 8n) | BigInt(msg[off + t * 8 + b]);
      W[t] = w;
    }
    for (let t = 16; t < 80; t += 1) {
      const x = W[t - 15];
      const y = W[t - 2];
      const s0 = rotr(x, 1n) ^ rotr(x, 8n) ^ (x >> 7n);
      const s1 = rotr(y, 19n) ^ rotr(y, 61n) ^ (y >> 6n);
      W[t] = (s1 + W[t - 7] + s0 + W[t - 16]) & M64;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 80; t += 1) {
      const S1 = rotr(e, 14n) ^ rotr(e, 18n) ^ rotr(e, 41n);
      const ch = (e & f) ^ (~e & M64 & g);
      const T1 = (h + S1 + ch + K512[t] + W[t]) & M64;
      const S0 = rotr(a, 28n) ^ rotr(a, 34n) ^ rotr(a, 39n);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const T2 = (S0 + maj) & M64;
      h = g; g = f; f = e;
      e = (d + T1) & M64;
      d = c; c = b; b = a;
      a = (T1 + T2) & M64;
    }
    const v = [a, b, c, d, e, f, g, h];
    for (let i = 0; i < 8; i += 1) H[i] = (H[i] + v[i]) & M64;
  }
  const out = new Uint8Array(64);
  H.forEach((w, i) => {
    for (let b = 7; b >= 0; b -= 1) {
      out[i * 8 + b] = Number(w & 0xffn);
      w >>= 8n;
    }
  });
  return out;
}

// str.encode() — UTF-8, strict
export function utf8(s) {
  let pos = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xd800 && cp <= 0xdfff) {
      raise('UnicodeEncodeError', `'utf-8' codec can't encode character '\\u${cp.toString(16)}' in position ${pos}: surrogates not allowed`);
    }
    pos += 1;
  }
  return new TextEncoder().encode(s);
}

const intFromBytesBig = (bytes) => {
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return hex === '' ? 0n : BigInt('0x' + hex);
};

// hash(float) — Python/pyhash.c _Py_HashDouble for finite values:
// |x| = m * 2**e  →  m * 2**(e mod 61)  (mod 2**61 - 1), sign applied.
const HASH_MOD = (1n << 61n) - 1n;
export function floatHash(x) {
  if (x === Infinity) return 314159n;
  if (x === -Infinity) return -314159n;
  if (x === 0) return 0n;
  const { m, e } = decompose(Math.abs(x));
  const ee = BigInt(((e % 61) + 61) % 61);
  let h = ((m % HASH_MOD) * ((1n << ee) % HASH_MOD)) % HASH_MOD;
  if (x < 0) h = -h;
  if (h === -1n) h = -2n;
  return h;
}

// ── the generator ────────────────────────────────────────────
const N = 624;
const MM = 397;

function initGenrand(mt, s) {
  mt[0] = s >>> 0;
  for (let i = 1; i < N; i += 1) {
    const p = mt[i - 1] ^ (mt[i - 1] >>> 30);
    mt[i] = (Math.imul(1812433253, p) + i) >>> 0;
  }
}

function initByArray(mt, key) {
  initGenrand(mt, 19650218);
  let i = 1;
  let j = 0;
  const kl = key.length;
  for (let k = Math.max(N, kl); k; k -= 1) {
    const p = mt[i - 1] ^ (mt[i - 1] >>> 30);
    mt[i] = ((mt[i] ^ Math.imul(p, 1664525)) + key[j] + j) >>> 0;
    i += 1;
    j += 1;
    if (i >= N) { mt[0] = mt[N - 1]; i = 1; }
    if (j >= kl) j = 0;
  }
  for (let k = N - 1; k; k -= 1) {
    const p = mt[i - 1] ^ (mt[i - 1] >>> 30);
    mt[i] = ((mt[i] ^ Math.imul(p, 1566083941)) - i) >>> 0;
    i += 1;
    if (i >= N) { mt[0] = mt[N - 1]; i = 1; }
  }
  mt[0] = 0x80000000;
}

// 32-bit chunks of a non-negative int, least significant first
function limbs(n) {
  if (n === 0n) return [0];
  const out = [];
  while (n > 0n) {
    out.push(Number(n & 0xffffffffn));
    n >>= 32n;
  }
  return out;
}

// Seeds are tagged so str and bytes stay distinct:
//   null                       → None (non-deterministic)
//   bigint / boolean           → int
//   number                     → float
//   string                     → str
//   { bytes: Uint8Array }      → bytes / bytearray
export const bytesSeed = (arr) => ({ bytes: Uint8Array.from(arr) });

export class PyRandom {
  constructor(seed = null) {
    this.mt = new Uint32Array(N);
    this.index = N;
    this.gaussNext = null;
    this.seed(seed);
  }

  // _random.Random.seed (C) after random.py's version-2 conversion
  seed(a = null, version = 2) {
    if (version === 1 && (typeof a === 'string' || (a && a.bytes))) {
      const s = typeof a === 'string' ? a : String.fromCharCode(...a.bytes);
      const cps = [...s].map((c) => c.codePointAt(0));
      let x = cps.length ? BigInt(cps[0]) << 7n : 0n;
      for (const c of cps) x = ((1000003n * x) ^ BigInt(c)) & 0xFFFFFFFFFFFFFFFFn;
      x ^= BigInt(cps.length);
      a = x === -1n ? -2n : x;
    } else if (version === 2 && (typeof a === 'string' || (a && a.bytes))) {
      const b = typeof a === 'string' ? utf8(a) : a.bytes;
      const all = new Uint8Array(b.length + 64);
      all.set(b);
      all.set(sha512(b), b.length);
      a = intFromBytesBig(all);
    } else if (!(a === null || typeof a === 'bigint' || typeof a === 'boolean' || typeof a === 'number' || typeof a === 'string' || (a && a.bytes))) {
      raise('TypeError', 'The only supported seed types are:\nNone, int, float, str, bytes, and bytearray.');
    }
    this.seedC(a);
    this.gaussNext = null;
  }

  seedC(a) {
    let n;
    if (a === null) {
      // os.urandom in CPython — any unpredictable key will do here
      const key = new Uint32Array(N);
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(key);
      else for (let i = 0; i < N; i += 1) key[i] = Math.floor(Math.random() * 2 ** 32);
      initByArray(this.mt, Array.from(key));
      this.index = N;
      return;
    }
    if (typeof a === 'boolean') n = a ? 1n : 0n;
    else if (typeof a === 'bigint') n = a < 0n ? -a : a;
    else if (typeof a === 'number') {
      if (Number.isNaN(a)) {
        // hash(nan) is based on the object's id: unpredictable
        this.seedC(null);
        return;
      }
      const h = floatHash(a);
      n = h < 0n ? (1n << 64n) + h : h; // (size_t)hash
    } else {
      raise('TypeError', 'unhashable seed');
    }
    initByArray(this.mt, limbs(n));
    this.index = N;
  }

  next32() {
    const mt = this.mt;
    if (this.index >= N) {
      let kk = 0;
      let y;
      for (; kk < N - MM; kk += 1) {
        y = (mt[kk] & 0x80000000) | (mt[kk + 1] & 0x7fffffff);
        mt[kk] = mt[kk + MM] ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0);
      }
      for (; kk < N - 1; kk += 1) {
        y = (mt[kk] & 0x80000000) | (mt[kk + 1] & 0x7fffffff);
        mt[kk] = mt[kk + (MM - N)] ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0);
      }
      y = (mt[N - 1] & 0x80000000) | (mt[0] & 0x7fffffff);
      mt[N - 1] = mt[MM - 1] ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0);
      this.index = 0;
    }
    let y = mt[this.index];
    this.index += 1;
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;
    return y >>> 0;
  }

  random() {
    const a = this.next32() >>> 5;
    const b = this.next32() >>> 6;
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }

  getrandbits(k) {
    k = this.checkBits(k);
    if (k === 0) return 0n;
    if (k <= 32) return BigInt(this.next32() >>> (32 - k));
    // words least significant first → one hex string, most significant first
    const words = this.bitWords(k);
    let hex = '';
    for (let i = words.length - 1; i >= 0; i -= 1) hex += words[i].toString(16).padStart(8, '0');
    return BigInt('0x' + hex);
  }

  // validation shared by getrandbits and randbytes; returns k as a number
  checkBits(k) {
    k = pyIndex(k);
    if (k < 0n) raise('ValueError', 'number of bits must be non-negative');
    if (k > 9223372036854775807n) raise('OverflowError', 'Python int too large to convert to C long long');
    if (k > DEMO_MAX_BITS) demoLimit(`getrandbits(${k})`);
    return Number(k);
  }

  // the C loop for k > 32: 32-bit words, least significant first, the last
  // one shifted right to keep only the remaining bits
  bitWords(k) {
    const n = Math.floor((k - 1) / 32) + 1;
    const words = new Array(n);
    for (let i = 0; i < n; i += 1, k -= 32) {
      let r = this.next32();
      if (k < 32) r >>>= (32 - k);
      words[i] = r;
    }
    return words;
  }

  // (3, 625-tuple, gauss_next) — the tuple as a JS array of BigInt
  getstate() {
    return [3n, [...Array.from(this.mt, (v) => BigInt(v)), BigInt(this.index)], this.gaussNext];
  }

  setstate(state) {
    const [version, internal, gaussNext] = state;
    if (version !== 3n && version !== 2n) {
      raise('ValueError', `state with version ${version} passed to Random.setstate() of version 3`);
    }
    let vals = internal;
    if (version === 2n) vals = internal.map((x) => ((x % (1n << 32n)) + (1n << 32n)) % (1n << 32n));
    if (vals.length !== N + 1) raise('ValueError', 'state vector is the wrong size');
    const idx = vals[N];
    if (idx < 0n || idx > BigInt(N)) raise('ValueError', 'invalid state');
    this.gaussNext = gaussNext;
    for (let i = 0; i < N; i += 1) this.mt[i] = Number(BigInt.asUintN(32, vals[i]));
    this.index = Number(idx);
  }

  // ── integers ──
  randbelow(n) {
    const k = BigInt(bitLength(n));
    let r = this.getrandbits(k);
    while (r >= n) r = this.getrandbits(k);
    return r;
  }

  // getrandbits(n * 8).to_bytes(n, 'little'), written out word by word
  randbytes(n) {
    n = pyIndex(n);
    const k = this.checkBits(n * 8n);
    const out = new Uint8Array(k / 8);
    if (k === 0) return out;
    if (k <= 32) {
      const v = this.next32() >>> (32 - k);
      for (let i = 0; i < out.length; i += 1) out[i] = (v >>> (8 * i)) & 0xff;
      return out;
    }
    const words = this.bitWords(k);
    for (let i = 0; i < out.length; i += 1) out[i] = (words[i >> 2] >>> (8 * (i & 3))) & 0xff;
    return out;
  }

  // randrange(start, stop=None, step=1); stepGiven mirrors `step is not _ONE`
  randrange(start, stop = null, step = 1n) {
    const istart = pyIndex(start);
    if (stop === null) {
      if (step !== 1n) raise('TypeError', 'Missing a non-None stop argument');
      if (istart > 0n) return this.randbelow(istart);
      raise('ValueError', 'empty range for randrange()');
    }
    const istop = pyIndex(stop);
    const width = istop - istart;
    const istep = pyIndex(step);
    if (istep === 1n) {
      if (width > 0n) return istart + this.randbelow(width);
      raise('ValueError', `empty range in randrange(${pyStr(start)}, ${pyStr(stop)})`);
    }
    let n;
    if (istep > 0n) n = floordiv(width + istep - 1n, istep);
    else if (istep < 0n) n = floordiv(width + istep + 1n, istep);
    else raise('ValueError', 'zero step for randrange()');
    if (n <= 0n) raise('ValueError', `empty range in randrange(${pyStr(start)}, ${pyStr(stop)}, ${pyStr(step)})`);
    return istart + istep * this.randbelow(n);
  }

  randint(a, b) {
    return this.randrange(a, pyAddOne(b));
  }

  // ── sequences ──
  // seq: a JS array (list/tuple items) or a string; kind names the type
  // for IndexError messages ('list', 'tuple', 'str', 'range')
  choice(seq) {
    const n = seqLen(seq);
    if (!n) raise('IndexError', 'Cannot choose from an empty sequence');
    return seqItem(seq, Number(this.randbelow(BigInt(n))));
  }

  shuffle(x) {
    for (let i = x.length - 1; i >= 1; i -= 1) {
      const j = Number(this.randbelow(BigInt(i + 1)));
      const t = x[i];
      x[i] = x[j];
      x[j] = t;
    }
    return null;
  }

  sample(population, k, counts = null) {
    if (!isSequence(population)) {
      raise('TypeError', 'Population must be a sequence.  For dicts or sets, use sorted(d).');
    }
    const n = seqLen(population);
    if (counts !== null) {
      const cum = [];
      let acc = null;
      for (const c of counts) {
        acc = acc === null ? c : addNum(acc, c);
        cum.push(acc);
      }
      if (cum.length !== n) raise('ValueError', 'The number of counts does not match the population');
      const total = cum.length ? cum.pop() : 0n;
      if (typeof total !== 'bigint') raise('TypeError', 'Counts must be integers');
      if (total < 0n) raise('ValueError', 'Counts must be non-negative');
      const selections = this.sample({ range: total }, k);
      return selections.map((s) => seqItem(population, bisectRight(cum, s, 0, cum.length)));
    }
    if (typeof k === 'number') {
      // a float k passes the range check, then [None] * k fails
      if (!(k >= 0 && k <= n)) raise('ValueError', 'Sample larger than population or is negative');
      raise('TypeError', "can't multiply sequence by non-int of type 'float'");
    }
    k = pyIndex(k);
    const nBig = seqLenBig(population);
    if (!(k >= 0n && k <= nBig)) raise('ValueError', 'Sample larger than population or is negative');
    if (k > DEMO_MAX_ITEMS) demoLimit(`sample(..., k=${k})`);
    const kk = Number(k);
    const result = new Array(kk);
    let setsize = 21;
    if (kk > 5) {
      // 4 ** ceil(log(k * 3, 4))
      const e = Number(ceilInt(crLog(kk * 3) / crLog(4)));
      setsize += 4 ** e;
    }
    if (n <= setsize) {
      const pool = seqList(population);
      for (let i = 0; i < kk; i += 1) {
        const j = Number(this.randbelow(BigInt(n - i)));
        result[i] = pool[j];
        pool[j] = pool[n - i - 1];
      }
    } else {
      const selected = new Set();
      for (let i = 0; i < kk; i += 1) {
        let j = this.randbelow(nBig);
        while (selected.has(j)) j = this.randbelow(nBig);
        selected.add(j);
        result[i] = population.range !== undefined ? j : seqItem(population, Number(j));
      }
    }
    return result;
  }

  // weights / cumWeights: arrays of int (BigInt) / float (number), or null
  choices(population, weights = null, cumWeights = null, k = 1n) {
    const n = seqLen(population);
    k = pyIndex(k);
    if (k > DEMO_MAX_ITEMS) demoLimit(`choices(..., k=${k})`);
    const kk = k > 0n ? Number(k) : 0;
    if (cumWeights === null) {
      if (weights === null) {
        const nf = n + 0.0;
        const out = [];
        for (let i = 0; i < kk; i += 1) out.push(seqItem(population, Math.floor(this.random() * nf)));
        return out;
      }
      if (typeof weights === 'bigint') {
        raise('TypeError', `The number of choices must be a keyword argument: k=${weights}`);
      }
      if (typeof weights === 'number') raise('TypeError', "'float' object is not iterable");
      cumWeights = [];
      let acc = null;
      for (const w of weights) {
        acc = acc === null ? w : addNum(acc, w);
        cumWeights.push(acc);
      }
    } else if (weights !== null) {
      raise('TypeError', 'Cannot specify both weights and cumulative weights');
    }
    if (cumWeights.length !== n) raise('ValueError', 'The number of weights does not match the population');
    if (cumWeights.length === 0) raise('IndexError', 'list index out of range');
    const total = toFloat(cumWeights[cumWeights.length - 1]) + 0.0;
    if (total <= 0.0) raise('ValueError', 'Total of weights must be greater than zero');
    if (!Number.isFinite(total)) raise('ValueError', 'Total of weights must be finite');
    const hi = n - 1;
    const out = [];
    for (let i = 0; i < kk; i += 1) {
      out.push(seqItem(population, bisectRight(cumWeights, this.random() * total, 0, hi)));
    }
    return out;
  }

  // ── real-valued distributions (arguments are JS numbers) ──
  uniform(a, b) {
    return a + (b - a) * this.random();
  }

  // returns low itself when high == low (no division possible)
  triangular(low = 0.0, high = 1.0, mode = null) {
    let u = this.random();
    let c;
    if (mode === null) c = 0.5;
    else {
      if (high - low === 0) return { same: low };
      c = (mode - low) / (high - low);
    }
    if (u > c) {
      u = 1.0 - u;
      c = 1.0 - c;
      const t = low;
      low = high;
      high = t;
    }
    if (u * c < 0) raise('ValueError', 'math domain error');
    return low + (high - low) * Math.sqrt(u * c);
  }

  normalvariate(mu = 0.0, sigma = 1.0) {
    let z;
    for (;;) {
      const u1 = this.random();
      const u2 = 1.0 - this.random();
      z = NV_MAGICCONST * (u1 - 0.5) / u2;
      const zz = z * z / 4.0;
      if (zz <= -mathLog(u2)) break;
    }
    return mu + z * sigma;
  }

  gauss(mu = 0.0, sigma = 1.0) {
    let z = this.gaussNext;
    this.gaussNext = null;
    if (z === null) {
      const x2pi = this.random() * TWOPI;
      const g2rad = Math.sqrt(-2.0 * mathLog(1.0 - this.random()));
      z = crCos(x2pi) * g2rad;
      this.gaussNext = crSin(x2pi) * g2rad;
    }
    return mu + z * sigma;
  }

  lognormvariate(mu, sigma) {
    return mathExp(this.normalvariate(mu, sigma));
  }

  expovariate(lambd = 1.0) {
    return fdiv(-mathLog(1.0 - this.random()), lambd);
  }

  vonmisesvariate(mu, kappa) {
    if (kappa <= 1e-6) return TWOPI * this.random();
    const s = 0.5 / kappa;
    const r = s + Math.sqrt(1.0 + s * s);
    let z;
    for (;;) {
      const u1 = this.random();
      z = crCos(PI * u1);
      const d = z / (r + z);
      const u2 = this.random();
      if (u2 < 1.0 - d * d || u2 <= (1.0 - d) * mathExp(d)) break;
    }
    const q = 1.0 / r;
    const f = (q + z) / (1.0 + q * z);
    const u3 = this.random();
    if (u3 > 0.5) return fmod(mu + mathAcos(f), TWOPI);
    return fmod(mu - mathAcos(f), TWOPI);
  }

  gammavariate(alpha, beta) {
    if (alpha <= 0.0 || beta <= 0.0) raise('ValueError', 'gammavariate: alpha and beta must be > 0.0');
    if (alpha > 1.0) {
      const ainv = Math.sqrt(2.0 * alpha - 1.0);
      const bbb = alpha - LOG4;
      const ccc = alpha + ainv;
      for (;;) {
        const u1 = this.random();
        if (!(1e-7 < u1 && u1 < 0.9999999)) continue;
        const u2 = 1.0 - this.random();
        const v = mathLog(u1 / (1.0 - u1)) / ainv;
        const x = alpha * mathExp(v);
        const z = u1 * u1 * u2;
        const r = bbb + ccc * v - x;
        if (r + SG_MAGICCONST - 4.5 * z >= 0.0 || r >= mathLog(z)) return x * beta;
      }
    }
    if (alpha === 1.0) return -mathLog(1.0 - this.random()) * beta;
    let x;
    for (;;) {
      const u = this.random();
      const b = (E + alpha) / E;
      const p = b * u;
      if (p <= 1.0) x = floatPow(p, 1.0 / alpha);
      else x = -mathLog((b - p) / alpha);
      const u1 = this.random();
      if (p > 1.0) {
        if (u1 <= floatPow(x, alpha - 1.0)) break;
      } else if (u1 <= mathExp(-x)) break;
    }
    return x * beta;
  }

  betavariate(alpha, beta) {
    const y = this.gammavariate(alpha, 1.0);
    if (y) return y / (y + this.gammavariate(beta, 1.0));
    return 0.0;
  }

  paretovariate(alpha) {
    const u = 1.0 - this.random();
    return floatPow(u, fdiv(-1.0, alpha));
  }

  weibullvariate(alpha, beta) {
    const u = 1.0 - this.random();
    return alpha * floatPow(-mathLog(u), fdiv(1.0, beta));
  }

  // n: a JS integer (Python int), p: a JS number; returns BigInt
  binomialvariate(n = 1, p = 0.5) {
    if (n < 0) raise('ValueError', 'n must be non-negative');
    if (p <= 0.0 || p >= 1.0) {
      if (p === 0.0) return 0n;
      if (p === 1.0) return BigInt(n);
      raise('ValueError', 'p must be in the range 0.0 <= p <= 1.0');
    }
    if (n === 1) return this.random() < p ? 1n : 0n;
    if (p > 0.5) return BigInt(n) - this.binomialvariate(n, 1.0 - p);
    if (n * p < 10.0) {
      let x = 0;
      let y = 0;
      const c = mathLog2(1.0 - p);
      if (!c) return BigInt(x);
      for (;;) {
        y += Math.floor(mathLog2(this.random()) / c) + 1;
        if (y > n) return BigInt(x);
        x += 1;
      }
    }
    const spq = Math.sqrt(n * p * (1.0 - p));
    const b = 1.15 + 2.53 * spq;
    const a = -0.0873 + 0.0248 * b + 0.01 * p;
    const c = n * p + 0.5;
    const vr = 0.92 - 4.2 / b;
    let setup = false;
    let alpha;
    let lpq;
    let m;
    let h;
    for (;;) {
      let u = this.random();
      u -= 0.5;
      const us = 0.5 - Math.abs(u);
      const k = Math.floor((2.0 * a / us + b) * u + c);
      if (k < 0 || k > n) continue;
      let v = this.random();
      if (us >= 0.07 && v <= vr) return BigInt(k);
      if (!setup) {
        alpha = (2.83 + 5.1 / b) * spq;
        lpq = mathLog(p / (1.0 - p));
        m = Math.floor((n + 1) * p);
        h = mathLgamma(m + 1) + mathLgamma(n - m + 1);
        setup = true;
      }
      v *= alpha / (a / (us * us) + b);
      if (mathLog(v) <= h - mathLgamma(k + 1) - mathLgamma(n - k + 1) + (k - m) * lpq) return BigInt(k);
    }
  }
}

// ── Python value helpers ─────────────────────────────────────
// Demos stay responsive: inputs that would make CPython build huge
// objects stop with a clearly non-Python error instead of freezing the page.
const DEMO_MAX_ITEMS = 100000n;
const DEMO_MAX_BITS = 8000000n;
function demoLimit(what) {
  const e = new Error(`${what} is too large for the in-browser demo — run it in Python`);
  e.name = 'DemoLimit';
  throw e;
}

// Ints the float-based algorithms (binomialvariate) handle as JS numbers
export function demoGuard(n, what) {
  if (typeof n === 'bigint' && (n > 9007199254740992n || n < -9007199254740992n)) demoLimit(what);
}

// operator.index()
export function pyIndex(v) {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'boolean') return v ? 1n : 0n;
  raise('TypeError', `'${pyTypeName(v)}' object cannot be interpreted as an integer`);
}

export function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number') return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v.__pyTuple) return 'tuple';
  if (v.__pySet) return 'set';
  if (v.bytes) return 'bytes';
  if (v.range !== undefined) return 'range';
  return 'object';
}

// str() of an int / float / bool argument (randrange's messages)
export function pyStr(v) {
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'number') return pyFloatRepr(v);
  if (v === null) return 'None';
  return String(v);
}

// b + 1 for randint(a, b)
function pyAddOne(b) {
  if (typeof b === 'bigint') return b + 1n;
  if (typeof b === 'boolean') return b ? 2n : 1n;
  if (typeof b === 'number') return b + 1;
  if (typeof b === 'string') raise('TypeError', 'can only concatenate str (not "int") to str');
  raise('TypeError', `unsupported operand type(s) for +: '${pyTypeName(b)}' and 'int'`);
}

function floordiv(a, b) {
  const q = a / b;
  return (a % b !== 0n && (a < 0n) !== (b < 0n)) ? q - 1n : q;
}

// int + int stays exact; anything with a float becomes a float
function addNum(a, b) {
  if (typeof a === 'bigint' && typeof b === 'bigint') return a + b;
  return toFloat(a) + toFloat(b);
}

export function toFloat(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'bigint') {
    const f = Number(v);
    if (!Number.isFinite(f)) raise('OverflowError', 'int too large to convert to float');
    return f;
  }
  raise('TypeError', `unsupported operand type(s) for +: '${pyTypeName(v)}' and 'float'`);
}

// exact Python comparison x < y for int (BigInt) / float (number)
function lessThan(x, y) {
  if (typeof x === 'bigint' && typeof y === 'bigint') return x < y;
  if (typeof x === 'number' && typeof y === 'number') return x < y;
  if (typeof x === 'number') { // float < int
    if (Number.isNaN(x)) return false;
    if (!Number.isFinite(x)) return x < 0;
    const fl = BigInt(pyIntText(Math.floor(x)));
    return fl < y; // floor(x) < y  ⇔  x < y  for integer y
  }
  // int < float
  if (Number.isNaN(y)) return false;
  if (!Number.isFinite(y)) return y > 0;
  const fl = BigInt(pyIntText(Math.floor(y)));
  return x < fl || (x === fl && !Number.isInteger(y));
}

// bisect.bisect_right
function bisectRight(a, x, lo, hi) {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lessThan(x, a[mid])) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

function isSequence(v) {
  return typeof v === 'string' || Array.isArray(v) || (v && (v.__pyTuple || v.range !== undefined || v.bytes));
}

// len() as a BigInt: range(n) may exceed 2**53
function seqLenBig(v) {
  if (v && v.range !== undefined) return v.range > 0n ? v.range : 0n;
  return BigInt(seqLen(v));
}

function seqLen(v) {
  if (typeof v === 'string') return [...v].length;
  if (Array.isArray(v)) return v.length;
  if (v.__pyTuple) return v.__pyTuple.length;
  if (v.bytes) return v.bytes.length;
  if (v.range !== undefined) return Number(seqLenBig(v));
  if (v.__pySet) return v.__pySet.length;
  raise('TypeError', `object of type '${pyTypeName(v)}' has no len()`);
}

// seq[i] for 0 <= i, IndexError beyond the end
function seqItem(v, i) {
  const n = seqLen(v);
  if (i >= n) {
    const kind = typeof v === 'string' ? 'string' : pyTypeName(v) === 'range' ? 'range object' : pyTypeName(v);
    raise('IndexError', `${kind} index out of range`);
  }
  if (typeof v === 'string') return [...v][i];
  if (Array.isArray(v)) return v[i];
  if (v.__pyTuple) return v.__pyTuple[i];
  if (v.bytes) return BigInt(v.bytes[i]);
  return BigInt(i); // range(n)
}

function seqList(v) {
  const n = seqLen(v);
  const out = new Array(n);
  for (let i = 0; i < n; i += 1) out[i] = seqItem(v, i);
  return out;
}

// ── demo-input conversion ────────────────────────────────────
// A number typed into a demo appears in the code as its JS text; CPython
// reads that TEXT: '42' is an int (exact BigInt here), '2.5' or '1e+21' a
// float. 'auto' inputs may also be strings (str seeds).
export function lit(v) {
  if (typeof v !== 'number') return v;
  const n = fromLiteral(v);
  return n.int !== undefined ? n.int : n.float;
}

// Python float(x) for an int-or-float demo value
export const asFloat = (v) => toFloat(lit(v));

// A 'float' demo input: always a float literal in the code (2.0, 1e-05);
// infinity prints as the bare name inf, which CPython rejects (NameError).
export function floatArg(v) {
  if (!Number.isFinite(v)) fromLiteral(v);
  return v;
}

// round(x, ndigits) for a float, exactly as CPython: the exact binary
// value rounded half-even to ndigits decimals, read back correctly rounded.
export function pyRound(x, nd) {
  if (!Number.isFinite(x) || x === 0) return x;
  const { m, e } = decompose(Math.abs(x));
  let num = m * 10n ** BigInt(nd);
  let den = 1n;
  if (e >= 0) num <<= BigInt(e);
  else den <<= BigInt(-e);
  let q = num / den;
  const r = num - q * den;
  if (2n * r > den || (2n * r === den && (q & 1n) === 1n)) q += 1n;
  const val = parseFloat(`${q}e-${nd}`);
  return x < 0 ? -val : val;
}

// repr() of bytes
export function pyBytesRepr(bytes) {
  let hasSingle = false;
  let hasDouble = false;
  for (const b of bytes) {
    if (b === 0x27) hasSingle = true;
    if (b === 0x22) hasDouble = true;
  }
  const q = hasSingle && !hasDouble ? '"' : "'";
  let out = 'b' + q;
  for (const b of bytes) {
    if (b === 0x5c) out += '\\\\';
    else if (b === 0x09) out += '\\t';
    else if (b === 0x0a) out += '\\n';
    else if (b === 0x0d) out += '\\r';
    else if (String.fromCharCode(b) === q) out += '\\' + q;
    else if (b >= 0x20 && b < 0x7f) out += String.fromCharCode(b);
    else out += '\\x' + b.toString(16).padStart(2, '0');
  }
  return out + q;
}
export const pyBytes = (bytes) => ({ __pyRaw: pyBytesRepr(bytes) });
