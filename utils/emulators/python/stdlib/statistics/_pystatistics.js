// utils/emulators/python/stdlib/statistics/_pystatistics.js
//
// A port of CPython 3.13's Lib/statistics.py for the snippet demos,
// statement for statement, on top of:
//   * ../fractions/_pyfraction.js — the exact Fraction engine (BigInt
//     rationals) and Python int/float/Fraction arithmetic, so _sum / _ss /
//     _convert / _float_sqrt_of_frac are exact like CPython's;
//   * ../math/_pymath.js — math.fsum, math.sumprod's extended-precision
//     float path (ported here with Fraction support), math.hypot, builtin
//     sum() (Neumaier) and the libm wrappers (exp, log, erf, cosh, cos, …,
//     glibc's results via ../math/_libm.js);
//   * ../random/_pyrandom.js — MT19937 and random.Random for samples() and
//     kde_random().
//
// Exact on every platform: mean, fmean, harmonic_mean, median*, mode,
// multimode, quantiles, variance, pvariance, stdev, pstdev, covariance,
// correlation, linear_regression, NormalDist arithmetic / zscore /
// from_samples. Platform C library (libm) dependent in the last digit:
// geometric_mean (log, exp), NormalDist.pdf (exp), cdf (erf), overlap,
// inv_cdf / quantiles / samples in the tails (log), kde (exp, erf, cosh,
// atan, cos, sin, pow) and kde_random. Those results here are glibc's.
//
// Values: see _pyfraction.js. Data lists are JS arrays of Python values.

import * as M from '../math/_pymath.js';
import * as L from '../math/_libm.js';
import * as Q from '../fractions/_pyfraction.js';
import { PyRandom } from '../random/_pyrandom.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';
import { raise } from '../../../../py-exceptions.js';

const { F, I, isInt, isFloat, isBool, isFrac, Fraction } = Q;
const { add, sub, mul, truediv, lt, le, gt, ge, eq } = Q;

// ── StatisticsError ───────────────────────────────────────────
export function statsError(...args) {
  const msg = args.length === 1 ? (typeof args[0] === 'string' ? args[0] : Q.reprOf(args[0])) : Q.reprOf({ tuple: args });
  const e = new Error(msg);
  e.name = 'statistics.StatisticsError';
  throw e;
}

const intOf = (v) => (isBool(v) ? (v ? 1n : 0n) : v.int);
const isIntegral = (v) => isInt(v) || isBool(v);
const typeOf = (v) => (isBool(v) ? 'bool' : isInt(v) ? 'int' : isFloat(v) ? 'float' : isFrac(v) ? 'Fraction' : Q.typeName(v));
const fl = (v) => (isFrac(v) ? F(Q.fracToFloat(v)) : v); // PyFloat_AsDouble on a Fraction

// math functions as Python calls them (Fraction arguments go through __float__)
const m = {
  exp: (v) => M.exp(fl(v)),
  log: (v) => M.log(fl(v)),
  sqrt: (v) => M.sqrt(fl(v)),
  erf: (v) => M.erf(fl(v)),
  cosh: (v) => M.cosh(fl(v)),
  cos: (v) => M.cos(fl(v)),
  sin: (v) => M.sin(fl(v)),
  tan: (v) => M.tan(fl(v)),
  asin: (v) => M.asin(fl(v)),
  acos: (v) => M.acos(fl(v)),
  atan: (v) => M.atan(fl(v)),
  fabs: (v) => M.fabs(fl(v)),
  isnan: (v) => M.isnan(fl(v)),
  isfinite: (v) => M.isfinite(fl(v)),
  isinf: (v) => M.isinf(fl(v)),
};
const PI = F(Math.PI);
const TAU = F(2 * Math.PI);
const SQRT2 = M.sqrt(F(2.0));

// builtin round(x) / round(x, ndigits) for the demos (ndigits a JS number)
export function round(v, ndigits = null) {
  const nd = ndigits === null ? null : I(BigInt(ndigits));
  return isFrac(v) ? Q.fracRound(v, nd) : M.pyRound(v, nd);
}

// math.fsum over int / float / Fraction items (items converted one at a time)
function fsum(items) {
  return M.fsum((function* conv() { for (const v of items) yield fl(v); })());
}

// ── math.sumprod (Modules/mathmodule.c), any numeric items ────
const LONG_MAX = (1n << 63n) - 1n;
const LONG_MIN = -(1n << 63n);
const fitsLong = (n) => n >= LONG_MIN && n <= LONG_MAX;
const dlMul = (x, y) => { const z = x * y; return [z, L.fma(x, y, -z)]; };
const dlSum = (a, b) => { const x = a + b; const z = x - a; return [x, (a - (x - z)) + (b - z)]; };
const tlFma = (x, y, t) => {
  const [ph, pl] = dlMul(x, y);
  const [sh, sl] = dlSum(t.hi, ph);
  const [r1h, r1l] = dlSum(t.lo, pl);
  const [r2h, r2l] = dlSum(r1h, sl);
  return { hi: sh, lo: r2h, tiny: t.tiny + r1l + r2l };
};
const tlToD = (t) => { const [lh, ll] = dlSum(t.lo, t.hi); return t.tiny + ll + lh; };

