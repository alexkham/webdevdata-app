// utils/emulators/python/stdlib/math/_libm.js
//
// The C math library underneath CPython's math module, as the reader's
// CPython sees it: Linux x86-64, glibc 2.39 (the FMA code paths a modern
// CPU selects). Three kinds of function live here:
//
//   1. Exact IEEE 754 primitives — fma, ldexp, frexp, nextafter, rounding
//      of exact BigInt/rational values to the nearest double.
//   2. Ports of glibc's own double-precision code (sysdeps/ieee754/dbl-64),
//      bit-identical to Linux CPython in all fuzzing: exp, exp2, log, log2,
//      pow (ARM optimized-routines), sin, cos, tan (IBM), expm1, log1p,
//      sinh, cosh, tanh, asinh, acosh, atanh, log10, cbrt, erf, erfc. The
//      -mfma builds are modelled: every a*b+c that GCC contracts is an fma
//      here. Their tables are rebuilt at first use (BigInt fixed point)
//      from the few inputs kept in _glibc_data.js.
//   3. Correctly rounded asin, acos, atan, atan2 (BigInt + Ziv's rounding
//      test). glibc's IBM versions need ~40 KB of tables; they return the
//      correctly rounded result for all but about 1 input in 1000.
//
// Every function takes and returns JS numbers with C semantics (NaN for a
// domain error, ±Infinity for overflow); the Python-level error mapping
// is in _pymath.js.

import { EXP, LOG, LOG2, POWLOG, SINCOS, TAN } from './_glibc_data.js';

const big = BigInt;

// ── bits ──────────────────────────────────────────────────────
const DV = new DataView(new ArrayBuffer(8));
export function toBits(x) { DV.setFloat64(0, x); return DV.getBigUint64(0); }
export function fromBits(b) { DV.setBigUint64(0, BigInt.asUintN(64, b)); return DV.getFloat64(0); }
const hiWord = (x) => { DV.setFloat64(0, x); return DV.getInt32(0); };          // int32_t
const loWord = (x) => { DV.setFloat64(0, x); return DV.getUint32(4); };         // uint32_t
const withHi = (x, hi) => { DV.setFloat64(0, x); DV.setInt32(0, hi | 0); return DV.getFloat64(0); };
const withLo = (x, lo) => { DV.setFloat64(0, x); DV.setUint32(4, lo >>> 0); return DV.getFloat64(0); };

export function bitLen(a) {
  if (a === 0n) return 0;
  const s = a.toString(16);
  return (s.length - 1) * 4 + (32 - Math.clz32(parseInt(s[0], 16)));
}

// finite nonzero x → { neg, m, e } with |x| = m * 2**e (m < 2**53)
export function decompose(x) {
  const b = toBits(x);
  const neg = (b >> 63n) === 1n;
  const be = Number((b >> 52n) & 0x7ffn);
  let m = b & 0xfffffffffffffn;
  let e;
  if (be === 0) e = -1074;
  else { m |= 1n << 52n; e = be - 1075; }
  return { neg, m, e };
}

const pow2 = (n) => (n >= -1022 ? fromBits(big(n + 1023) << 52n) : fromBits(1n << big(n + 1074)));

// x * 2**n exactly, for a result that is representable (or overflows)
function scale2(x, n) {
  while (n > 1023) { x *= pow2(1023); n -= 1023; }
  while (n < -1022) { x *= pow2(-1022); n += 1022; }
  return x * pow2(n);
}

// v * 2**e (v a signed BigInt) rounded to the nearest double, ties to even,
// with gradual underflow and overflow to ±Infinity.
export function roundScaled(v, e) {
  if (v === 0n) return 0;
  const neg = v < 0n;
  const a = neg ? -v : v;
  const L = bitLen(a);
  const E = L - 1 + e;
  if (E > 1024) return neg ? -Infinity : Infinity;
  let bits = 53;
  if (E < -1022) bits = 53 - (-1022 - E);
  const shift = L - bits;
  let q;
  let ex;
  if (shift <= 0) { q = a; ex = e; } else {
    const sh = big(shift);
    q = a >> sh;
    const rem = a - (q << sh);
    const half = 1n << (sh - 1n);
    if (rem > half || (rem === half && (q & 1n) === 1n)) q += 1n;
    ex = e + shift;
  }
  if (q === 0n) return neg ? -0 : 0;
  const r = scale2(Number(q), ex);
  return neg ? -r : r;
}

// (num / den) * 2**e, num and den positive BigInts, correctly rounded
export function roundFrac(num, den, e, neg = false) {
  const K = Math.max(0, 64 + bitLen(den) - bitLen(num));
  const n = num << big(K);
  const q = n / den;
  const sticky = n - q * den === 0n ? 0n : 1n;
  const v = (q << 1n) | sticky;
  return roundScaled(neg ? -v : v, e - K - 1);
}

// ── exact IEEE primitives ─────────────────────────────────────
export function ldexp(x, n) {
  if (x === 0 || !Number.isFinite(x)) return x;
  const { neg, m, e } = decompose(x);
  if (n > 5000) n = 5000;
  if (n < -5000) n = -5000;
  return roundScaled(neg ? -m : m, e + n);
}

// [m, e] with x = m * 2**e, 0.5 <= |m| < 1 (C frexp; specials → [x, 0])
export function frexp(x) {
  if (x === 0 || !Number.isFinite(x)) return [x, 0];
  const { neg, m, e } = decompose(x);
  const L = bitLen(m);
  const mm = scale2(Number(m), -L);
  return [neg ? -mm : mm, e + L];
}

export function nextafter(x, y) {
  if (Number.isNaN(x) || Number.isNaN(y)) return x + y;
  if (x === y) return y;
  if (x === 0) return y > 0 ? pow2(-1074) : -pow2(-1074);
  const b = toBits(x);
  const up = (y > x) === (x > 0);
  return fromBits(up ? b + 1n : b - 1n);
}

// fused multiply-add, one rounding (C fma)
export function fma(a, b, c) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    if (Number.isFinite(a) && Number.isFinite(b)) return c + 0 * a * b; // finite product: c decides
    return a * b + c;
  }
  if (a === 0 || b === 0) return a * b + c;
  const A = decompose(a);
  const B = decompose(b);
  let pm = A.m * B.m;
  if (A.neg !== B.neg) pm = -pm;
  const pe = A.e + B.e;
  if (c === 0) return roundScaled(pm, pe);
  const C = decompose(c);
  const cm = C.neg ? -C.m : C.m;
  const e = Math.min(pe, C.e);
  const s = (pm << big(pe - e)) + (cm << big(C.e - e));
  if (s === 0n) return 0;
  return roundScaled(s, e);
}

// ── BigInt helpers ────────────────────────────────────────────
export function isqrtBig(n) {
  if (n < 2n) return n;
  let x = 1n << big(Math.ceil(bitLen(n) / 2));
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (y >= x) return x;
    x = y;
  }
}

// ── BigInt fixed-point kernel ─────────────────────────────────
// Values are BigInts v standing for v / 2**S. Used (1) to rebuild glibc's
// tables at first use instead of shipping them, and (2) for the correctly
// rounded asin / acos / atan / atan2.
const tmul = (a, b, S) => { const p = a * b; return p >= 0n ? p >> S : -((-p) >> S); };

// signed x (finite) at scale S, truncated toward zero
function toFixed(x, S) {
  if (x === 0) return 0n;
  const { neg, m, e } = decompose(x);
  const sh = e + S;
  const v = sh >= 0 ? m << big(sh) : m >> big(-sh);
  return neg ? -v : v;
}

function atanhInv(n, S) { // atanh(1/n)
  const N = big(n);
  const N2 = N * N;
  let term = (1n << big(S)) / N;
  let sum = term;
  for (let k = 3n; term !== 0n; k += 2n) { term /= N2; sum += term / k; }
  return sum;
}
function atanInv(n, S) { // atan(1/n)
  const N = big(n);
  const N2 = N * N;
  let term = (1n << big(S)) / N;
  let sum = term;
  let sign = -1n;
  for (let k = 3n; term !== 0n; k += 2n) { term /= N2; sum += sign * (term / k); sign = -sign; }
  return sum;
}
const constCache = { ln2: { S: 0, v: 0n }, pi: { S: 0, v: 0n } };
function cachedConst(name, S, compute) {
  const c = constCache[name];
  if (c.S < S) {
    const W = Math.max(S, 2 * c.S, 256) + 32;
    c.v = compute(W) >> 32n;
    c.S = W - 32;
  }
  return c.v >> big(c.S - S);
}
const LN2 = (S) => cachedConst('ln2', S, (W) => 2n * atanhInv(3, W));
const PI = (S) => cachedConst('pi', S, (W) => 16n * atanInv(5, W) - 4n * atanInv(239, W));

// exp(r) for |r| <= ~1, scale S
function expF(r, S) {
  const k = Math.max(1, Math.ceil(Math.sqrt(S) / 2));
  const G = big(S + k + 24);
  const one = 1n << G;
  const x = (r << big(k + 24)) >> big(k);
  let term = one;
  let sum = one;
  for (let n = 1n; term !== 0n; n++) { term = tmul(term, x, G) / n; sum += term; }
  for (let i = 0; i < k; i++) sum = tmul(sum, sum, G);
  return sum >> big(k + 24);
}
// log(y) for y in about [0.7, 1.5], scale S
function logF(y, S) {
  const G = big(S + 24);
  const one = 1n << G;
  const Y = y << 24n;
  const s = ((Y - one) << G) / (Y + one);
  const s2 = tmul(s, s, G);
  let term = s;
  let sum = s;
  for (let k = 3n; term !== 0n; k += 2n) { term = tmul(term, s2, G); sum += term / k; }
  return tmul(2n * sum, 1n, 24n);
}
// log of a positive finite double at scale S: n*ln2 + log(y)
function logAt(x, S) {
  const { m, e } = decompose(x);
  const L = bitLen(m);
  let n = L - 1 + e;
  if ((m >> big(L - 2)) === 3n) n += 1;
  const sh = e - n + S;
  const Y = sh >= 0 ? m << big(sh) : m >> big(-sh);
  return logF(Y, S) + big(n) * LN2(S);
}
// atan(t) for |t| <= 1, scale S
function atanF(t, S) {
  if (t < 0n) return -atanF(-t, S);
  const G = big(S + 24);
  const one = 1n << G;
  let x = t << 24n;
  for (let i = 0; i < 2; i++) {
    const x2 = tmul(x, x, G);
    const r = isqrtBig((one + x2) << G);
    x = (x << G) / (one + r);
  }
  const x2 = tmul(x, x, G);
  let term = x;
  let sum = x;
  let sign = -1n;
  for (let k = 3n; term !== 0n; k += 2n) { term = tmul(term, x2, G); sum += sign * (term / k); sign = -sign; }
  return (4n * sum) >> 24n;
}
// [sin r, cos r] for |r| <= ~1, scale S
function sinCosF(r, S) {
  const G = big(S + 24);
  const one = 1n << G;
  const x = r << 24n;
  const x2 = tmul(x, x, G);
  let term = x;
  let s = x;
  for (let n = 2n; term !== 0n; n += 2n) { term = -tmul(term, x2, G) / (n * (n + 1n)); s += term; }
  term = one;
  let c = one;
  for (let n = 1n; term !== 0n; n += 2n) { term = -tmul(term, x2, G) / (n * (n + 1n)); c += term; }
  return [s >> 24n, c >> 24n];
}

// Ziv's loop: approx(p) returns { v, e } with |true - v*2**e| <= 64*2**e
// and v carrying at least p significant bits.
function ziv(approx) {
  for (let p = 64; p <= 1 << 15; p *= 2) {
    const { v, e } = approx(p);
    const lo = roundScaled(v - 64n, e);
    const hi = roundScaled(v + 64n, e);
    if (Object.is(lo, hi)) return lo;
  }
  const { v, e } = approx(1 << 15);
  return roundScaled(v, e);
}
const expo = (est) => (est === 0 || !Number.isFinite(est) ? 0 : Math.floor(Math.log2(Math.abs(est))));

// ── tables rebuilt at first use ───────────────────────────────
// glibc's tables are correctly rounded values of 2**(k/128), log(c),
// sin/cos(k/128) and tan(x_i); only the inputs (invc, the x_i offsets)
// and the few low parts that are not correctly rounded are stored in
// _glibc_data.js.
// The rebuilt tables are bit-identical to glibc 2.39's (checked).
const TABLE_S = 240;
const lazy = (build) => { let t = null; return () => t || (t = build()); };
const fixedToDouble = (v, S) => roundScaled(v, -S);

const expTable = lazy(() => {
  const out = [];
  for (let k = 0; k < 128; k++) {
    // 2**(k/128) = exp(k * ln2 / 128)
    const r = (big(k) * LN2(TABLE_S)) / 128n;
    const v = expF(r, TABLE_S);
    const H = fixedToDouble(v, TABLE_S);
    const T = fixedToDouble(((v << big(TABLE_S)) / toFixed(H, TABLE_S)) - (1n << big(TABLE_S)), TABLE_S);
    out.push(toBits(T), U64(toBits(H) - ((big(k) << 52n) / 128n)));
  }
  return out;
});
const logTable = (invcs, base2) => () => {
  const out = [];
  const ln2 = LN2(TABLE_S);
  for (const invc of invcs) {
    let v = -logAt(invc, TABLE_S);
    if (base2) v = (v << big(TABLE_S)) / ln2;
    out.push(invc, fixedToDouble(v, TABLE_S));
  }
  return out;
};
const powTable = lazy(() => {
  const out = [];
  for (const j of POWLOG.invc256) {
    const invc = j / 256;
    const v = -logAt(invc, TABLE_S); // log(c), c = 1/invc
    // logc = round(2**43 * log(c)) / 2**43, logctail = (double)(log(c) - logc)
    const unit = 1n << big(TABLE_S - 43);
    const q = v >= 0n ? (v + unit / 2n) / unit : -((-v + unit / 2n) / unit);
    const logcFixed = q * unit;
    out.push(invc, fixedToDouble(logcFixed, TABLE_S), fixedToDouble(v - logcFixed, TABLE_S));
  }
  return out;
});
const sincosTable = lazy(() => {
  // hi parts and low residuals of sin/cos(k/128); glibc's low parts are
  // not all correctly rounded, the exceptions are listed in loPatch
  const lo = [];
  const out = [];
  for (let k = 0; k < SINCOS.rows; k++) {
    const [s, c] = sinCosF((1n << big(TABLE_S)) * big(k) / 128n, TABLE_S);
    const sh = fixedToDouble(s, TABLE_S);
    const ch = fixedToDouble(c, TABLE_S);
    lo.push(fixedToDouble(s - toFixed(sh, TABLE_S), TABLE_S), fixedToDouble(c - toFixed(ch, TABLE_S), TABLE_S));
    out.push(sh, 0, ch, 0);
  }
  for (let i = 0; i < SINCOS.loPatch.length; i += 2) lo[SINCOS.loPatch[i]] = SINCOS.loPatch[i + 1];
  for (let k = 0; k < SINCOS.rows; k++) { out[4 * k + 1] = lo[2 * k]; out[4 * k + 3] = lo[2 * k + 1]; }
  return out;
});
const tanTable = lazy(() => {
  const out = [];
  for (let i = 0; i < TAN.xiOffset.length; i++) {
    const xi = (i + 16) / 256 + TAN.xiOffset[i] * 2 ** -57; // exact
    const [s, c] = sinCosF(toFixed(xi, TABLE_S), TABLE_S);
    const t = (s << big(TABLE_S)) / c;
    const Fi = fixedToDouble(t, TABLE_S);
    out.push(xi, Fi, fixedToDouble((c << big(TABLE_S)) / s, TABLE_S), fixedToDouble(t - toFixed(Fi, TABLE_S), TABLE_S));
  }
  return out;
});