export function sumprod(P, Qs) {
  let total = I(0);
  let intPath = true;
  let intTotal = 0n;
  let intInUse = false;
  let fltPath = true;
  let flt = { hi: 0, lo: 0, tiny: 0 };
  let fltInUse = false;
  for (let i = 0; ; i++) {
    const pStop = i >= P.length;
    const qStop = i >= Qs.length;
    if (pStop !== qStop) raise('ValueError', 'Inputs are not the same length');
    const finished = pStop && qStop;
    const p = P[i];
    const q = Qs[i];
    if (intPath) {
      if (!finished && isInt(p) && isInt(q) && fitsLong(p.int) && fitsLong(q.int)
          && fitsLong(p.int * q.int) && fitsLong(intTotal + p.int * q.int)) {
        intTotal += p.int * q.int;
        intInUse = true;
        continue;
      }
      intPath = false;
      if (intInUse) { total = add(total, I(intTotal)); intTotal = 0n; intInUse = false; }
    }
    if (fltPath) {
      let done = false;
      if (!finished) {
        let fp = null;
        let fq = null;
        const pf = isFloat(p);
        const qf = isFloat(q);
        const conv = (v) => { const x = Number(intOf(v)); return Number.isFinite(x) ? x : null; };
        if (pf && qf) { fp = p.float; fq = q.float; } else if (pf && isIntegral(q)) { fp = p.float; fq = conv(q); } else if (qf && isIntegral(p)) { fq = q.float; fp = conv(p); }
        if (fp !== null && fq !== null) {
          const nt = tlFma(fp, fq, flt);
          if (Number.isFinite(nt.hi)) { flt = nt; fltInUse = true; done = true; }
        }
      }
      if (done) continue;
      fltPath = false;
      if (fltInUse) { total = add(total, F(tlToD(flt))); flt = { hi: 0, lo: 0, tiny: 0 }; fltInUse = false; }
    }
    if (finished) return total;
    total = add(total, mul(p, q));
  }
}

// ── private utilities ─────────────────────────────────────────
function exactRatio(x) {
  if (isFloat(x)) {
    if (!Number.isFinite(x.float)) return [x, null];
    return Q.floatRatio(x.float);
  }
  if (isIntegral(x)) return [intOf(x), 1n];
  if (isFrac(x)) return [x.n, x.d];
  if (Q.isDec(x)) Q.demoLimit('Decimal data');
  raise('TypeError', `can't convert type '${Q.typeName(x)}' to numerator/denominator`);
}

function coerce(T, S) {
  if (T === S) return T;
  if (S === 'int' || S === 'bool') return T;
  if (T === 'int') return S;
  if (T === 'Fraction' && S === 'float') return S;
  if (T === 'float' && S === 'Fraction') return T;
  raise('TypeError', `don't know how to coerce ${T} and ${S}`);
}
const reduceTypes = (types) => [...types].reduce(coerce, 'int');

// exact sum of {d: n} partials as a Fraction (builtin sum over Fractions)
function sumPartials(partials, square = false) {
  let total = I(0);
  for (const [d, n] of partials) total = add(total, Q.fraction(I(n), I(square ? d * d : d)));
  return total;
}

// _sum(data) → { T, total, count }
function _sum(data) {
  let count = 0;
  const types = new Set();
  const partials = new Map();
  let special = null;
  for (const x of data) {
    types.add(typeOf(x));
    const [n, d] = exactRatio(x);
    count += 1;
    if (d === null) special = special === null ? n : F(special.float + n.float);
    else partials.set(d, (partials.get(d) || 0n) + n);
  }
  const total = special !== null ? special : sumPartials(partials);
  return { T: reduceTypes(types), total, count };
}

// _ss(data, c=None) → { T, ss, c, count }
function _ss(data, c = null) {
  if (c !== null) {
    const r = _sum(data.map((x) => { const d = sub(x, c); return mul(d, d); }));
    return { T: r.T, ss: r.total, c, count: r.count };
  }
  let count = 0;
  const types = new Set();
  const sx = new Map();
  const sxx = new Map();
  let specialX = null;
  for (const x of data) {
    types.add(typeOf(x));
    const [n, d] = exactRatio(x);
    count += 1;
    if (d === null) specialX = specialX === null ? n : F(specialX.float + n.float);
    else {
      sx.set(d, (sx.get(d) || 0n) + n);
      sxx.set(d, (sxx.get(d) || 0n) + n * n);
    }
  }
  let ssd;
  let cc;
  if (!count) {
    ssd = cc = Q.fraction(I(0));
  } else if (specialX !== null) {
    ssd = cc = specialX;
  } else {
    const SX = sumPartials(sx);
    const SXX = sumPartials(sxx, true);
    ssd = truediv(sub(mul(I(count), SXX), mul(SX, SX)), I(count));
    cc = truediv(SX, I(count));
  }
  return { T: reduceTypes(types), ss: ssd, c: cc, count };
}

// _convert(value, T)
function convert(value, T) {
  if (typeOf(value) === T) return value;
  if (T === 'int' || T === 'bool') {
    if (isFloat(value)) raise('AttributeError', "'float' object has no attribute 'denominator'");
    const den = isFrac(value) ? value.d : 1n;
    if (den !== 1n) T = 'float';
  }
  if (T === 'int') return isFrac(value) ? Q.fracTrunc(value) : value;
  if (T === 'float') return F(Q.toFloat(value));
  if (T === 'Fraction') return Q.fraction(value);
  raise('TypeError', `cannot convert to ${T}`);
}

function failNeg(x, errmsg) {
  if (lt(x, I(0))) statsError(errmsg);
  return x;
}