// ── correctly rounded asin, acos, atan, atan2 ─────────────────
// glibc's IBM implementations of these need ~40 KB of tables; here they
// are computed exactly and rounded once. glibc agrees with the correctly
// rounded result for all but about 1 input in 1000 (fuzzed).
function atanRatio(num, den, S) {
  if (num <= den) return atanF((num << big(S)) / den, S);
  return PI(S - 1) - atanF((den << big(S)) / num, S);
}
function roundPiFrac(a, b, neg) {
  return ziv((p) => {
    const S = p + 32;
    const v = (PI(S) * big(a)) / big(b);
    return { v: neg ? -v : v, e: -S };
  });
}
export function atan(x) {
  if (Number.isNaN(x)) return x;
  if (x === Infinity) return roundPiFrac(1, 2, false);
  if (x === -Infinity) return roundPiFrac(1, 2, true);
  if (x === 0) return x;
  return ziv((p) => {
    const S = p + 32 + Math.max(0, -expo(Math.atan(x))) + 2;
    const W = S + 16;
    const { neg, m, e } = decompose(x);
    const num = e >= 0 ? m << big(e) : m;
    const den = e >= 0 ? 1n : 1n << big(-e);
    const v = atanRatio(num, den, W) >> 16n;
    return { v: neg ? -v : v, e: -S };
  });
}
// sqrt(1 - x*x) and |x| as fixed values at scale S, for |x| < 1
function cofactor(x, S) {
  const { m, e } = decompose(x);
  const N = (1n << big(-2 * e)) - m * m;
  const sh = 2 * S + 2 * e;
  const s = isqrtBig(sh >= 0 ? N << big(sh) : N >> big(-sh));
  return { s, X: toFixed(Math.abs(x), S) };
}
export function asin(x) {
  if (Number.isNaN(x)) return x;
  if (Math.abs(x) > 1) return NaN;
  if (x === 0) return x;
  if (x === 1) return roundPiFrac(1, 2, false);
  if (x === -1) return roundPiFrac(1, 2, true);
  return ziv((p) => {
    const S = p + 32 + Math.max(0, -expo(Math.asin(x))) + 2;
    const W = S + 16;
    const { s, X } = cofactor(x, W);
    const v = atanRatio(X, s, W) >> 16n;
    return { v: x < 0 ? -v : v, e: -S };
  });
}
export function acos(x) {
  if (Number.isNaN(x)) return x;
  if (Math.abs(x) > 1) return NaN;
  if (x === 1) return 0;
  if (x === -1) return roundPiFrac(1, 1, false);
  if (x === 0) return roundPiFrac(1, 2, false);
  return ziv((p) => {
    const S = p + 32 + Math.max(0, -expo(Math.acos(x))) + 2;
    const W = S + 16;
    const { s, X } = cofactor(x, W);
    let v = atanRatio(s, X, W);
    if (x < 0) v = PI(W) - v;
    return { v: v >> 16n, e: -S };
  });
}
// atan2 for finite y != 0 and finite x (CPython's m_atan2 handles the rest)
export function atan2(y, x) {
  if (Number.isNaN(x) || Number.isNaN(y)) return NaN;
  if (x === 0) return roundPiFrac(1, 2, y < 0);
  const Y = decompose(y);
  const X = decompose(x);
  const ey = Y.e + bitLen(Y.m);
  const ex = X.e + bitLen(X.m);
  if (x > 0 && ey - ex < -1080) return y < 0 ? -0 : 0;
  const extra = x > 0 ? Math.max(0, ex - ey) : 0;
  return ziv((p) => {
    const S = p + 32 + extra + 4;
    const W = S + 16;
    const e = Math.min(Y.e, X.e);
    const ny = Y.m << big(Y.e - e);
    const nx = X.m << big(X.e - e);
    let v = atanRatio(ny, nx, W);
    if (x < 0) v = PI(W) - v;
    v >>= 16n;
    return { v: y < 0 ? -v : v, e: -S };
  });
}

// ── glibc's exp, log, log2, pow (ARM optimized-routines) ──────
// Ported from the e_*-fma.c builds. GCC (-ffp-contract=fast) turns a
// product into an fma when every use of it is an addition or subtraction
// in the same basic block; each fma() below is such a contraction (or an
// explicit __builtin_fma in the source).
const [C2, C3, C4, C5] = EXP.poly;
const U64 = (v) => BigInt.asUintN(64, v);
const top12 = (x) => Number(toBits(x) >> 52n);
const BITS_ONE = 0x3ff0000000000000n;
const BITS_INF = 0x7ff0000000000000n;
const SIGN = 0x8000000000000000n;

// exp(x) ~ scale * (1 + tmp): the reduction shared by exp and pow
function expCore(x, xtail, signBias) {
  const kd0 = fma(EXP.invln2N, x, EXP.shift);
  const ki = toBits(kd0);
  const kd = kd0 - EXP.shift;
  let r = fma(kd, EXP.negln2loN, fma(kd, EXP.negln2hiN, x));
  if (xtail !== null) r += xtail;
  const idx = Number(ki % 128n) * 2;
  const top = U64((ki + signBias) << 45n);
  const T = expTable();
  const tail = fromBits(T[idx]);
  const sbits = U64(T[idx + 1] + top);
  const r2 = r * r;
  const tmp = fma(r2 * r2, fma(r, C5, C4), fma(r2, fma(r, C3, C2), tail + r));
  return { tmp, sbits, ki };
}

export function exp(x) {
  let abstop = top12(x) & 0x7ff;
  if (abstop - 0x3c9 < 0 || abstop - 0x3c9 >= 0x408 - 0x3c9) {
    if (abstop - 0x3c9 < 0) return 1.0 + x;
    if (abstop >= 0x409) {
      if (x === -Infinity) return 0.0;
      if (abstop >= 0x7ff) return 1.0 + x;
      return x < 0 ? 0 : Infinity;
    }
    abstop = 0;
  }
  const { tmp, sbits, ki } = expCore(x, null, 0n);
  if (abstop === 0) {
    // specialcase (e_exp.c)
    if ((ki & 0x80000000n) === 0n) {
      const scale = fromBits(U64(sbits - (1009n << 52n)));
      return 2 ** 1009 * fma(scale, tmp, scale);
    }
    const scale = fromBits(U64(sbits + (1022n << 52n)));
    const m = scale * tmp; // used in two blocks: not contracted
    let y = scale + m;
    if (y < 1.0) {
      let lo = scale - y + m;
      const hi = 1.0 + y;
      lo = 1.0 - hi + y + lo;
      y = (hi + lo) - 1.0;
      if (y === 0) y = 0;
    }
    return 2 ** -1022 * y;
  }
  const scale = fromBits(sbits);
  return fma(scale, tmp, scale);
}

const LOG_T = lazy(logTable(LOG.invc, false));
const LOG_LO = toBits(1.0 - 2 ** -4);
const LOG_HI = toBits(1.0 + (0x109 / 0x100) * 2 ** -4);
const LOG_OFF = 0x3fe6000000000000n;

// subnormal / special handling shared by log and log2: the normalized
// bits, or the result when it is decided here
function logSpecial(x, ix, top) {
  if (U64(ix * 2n) === 0n) return -Infinity;
  if (ix === BITS_INF) return x;
  if ((top & 0x8000) || (top & 0x7ff0) === 0x7ff0) return NaN;
  return U64(toBits(x * 2 ** 52) - (52n << 52n));
}

// exp2: e_exp2.c (generic build, no fma)
export function exp2(x) {
  const [E1, E2, E3, E4, E5] = EXP.exp2poly;
  let abstop = top12(x) & 0x7ff;
  if (abstop - 0x3c9 < 0 || abstop - 0x3c9 >= 0x408 - 0x3c9) {
    if (abstop - 0x3c9 < 0) return 1.0 + x;
    if (abstop >= 0x409) {
      if (x === -Infinity) return 0.0;
      if (abstop >= 0x7ff) return 1.0 + x;
      if (x > 0) return Infinity;
      if (toBits(x) >= toBits(-1075.0)) return 0;
    }
    if (U64(2n * toBits(x)) > U64(2n * toBits(928.0))) abstop = 0;
  }
  let kd = x + EXP.exp2shift;
  const ki = toBits(kd);
  kd -= EXP.exp2shift;
  const r = x - kd;
  const idx = Number(ki % 128n) * 2;
  const top = U64(ki << 45n);
  const T = expTable();
  const tail = fromBits(T[idx]);
  let sbits = U64(T[idx + 1] + top);
  const r2 = r * r;
  const tmp = ((tail + r * E1) + r2 * (E2 + r * E3)) + r2 * r2 * (E4 + r * E5);
  if (abstop === 0) {
    if ((ki & 0x80000000n) === 0n) {
      sbits = U64(sbits - (1n << 52n));
      const scale = fromBits(sbits);
      return 2 * (scale + scale * tmp);
    }
    const scale = fromBits(U64(sbits + (1022n << 52n)));
    let y = scale + scale * tmp;
    if (y < 1.0) {
      let lo = scale - y + scale * tmp;
      const hi = 1.0 + y;
      lo = 1.0 - hi + y + lo;
      y = (hi + lo) - 1.0;
      if (y === 0) y = 0;
    }
    return 2 ** -1022 * y;
  }
  const scale = fromBits(sbits);
  return scale + scale * tmp;
}