// sorted(): a stable sort with Python's exact comparisons
export function sorted(data, reverse = false) {
  const items = data.map((v, i) => [v, i]);
  items.sort((a, b) => {
    const c = Q.cmp(a[0], b[0]);
    if (Number.isNaN(c)) return 0;
    return reverse ? -c : c;
  });
  return items.map((x) => x[0]);
}
function bisectLeft(a, x, lo = 0) {
  let hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lt(a[mid], x)) lo = mid + 1; else hi = mid;
  }
  return lo;
}
function bisectRight(a, x, lo = 0) {
  let hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lt(x, a[mid])) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// _rank(data, start=…) with ties averaged
function rank(data, start) {
  const valPos = data.map((v, i) => [v, i]);
  valPos.sort((a, b) => {
    const c = Q.cmp(a[0], b[0]);
    if (c !== 0 && !Number.isNaN(c)) return c;
    return a[1] - b[1];
  });
  let i = sub(start, I(1));
  const result = new Array(valPos.length).fill(I(0));
  let k = 0;
  while (k < valPos.length) {
    let e = k + 1;
    while (e < valPos.length && eq(valPos[e][0], valPos[k][0])) e += 1;
    const size = e - k;
    const r = add(i, truediv(I(size + 1), I(2)));
    for (let t = k; t < e; t++) result[valPos[t][1]] = r;
    i = add(i, I(size));
    k = e;
  }
  return result;
}

const bitLength = (n) => L.bitLen(n < 0n ? -n : n);
function isqrtFracRto(n, mm) {
  const a = L.isqrtBig(n / mm);
  return a | (a * a * mm !== n ? 1n : 0n);
}
// _float_sqrt_of_frac(n, m): correctly rounded sqrt(n/m)
function floatSqrtOfFrac(n, mm) {
  const q = Math.floor((bitLength(n) - bitLength(mm) - 109) / 2);
  let num;
  let den;
  if (q >= 0) {
    num = isqrtFracRto(n, mm << BigInt(2 * q)) << BigInt(q);
    den = 1n;
  } else {
    num = isqrtFracRto(n << BigInt(-2 * q), mm);
    den = 1n << BigInt(-q);
  }
  return F(Q.ratioToFloat(num, den));
}

const ratioParts = (v) => {
  if (isFloat(v)) raise('AttributeError', "'float' object has no attribute 'numerator'");
  return isFrac(v) ? [v.n, v.d] : [intOf(v), 1n];
};

// ── averages ──────────────────────────────────────────────────
export function mean(data) {
  const { T, total, count } = _sum(data);
  if (count < 1) statsError('mean requires at least one data point');
  return convert(truediv(total, I(count)), T);
}

export function fmean(data, weights = null) {
  if (weights === null) {
    const n = data.length;
    const total = fsum(data);
    if (!n) statsError('fmean requires at least one data point');
    return truediv(total, I(n));
  }
  let num;
  try {
    num = sumprod(data, weights);
  } catch (e) {
    if (e.name === 'ValueError') statsError('data and weights must be the same length');
    throw e;
  }
  const den = fsum(weights);
  if (!Q.truthy(den)) statsError('sum of weights must be non-zero');
  return truediv(num, den);
}

export function geometricMean(data) {
  let n = 0;
  let foundZero = false;
  const logs = [];
  for (const x of data) {
    n += 1;
    if (gt(x, F(0.0)) || m.isnan(x)) logs.push(m.log(x));
    else if (eq(x, F(0.0))) foundZero = true;
    else statsError('No negative inputs allowed', x);
  }
  const total = M.fsum(logs);
  if (!n) statsError('Must have a non-empty dataset');
  if (Number.isNaN(total.float)) return F(NaN);
  if (foundZero) return F(total.float === Infinity ? NaN : 0.0);
  return m.exp(truediv(total, I(n)));
}

export function harmonicMean(data, weights = null) {
  const errmsg = 'harmonic mean does not support negative values';
  const n = data.length;
  if (n < 1) statsError('harmonic_mean requires at least one data point');
  if (n === 1 && weights === null) {
    const x = data[0];
    if (isIntegral(x) || isFloat(x) || isFrac(x)) {
      if (lt(x, I(0))) statsError(errmsg);
      return x;
    }
    raise('TypeError', 'unsupported type');
  }
  let ws;
  let sumWeights;
  if (weights === null) {
    ws = new Array(n).fill(I(1));
    sumWeights = I(n);
  } else {
    if (weights.length !== n) statsError('Number of weights does not match data size');
    sumWeights = _sum(weights.map((w) => failNeg(w, errmsg))).total;
    ws = weights;
  }
  const terms = [];
  try {
    for (let i = 0; i < n; i++) {
      const w = ws[i];
      const x = failNeg(data[i], errmsg);
      terms.push(Q.truthy(w) ? truediv(w, x) : I(0));
    }
  } catch (e) {
    if (e.name === 'ZeroDivisionError') return I(0);
    throw e;
  }
  const { T, total } = _sum(terms);
  if (le(total, I(0))) statsError('Weighted sum must be positive');
  return convert(truediv(sumWeights, total), T);
}

export function median(data) {
  const d = sorted(data);
  const n = d.length;
  if (n === 0) statsError('no median for empty data');
  if (n % 2 === 1) return d[(n - 1) / 2];
  const i = n / 2;
  return truediv(add(d[i - 1], d[i]), I(2));
}
export function medianLow(data) {
  const d = sorted(data);
  const n = d.length;
  if (n === 0) statsError('no median for empty data');
  if (n % 2 === 1) return d[(n - 1) / 2];
  return d[n / 2 - 1];
}
export function medianHigh(data) {
  const d = sorted(data);
  const n = d.length;
  if (n === 0) statsError('no median for empty data');
  return d[Math.floor(n / 2)];
}
export function medianGrouped(data, interval = F(1.0)) {
  const d = sorted(data);
  const n = d.length;
  if (!n) statsError('no median for empty data');
  let x = d[Math.floor(n / 2)];
  const i = bisectLeft(d, x);
  const j = bisectRight(d, x, i);
  let iv;
  const toF = (v) => (typeof v === 'string' ? M.floatFromStr(v) : F(Q.toFloat(v)));
  try {
    iv = toF(interval);
    x = toF(x);
  } catch (e) {
    if (e.name === 'ValueError') raise('TypeError', 'Value cannot be converted to a float');
    throw e;
  }
  const Lo = sub(x, truediv(iv, F(2.0)));
  const cf = I(i);
  const f = I(j - i);
  return add(Lo, truediv(mul(iv, sub(truediv(I(n), I(2)), cf)), f));
}

// hash/eq key for Counter: equal numbers share a key (1 == 1.0 == True)
let nanId = 0;
function hashKey(v) {
  if (typeof v === 'string') return `s:${v}`;
  if (v === null) return 'None';
  if (isFloat(v) && Number.isNaN(v.float)) { nanId += 1; return `nan:${nanId}`; }
  if (isFloat(v) && !Number.isFinite(v.float)) return v.float > 0 ? 'inf' : '-inf';
  if (isIntegral(v) || isFloat(v) || isFrac(v)) {
    const [n, d] = exactRatio(v);
    return `n:${n}/${d}`;
  }
  if (Q.isTuple(v)) return `t:(${v.tuple.map(hashKey).join(',')})`;
  if (Array.isArray(v)) raise('TypeError', "unhashable type: 'list'");
  return `o:${Q.reprOf(v)}`;
}
function counter(data) {
  const counts = new Map();
  for (const v of data) {
    const k = hashKey(v);
    if (counts.has(k)) counts.get(k)[1] += 1;
    else counts.set(k, [v, 1]);
  }
  return [...counts.values()];
}
export function mode(data) {
  const items = counter(data);
  if (!items.length) statsError('no mode for empty data');
  let best = items[0];
  for (const it of items) if (it[1] > best[1]) best = it;
  return best[0];
}
export function multimode(data) {
  const items = counter(data);
  if (!items.length) return [];
  const maxcount = Math.max(...items.map((it) => it[1]));
  return items.filter((it) => it[1] === maxcount).map((it) => it[0]);
}

// ── kde ───────────────────────────────────────────────────────
const C = (x) => F(x);
function kernelFns(kernel) {
  switch (kernel) {
    case 'normal': case 'gauss': {
      const sqrt2pi = m.sqrt(mul(I(2), PI));
      const sqrt2 = m.sqrt(I(2));
      return {
        K: (t) => truediv(m.exp(mul(mul(C(-0.5), t), t)), sqrt2pi),
        W: (t) => mul(C(0.5), add(C(1.0), m.erf(truediv(t, sqrt2)))),
        support: null,
      };
    }
    case 'logistic':
      return {
        K: (t) => truediv(C(0.5), add(C(1.0), m.cosh(t))),
        W: (t) => sub(C(1.0), truediv(C(1.0), add(m.exp(t), C(1.0)))),
        support: null,
      };
    case 'sigmoid': {
      const c1 = truediv(I(1), PI);
      const c2 = truediv(I(2), PI);
      return {
        K: (t) => truediv(c1, m.cosh(t)),
        W: (t) => mul(c2, m.atan(m.exp(t))),
        support: null,
      };
    }
    case 'rectangular': case 'uniform':
      return { K: () => C(0.5), W: (t) => add(mul(C(0.5), t), C(0.5)), support: C(1.0) };
    case 'triangular':
      return {
        K: (t) => sub(C(1.0), Q.pyAbs(t)),
        W: (t) => add(add(mul(mul(t, t), lt(t, C(0.0)) ? C(0.5) : C(-0.5)), t), C(0.5)),
        support: C(1.0),
      };
    case 'parabolic': case 'epanechnikov':
      return {
        K: (t) => mul(C(0.75), sub(C(1.0), mul(t, t))),
        W: (t) => add(add(mul(C(-0.25), Q.pyPow(t, I(3))), mul(C(0.75), t)), C(0.5)),
        support: C(1.0),
      };
    case 'quartic': case 'biweight':
      return {
        K: (t) => mul(C(0.9375), Q.pyPow(sub(C(1.0), mul(t, t)), I(2))),
        W: quarticCdf,
        support: C(1.0),
      };
    case 'triweight':
      return {
        K: (t) => mul(C(1.09375), Q.pyPow(sub(C(1.0), mul(t, t)), I(3))),
        W: triweightCdf,
        support: C(1.0),
      };
    case 'cosine': {
      const c1 = truediv(PI, I(4));
      const c2 = truediv(PI, I(2));
      return {
        K: (t) => mul(c1, m.cos(mul(c2, t))),
        W: (t) => add(mul(C(0.5), m.sin(mul(c2, t))), C(0.5)),
        support: C(1.0),
      };
    }
    default:
      return null;
  }
}
// 3/16 * t**5 - 5/8 * t**3 + 15/16 * t + 1/2
const quarticCdf = (t) => add(add(sub(mul(C(0.1875), Q.pyPow(t, I(5))), mul(C(0.625), Q.pyPow(t, I(3)))), mul(C(0.9375), t)), C(0.5));
// 35/32 * (-1/7*t**7 + 3/5*t**5 - t**3 + t) + 1/2
const triweightCdf = (t) => add(mul(C(1.09375), add(sub(add(mul(C(-1 / 7), Q.pyPow(t, I(7))), mul(C(3 / 5), Q.pyPow(t, I(5)))), Q.pyPow(t, I(3))), t)), C(0.5));