export function log(x) {
  let ix = toBits(x);
  const top = Number(ix >> 48n);
  if (U64(ix - LOG_LO) < LOG_HI - LOG_LO) {
    if (ix === BITS_ONE) return 0;
    const B = LOG.poly1;
    const r = x - 1.0;
    const r2 = r * r;
    const r3 = r * r2;
    const in3 = fma(r3, B[10], fma(r2, B[9], fma(r, B[8], B[7])));
    const in2 = fma(r3, in3, fma(r2, B[6], fma(r, B[5], B[4])));
    const in1 = fma(r3, in2, fma(r2, B[3], fma(r, B[2], B[1])));
    const w = r * 2 ** 27;
    const rhi = r + w - w;
    const rlo = r - rhi;
    const a = rhi * rhi;
    const hi = fma(a, B[0], r);
    let lo = fma(a, B[0], r - hi);
    lo = fma(B[0] * rlo, rhi + r, lo);
    let y = fma(r3, in1, lo);
    y += hi;
    return y;
  }
  if (top - 0x0010 < 0 || top - 0x0010 >= 0x7ff0 - 0x0010) {
    const s = logSpecial(x, ix, top);
    if (typeof s === 'number') return s;
    ix = s;
  }
  const tmp = U64(ix - LOG_OFF);
  const i = Number((tmp >> 45n) % 128n);
  const k = Number(BigInt.asIntN(64, tmp) >> 52n);
  const iz = U64(ix - (tmp & (0xfffn << 52n)));
  const T = LOG_T();
  const invc = T[2 * i];
  const logc = T[2 * i + 1];
  const z = fromBits(iz);
  const r = fma(z, invc, -1.0);
  const kd = k;
  const w = fma(kd, LOG.ln2hi, logc);
  const hi = w + r;
  const lo = fma(kd, LOG.ln2lo, w - hi + r);
  const r2 = r * r;
  const A = LOG.poly;
  const q = fma(r2, fma(r, A[4], A[3]), fma(r, A[2], A[1]));
  return fma(r * r2, q, fma(r2, A[0], lo)) + hi;
}

const LOG2_T = lazy(logTable(LOG2.invc, true));
const LOG2_LO = toBits(1.0 - (0x15b51 / 0x10000) * 2 ** -5);
const LOG2_HI = toBits(1.0 + (0x16ab2 / 0x10000) * 2 ** -5);

export function log2(x) {
  let ix = toBits(x);
  const top = Number(ix >> 48n);
  const { invln2hi, invln2lo } = LOG2;
  if (U64(ix - LOG2_LO) < LOG2_HI - LOG2_LO) {
    if (ix === BITS_ONE) return 0;
    const B = LOG2.poly1;
    const r = x - 1.0;
    const hi = r * invln2hi;
    let lo = fma(r, invln2lo, fma(r, invln2hi, -hi));
    const r2 = r * r;
    const r4 = r2 * r2;
    const pb = fma(r, B[1], B[0]);
    const y = fma(r2, pb, hi);
    lo += fma(r2, pb, hi - y);
    const s1 = fma(r2, fma(r, B[5], B[4]), fma(r, B[3], B[2]));
    const s2 = fma(r2, fma(r, B[9], B[8]), fma(r, B[7], B[6]));
    lo = fma(r4, fma(r4, s2, s1), lo);
    return y + lo;
  }
  if (top - 0x0010 < 0 || top - 0x0010 >= 0x7ff0 - 0x0010) {
    const s = logSpecial(x, ix, top);
    if (typeof s === 'number') return s;
    ix = s;
  }
  const tmp = U64(ix - LOG_OFF);
  const i = Number((tmp >> 46n) % 64n);
  const k = Number(BigInt.asIntN(64, tmp) >> 52n);
  const iz = U64(ix - (tmp & (0xfffn << 52n)));
  const T = LOG2_T();
  const invc = T[2 * i];
  const logc = T[2 * i + 1];
  const z = fromBits(iz);
  const kd = k;
  const r = fma(z, invc, -1.0);
  const t1 = r * invln2hi;
  const t2 = fma(r, invln2lo, fma(r, invln2hi, -t1));
  const t3 = kd + logc;
  const hi = t3 + t1;
  const lo = t3 - hi + t1 + t2;
  const r2 = r * r;
  const r4 = r2 * r2;
  const A = LOG2.poly;
  const p = fma(r4, fma(r, A[5], A[4]), fma(r2, fma(r, A[3], A[2]), fma(r, A[1], A[0])));
  return fma(r2, p, lo) + hi;
}

const POW_OFF = 0x3fe6955500000000n;
const SIGN_BIAS = 0x800n << 7n;

function powLog(ix) {
  const A = POWLOG.poly;
  const tmp = U64(ix - POW_OFF);
  const i = Number((tmp >> 45n) % 128n);
  const k = Number(BigInt.asIntN(64, tmp) >> 52n);
  const iz = U64(ix - (tmp & (0xfffn << 52n)));
  const z = fromBits(iz);
  const kd = k;
  const T = powTable();
  const invc = T[3 * i];
  const logc = T[3 * i + 1];
  const logctail = T[3 * i + 2];
  const r = fma(z, invc, -1.0);
  const t1 = fma(kd, POWLOG.ln2hi, logc);
  const t2 = t1 + r;
  const lo1 = fma(kd, POWLOG.ln2lo, logctail);
  const lo2 = t1 - t2 + r;
  const ar = A[0] * r;
  const ar2 = r * ar;
  const ar3 = r * ar2;
  const hi = t2 + ar2;
  const lo3 = fma(ar, r, -ar2);
  const lo4 = t2 - hi + ar2;
  const q = fma(ar2, fma(ar2, fma(r, A[6], A[5]), fma(r, A[4], A[3])), fma(r, A[2], A[1]));
  const lo = fma(ar3, q, lo1 + lo2 + lo3 + lo4);
  const y = hi + lo;
  return [y, hi - y + lo];
}

function powExp(x, xtail, signBias) {
  let abstop = top12(x) & 0x7ff;
  if (abstop - 0x3c9 < 0 || abstop - 0x3c9 >= 0x408 - 0x3c9) {
    if (abstop - 0x3c9 < 0) {
      const one = 1.0 + x;
      return signBias ? -one : one;
    }
    if (abstop >= 0x409) {
      if (x < 0) return signBias ? -0 : 0;
      return signBias ? -Infinity : Infinity;
    }
    abstop = 0;
  }
  const { tmp, sbits, ki } = expCore(x, xtail, signBias);
  if (abstop === 0) {
    if ((ki & 0x80000000n) === 0n) {
      const scale = fromBits(U64(sbits - (1009n << 52n)));
      return 2 ** 1009 * fma(scale, tmp, scale);
    }
    const sb = U64(sbits + (1022n << 52n));
    const scale = fromBits(sb);
    const m = scale * tmp;
    let y = scale + m;
    if (Math.abs(y) < 1.0) {
      const one = y < 0.0 ? -1.0 : 1.0;
      let lo = scale - y + m;
      const hi = one + y;
      lo = one - hi + y + lo;
      y = (hi + lo) - one;
      if (y === 0.0) y = fromBits(sb & SIGN);
    }
    return 2 ** -1022 * y;
  }
  const scale = fromBits(sbits);
  return fma(scale, tmp, scale);
}

function checkint(iy) {
  const e = Number((iy >> 52n) & 0x7ffn);
  if (e < 0x3ff) return 0;
  if (e > 0x3ff + 52) return 2;
  const sh = big(0x3ff + 52 - e);
  if (iy & ((1n << sh) - 1n)) return 0;
  if (iy & (1n << sh)) return 1;
  return 2;
}
const zeroinfnan = (i) => U64(2n * i - 1n) >= U64(2n * BITS_INF - 1n);

export function pow(x, y) {
  let signBias = 0n;
  let ix = toBits(x);
  const iy = toBits(y);
  let topx = Number(ix >> 52n);
  const topy = Number(iy >> 52n);
  const ty = topy & 0x7ff;
  if (topx - 0x001 < 0 || topx - 0x001 >= 0x7ff - 0x001 || ty - 0x3be < 0 || ty - 0x3be >= 0x43e - 0x3be) {
    if (zeroinfnan(iy)) {
      if (U64(2n * iy) === 0n) return 1.0;
      if (ix === BITS_ONE) return 1.0;
      if (U64(2n * ix) > U64(2n * BITS_INF) || U64(2n * iy) > U64(2n * BITS_INF)) return x + y;
      if (U64(2n * ix) === U64(2n * BITS_ONE)) return 1.0;
      if ((U64(2n * ix) < U64(2n * BITS_ONE)) === !(iy >> 63n)) return 0.0;
      return y * y;
    }
    if (zeroinfnan(ix)) {
      let x2 = x * x;
      let neg = false;
      if ((ix >> 63n) && checkint(iy) === 1) { x2 = -x2; neg = true; }
      if (U64(2n * ix) === 0n && (iy >> 63n)) return neg ? -Infinity : Infinity;
      return (iy >> 63n) ? 1 / x2 : x2;
    }
    if (ix >> 63n) {
      const yint = checkint(iy);
      if (yint === 0) return NaN;
      if (yint === 1) signBias = SIGN_BIAS;
      ix &= 0x7fffffffffffffffn;
      topx &= 0x7ff;
    }
    if (ty - 0x3be < 0 || ty - 0x3be >= 0x43e - 0x3be) {
      if (ix === BITS_ONE) return 1.0;
      if (ty < 0x3be) return ix > BITS_ONE ? 1.0 + y : 1.0 - y;
      return (ix > BITS_ONE) === (topy < 0x800) ? Infinity : 0;
    }
    if (topx === 0) {
      ix = toBits(x * 2 ** 52) & 0x7fffffffffffffffn;
      ix = U64(ix - (52n << 52n));
    }
  }
  const [hi, lo] = powLog(ix);
  const ehi = y * hi;
  const elo = fma(y, lo, fma(y, hi, -ehi));
  return powExp(ehi, elo, signBias);
}

// ── glibc's sin and cos (IBM Accurate Mathematical Library) ───
// s_sin.c as built in s_sin-fma.c (-mfma: contracted products are fma()
// below), with branred.c (built without fma) for |x| >= 105414350.
const {
  s1, s2, s3, s4, s5, big: SBIG, hp0, hp1, mp1, mp2, pp3, pp4, hpinv, toint,
  sn3, sn5, cs2, cs4, cs6, brBig, brBig1, brHp0, brHp1, brMp1, brMp2, toverp: TOVERP,
} = SINCOS;
const SPLIT = 134217729.0;

function doCos(x, dx) {
  if (x < 0) dx = -dx;
  const ax = Math.abs(x);
  const u = SBIG + ax;
  x = ax - (u - SBIG) + dx;
  const xx = x * x;
  const s = fma(x * xx, fma(xx, sn5, sn3), x);
  const c = xx * fma(xx, fma(xx, cs6, cs4), cs2);
  const k = loWord(u) << 2;
  const SCT = sincosTable();
  const sn = SCT[k], ssn = SCT[k + 1], cs = SCT[k + 2], ccs = SCT[k + 3];
  const cor = fma(-sn, s, fma(-cs, c, fma(-s, ssn, ccs)));
  return cs + cor;
}

function doSin(x, dx) {
  const xold = x;
  if (Math.abs(x) < 0.126) {
    const xx = x * x;
    const poly = fma(fma(fma(fma(s5, xx, s4), xx, s3), xx, s2), xx, s1);
    const t = fma(fma(poly, x, -(0.5 * dx)), xx, dx);
    return x + t;
  }
  if (x <= 0) dx = -dx;
  const ax = Math.abs(x);
  const u = SBIG + ax;
  x = ax - (u - SBIG);
  const xx = x * x;
  const s = x + fma(x * xx, fma(xx, sn5, sn3), dx);
  const c = fma(x, dx, xx * fma(xx, fma(xx, cs6, cs4), cs2));
  const k = loWord(u) << 2;
  const SCT = sincosTable();
  const sn = SCT[k], ssn = SCT[k + 1], cs = SCT[k + 2], ccs = SCT[k + 3];
  const cor = fma(cs, s, fma(-sn, c, fma(s, ccs, ssn)));
  return copysign(sn + cor, xold);
}

function reduceSincos(x) {
  const t = fma(x, hpinv, toint);
  const xn = t - toint;
  const y = fma(-xn, mp2, fma(-xn, mp1, x));
  const n = loWord(t) & 3;
  const t2 = fma(-xn, pp3, y);
  let db = fma(-xn, pp3, y - t2);
  const b = fma(-xn, pp4, t2);
  db += fma(-xn, pp4, t2 - b);
  return [n, b, db];
}

function doSincos(a, da, n) {
  const r = (n & 1) ? doCos(a, da) : doSin(a, da);
  return (n & 2) ? -r : r;
}

function branredHalf(xv, r) {
  let sum = 0;
  let k = (hiWord(xv) >> 20) & 2047;
  k = Math.trunc((k - 450) / 24);
  if (k < 0) k = 0;
  const t576 = 2 ** 576;
  let gor = withHi(t576, hiWord(t576) - ((k * 24) << 20));
  for (let i = 0; i < 6; i++) { r[i] = xv * TOVERP[k + i] * gor; gor *= 2 ** -24; }
  let s;
  for (let i = 0; i < 3; i++) { s = (r[i] + brBig) - brBig; sum += s; r[i] -= s; }
  let t = 0;
  for (let i = 0; i < 6; i++) t += r[5 - i];
  let bb = (((((r[0] - t) + r[1]) + r[2]) + r[3]) + r[4]) + r[5];
  s = (t + brBig) - brBig;
  sum += s;
  t -= s;
  const b = t + bb;
  bb = (t - b) + bb;
  s = (sum + brBig1) - brBig1;
  sum -= s;
  return [b, bb, sum];
}

function branred(x) {
  const r = [0, 0, 0, 0, 0, 0];
  x *= 2 ** -600;
  let t = x * SPLIT;
  const x1 = t - (t - x);
  const x2 = x - x1;
  const [b1, bb1, sum1] = branredHalf(x1, r);
  const [b2, bb2, sum2] = branredHalf(x2, r);
  let sum = sum1 + sum2;
  let b = b1 + b2;
  let bb = Math.abs(b1) > Math.abs(b2) ? (b1 - b) + b2 : (b2 - b) + b1;
  if (b > 0.5) { b -= 1.0; sum += 1.0; } else if (b < -0.5) { b += 1.0; sum -= 1.0; }
  let s = b + (bb + bb1 + bb2);
  t = ((b - s) + bb) + (bb1 + bb2);
  b = s * SPLIT;
  const t1 = b - (b - s);
  const t2 = s - t1;
  b = s * brHp0;
  bb = (((t1 * brMp1 - b) + t1 * brMp2) + t2 * brMp1) + (t2 * brMp2 + s * brHp1 + t * brHp0);
  s = b + bb;
  t = (b - s) + bb;
  return [Math.trunc(sum) & 3, s, t];
}

export function sin(x) {
  const k = hiWord(x) & 0x7fffffff;
  if (k < 0x3e500000) return x;
  if (k < 0x3feb6000) return doSin(x, 0);
  if (k < 0x400368fd) return copysign(doCos(hp0 - Math.abs(x), hp1), x);
  if (k < 0x419921FB) { const [n, a, da] = reduceSincos(x); return doSincos(a, da, n); }
  if (k < 0x7ff00000) { const [n, a, da] = branred(x); return doSincos(a, da, n); }
  return x / x;
}