function checkKdeArgs(data, h) {
  const n = data.length;
  if (!n) statsError('Empty data sequence');
  if (!(isIntegral(data[0]) || isFloat(data[0]))) raise('TypeError', 'Data sequence must contain ints or floats');
  if (le(h, F(0.0))) statsError(`Bandwidth h must be positive, not h=${Q.reprOf(h)}`);
  return n;
}

// kde(data, h, kernel='normal', *, cumulative=False) → a JS function of x
export function kde(data, h, kernel = 'normal', cumulative = false) {
  const n = checkKdeArgs(data, h);
  const fns = kernelFns(kernel);
  if (fns === null) statsError(`Unknown kernel name: ${Q.reprOf(kernel)}`);
  const { K, W, support } = fns;
  let f;
  if (support === null) {
    if (cumulative) f = (x) => truediv(M.pySum(data.map((xi) => W(truediv(sub(x, xi), h)))), I(n));
    else f = (x) => truediv(M.pySum(data.map((xi) => K(truediv(sub(x, xi), h)))), mul(I(n), h));
  } else {
    const sample = sorted(data);
    const bandwidth = mul(h, support);
    const supported = (x) => {
      const i = bisectLeft(sample, sub(x, bandwidth));
      const j = bisectRight(sample, add(x, bandwidth));
      return [i, sample.slice(i, j)];
    };
    if (cumulative) {
      f = (x) => {
        const [i, s] = supported(x);
        return truediv(M.pySum(s.map((xi) => W(truediv(sub(x, xi), h))), I(i)), I(n));
      };
    } else {
      f = (x) => {
        const [, s] = supported(x);
        return truediv(M.pySum(s.map((xi) => K(truediv(sub(x, xi), h)))), mul(I(n), h));
      };
    }
  }
  f.doc = `${cumulative ? 'CDF' : 'PDF'} estimate with h=${Q.reprOf(h)} and kernel=${Q.reprOf(kernel)}`;
  return f;
}

// ── quantiles ─────────────────────────────────────────────────
export function quantiles(data, n = I(4), method = 'exclusive') {
  if (lt(n, I(1))) statsError('n must be at least 1');
  const d = sorted(data);
  const ld = d.length;
  if (ld < 2) {
    if (ld === 1) {
      if (!isIntegral(n)) raise('TypeError', `can't multiply sequence by non-int of type '${Q.typeName(n)}'`);
      return new Array(Number(intOf(n) - 1n)).fill(d[0]);
    }
    statsError('must have at least one data point');
  }
  if (!isIntegral(n)) raise('TypeError', `'${Q.typeName(n)}' object cannot be interpreted as an integer`);
  const N = intOf(n);
  if (N > 10000n) Q.demoLimit('n beyond 10000');
  const result = [];
  if (method === 'inclusive') {
    const mm = BigInt(ld - 1);
    for (let i = 1n; i < N; i++) {
      const j = Q.floorDiv(i * mm, N);
      const delta = i * mm - j * N;
      const jj = Number(j);
      result.push(truediv(add(mul(d[jj], I(N - delta)), mul(d[jj + 1], I(delta))), I(N)));
    }
    return result;
  }
  if (method === 'exclusive') {
    const mm = BigInt(ld + 1);
    for (let i = 1n; i < N; i++) {
      let j = Q.floorDiv(i * mm, N);
      j = j < 1n ? 1n : j > BigInt(ld - 1) ? BigInt(ld - 1) : j;
      const delta = i * mm - j * N;
      const jj = Number(j);
      result.push(truediv(add(mul(d[jj - 1], I(N - delta)), mul(d[jj], I(delta))), I(N)));
    }
    return result;
  }
  raise('ValueError', `Unknown method: ${Q.reprOf(method)}`);
}

// ── spread ────────────────────────────────────────────────────
export function variance(data, xbar = null) {
  const { T, ss, count } = _ss(data, xbar);
  if (count < 2) statsError('variance requires at least two data points');
  return convert(truediv(ss, I(count - 1)), T);
}
export function pvariance(data, mu = null) {
  const { T, ss, count } = _ss(data, mu);
  if (count < 1) statsError('pvariance requires at least one data point');
  return convert(truediv(ss, I(count)), T);
}
export function stdev(data, xbar = null) {
  const { ss, count } = _ss(data, xbar);
  if (count < 2) statsError('stdev requires at least two data points');
  const mss = truediv(ss, I(count - 1));
  const [a, b] = ratioParts(mss);
  return floatSqrtOfFrac(a, b);
}
export function pstdev(data, mu = null) {
  const { ss, count } = _ss(data, mu);
  if (count < 1) statsError('pstdev requires at least one data point');
  const mss = truediv(ss, I(count));
  const [a, b] = ratioParts(mss);
  return floatSqrtOfFrac(a, b);
}
function meanStdev(data) {
  const { ss, c, count } = _ss(data);
  if (count < 2) statsError('stdev requires at least two data points');
  const mss = truediv(ss, I(count - 1));
  if (isFloat(mss)) return [F(Q.toFloat(c)), truediv(F(Q.toFloat(c)), F(Q.toFloat(ss)))];
  return [F(Q.toFloat(c)), floatSqrtOfFrac(...ratioParts(mss))];
}

// _sqrtprod(x, y): sqrt(x * y) with a differential correction
function sqrtprod(x, y) {
  const h = Math.sqrt(x * y);
  if (Number.isNaN(x * y) || x * y < 0) M.sqrt(F(x * y)); // math domain error, like math.sqrt
  if (!Number.isFinite(h)) {
    if ((h === Infinity || h === -Infinity) && Number.isFinite(x) && Number.isFinite(y)) {
      const scale = 2.0 ** -512;
      return sqrtprod(scale * x, scale * y) / scale;
    }
    return h;
  }
  if (h === 0) {
    if (x && y) {
      const scale = 2.0 ** 537;
      return sqrtprod(scale * x, scale * y) / scale;
    }
    return h;
  }
  const d = sumprod([F(x), F(h)], [F(y), F(-h)]);
  return h + d.float / (2.0 * h);
}

// ── two inputs ────────────────────────────────────────────────
export function covariance(x, y) {
  const n = x.length;
  if (y.length !== n) statsError('covariance requires that both inputs have same number of data points');
  if (n < 2) statsError('covariance requires at least two data points');
  const xbar = truediv(fsum(x), I(n));
  const ybar = truediv(fsum(y), I(n));
  const P = [];
  const Qs = [];
  for (let i = 0; i < n; i++) { P.push(sub(x[i], xbar)); Qs.push(sub(y[i], ybar)); }
  const sxy = sumprod(P, Qs);
  return truediv(sxy, I(n - 1));
}

export function correlation(x, y, method = 'linear') {
  const n = x.length;
  if (y.length !== n) statsError('correlation requires that both inputs have same number of data points');
  if (n < 2) statsError('correlation requires at least two data points');
  if (method !== 'linear' && method !== 'ranked') raise('ValueError', `Unknown method: ${Q.reprOf(method)}`);
  if (method === 'ranked') {
    const start = truediv(I(n - 1), I(-2));
    x = rank(x, start);
    y = rank(y, start);
  } else {
    const xbar = truediv(fsum(x), I(n));
    const ybar = truediv(fsum(y), I(n));
    x = x.map((xi) => sub(xi, xbar));
    y = y.map((yi) => sub(yi, ybar));
  }
  const sxy = sumprod(x, y);
  const sxx = sumprod(x, x);
  const syy = sumprod(y, y);
  const den = sqrtprod(Q.toFloat(sxx), Q.toFloat(syy));
  if (den === 0) statsError('at least one of the inputs is constant');
  return truediv(sxy, F(den));
}

class LinearRegression {
  constructor(slope, intercept) {
    this.slope = slope;
    this.intercept = intercept;
    this.pyType = 'LinearRegression';
  }
  repr() { return `LinearRegression(slope=${Q.reprOf(this.slope)}, intercept=${Q.reprOf(this.intercept)})`; }
}

export function linearRegression(x, y, proportional = false) {
  const n = x.length;
  if (y.length !== n) statsError('linear regression requires that both inputs have same number of data points');
  if (n < 2) statsError('linear regression requires at least two data points');
  let xbar;
  let ybar;
  if (!proportional) {
    xbar = truediv(fsum(x), I(n));
    ybar = truediv(fsum(y), I(n));
    x = x.map((xi) => sub(xi, xbar));
    y = y.map((yi) => sub(yi, ybar));
  }
  const sxy = add(sumprod(x, y), F(0.0));
  const sxx = sumprod(x, x);
  let slope;
  try {
    slope = truediv(sxy, sxx);
  } catch (e) {
    if (e.name === 'ZeroDivisionError') statsError('x is constant');
    throw e;
  }
  const intercept = proportional ? F(0.0) : sub(ybar, mul(slope, xbar));
  return new LinearRegression(slope, intercept);
}

// ── NormalDist ────────────────────────────────────────────────
const P0 = [2.5090809287301226727e+3, 3.3430575583588128105e+4, 6.7265770927008700853e+4, 4.5921953931549871457e+4,
  1.3731693765509461125e+4, 1.9715909503065514427e+3, 1.3314166789178437745e+2, 3.3871328727963666080e+0];
const Q0 = [5.2264952788528545610e+3, 2.8729085735721942674e+4, 3.9307895800092710610e+4, 2.1213794301586595867e+4,
  5.3941960214247511077e+3, 6.8718700749205790830e+2, 4.2313330701600911252e+1, 1.0];
const P1 = [7.74545014278341407640e-4, 2.27238449892691845833e-2, 2.41780725177450611770e-1, 1.27045825245236838258e+0,
  3.64784832476320460504e+0, 5.76949722146069140550e+0, 4.63033784615654529590e+0, 1.42343711074968357734e+0];
const Q1 = [1.05075007164441684324e-9, 5.47593808499534494600e-4, 1.51986665636164571966e-2, 1.48103976427480074590e-1,
  6.89767334985100004550e-1, 1.67638483018380384940e+0, 2.05319162663775882187e+0, 1.0];