export function cos(x) {
  const k = hiWord(x) & 0x7fffffff;
  if (k < 0x3e400000) return 1.0;
  if (k < 0x3feb6000) return doCos(x, 0);
  if (k < 0x400368fd) {
    const y = hp0 - Math.abs(x);
    const a = y + hp1;
    const da = (y - a) + hp1;
    return doSin(a, da);
  }
  if (k < 0x419921FB) { const [n, a, da] = reduceSincos(x); return doSincos(a, da, n + 1); }
  if (k < 0x7ff00000) { const [n, a, da] = branred(x); return doSincos(a, da, n + 1); }
  return x / x;
}

// ── glibc's tan (IBM, s_tan.c as built in s_tan-fma.c) ────────
const T_ = TAN;

// tan or -cot of a + da (|a| < pi/4), sign handling as in s_tan.c
function tanTail(a, da, n) {
  let ya, yya, sy;
  if (a < 0.0) { ya = -a; yya = -da; sy = -1; } else { ya = a; yya = da; sy = 1; }
  if (ya <= T_.gy2) {
    const a2 = a * a;
    let t2 = fma(a2, T_.d11, T_.d9);
    t2 = fma(a2, t2, T_.d7);
    t2 = fma(a2, t2, T_.d5);
    t2 = fma(a2, t2, T_.d3);
    t2 = fma(a * a2, t2, da);
    if (n) {
      // EADD(a, t2, b, db); DIV2(1.0, 0.0, b, db, c, dc, ...)
      const b = a + t2;
      const db = Math.abs(a) > Math.abs(t2) ? (a - b) + t2 : (t2 - b) + a;
      const c = 1.0 / b;
      const u = c * b;
      const uu = fma(c, b, -u);
      const cc = fma(-c, db, ((1.0 - u) - uu) + 0.0) / b;
      const y = c + cc;
      return -y;
    }
    return a + t2;
  }
  const XFG = tanTable();
  const i = Math.trunc(T_.mfftnhf + 256 * ya);
  const z = (ya - XFG[4 * i]) + yya;
  const z2 = z * z;
  const pz = fma(z * z2, fma(z2, T_.e1, T_.e0), z);
  const fi = XFG[4 * i + 1];
  const gi = XFG[4 * i + 2];
  if (n) {
    const t2 = pz * (fi + gi) / (fi + pz);
    const y = gi - t2;
    return -sy * y;
  }
  const t2 = pz * (gi + fi) / (gi - pz);
  const y = fi + t2;
  return sy * y;
}

export function tan(x) {
  const ux = hiWord(x);
  if ((ux & 0x7ff00000) === 0x7ff00000) return x - x;
  const w = x < 0.0 ? -x : x;
  if (w <= T_.g1) return x;
  if (w <= T_.g2) {
    const x2 = x * x;
    let t2 = fma(x2, T_.d11, T_.d9);
    t2 = fma(x2, t2, T_.d7);
    t2 = fma(x2, t2, T_.d5);
    t2 = fma(x2, t2, T_.d3);
    return fma(t2, x * x2, x);
  }
  if (w <= T_.g3) {
    const XFG = tanTable();
    const i = Math.trunc(T_.mfftnhf + 256 * w);
    const z = w - XFG[4 * i];
    const z2 = z * z;
    const s = x < 0.0 ? -1 : 1;
    const pz = fma(z * z2, fma(z2, T_.e1, T_.e0), z);
    const fi = XFG[4 * i + 1];
    const gi = XFG[4 * i + 2];
    const t2 = pz * (gi + fi) / (gi - pz);
    const y = fi + t2;
    return s * y;
  }
  if (w <= T_.g4) {
    const t = fma(x, T_.hpinv, T_.toint);
    const xn = t - T_.toint;
    const t1 = fma(-xn, T_.mp2, fma(-xn, T_.mp1, x));
    const n = loWord(t) & 1;
    const a = fma(-xn, T_.mp3, t1);
    const da = fma(-xn, T_.mp3, t1 - a);
    return tanTail(a, da, n);
  }
  let n, a, da;
  if (w <= T_.g5) {
    let t = fma(x, T_.hpinv, T_.toint);
    const xn = t - T_.toint;
    const t1 = fma(-xn, T_.mp2, fma(-xn, T_.mp1, x));
    n = loWord(t) & 1;
    t = fma(-xn, T_.pp3, t1);
    da = fma(-xn, T_.pp3, t1 - t);
    a = fma(-xn, T_.pp4, t);
    da = fma(-xn, T_.pp4, t - a) + da;
  } else {
    [n, a, da] = branred(x);
    n &= 1;
  }
  // EADD(a, da, t1, t2)
  const s1_ = a + da;
  const s2_ = Math.abs(a) > Math.abs(da) ? (a - s1_) + da : (da - s1_) + a;
  return tanTail(s1_, s2_, n);
}

// ── glibc ports (sysdeps/ieee754/dbl-64) ──────────────────────
// expm1 / log1p: the s_*-fma.c builds (compiled with -mfma -mavx2, so GCC
// contracts a*b+c into fma; the contraction sites below are the ones GCC
// chooses: a product whose every use is an addition/subtraction).
const ln2_hi = 6.93147180369123816490e-01;
const ln2_lo = 1.90821492927058770002e-10;

export function expm1(x) {
  const o_threshold = 7.09782712893383973096e+02;
  const invln2 = 1.44269504088896338700e+00;
  const Q1 = -3.33333333333331316428e-02, Q2 = 1.58730158725481460165e-03,
    Q3 = -7.93650757867487942473e-05, Q4 = 4.00821782732936239552e-06,
    Q5 = -2.01099218183624371326e-07;
  let hi, lo, c = 0, t, e, k;
  let hx = hiWord(x);
  const xsb = hx & 0x80000000;
  hx &= 0x7fffffff;
  if (hx >= 0x4043687A) {
    if (hx >= 0x40862E42) {
      if (hx >= 0x7ff00000) {
        if (((hx & 0xfffff) | loWord(x)) !== 0) return x + x;
        return xsb === 0 ? x : -1.0;
      }
      if (x > o_threshold) return Infinity;
    }
    if (xsb !== 0) return -1.0;
  }
  if (hx > 0x3fd62e42) {
    if (hx < 0x3FF0A2B2) {
      if (xsb === 0) { hi = x - ln2_hi; lo = ln2_lo; k = 1; } else { hi = x + ln2_hi; lo = -ln2_lo; k = -1; }
    } else {
      k = Math.trunc(invln2 * x + (xsb === 0 ? 0.5 : -0.5)); // ?: splits the block: not fused
      t = k;
      hi = fma(-t, ln2_hi, x);
      lo = t * ln2_lo;
    }
    x = hi - lo;
    c = (hi - x) - lo;
  } else if (hx < 0x3c900000) {
    return x;
  } else k = 0;
  const hfx = 0.5 * x;
  const hxs = x * hfx;
  const R1 = fma(hxs, Q1, 1.0);
  const h2 = hxs * hxs;
  const R2 = fma(hxs, Q3, Q2);
  const h4 = h2 * h2;
  const R3 = fma(hxs, Q5, Q4);
  const r1 = fma(h4, R3, fma(h2, R2, R1));
  t = fma(-r1, hfx, 3.0);
  e = hxs * ((r1 - t) / fma(-x, t, 6.0));
  if (k === 0) return x - fma(x, e, -hxs);
  e = fma(x, e - c, -c);
  e -= hxs;
  if (k === -1) return fma(0.5, x - e, -0.5);
  if (k === 1) {
    if (x < -0.25) return -2.0 * (e - (x + 0.5));
    return fma(2.0, x - e, 1.0);
  }
  let y;
  if (k <= -2 || k > 56) {
    y = 1.0 - (e - x);
    y = withHi(y, hiWord(y) + (k << 20));
    return y - 1.0;
  }
  t = 1.0;
  if (k < 20) {
    t = withHi(t, 0x3ff00000 - (0x200000 >> k));
    t = withLo(t, 0);
    y = t - (e - x);
    y = withHi(y, hiWord(y) + (k << 20));
  } else {
    t = withLo(withHi(t, (0x3ff - k) << 20), 0);
    y = x - (e + t);
    y += 1.0;
    y = withHi(y, hiWord(y) + (k << 20));
  }
  return y;
}