const P2 = [2.01033439929228813265e-7, 2.71155556874348757815e-5, 1.24266094738807843860e-3, 2.65321895265761230930e-2,
  2.96560571828504891230e-1, 1.78482653991729133580e+0, 5.46378491116411436990e+0, 6.65790464350110377720e+0];
const Q2 = [2.04426310338993978564e-15, 1.42151175831644588870e-7, 1.84631831751005468180e-5, 7.86869131145613259100e-4,
  1.48753612908506148525e-2, 1.36929880922735805310e-1, 5.99832206555887937690e-1, 1.0];
// (((((((c0 * r + c1) * r + c2) …) * r + c7)
const horner = (c, r) => {
  let s = c[0];
  for (let i = 1; i < 8; i++) s = s * r + c[i];
  return s;
};

// _statistics._normal_dist_inv_cdf (Modules/_statisticsmodule.c)
export function normalDistInvCdf(p, mu, sigma) {
  if (p <= 0.0 || p >= 1.0) raise('ValueError', 'inv_cdf undefined for these parameters');
  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    const num = horner(P0, r) * q;
    const den = horner(Q0, r);
    const x = num / den;
    return mu + (x * sigma);
  }
  let r = q <= 0.0 ? p : (1.0 - p);
  if (r <= 0.0 || r >= 1.0) raise('ValueError', 'inv_cdf undefined for these parameters');
  r = Math.sqrt(-L.log(r));
  let num;
  let den;
  if (r <= 5.0) {
    r -= 1.6;
    num = horner(P1, r);
    den = horner(Q1, r);
  } else {
    r -= 5.0;
    num = horner(P2, r);
    den = horner(Q2, r);
  }
  let x = num / den;
  if (q < 0.0) x = -x;
  return mu + (x * sigma);
}

export class NormalDist {
  constructor(mu = F(0.0), sigma = F(1.0)) {
    if (lt(sigma, F(0.0))) statsError('sigma must be non-negative');
    this.mu = Q.toFloat(mu);
    this.sigma = Q.toFloat(sigma);
    this.pyType = 'NormalDist';
  }
  repr() { return `NormalDist(mu=${pyFloatRepr(this.mu)}, sigma=${pyFloatRepr(this.sigma)})`; }
  static fromSamples(data) {
    const [mu, sigma] = meanStdev(data);
    return new NormalDist(mu, sigma);
  }
  samples(n, seed = null) {
    const rng = new PyRandom(seedArg(seed));
    if (!isIntegral(n)) raise('TypeError', `'${Q.typeName(n)}' object cannot be interpreted as an integer`);
    const k = intOf(n);
    if (k > 20000n) Q.demoLimit('more than 20000 samples');
    const out = [];
    for (let i = 0n; i < k; i++) out.push(F(normalDistInvCdf(rng.random(), this.mu, this.sigma)));
    return out;
  }
  pdf(x) {
    const variance = this.sigma * this.sigma;
    if (variance === 0) statsError('pdf() not defined when sigma is zero');
    const diff = sub(x, F(this.mu));
    return truediv(m.exp(truediv(mul(diff, diff), F(-2.0 * variance))), m.sqrt(mul(TAU, F(variance))));
  }
  cdf(x) {
    if (this.sigma === 0) statsError('cdf() not defined when sigma is zero');
    return mul(F(0.5), add(F(1.0), m.erf(truediv(sub(x, F(this.mu)), F(this.sigma * SQRT2.float)))));
  }
  invCdf(p) {
    if (le(p, F(0.0)) || ge(p, F(1.0))) statsError('p must be in the range 0.0 < p < 1.0');
    return F(normalDistInvCdf(Q.toFloat(p), this.mu, this.sigma));
  }
  quantiles(n = I(4)) {
    if (!isIntegral(n)) raise('TypeError', `'${Q.typeName(n)}' object cannot be interpreted as an integer`);
    const N = intOf(n);
    if (N > 10000n) Q.demoLimit('n beyond 10000');
    const out = [];
    for (let i = 1n; i < N; i++) out.push(this.invCdf(truediv(I(i), I(N))));
    return out;
  }
  overlap(other) {
    if (!(other instanceof NormalDist)) raise('TypeError', 'Expected another NormalDist instance');
    let X = this;
    let Y = other;
    if (Y.sigma < X.sigma || (Y.sigma === X.sigma && Y.mu < X.mu)) [X, Y] = [Y, X];
    const Xv = X.variance();
    const Yv = Y.variance();
    if (Xv === 0 || Yv === 0) statsError('overlap() not defined when sigma is zero');
    const dv = Yv - Xv;
    const dm = Math.abs(Y.mu - X.mu);
    if (dv === 0) return F(1.0 - M.erf(F(dm / (2.0 * X.sigma * SQRT2.float))).float);
    const a = X.mu * Yv - Y.mu * Xv;
    const b = X.sigma * Y.sigma * M.sqrt(F(dm * dm + dv * M.log(F(Yv / Xv)).float)).float;
    const x1 = (a + b) / dv;
    const x2 = (a - b) / dv;
    const t1 = Math.abs(Y.cdf(F(x1)).float - X.cdf(F(x1)).float);
    const t2 = Math.abs(Y.cdf(F(x2)).float - X.cdf(F(x2)).float);
    return F(1.0 - (t1 + t2));
  }
  zscore(x) {
    if (this.sigma === 0) statsError('zscore() not defined when sigma is zero');
    return truediv(sub(x, F(this.mu)), F(this.sigma));
  }
  variance() { return this.sigma * this.sigma; }
  // operators
  plus(x2) {
    if (x2 instanceof NormalDist) return new NormalDist(F(this.mu + x2.mu), M.hypot(F(this.sigma), F(x2.sigma)));
    return new NormalDist(add(F(this.mu), x2), F(this.sigma));
  }
  minus(x2) {
    if (x2 instanceof NormalDist) return new NormalDist(F(this.mu - x2.mu), M.hypot(F(this.sigma), F(x2.sigma)));
    return new NormalDist(sub(F(this.mu), x2), F(this.sigma));
  }
  times(x2) { return new NormalDist(mul(F(this.mu), x2), mul(F(this.sigma), m.fabs(x2))); }
  over(x2) { return new NormalDist(truediv(F(this.mu), x2), truediv(F(this.sigma), m.fabs(x2))); }
  negate() { return new NormalDist(F(-this.mu), F(this.sigma)); }
  equals(o) { return o instanceof NormalDist && this.mu === o.mu && this.sigma === o.sigma; }
}

// random.Random(seed) argument in _pyrandom's value model
function seedArg(seed) {
  if (seed === null || seed === undefined) return null;
  if (isInt(seed)) return seed.int;
  if (isFloat(seed)) return seed.float;
  if (isBool(seed) || typeof seed === 'string') return seed;
  if (seed && seed.bytes) return seed;
  raise('TypeError', 'The only supported seed types are:\nNone, int, float, str, bytes, and bytearray.');
}

// ── kde_random ────────────────────────────────────────────────
function newtonRaphson(estimate, f, fPrime, tolerance = 1e-12) {
  return (y) => {
    let x = estimate(y);
    for (let k = 0; ; k++) {
      const diff = sub(f(x), y);
      if (!gt(Q.pyAbs(diff), F(tolerance))) return x;
      if (k > 10000) Q.demoLimit('a Newton iteration that does not converge');
      x = sub(x, truediv(diff, fPrime(x)));
    }
  };
}
function quarticEstimate(p) {
  let sign;
  if (le(p, F(0.5))) sign = F(1.0); else { sign = F(-1.0); p = sub(F(1.0), p); }
  let x = sub(Q.pyPow(mul(F(2.0), p), F(0.4258865685331)), F(1.0));
  if (ge(p, F(0.004))) x = add(x, mul(F(0.026818732), m.sin(add(mul(F(7.101753784), p), F(2.73230839482953)))));
  return mul(x, sign);
}
function triweightEstimate(p) {
  let sign;
  if (le(p, F(0.5))) sign = F(1.0); else { sign = F(-1.0); p = sub(F(1.0), p); }
  const x = sub(Q.pyPow(mul(F(2.0), p), F(0.3400218741872791)), F(1.0));
  return mul(x, sign);
}
const quarticInv = newtonRaphson(quarticEstimate, quarticCdf, (t) => mul(F(0.9375), Q.pyPow(sub(F(1.0), mul(t, t)), I(2))));
const triweightInv = newtonRaphson(triweightEstimate, triweightCdf, (t) => mul(F(1.09375), Q.pyPow(sub(F(1.0), mul(t, t)), I(3))));
const STD_NORMAL = new NormalDist();
const KERNEL_INVCDFS = {
  normal: (p) => STD_NORMAL.invCdf(p),
  logistic: (p) => m.log(truediv(p, sub(I(1), p))),
  sigmoid: (p) => m.log(m.tan(truediv(mul(p, PI), I(2)))),
  rectangular: (p) => sub(mul(I(2), p), I(1)),
  parabolic: (p) => mul(I(2), m.cos(truediv(add(m.acos(sub(mul(I(2), p), I(1))), PI), I(3)))),
  quartic: quarticInv,
  triweight: triweightInv,
  triangular: (p) => (lt(p, F(0.5)) ? sub(m.sqrt(mul(I(2), p)), I(1)) : sub(I(1), m.sqrt(sub(I(2), mul(I(2), p))))),
  cosine: (p) => truediv(mul(I(2), m.asin(sub(mul(I(2), p), I(1)))), PI),
};
KERNEL_INVCDFS.gauss = KERNEL_INVCDFS.normal;
KERNEL_INVCDFS.uniform = KERNEL_INVCDFS.rectangular;
KERNEL_INVCDFS.epanechnikov = KERNEL_INVCDFS.parabolic;
KERNEL_INVCDFS.biweight = KERNEL_INVCDFS.quartic;

// kde_random(data, h, kernel='normal', *, seed=None) → a JS function
export function kdeRandom(data, h, kernel = 'normal', seed = null) {
  checkKdeArgs(data, h);
  const inv = typeof kernel === 'string' && Object.prototype.hasOwnProperty.call(KERNEL_INVCDFS, kernel) ? KERNEL_INVCDFS[kernel] : null;
  if (inv === null) statsError(`Unknown kernel name: ${Q.reprOf(kernel)}`);
  const rng = new PyRandom(seedArg(seed));
  const rand = () => {
    const c = rng.choice(data);
    return add(c, mul(h, inv(F(rng.random()))));
  };
  rand.doc = `Random KDE selection with h=${Q.reprOf(h)} and kernel=${Q.reprOf(kernel)}`;
  return rand;
}