export function log1p(x) {
  const two54 = 1.80143985094819840000e+16;
  const Lp1 = 6.666666666666735130e-01, Lp2 = 3.999999999940941908e-01,
    Lp3 = 2.857142874366239149e-01, Lp4 = 2.222219843214978396e-01,
    Lp5 = 1.818357216161805012e-01, Lp6 = 1.531383769920937332e-01,
    Lp7 = 1.479819860511658591e-01;
  let f, c = 0, u, k, hu = 0;
  const hx = hiWord(x);
  const ax = hx & 0x7fffffff;
  k = 1;
  if (hx < 0x3FDA827A) {
    if (ax >= 0x3ff00000) {
      if (x === -1.0) return -two54 / 0;
      return NaN;
    }
    if (ax < 0x3e200000) {
      if (ax < 0x3c900000) return x;
      return fma(-(x * x), 0.5, x);
    }
    if (hx > 0 || hx <= (0xbfd2bec3 | 0)) { k = 0; f = x; hu = 1; }
  } else if (hx >= 0x7ff00000) return x + x;
  if (k !== 0) {
    if (hx < 0x43400000) {
      u = 1.0 + x;
      hu = hiWord(u);
      k = (hu >> 20) - 1023;
      c = k > 0 ? 1.0 - (u - x) : x - (u - 1.0);
      c /= u;
    } else {
      u = x;
      hu = hiWord(u);
      k = (hu >> 20) - 1023;
      c = 0;
    }
    hu &= 0x000fffff;
    if (hu < 0x6a09e) u = withHi(u, hu | 0x3ff00000);
    else { k += 1; u = withHi(u, hu | 0x3fe00000); hu = (0x00100000 - hu) >> 2; }
    f = u - 1.0;
  }
  const hfsq = 0.5 * f * f;
  if (hu === 0) {
    if (f === 0) {
      if (k === 0) return 0;
      c += k * ln2_lo;
      return k * ln2_hi + c;
    }
    const R = hfsq * fma(-0.66666666666666666, f, 1.0);
    if (k === 0) return f - R;
    return k * ln2_hi - ((R - (k * ln2_lo + c)) - f);
  }
  const s = f / (2.0 + f);
  const z = s * s;
  const z2 = z * z;
  const R2 = fma(z, Lp3, Lp2);
  const z4 = z2 * z2;
  const R3 = fma(z, Lp5, Lp4);
  const z6 = z4 * z2;
  const R4 = fma(z, Lp7, Lp6);
  const R = fma(z6, R4, fma(z4, R3, fma(z, Lp1, z2 * R2)));
  // s*(hfsq+R) and k*ln2_hi/lo are common to several branches: GCC hoists
  // them out of the branch, and a product is only fused within its block
  if (k === 0) return f - (hfsq - s * (hfsq + R));
  return k * ln2_hi - ((hfsq - (s * (hfsq + R) + (k * ln2_lo + c))) - f);
}

// The rest are generic (non-FMA) builds: plain double arithmetic.
export function sinh(x) {
  const shuge = 1.0e307;
  const jx = hiWord(x);
  const ix = jx & 0x7fffffff;
  if (ix >= 0x7ff00000) return x + x;
  const h = jx < 0 ? -0.5 : 0.5;
  if (ix < 0x40360000) {
    if (ix < 0x3e300000) { if (shuge + x > 1.0) return x; }
    const t = expm1(Math.abs(x));
    if (ix < 0x3ff00000) return h * (2.0 * t - t * t / (t + 1.0));
    return h * (t + t / (t + 1.0));
  }
  if (ix < 0x40862e42) return h * exp(Math.abs(x));
  const lx = loWord(x);
  if (ix < 0x408633ce || (ix === 0x408633ce && lx <= 0x8fb9f87d)) {
    const w = exp(0.5 * Math.abs(x));
    const t = h * w;
    return t * w;
  }
  return x * shuge;
}

export function cosh(x) {
  const ix = hiWord(x) & 0x7fffffff;
  if (ix < 0x40360000) {
    if (ix < 0x3fd62e43) {
      if (ix < 0x3c800000) return 1.0;
      const t = expm1(Math.abs(x));
      const w = 1.0 + t;
      return 1.0 + (t * t) / (w + w);
    }
    const t = exp(Math.abs(x));
    return 0.5 * t + 0.5 / t;
  }
  if (ix < 0x40862e42) return 0.5 * exp(Math.abs(x));
  const fix = toBits(x) & 0x7fffffffffffffffn;
  if (fix <= 0x408633ce8fb9f87dn) {
    const w = exp(0.5 * Math.abs(x));
    const t = 0.5 * w;
    return t * w;
  }
  if (ix >= 0x7ff00000) return x * x;
  return Infinity;
}

export function tanh(x) {
  const jx = hiWord(x);
  const lx = loWord(x);
  const ix = jx & 0x7fffffff;
  let z;
  if (ix >= 0x7ff00000) return jx >= 0 ? 1.0 / x + 1.0 : 1.0 / x - 1.0;
  if (ix < 0x40360000) {
    if ((ix | lx) === 0) return x;
    if (ix < 0x3c800000) return x * (1.0 + x);
    if (ix >= 0x3ff00000) {
      const t = expm1(2.0 * Math.abs(x));
      z = 1.0 - 2.0 / (t + 2.0);
    } else {
      const t = expm1(-2.0 * Math.abs(x));
      z = -t / (t + 2.0);
    }
  } else z = 1.0 - 1.0e-300;
  return jx >= 0 ? z : -z;
}

const LN2D = 6.93147180559945286227e-01;
export function asinh(x) {
  const hx = hiWord(x);
  const ix = hx & 0x7fffffff;
  let w;
  if (ix < 0x3e300000) { if (1.0e300 + x > 1.0) return x; }
  if (ix > 0x41b00000) {
    if (ix >= 0x7ff00000) return x + x;
    w = log(Math.abs(x)) + LN2D;
  } else {
    const xa = Math.abs(x);
    if (ix > 0x40000000) w = log(2.0 * xa + 1.0 / (Math.sqrt(xa * xa + 1.0) + xa));
    else {
      const t = xa * xa;
      w = log1p(xa + t / (1.0 + Math.sqrt(1.0 + t)));
    }
  }
  return copysign(w, x);
}

export function acosh(x) {
  const hx = BigInt.asIntN(64, toBits(x));
  if (hx > 0x4000000000000000n) {
    if (hx >= 0x41b0000000000000n) {
      if (hx >= 0x7ff0000000000000n) return x + x;
      return log(x) + LN2D;
    }
    const t = x * x;
    return log(2.0 * x - 1.0 / (x + Math.sqrt(t - 1.0)));
  }
  if (hx > 0x3ff0000000000000n) {
    const t = x - 1.0;
    return log1p(t + Math.sqrt(2.0 * t + t * t));
  }
  if (hx === 0x3ff0000000000000n) return 0.0;
  return NaN;
}

export function atanh(x) {
  const xa = Math.abs(x);
  let t;
  if (xa < 0.5) {
    if (xa < 2 ** -28) return x;
    t = xa + xa;
    t = 0.5 * log1p(t + t * xa / (1.0 - xa));
  } else if (xa < 1.0) {
    t = 0.5 * log1p((xa + xa) / (1.0 - xa));
  } else {
    if (xa > 1.0) return NaN;
    if (Number.isNaN(x)) return x;
    return x / 0.0;
  }
  return copysign(t, x);
}

export function log10(x) {
  const two54 = 1.80143985094819840000e+16;
  const ivln10 = 4.34294481903251816668e-01;
  const log10_2hi = 3.01029995663611771306e-01;
  const log10_2lo = 3.69423907715893078616e-13;
  let hx = BigInt.asIntN(64, toBits(x));
  let k = 0;
  if (hx < 0x0010000000000000n) {
    if ((hx & 0x7fffffffffffffffn) === 0n) return -two54 / Math.abs(x);
    if (hx < 0n) return NaN;
    k -= 54;
    x *= two54;
    hx = BigInt.asIntN(64, toBits(x));
  }
  if (hx >= 0x7ff0000000000000n) return x + x;
  k += Number(hx >> 52n) - 1023;
  const i = k < 0 ? 1 : 0;
  hx = (hx & 0x000fffffffffffffn) | (big(0x3ff - i) << 52n);
  const y = k + i;
  x = fromBits(hx);
  const z = y * log10_2lo + ivln10 * log(x);
  return z + y * log10_2hi;
}

export function cbrt(x) {
  const CBRT2 = 1.2599210498948731648;
  const SQR_CBRT2 = 1.5874010519681994748;
  const factor = [1.0 / SQR_CBRT2, 1.0 / CBRT2, 1.0, CBRT2, SQR_CBRT2];
  if (x === 0 || !Number.isFinite(x)) return x + x;
  const [xm, xe] = frexp(Math.abs(x));
  const u = (0.354895765043919860
    + ((1.50819193781584896
      + ((-2.11499494167371287
        + ((2.44693122563534430
          + ((-1.83469277483613086
            + (0.784932344976639262 - 0.145263899385486377 * xm)
            * xm)
            * xm))
          * xm))
        * xm))
      * xm));
  const t2 = u * u * u;
  const ym = u * (t2 + 2.0 * xm) / (2.0 * t2 + xm) * factor[2 + (xe % 3)];
  return ldexp(x > 0.0 ? ym : -ym, Math.trunc(xe / 3));
}

export function copysign(x, y) {
  const neg = (toBits(y) >> 63n) === 1n;
  const ax = Math.abs(x);
  return neg ? -ax : ax;
}

// erf / erfc (s_erf.c)
const erx = 8.45062911510467529297e-01, efx = 1.28379167095512586316e-01;
const pp = [1.28379167095512558561e-01, -3.25042107247001499370e-01, -2.84817495755985104766e-02,
  -5.77027029648944159157e-03, -2.37630166566501626084e-05];
const qq = [0.0, 3.97917223959155352819e-01, 6.50222499887672944485e-02, 5.08130628187576562776e-03,
  1.32494738004321644526e-04, -3.96022827877536812320e-06];
const pa = [-2.36211856075265944077e-03, 4.14856118683748331666e-01, -3.72207876035701323847e-01,
  3.18346619901161753674e-01, -1.10894694282396677476e-01, 3.54783043256182359371e-02,
  -2.16637559486879084300e-03];
const qa = [0.0, 1.06420880400844228286e-01, 5.40397917702171048937e-01, 7.18286544141962662868e-02,
  1.26171219808761642112e-01, 1.36370839120290507362e-02, 1.19844998467991074170e-02];
const ra = [-9.86494403484714822705e-03, -6.93858572707181764372e-01, -1.05586262253232909814e+01,
  -6.23753324503260060396e+01, -1.62396669462573470355e+02, -1.84605092906711035994e+02,
  -8.12874355063065934246e+01, -9.81432934416914548592e+00];
const sa = [0.0, 1.96512716674392571292e+01, 1.37657754143519042600e+02, 4.34565877475229228821e+02,
  6.45387271733267880336e+02, 4.29008140027567833386e+02, 1.08635005541779435134e+02,
  6.57024977031928170135e+00, -6.04244152148580987438e-02];
const rb = [-9.86494292470009928597e-03, -7.99283237680523006574e-01, -1.77579549177547519889e+01,
  -1.60636384855821916062e+02, -6.37566443368389627722e+02, -1.02509513161107724954e+03,
  -4.83519191608651397019e+02];
const sb = [0.0, 3.03380607434824582924e+01, 3.25792512996573918826e+02, 1.53672958608443695994e+03,
  3.19985821950859553908e+03, 2.55305040643316442583e+03, 4.74528541206955367215e+02,
  -2.24409524465858183362e+01];

function erfSmallRS(x) {
  const z = x * x;
  const r1 = pp[0] + z * pp[1]; const z2 = z * z;
  const r2 = pp[2] + z * pp[3]; const z4 = z2 * z2;
  const s1 = 1.0 + z * qq[1];
  const s2 = qq[2] + z * qq[3];
  const s3 = qq[4] + z * qq[5];
  const r = r1 + z2 * r2 + z4 * pp[4];
  const s = s1 + z2 * s2 + z4 * s3;
  return r / s;
}
function erfMidPQ(x) {
  const s = Math.abs(x) - 1.0;
  const P1 = pa[0] + s * pa[1]; const s2 = s * s;
  const Q1 = 1.0 + s * qa[1]; const s4 = s2 * s2;
  const P2 = pa[2] + s * pa[3]; const s6 = s4 * s2;
  const Q2 = qa[2] + s * qa[3];
  const P3 = pa[4] + s * pa[5];
  const Q3 = qa[4] + s * qa[5];
  const P = P1 + s2 * P2 + s4 * P3 + s6 * pa[6];
  const Q = Q1 + s2 * Q2 + s4 * Q3 + s6 * qa[6];
  return [P, Q];
}
function erfTail(ax, ixSmall) { // r = exp(-x^2 - 0.5625 + R/S) piecewise, for |x| >= 1.25
  const s = 1.0 / (ax * ax);
  let R, S;
  if (ixSmall) {
    const R1 = ra[0] + s * ra[1]; const s2 = s * s;
    const S1 = 1.0 + s * sa[1]; const s4 = s2 * s2;
    const R2 = ra[2] + s * ra[3]; const s6 = s4 * s2;
    const S2 = sa[2] + s * sa[3]; const s8 = s4 * s4;
    const R3 = ra[4] + s * ra[5];
    const S3 = sa[4] + s * sa[5];
    const R4 = ra[6] + s * ra[7];
    const S4 = sa[6] + s * sa[7];
    R = R1 + s2 * R2 + s4 * R3 + s6 * R4;
    S = S1 + s2 * S2 + s4 * S3 + s6 * S4 + s8 * sa[8];
  } else {
    const R1 = rb[0] + s * rb[1]; const s2 = s * s;
    const S1 = 1.0 + s * sb[1]; const s4 = s2 * s2;
    const R2 = rb[2] + s * rb[3]; const s6 = s4 * s2;
    const S2 = sb[2] + s * sb[3];
    const R3 = rb[4] + s * rb[5];
    const S3 = sb[4] + s * sb[5];
    const S4 = sb[6] + s * sb[7];
    R = R1 + s2 * R2 + s4 * R3 + s6 * rb[6];
    S = S1 + s2 * S2 + s4 * S3 + s6 * S4;
  }
  const z = withLo(ax, 0);
  return exp(-z * z - 0.5625) * exp((z - ax) * (z + ax) + R / S);
}

export function erf(x) {
  const hx = hiWord(x);
  const ix = hx & 0x7fffffff;
  if (ix >= 0x7ff00000) {
    const i = (hx >>> 31) << 1;
    return (1 - i) + 1.0 / x;
  }
  if (ix < 0x3feb0000) {
    if (ix < 0x3e300000) {
      if (ix < 0x00800000) return 0.0625 * (16.0 * x + (16.0 * efx) * x);
      return x + efx * x;
    }
    const y = erfSmallRS(x);
    return x + x * y;
  }
  if (ix < 0x3ff40000) {
    const [P, Q] = erfMidPQ(x);
    return hx >= 0 ? erx + P / Q : -erx - P / Q;
  }
  if (ix >= 0x40180000) return hx >= 0 ? 1.0 - 1e-300 : 1e-300 - 1.0;
  const ax = Math.abs(x);
  const r = erfTail(ax, ix < 0x4006DB6E);
  return hx >= 0 ? 1.0 - r / ax : r / ax - 1.0;
}

export function erfc(x) {
  const hx = hiWord(x);
  const ix = hx & 0x7fffffff;
  if (ix >= 0x7ff00000) return ((hx >>> 31) << 1) + 1.0 / x;
  if (ix < 0x3feb0000) {
    if (ix < 0x3c700000) return 1.0 - x;
    const y = erfSmallRS(x);
    if (hx < 0x3fd00000) return 1.0 - (x + x * y);
    let r = x * y;
    r += (x - 0.5);
    return 0.5 - r;
  }
  if (ix < 0x3ff40000) {
    const [P, Q] = erfMidPQ(x);
    if (hx >= 0) { const z = 1.0 - erx; return z - P / Q; }
    const z = erx + P / Q;
    return 1.0 + z;
  }
  if (ix < 0x403c0000) {
    const ax = Math.abs(x);
    if (!(ix < 0x4006DB6D) && hx < 0 && ix >= 0x40180000) return 2.0 - 1e-300;
    const r = erfTail(ax, ix < 0x4006DB6D);
    if (hx > 0) return r / ax;
    return 2.0 - r / ax;
  }
  if (hx > 0) return 0 * 1e-300;
  return 2.0 - 1e-300;
}
