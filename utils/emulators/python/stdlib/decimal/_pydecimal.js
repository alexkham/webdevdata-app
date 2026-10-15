// utils/emulators/python/stdlib/decimal/_pydecimal.js
//
// A port of CPython 3.13's Lib/_pydecimal.py — the pure-Python twin of the
// C _decimal module (libmpdec) — for the snippet demos, adjusted wherever
// the C module that CPython actually uses behaves differently:
//
//   * Signals are collected per operation and checked at the end, the way
//     _decimal's dec_addstatus() does it: every flag is set (even when the
//     operation raises), the exception class is the first trapped signal
//     and its message is the LIST of trapped conditions, e.g.
//     decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>].
//     Flags are kept as libmpdec condition bits, so Context reprs list
//     them in libmpdec's order.
//   * Decimal(str) follows _decimal + libmpdec: Unicode digits and
//     whitespace, underscores ignored, inf/infinity/nan/snan in any case,
//     out-of-range exponents → InvalidOperation.
//   * TypeError / ValueError texts, Context validation, Context and
//     signal-dict reprs and format() are the C module's.
//
// Coefficients are digit strings (as in _pydecimal), BigInt for
// arithmetic; exponents are JS numbers. Inputs the browser should not
// attempt (exponents beyond ±10**15, hundreds of thousands of digits,
// huge precisions) raise a DemoLimit instead.

import { PyException } from '../../../../py-exceptions.js';
import { pyFloatRepr, pyStrRepr } from '../../../../demo-coerce.js';

export function demoLimit(what) {
  const e = new Error(`not emulated: ${what}`);
  e.name = 'DemoLimit';
  throw e;
}
export function pyErr(type, msg = '') {
  throw new PyException(type, msg);
}

// ── module constants ──────────────────────────────────────────
export const ROUND_DOWN = 'ROUND_DOWN';
export const ROUND_HALF_UP = 'ROUND_HALF_UP';
export const ROUND_HALF_EVEN = 'ROUND_HALF_EVEN';
export const ROUND_CEILING = 'ROUND_CEILING';
export const ROUND_FLOOR = 'ROUND_FLOOR';
export const ROUND_UP = 'ROUND_UP';
export const ROUND_HALF_DOWN = 'ROUND_HALF_DOWN';
export const ROUND_05UP = 'ROUND_05UP';
export const ROUNDINGS = [ROUND_UP, ROUND_DOWN, ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN, ROUND_05UP];
const ROUNDING_ERR = 'valid values for rounding are:\n  [ROUND_CEILING, ROUND_FLOOR, ROUND_UP, ROUND_DOWN,\n   ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN,\n   ROUND_05UP]';
const SIGNAL_ERR = 'valid values for signals are:\n  [InvalidOperation, FloatOperation, DivisionByZero,\n   Overflow, Underflow, Subnormal, Inexact, Rounded,\n   Clamped]';

// 64-bit build values (sys.maxsize == 2**63 - 1)
export const MAX_PREC = 999999999999999999n;
export const MAX_EMAX = 999999999999999999n;
export const MIN_EMIN = -999999999999999999n;
export const MIN_ETINY = -1999999999999999997n;
// what this port computes with plain JS numbers
const EXP_LIMIT = 1e15;
const PREC_LIMIT = 100000;
const DIGIT_LIMIT = 200000;

// ── signals and libmpdec condition bits ───────────────────────
// libmpdec status bits in bit order (MPD_Clamped = 1 … MPD_Underflow);
// FloatOperation reuses MPD_Not_implemented.
const BITS = ['Clamped', 'ConversionSyntax', 'DivisionByZero', 'DivisionImpossible', 'DivisionUndefined', 'FpuError',
  'Inexact', 'InvalidContext', 'InvalidOperation', 'MallocError', 'FloatOperation', 'Overflow', 'Rounded', 'Subnormal', 'Underflow'];
const IEEE_INVALID = ['ConversionSyntax', 'DivisionImpossible', 'DivisionUndefined', 'FpuError', 'InvalidContext', 'InvalidOperation', 'MallocError'];
const IEEE_SET = new Set(IEEE_INVALID);
// _decimal's signal_map (order of Context.flags / .traps dicts) and cond_map
export const SIGNALS = ['InvalidOperation', 'FloatOperation', 'DivisionByZero', 'Overflow', 'Underflow', 'Subnormal', 'Inexact', 'Rounded', 'Clamped'];
const COND_MAP = ['InvalidOperation', 'ConversionSyntax', 'DivisionImpossible', 'DivisionUndefined', 'InvalidContext'];
const signalOf = (bit) => (IEEE_SET.has(bit) ? 'InvalidOperation' : bit);
const bitsOf = (sig) => (sig === 'InvalidOperation' ? IEEE_INVALID : [sig]);

// exception classes: name → MRO (as Python prints __mro__ minus object)
export const EXC_MRO = {
  DecimalException: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException'],
  Clamped: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Clamped'],
  InvalidOperation: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'InvalidOperation'],
  ConversionSyntax: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'InvalidOperation', 'ConversionSyntax'],
  DivisionByZero: ['BaseException', 'Exception', 'ArithmeticError', 'ZeroDivisionError', 'DecimalException', 'DivisionByZero'],
  DivisionImpossible: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'InvalidOperation', 'DivisionImpossible'],
  DivisionUndefined: ['BaseException', 'Exception', 'ArithmeticError', 'ZeroDivisionError', 'DecimalException', 'InvalidOperation', 'DivisionUndefined'],
  Inexact: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Inexact'],
  InvalidContext: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'InvalidOperation', 'InvalidContext'],
  Rounded: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Rounded'],
  Subnormal: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Subnormal'],
  Overflow: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Rounded', 'Inexact', 'Overflow'],
  Underflow: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Subnormal', 'Rounded', 'Inexact', 'Underflow'],
  FloatOperation: ['BaseException', 'Exception', 'TypeError', 'ArithmeticError', 'DecimalException', 'FloatOperation'],
};
// isinstance(exc, cls) for an emulated exception (cls a bare class name)
export function excIs(e, cls) {
  if (!e || !e.name) return false;
  const name = e.name.replace(/^decimal\./, '');
  const mro = EXC_MRO[name];
  if (mro) return mro.includes(cls);
  return name === cls;
}
// type(exc).__name__ of an emulated exception
export const excName = (e) => String(e.name).replace(/^decimal\./, '');

// ── small helpers ─────────────────────────────────────────────
const zeros = (n) => (n > 0 ? '0'.repeat(n) : '');
const P10 = [];
function p10(k) {
  // 10 ** k as BigInt (k a non-negative JS number)
  if (k < 0) throw new Error('p10 of a negative number');
  if (k < 400) {
    if (P10[k] === undefined) P10[k] = 10n ** BigInt(k);
    return P10[k];
  }
  if (k > 4 * DIGIT_LIMIT) demoLimit('numbers with this many digits are too large for the in-browser demo');
  return 10n ** BigInt(k);
}
const babs = (n) => (n < 0n ? -n : n);
const bmin = (a, b) => (a < b ? a : b);
// Python floor division / divmod on BigInt
function fdiv(a, b) {
  const q = a / b;
  return (a % b !== 0n && ((a < 0n) !== (b < 0n))) ? q - 1n : q;
}
function fdivmod(a, b) {
  const q = fdiv(a, b);
  return [q, a - q * b];
}
const nbits = (n) => (n === 0n ? 0 : babs(n).toString(2).length);
const blen = (n) => n.toString().length; // len(str(n)), sign included
const toNum = (b) => {
  const n = Number(b);
  if (!Number.isSafeInteger(n)) demoLimit('exponents this large are outside what the in-browser demo computes');
  return n;
};

// Python int repr, with the 4300-digit str() limit
export function intRepr(n) {
  const s = babs(n).toString();
  if (s.length > 4300) {
    pyErr('ValueError', 'Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit');
  }
  return n < 0n ? `-${s}` : s;
}

// ── the Decimal value ─────────────────────────────────────────
// sign 0/1; int = coefficient digits ('' for a NaN without payload);
// exp = number, or 'n' (NaN), 'N' (sNaN), 'F' (Infinity)
export class Dec {
  constructor(sign, int, exp, special = false) {
    this.sign = sign;
    this.int = int;
    this.exp = exp;
    this.special = special;
  }
}
export const isDec = (v) => v instanceof Dec;
const dft = (sign, coeff, exp, special = false) => new Dec(sign, coeff, exp, special);
const INF = dft(0, '0', 'F', true);
const NEG_INF = dft(1, '0', 'F', true);
const NAN = dft(0, '', 'n', true);
const ZERO = dft(0, '0', 0);
const ONE = dft(0, '1', 0);
const NEG_ONE = dft(1, '1', 0);
const SIGNED_INF = [INF, NEG_INF];

const isnan = (d) => (d.special ? (d.exp === 'n' ? 1 : d.exp === 'N' ? 2 : 0) : 0);
const isinf = (d) => (d.exp === 'F' ? (d.sign ? -1 : 1) : 0);
const truthy = (d) => d.special || d.int !== '0';
export const adjusted = (d) => (d.special ? 0 : d.exp + d.int.length - 1);
const copyAbs = (d) => dft(0, d.int, d.exp, d.special);
const copyNegate = (d) => dft(d.sign ? 0 : 1, d.int, d.exp, d.special);
const isInteger = (d) => {
  if (d.special) return false;
  if (d.exp >= 0) return true;
  return /^0*$/.test(d.int.slice(d.exp));
};
const isEven = (d) => {
  if (!truthy(d) || d.exp > 0) return true;
  return '02468'.includes(d.int[d.int.length - 1 + d.exp]);
};
const workRep = (d) => ({ sign: d.sign, int: BigInt(d.int), exp: d.exp });

// ── Context ───────────────────────────────────────────────────
export class Context {
  constructor(o) {
    this.prec = o.prec;
    this.rounding = o.rounding;
    this.Emin = o.Emin;
    this.Emax = o.Emax;
    this.capitals = o.capitals;
    this.clamp = o.clamp;
    this.flags = o.flags;      // Set of condition bits
    this.traps = o.traps;      // Set of condition bits
    this._ignoreAll = o._ignoreAll || false;
    this._pend = o._pend || { bits: new Set() };
  }
  Etiny() { return this.Emin - this.prec + 1; }
  Etop() { return this.Emax - this.prec + 1; }
  fields() {
    return { prec: this.prec, rounding: this.rounding, Emin: this.Emin, Emax: this.Emax, capitals: this.capitals, clamp: this.clamp };
  }
  // _pydecimal's _shallow_copy: shares flags and traps (and, here, the
  // pending status of the running operation)
  _shallow() {
    return new Context({ ...this.fields(), flags: this.flags, traps: this.traps, _ignoreAll: this._ignoreAll, _pend: this._pend });
  }
  // Context.copy()
  copy() {
    return new Context({ ...this.fields(), flags: new Set(this.flags), traps: new Set(this.traps), _ignoreAll: this._ignoreAll });
  }
  // _raise_error: record the condition; the value returned is what
  // _pydecimal returns when the signal is not trapped
  _raise(cond, ...args) {
    if (this._ignoreAll) return handle(signalOf(cond), this, args);
    this.flags.add(cond);
    this._pend.bits.add(cond);
    return handle(cond, this, args);
  }
}

function handle(cond, ctx, args) {
  switch (cond) {
    case 'InvalidOperation':
      if (args.length) return fixNan(dft(args[0].sign, args[0].int, 'n', true), ctx);
      return NAN;
    case 'ConversionSyntax':
    case 'DivisionImpossible':
    case 'DivisionUndefined':
    case 'InvalidContext':
      return NAN;
    case 'DivisionByZero':
      return SIGNED_INF[args[0]];
    case 'Overflow': {
      const sign = args[0];
      const r = ctx.rounding;
      if (r === ROUND_HALF_UP || r === ROUND_HALF_EVEN || r === ROUND_HALF_DOWN || r === ROUND_UP) return SIGNED_INF[sign];
      if (sign === 0) {
        if (r === ROUND_CEILING) return SIGNED_INF[sign];
        return dft(sign, '9'.repeat(ctx.prec), ctx.Emax - ctx.prec + 1);
      }
      if (r === ROUND_FLOOR) return SIGNED_INF[sign];
      return dft(sign, '9'.repeat(ctx.prec), ctx.Emax - ctx.prec + 1);
    }
    default:
      return undefined;
  }
}

// Start / finish one C-level operation on ctx: the status of the
// operation is added to the flags as it happens; at the end, trapped
// conditions raise (dec_addstatus).
function begin(ctx) {
  ctx._pend.bits.clear();
  return ctx;
}
function commit(ctx) {
  const st = ctx._pend.bits;
  if (st.size === 0) return;
  const trapped = new Set([...st].filter((b) => ctx.traps.has(b)));
  st.clear();
  if (trapped.size === 0) return;
  const cls = SIGNALS.find((s) => bitsOf(s).some((b) => trapped.has(b)));
  const list = [...COND_MAP, ...SIGNALS.slice(1)].filter((n) => trapped.has(n));
  throw new PyException(`decimal.${cls}`, `[${list.map((n) => `<class 'decimal.${n}'>`).join(', ')}]`);
}
// run fn as one operation on ctx
function op(ctx, fn) {
  if (ctx.prec > PREC_LIMIT) demoLimit(`arithmetic with prec=${ctx.prec} is far beyond what the in-browser demo computes`);
  begin(ctx);
  const r = fn();
  commit(ctx);
  return r;
}

const trapSet = (signals) => new Set(signals.flatMap(bitsOf));
function makeContext(o) {
  return new Context({
    prec: 28, rounding: ROUND_HALF_EVEN, Emin: -999999, Emax: 999999, capitals: 1, clamp: 0,
    flags: new Set(), traps: trapSet(['InvalidOperation', 'DivisionByZero', 'Overflow']), ...o,
  });
}
export const DefaultContext = makeContext({});
export const BasicContext = makeContext({ prec: 9, rounding: ROUND_HALF_UP, traps: trapSet(['Clamped', 'InvalidOperation', 'DivisionByZero', 'Overflow', 'Underflow']) });
export const ExtendedContext = makeContext({ prec: 9, traps: new Set() });

// the thread's current context (getcontext()); fresh() gives every demo
// run a new one, as a new interpreter would
let CUR = DefaultContext.copy();
export function fresh() {
  CUR = DefaultContext.copy();
  CUR.flags.clear();
  return CUR;
}
export const getcontext = () => CUR;
export function setcontext(ctx) {
  if (!(ctx instanceof Context)) pyErr('TypeError', 'argument must be a context');
  if (ctx === DefaultContext || ctx === BasicContext || ctx === ExtendedContext) {
    ctx = ctx.copy();
    ctx.flags.clear();
  }
  CUR = ctx;
}

// ── Context construction and attributes (C validation) ───────
// The C module reads context ints with PyLong_AsSsize_t (64-bit on Linux x86-64
// and 64-bit Windows alike): anything outside [-2**63, 2**63-1] is an OverflowError.
const SSIZE_MAX = 9223372036854775807n;
function checkInt(v) {
  let n;
  if (typeof v === 'bigint') n = v;
  else if (typeof v === 'number' && Number.isInteger(v)) n = BigInt(v);
  else if (typeof v === 'boolean') n = v ? 1n : 0n;
  else return pyErr('TypeError', 'an integer is required');
  if (n > SSIZE_MAX || n < -SSIZE_MAX - 1n) pyErr('OverflowError', 'Python int too large to convert to C ssize_t');
  return n;
}
function setPrec(ctx, v) {
  const n = checkInt(v);
  if (n < 1n || n > MAX_PREC) pyErr('ValueError', 'valid range for prec is [1, MAX_PREC]');
  // (a huge prec is fine to store; arithmetic with it is a DemoLimit in op())
  if (n > 9007199254740991n) demoLimit(`prec=${n} is outside what the in-browser demo represents`);
  ctx.prec = Number(n);
}
function setEmin(ctx, v) {
  const n = checkInt(v);
  if (n > 0n || n < MIN_EMIN) pyErr('ValueError', 'valid range for Emin is [MIN_EMIN, 0]');
  if (n < BigInt(-EXP_LIMIT)) demoLimit('an Emin this small is outside what the in-browser demo computes');
  ctx.Emin = Number(n);
}
function setEmax(ctx, v) {
  const n = checkInt(v);
  if (n < 0n || n > MAX_EMAX) pyErr('ValueError', 'valid range for Emax is [0, MAX_EMAX]');
  if (n > BigInt(EXP_LIMIT)) demoLimit('an Emax this large is outside what the in-browser demo computes');
  ctx.Emax = Number(n);
}
function setCapitals(ctx, v) {
  const n = checkInt(v);
  if (n !== 0n && n !== 1n) pyErr('ValueError', 'valid values for capitals are 0 or 1');
  ctx.capitals = Number(n);
}
function setClamp(ctx, v) {
  const n = checkInt(v);
  if (n !== 0n && n !== 1n) pyErr('ValueError', 'valid values for clamp are 0 or 1');
  ctx.clamp = Number(n);
}
export function checkRounding(v) {
  if (typeof v !== 'string' || !ROUNDINGS.includes(v)) pyErr('TypeError', ROUNDING_ERR);
  return v;
}
// a list of signal names (flags=[...] / traps=[...] arguments)
function signalList(list) {
  for (const s of list) if (!SIGNALS.includes(s)) pyErr('KeyError', pyStrRepr(SIGNAL_ERR));
  return trapSet(list);
}
// Context(prec=None, rounding=None, Emin=None, Emax=None, capitals=None,
// clamp=None, flags=None, traps=None) — values not given come from
// DefaultContext; flags are cleared unless given
export function newContext(kw = {}) {
  const ctx = DefaultContext.copy();
  ctx.flags = new Set();
  applyContextArgs(ctx, kw);
  return ctx;
}
function applyContextArgs(ctx, kw) {
  if (kw.prec !== undefined && kw.prec !== null) setPrec(ctx, kw.prec);
  if (kw.rounding !== undefined && kw.rounding !== null) ctx.rounding = checkRounding(kw.rounding);
  if (kw.Emin !== undefined && kw.Emin !== null) setEmin(ctx, kw.Emin);
  if (kw.Emax !== undefined && kw.Emax !== null) setEmax(ctx, kw.Emax);
  if (kw.capitals !== undefined && kw.capitals !== null) setCapitals(ctx, kw.capitals);
  if (kw.clamp !== undefined && kw.clamp !== null) setClamp(ctx, kw.clamp);
  if (kw.traps !== undefined && kw.traps !== null) ctx.traps = signalList(kw.traps);
  if (kw.flags !== undefined && kw.flags !== null) ctx.flags = signalList(kw.flags);
}
// localcontext(ctx=None, **kwargs): a copy of ctx (default: the current
// context) with the keyword changes applied
export function localcontext(kw = {}, base = null) {
  const ctx = (base || CUR).copy();
  applyContextArgs(ctx, kw);
  return ctx;
}
// with localcontext(...) as ctx: body — fn(ctx) runs with ctx current
export function withContext(ctx, fn) {
  const saved = CUR;
  setcontext(ctx);
  try {
    return fn(CUR);
  } finally {
    CUR = saved;
  }
}
// ctx.attr = value
export function setAttr(ctx, name, value) {
  switch (name) {
    case 'prec': return setPrec(ctx, value);
    case 'rounding': ctx.rounding = checkRounding(value); return undefined;
    case 'Emin': return setEmin(ctx, value);
    case 'Emax': return setEmax(ctx, value);
    case 'capitals': return setCapitals(ctx, value);
    case 'clamp': return setClamp(ctx, value);
    default: return pyErr('AttributeError', `'decimal.Context' object has no attribute '${name}'`);
  }
}
// ctx.flags[sig] / ctx.traps[sig] (and assignment)
export function sigGet(set, sig) {
  if (!SIGNALS.includes(sig)) pyErr('KeyError', pyStrRepr(SIGNAL_ERR));
  return bitsOf(sig).some((b) => set.has(b));
}
export function sigSet(set, sig, on) {
  if (!SIGNALS.includes(sig)) pyErr('KeyError', pyStrRepr(SIGNAL_ERR));
  for (const b of bitsOf(sig)) {
    if (on) set.add(b);
    else set.delete(b);
  }
}
export const clearFlags = (ctx) => ctx.flags.clear();
export const clearTraps = (ctx) => ctx.traps.clear();
// signals currently set, in signal_map order (what a loop over the dict
// with a truth test produces)
export const setSignals = (set) => SIGNALS.filter((s) => sigGet(set, s));

// ── reprs ─────────────────────────────────────────────────────
function signalNamesInBitOrder(set) {
  const out = [];
  let invalidDone = false;
  for (const b of BITS) {
    if (!set.has(b)) continue;
    if (IEEE_SET.has(b)) {
      if (invalidDone) continue;
      invalidDone = true;
    }
    out.push(signalOf(b));
  }
  return out;
}
export function contextRepr(ctx) {
  return `Context(prec=${ctx.prec}, rounding=${ctx.rounding}, Emin=${ctx.Emin}, Emax=${ctx.Emax}, capitals=${ctx.capitals}, clamp=${ctx.clamp}, `
    + `flags=[${signalNamesInBitOrder(ctx.flags).join(', ')}], traps=[${signalNamesInBitOrder(ctx.traps).join(', ')}])`;
}
export function signalDictRepr(set) {
  return '{' + SIGNALS.map((s) => `<class 'decimal.${s}'>:${sigGet(set, s) ? 'True' : 'False'}`).join(', ') + '}';
}

// ── conversion to string (__str__ / to_eng_string) ────────────
export function decStr(d, eng = false, capitals = null) {
  const sign = d.sign ? '-' : '';
  if (d.special) {
    if (d.exp === 'F') return `${sign}Infinity`;
    if (d.exp === 'n') return `${sign}NaN${d.int}`;
    return `${sign}sNaN${d.int}`;
  }
  const leftdigits = d.exp + d.int.length;
  let dotplace;
  if (d.exp <= 0 && leftdigits > -6) dotplace = leftdigits;
  else if (!eng) dotplace = 1;
  else if (d.int === '0') dotplace = pmod(leftdigits + 1, 3) - 1;
  else dotplace = pmod(leftdigits - 1, 3) + 1;
  let intpart;
  let fracpart;
  if (dotplace <= 0) {
    intpart = '0';
    fracpart = '.' + zeros(-dotplace) + d.int;
  } else if (dotplace >= d.int.length) {
    intpart = d.int + zeros(dotplace - d.int.length);
    fracpart = '';
  } else {
    intpart = d.int.slice(0, dotplace);
    fracpart = '.' + d.int.slice(dotplace);
  }
  let exp = '';
  if (leftdigits !== dotplace) {
    const caps = capitals === null ? CUR.capitals : capitals;
    const e = leftdigits - dotplace;
    exp = (caps ? 'E' : 'e') + (e >= 0 ? '+' : '-') + Math.abs(e);
  }
  return sign + intpart + fracpart + exp;
}
const pmod = (a, b) => ((a % b) + b) % b;
export const decRepr = (d) => `Decimal('${decStr(d)}')`;

// ── Decimal(...) construction ─────────────────────────────────
// Unicode decimal digits as CPython 3.13 (Unicode 15.1) knows them: 68 runs
// of 0..9, by their zero (Py_UNICODE_TODECIMAL)
const ND_ZEROS = [
  0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xde6, 0xe50, 0xed0, 0xf20,
  0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0, 0x1c40, 0x1c50, 0xa620, 0xa8d0,
  0xa900, 0xa9d0, 0xa9f0, 0xaa50, 0xabf0, 0xff10, 0x104a0, 0x10d30, 0x11066, 0x110f0, 0x11136, 0x111d0, 0x112f0,
  0x11450, 0x114d0, 0x11650, 0x116c0, 0x11730, 0x118e0, 0x11950, 0x11c50, 0x11d50, 0x11da0, 0x11f50, 0x16a60,
  0x16ac0, 0x16b50, 0x1d7ce, 0x1d7d8, 0x1d7e2, 0x1d7ec, 0x1d7f6, 0x1e140, 0x1e2f0, 0x1e4f0, 0x1e950, 0x1fbf0,
];
function digitValue(cp) {
  for (const z of ND_ZEROS) if (cp >= z && cp <= z + 9) return cp - z;
  return -1;
}
// Py_UNICODE_ISSPACE
const WS_EXTRA = [0x85, 0xa0, 0x1680, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000];
const isPySpace = (ch) => {
  const cp = ch.codePointAt(0);
  return (cp >= 9 && cp <= 13) || (cp >= 0x1c && cp <= 0x20) || (cp >= 0x2000 && cp <= 0x200a) || WS_EXTRA.includes(cp);
};

// _decimal's numeric_as_ascii(); '' means "not a number" (ConversionSyntax)
function numericAsAscii(s, stripWs, ignoreUnderscores) {
  let chars = [...s];
  if (stripWs) {
    let i = 0;
    let j = chars.length;
    while (i < j && isPySpace(chars[i])) i += 1;
    while (j > i && isPySpace(chars[j - 1])) j -= 1;
    chars = chars.slice(i, j);
  }
  let out = '';
  for (const ch of chars) {
    const cp = ch.codePointAt(0);
    if (ignoreUnderscores && ch === '_') continue;
    if (cp > 0 && cp <= 127) {
      out += ch;
      continue;
    }
    if (isPySpace(ch)) {
      out += ' ';
      continue;
    }
    const dv = digitValue(cp);
    if (dv < 0) return '';
    out += String(dv);
  }
  return out;
}

const NUM_RE = /^([+-])?(?:(?=\d|\.\d)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?|(inf(?:inity)?)|(s)?nan(\d*))$/i;

// libmpdec's mpd_qset_string; ctx = null → exact (maxcontext) conversion
function parseDecimal(ascii, ctx, opCtx) {
  if (ascii.length > DIGIT_LIMIT) demoLimit('strings this long are too large for the in-browser demo');
  const m = NUM_RE.exec(ascii);
  if (!m) return opCtx._raise('ConversionSyntax');
  const sign = m[1] === '-' ? 1 : 0;
  if (m[5] !== undefined) return dft(sign, '0', 'F', true);
  if (m[7] !== undefined) {
    const payload = m[7].replace(/^0+/, '');
    if (ctx && payload.length > ctx.prec - ctx.clamp) return opCtx._raise('ConversionSyntax');
    return dft(sign, payload, m[6] ? 'N' : 'n', true);
  }
  const intpart = m[2] || '';
  const frac = m[3] || '';
  let exp = (m[4] !== undefined ? BigInt(m[4]) : 0n) - BigInt(frac.length);
  const coeff = (intpart + frac).replace(/^0+(?=\d)/, '');
  if (ctx === null) {
    // exact: anything maxcontext would round, clamp or overflow is an error
    if (coeff === '0') {
      if (exp > MAX_EMAX || exp < MIN_ETINY) return opCtx._raise('InvalidOperation');
    } else if (exp + BigInt(coeff.length - 1) > MAX_EMAX || exp < MIN_ETINY) {
      return opCtx._raise('InvalidOperation');
    }
  }
  if (exp > BigInt(EXP_LIMIT) || exp < BigInt(-EXP_LIMIT)) demoLimit('exponents beyond ±10**15 are outside what the in-browser demo computes');
  const d = dft(sign, coeff, Number(exp));
  return ctx ? fix(d, ctx) : d;
}

// exact float → Decimal (Decimal.from_float)
function floatToDec(x) {
  if (Number.isNaN(x)) return NAN;
  if (!Number.isFinite(x)) return x > 0 ? INF : NEG_INF;
  const sign = (x < 0 || Object.is(x, -0)) ? 1 : 0;
  const a = Math.abs(x);
  if (a === 0) return dft(sign, '0', 0);
  // a = mant * 2**e exactly, mant odd
  const buf = new DataView(new ArrayBuffer(8));
  buf.setFloat64(0, a);
  const hi = buf.getUint32(0);
  const lo = buf.getUint32(4);
  const bexp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e;
  if (bexp === 0) e = -1074;
  else {
    mant |= 1n << 52n;
    e = bexp - 1075;
  }
  while ((mant & 1n) === 0n) {
    mant >>= 1n;
    e += 1;
  }
  if (e >= 0) return dft(sign, (mant << BigInt(e)).toString(), 0);
  const k = -e;
  return dft(sign, (mant * 5n ** BigInt(k)).toString(), -k);
}

// Python-side value kinds the demos pass in:
//   string → str, bigint / safe-integer number → int, boolean → bool,
//   { float: x } → float, Dec → Decimal, { tuple: [...] } / array →
//   tuple / list, null → None
export const F = (x) => ({ float: x });
export const isFloatV = (v) => v !== null && typeof v === 'object' && typeof v.float === 'number';
const isIntV = (v) => typeof v === 'bigint' || typeof v === 'boolean' || (typeof v === 'number' && Number.isInteger(v));
const asBig = (v) => (typeof v === 'bigint' ? v : typeof v === 'boolean' ? (v ? 1n : 0n) : BigInt(v));
export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'boolean') return 'bool';
  if (isIntV(v)) return 'int';
  if (isFloatV(v)) return 'float';
  if (v instanceof Dec) return 'decimal.Decimal';
  if (v instanceof Context) return 'decimal.Context';
  if (Array.isArray(v)) return 'list';
  if (v && v.tuple) return 'tuple';
  if (v && v.frac) return 'Fraction';
  return 'object';
}
const shortType = (v) => (v instanceof Dec ? 'Decimal' : typeName(v));
const intToDec = (n) => dft(n < 0n ? 1 : 0, babs(n).toString(), 0);

function fromSequence(items, opCtx) {
  // _decimal's dectuple_as_str: sign, then exponent / special, then digits
  if (items.length !== 3) pyErr('ValueError', 'argument must be a sequence of length 3');
  const [s, digits, e] = items;
  if (!isIntV(s) || (asBig(s) !== 0n && asBig(s) !== 1n)) pyErr('ValueError', 'sign must be an integer with the value 0 or 1');
  const sign = Number(asBig(s));
  let special = null;
  if (typeof e === 'string') {
    if (e !== 'F' && e !== 'n' && e !== 'N') pyErr('ValueError', "string argument in the third position must be 'F', 'n' or 'N'");
    special = e;
  } else if (!isIntV(e)) {
    pyErr('ValueError', 'exponent must be an integer');
  }
  const seq = Array.isArray(digits) ? digits : digits && Array.isArray(digits.tuple) ? digits.tuple : null;
  if (!seq) pyErr('ValueError', 'coefficient must be a tuple of digits');
  let coeff = '';
  for (const dg of seq) {
    if (!isIntV(dg) || asBig(dg) < 0n || asBig(dg) > 9n) pyErr('ValueError', 'coefficient must be a tuple of digits');
    coeff += asBig(dg).toString();
  }
  // an infinity accepts (and ignores) any well-formed coefficient
  if (special === 'F') return dft(sign, '0', 'F', true);
  let text;
  if (special) text = `${sign ? '-' : ''}${special === 'N' ? 's' : ''}NaN${coeff}`;
  else text = `${sign ? '-' : ''}${coeff || '0'}E${asBig(e)}`;
  return parseDecimal(text, null, opCtx);
}

// Decimal(value="0", context=None)
export function dec(value = '0', context = null) {
  const ctx = context === null ? CUR : checkContext(context);
  return op(ctx, () => {
    if (value instanceof Dec) return value;
    if (typeof value === 'string') return parseDecimal(numericAsAscii(value, true, true), null, ctx);
    if (isIntV(value)) return intToDec(asBig(value));
    if (isFloatV(value)) {
      ctx._raise('FloatOperation');
      return floatToDec(value.float);
    }
    if (Array.isArray(value)) return fromSequence(value, ctx);
    if (value && Array.isArray(value.tuple)) return fromSequence(value.tuple, ctx);
    return pyErr('TypeError', `conversion from ${typeName(value)} to Decimal is not supported`);
  });
}
// Decimal.from_float(f)
export function fromFloat(f) {
  if (isIntV(f)) return intToDec(asBig(f));
  if (isFloatV(f)) return floatToDec(f.float);
  return pyErr('TypeError', 'argument must be int or float');
}
// Context.create_decimal(num="0")
export function createDecimal(ctx, num = '0') {
  return op(ctx, () => {
    if (num instanceof Dec) return fix(num, ctx);
    if (typeof num === 'string') return parseDecimal(numericAsAscii(num, false, false), ctx, ctx);
    if (isIntV(num)) return fix(intToDec(asBig(num)), ctx);
    if (isFloatV(num)) {
      ctx._raise('FloatOperation');
      return fix(floatToDec(num.float), ctx);
    }
    if (Array.isArray(num) || (num && Array.isArray(num.tuple))) return fix(fromSequence(Array.isArray(num) ? num : num.tuple, ctx), ctx);
    return pyErr('TypeError', `conversion from ${typeName(num)} to Decimal is not supported`);
  });
}
// Context.create_decimal_from_float(f)
export function createDecimalFromFloat(ctx, f) {
  if (!isIntV(f) && !isFloatV(f)) pyErr('TypeError', 'argument must be int or float');
  return op(ctx, () => fix(fromFloat(f), ctx));
}

// operand conversion for methods and Context methods (convert_op_raise)
function conv(v) {
  if (v instanceof Dec) return v;
  if (isIntV(v)) return intToDec(asBig(v));
  return pyErr('TypeError', `conversion from ${typeName(v)} to Decimal is not supported`);
}
function checkContext(c) {
  if (!(c instanceof Context)) pyErr('TypeError', 'optional argument must be a context');
  return c;
}
const ctxOf = (c) => (c === null || c === undefined ? CUR : checkContext(c));

// ── _fix and rounding ─────────────────────────────────────────
function fixNan(d, ctx) {
  let payload = d.int;
  const maxLen = ctx.prec - ctx.clamp;
  if (payload.length > maxLen) {
    payload = payload.slice(payload.length - maxLen).replace(/^0+/, '');
    return dft(d.sign, payload, d.exp, true);
  }
  return d;
}
const allZeros = (s, p) => /^0*$/.test(s.slice(p));
const exactHalf = (s, p) => /^50*$/.test(s.slice(p));
function roundDown(d, p) { return allZeros(d.int, p) ? 0 : -1; }
const ROUND = {
  ROUND_DOWN: roundDown,
  ROUND_UP: (d, p) => -roundDown(d, p),
  ROUND_HALF_UP: roundHalfUp,
  ROUND_HALF_DOWN: (d, p) => (exactHalf(d.int, p) ? -1 : roundHalfUp(d, p)),
  ROUND_HALF_EVEN: (d, p) => ((exactHalf(d.int, p) && (p === 0 || '02468'.includes(d.int[p - 1]))) ? -1 : roundHalfUp(d, p)),
  ROUND_CEILING: (d, p) => (d.sign ? roundDown(d, p) : -roundDown(d, p)),
  ROUND_FLOOR: (d, p) => (!d.sign ? roundDown(d, p) : -roundDown(d, p)),
  ROUND_05UP: (d, p) => ((p && !'05'.includes(d.int[p - 1])) ? roundDown(d, p) : -roundDown(d, p)),
};
function roundHalfUp(d, p) {
  if ('56789'.includes(d.int[p])) return 1;
  if (allZeros(d.int, p)) return 0;
  return -1;
}
// add one to a digit string
function incr(s) {
  return (BigInt(s) + 1n).toString();
}

function fix(self, ctx) {
  if (self.special) {
    if (isnan(self)) return fixNan(self, ctx);
    return self;
  }
  const Etiny = ctx.Etiny();
  const Etop = ctx.Etop();
  if (!truthy(self)) {
    const expMax = ctx.clamp ? Etop : ctx.Emax;
    const newExp = Math.min(Math.max(self.exp, Etiny), expMax);
    if (newExp !== self.exp) {
      ctx._raise('Clamped');
      return dft(self.sign, '0', newExp);
    }
    return self;
  }
  let expMin = self.int.length + self.exp - ctx.prec;
  if (expMin > Etop) {
    const ans = ctx._raise('Overflow', self.sign);
    ctx._raise('Inexact');
    ctx._raise('Rounded');
    return ans;
  }
  const subnormal = expMin < Etiny;
  if (subnormal) expMin = Etiny;
  if (self.exp < expMin) {
    let digits = self.int.length + self.exp - expMin;
    let s = self;
    if (digits < 0) {
      s = dft(self.sign, '1', expMin - 1);
      digits = 0;
    }
    const changed = ROUND[ctx.rounding](s, digits);
    let coeff = s.int.slice(0, digits) || '0';
    if (changed > 0) {
      coeff = incr(coeff);
      if (coeff.length > ctx.prec) {
        coeff = coeff.slice(0, -1);
        expMin += 1;
      }
    }
    let ans;
    if (expMin > Etop) ans = ctx._raise('Overflow', self.sign);
    else ans = dft(self.sign, coeff, expMin);
    if (changed && subnormal) ctx._raise('Underflow');
    if (subnormal) ctx._raise('Subnormal');
    if (changed) ctx._raise('Inexact');
    ctx._raise('Rounded');
    if (!truthy(ans)) ctx._raise('Clamped');
    return ans;
  }
  if (subnormal) ctx._raise('Subnormal');
  if (ctx.clamp === 1 && self.exp > Etop) {
    ctx._raise('Clamped');
    return dft(self.sign, self.int + zeros(self.exp - Etop), Etop);
  }
  return self;
}

function rescale(self, exp, rounding) {
  if (self.special) return self;
  if (!truthy(self)) return dft(self.sign, '0', exp);
  if (self.exp >= exp) {
    if (self.exp - exp > 4 * DIGIT_LIMIT) demoLimit('numbers with this many digits are too large for the in-browser demo');
    return dft(self.sign, self.int + zeros(self.exp - exp), exp);
  }
  let digits = self.int.length + self.exp - exp;
  let s = self;
  if (digits < 0) {
    s = dft(self.sign, '1', exp - 1);
    digits = 0;
  }
  const changed = ROUND[rounding](s, digits);
  let coeff = s.int.slice(0, digits) || '0';
  if (changed === 1) coeff = incr(coeff);
  return dft(self.sign, coeff, exp);
}

function roundPlaces(self, places, rounding) {
  if (self.special || !truthy(self)) return self;
  let ans = rescale(self, adjusted(self) + 1 - places, rounding);
  if (adjusted(ans) !== adjusted(self)) ans = rescale(ans, adjusted(ans) + 1 - places, rounding);
  return ans;
}

// ── NaN checks and comparison ─────────────────────────────────
function checkNans(self, other, ctx) {
  const sn = isnan(self);
  const on = other ? isnan(other) : 0;
  if (sn || on) {
    if (sn === 2) return ctx._raise('InvalidOperation', self);
    if (on === 2) return ctx._raise('InvalidOperation', other);
    if (sn) return fixNan(self, ctx);
    return fixNan(other, ctx);
  }
  return null;
}
function compareCheckNans(self, other, ctx) {
  if (self.special || other.special) {
    if (self.exp === 'N') return ctx._raise('InvalidOperation', self);
    if (other.exp === 'N') return ctx._raise('InvalidOperation', other);
    if (self.exp === 'n') return ctx._raise('InvalidOperation', self);
    if (other.exp === 'n') return ctx._raise('InvalidOperation', other);
  }
  return null;
}
function cmp(self, other) {
  if (self.special || other.special) {
    const a = isinf(self);
    const b = isinf(other);
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }
  if (!truthy(self)) {
    if (!truthy(other)) return 0;
    return other.sign ? 1 : -1;
  }
  if (!truthy(other)) return self.sign ? -1 : 1;
  if (other.sign < self.sign) return -1;
  if (self.sign < other.sign) return 1;
  const sa = adjusted(self);
  const oa = adjusted(other);
  const pos = self.sign ? -1 : 1;
  if (sa === oa) {
    const sp = self.int + zeros(self.exp - other.exp);
    const opd = other.int + zeros(other.exp - self.exp);
    if (sp === opd) return 0;
    return sp < opd ? -pos : pos;
  }
  return sa > oa ? pos : -pos;
}

// ── arithmetic ────────────────────────────────────────────────
function normalizeOps(op1, op2, prec) {
  let tmp;
  let other;
  if (op1.exp < op2.exp) {
    tmp = op2;
    other = op1;
  } else {
    tmp = op1;
    other = op2;
  }
  const tmpLen = tmp.int.toString().length;
  const otherLen = other.int.toString().length;
  const exp = tmp.exp + Math.min(-1, tmpLen - prec - 2);
  if (otherLen + other.exp - 1 < exp) {
    other.int = 1n;
    other.exp = exp;
  }
  tmp.int *= p10(tmp.exp - other.exp);
  tmp.exp = other.exp;
}

function add(self, other, ctx) {
  if (self.special || other.special) {
    const ans = checkNans(self, other, ctx);
    if (ans) return ans;
    if (isinf(self)) {
      if (self.sign !== other.sign && isinf(other)) return ctx._raise('InvalidOperation');
      return self;
    }
    if (isinf(other)) return other;
  }
  let exp = Math.min(self.exp, other.exp);
  const negativezero = (ctx.rounding === ROUND_FLOOR && self.sign !== other.sign) ? 1 : 0;
  if (!truthy(self) && !truthy(other)) {
    let sign = Math.min(self.sign, other.sign);
    if (negativezero) sign = 1;
    return fix(dft(sign, '0', exp), ctx);
  }
  if (!truthy(self)) {
    exp = Math.max(exp, other.exp - ctx.prec - 1);
    return fix(rescale(other, exp, ctx.rounding), ctx);
  }
  if (!truthy(other)) {
    exp = Math.max(exp, self.exp - ctx.prec - 1);
    return fix(rescale(self, exp, ctx.rounding), ctx);
  }
  let op1 = workRep(self);
  let op2 = workRep(other);
  normalizeOps(op1, op2, ctx.prec);
  const result = { sign: 0, int: 0n, exp: 0 };
  if (op1.sign !== op2.sign) {
    if (op1.int === op2.int) return fix(dft(negativezero, '0', exp), ctx);
    if (op1.int < op2.int) [op1, op2] = [op2, op1];
    if (op1.sign === 1) {
      result.sign = 1;
      [op1.sign, op2.sign] = [op2.sign, op1.sign];
    } else result.sign = 0;
  } else if (op1.sign === 1) {
    result.sign = 1;
    op1.sign = 0;
    op2.sign = 0;
  } else result.sign = 0;
  result.int = op2.sign === 0 ? op1.int + op2.int : op1.int - op2.int;
  result.exp = op1.exp;
  return fix(dft(result.sign, result.int.toString(), result.exp), ctx);
}
function sub(self, other, ctx) {
  if (self.special || other.special) {
    const ans = checkNans(self, other, ctx);
    if (ans) return ans;
  }
  return add(self, copyNegate(other), ctx);
}
function mul(self, other, ctx) {
  const resultsign = self.sign ^ other.sign;
  if (self.special || other.special) {
    const ans = checkNans(self, other, ctx);
    if (ans) return ans;
    if (isinf(self)) {
      if (!truthy(other)) return ctx._raise('InvalidOperation');
      return SIGNED_INF[resultsign];
    }
    if (isinf(other)) {
      if (!truthy(self)) return ctx._raise('InvalidOperation');
      return SIGNED_INF[resultsign];
    }
  }
  const resultexp = self.exp + other.exp;
  if (!truthy(self) || !truthy(other)) return fix(dft(resultsign, '0', resultexp), ctx);
  if (self.int === '1') return fix(dft(resultsign, other.int, resultexp), ctx);
  if (other.int === '1') return fix(dft(resultsign, self.int, resultexp), ctx);
  return fix(dft(resultsign, (BigInt(self.int) * BigInt(other.int)).toString(), resultexp), ctx);
}
function truediv(self, other, ctx) {
  const sign = self.sign ^ other.sign;
  if (self.special || other.special) {
    const ans = checkNans(self, other, ctx);
    if (ans) return ans;
    if (isinf(self) && isinf(other)) return ctx._raise('InvalidOperation');
    if (isinf(self)) return SIGNED_INF[sign];
    if (isinf(other)) {
      ctx._raise('Clamped');
      return dft(sign, '0', ctx.Etiny());
    }
  }
  if (!truthy(other)) {
    if (!truthy(self)) return ctx._raise('DivisionUndefined');
    return ctx._raise('DivisionByZero', sign);
  }
  let exp;
  let coeff;
  if (!truthy(self)) {
    exp = self.exp - other.exp;
    coeff = 0n;
  } else {
    const shift = other.int.length - self.int.length + ctx.prec + 1;
    exp = self.exp - other.exp - shift;
    const a = BigInt(self.int);
    const b = BigInt(other.int);
    let rem;
    if (shift >= 0) {
      const n = a * p10(shift);
      coeff = n / b;
      rem = n % b;
    } else {
      const m = b * p10(-shift);
      coeff = a / m;
      rem = a % m;
    }
    if (rem) {
      if (coeff % 5n === 0n) coeff += 1n;
    } else {
      const ideal = self.exp - other.exp;
      while (exp < ideal && coeff % 10n === 0n) {
        coeff /= 10n;
        exp += 1;
      }
    }
  }
  return fix(dft(sign, coeff.toString(), exp), ctx);
}
// (quotient, remainder) for // and %
function divideInt(self, other, ctx) {
  const sign = self.sign ^ other.sign;
  const idealExp = isinf(other) ? self.exp : Math.min(self.exp, other.exp);
  const expdiff = adjusted(self) - adjusted(other);
  if (!truthy(self) || isinf(other) || expdiff <= -2) {
    return [dft(sign, '0', 0), rescale(self, idealExp, ctx.rounding)];
  }
  if (expdiff <= ctx.prec) {
    let a = BigInt(self.int);
    let b = BigInt(other.int);
    if (self.exp >= other.exp) a *= p10(self.exp - other.exp);
    else b *= p10(other.exp - self.exp);
    const q = a / b;
    const r = a % b;
    if (q < p10(ctx.prec)) return [dft(sign, q.toString(), 0), dft(self.sign, r.toString(), idealExp)];
  }
  const ans = ctx._raise('DivisionImpossible');
  return [ans, ans];
}
function divmodDec(self, other, ctx) {
  const ans = checkNans(self, other, ctx);
  if (ans) return [ans, ans];
  const sign = self.sign ^ other.sign;
  if (isinf(self)) {
    if (isinf(other)) {
      const a = ctx._raise('InvalidOperation');
      return [a, a];
    }
    return [SIGNED_INF[sign], ctx._raise('InvalidOperation')];
  }
  if (!truthy(other)) {
    if (!truthy(self)) {
      const a = ctx._raise('DivisionUndefined');
      return [a, a];
    }
    return [ctx._raise('DivisionByZero', sign), ctx._raise('InvalidOperation')];
  }
  const [q, r] = divideInt(self, other, ctx);
  // an infinite divisor returns the zero quotient as is; otherwise
  // libmpdec finalizes the quotient too (mpd_qdivmod)
  if (isinf(other)) return [q, fix(r, ctx)];
  const qf = fix(q, ctx);
  return [qf, fix(r, ctx)];
}
function modDec(self, other, ctx) {
  const ans = checkNans(self, other, ctx);
  if (ans) return ans;
  if (isinf(self)) return ctx._raise('InvalidOperation');
  if (!truthy(other)) {
    if (truthy(self)) return ctx._raise('InvalidOperation');
    return ctx._raise('DivisionUndefined');
  }
  return fix(divideInt(self, other, ctx)[1], ctx);
}
function floordivDec(self, other, ctx) {
  const ans = checkNans(self, other, ctx);
  if (ans) return ans;
  if (isinf(self)) {
    if (isinf(other)) return ctx._raise('InvalidOperation');
    return SIGNED_INF[self.sign ^ other.sign];
  }
  if (!truthy(other)) {
    if (truthy(self)) return ctx._raise('DivisionByZero', self.sign ^ other.sign);
    return ctx._raise('DivisionUndefined');
  }
  // libmpdec finalizes the quotient (mpd_qdivint), except for an
  // infinite divisor
  if (isinf(other)) return dft(self.sign ^ other.sign, '0', 0);
  return fix(divideInt(self, other, ctx)[0], ctx);
}
function remainderNear(self, other, ctx) {
  const ans = checkNans(self, other, ctx);
  if (ans) return ans;
  if (isinf(self)) return ctx._raise('InvalidOperation');
  if (!truthy(other)) {
    if (truthy(self)) return ctx._raise('InvalidOperation');
    return ctx._raise('DivisionUndefined');
  }
  if (isinf(other)) return fix(self, ctx);
  const idealExponent = Math.min(self.exp, other.exp);
  if (!truthy(self)) return fix(dft(self.sign, '0', idealExponent), ctx);
  const expdiff = adjusted(self) - adjusted(other);
  if (expdiff >= ctx.prec + 1) return ctx._raise('DivisionImpossible');
  if (expdiff <= -2) return fix(rescale(self, idealExponent, ctx.rounding), ctx);
  let a = BigInt(self.int);
  let b = BigInt(other.int);
  if (self.exp >= other.exp) a *= p10(self.exp - other.exp);
  else b *= p10(other.exp - self.exp);
  let q = a / b;
  let r = a % b;
  if (2n * r + (q & 1n) > b) {
    r -= b;
    q += 1n;
  }
  if (q >= p10(ctx.prec)) return ctx._raise('DivisionImpossible');
  let sign = self.sign;
  if (r < 0n) {
    sign = 1 - sign;
    r = -r;
  }
  return fix(dft(sign, r.toString(), idealExponent), ctx);
}
function negDec(self, ctx) {
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
  }
  const ans = (!truthy(self) && ctx.rounding !== ROUND_FLOOR) ? copyAbs(self) : copyNegate(self);
  return fix(ans, ctx);
}
function posDec(self, ctx) {
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
  }
  const ans = (!truthy(self) && ctx.rounding !== ROUND_FLOOR) ? copyAbs(self) : self;
  return fix(ans, ctx);
}
function absDec(self, ctx) {
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
  }
  return self.sign ? negDec(self, ctx) : posDec(self, ctx);
}
function fma(self, other, third, ctx) {
  let product;
  if (self.special || other.special) {
    if (self.exp === 'N') return ctx._raise('InvalidOperation', self);
    if (other.exp === 'N') return ctx._raise('InvalidOperation', other);
    if (self.exp === 'n') product = self;
    else if (other.exp === 'n') product = other;
    else if (self.exp === 'F') {
      if (!truthy(other)) return ctx._raise('InvalidOperation');
      product = SIGNED_INF[self.sign ^ other.sign];
    } else if (other.exp === 'F') {
      if (!truthy(self)) return ctx._raise('InvalidOperation');
      product = SIGNED_INF[self.sign ^ other.sign];
    }
  } else {
    product = dft(self.sign ^ other.sign, (BigInt(self.int) * BigInt(other.int)).toString(), self.exp + other.exp);
  }
  return add(product, third, ctx);
}

// ── power ─────────────────────────────────────────────────────
function decimalLshiftExact(n, e) {
  // n, e BigInt
  if (n === 0n) return 0n;
  if (e >= 0n) return n * 10n ** e;
  const s = babs(n).toString();
  const valN = s.length - s.replace(/0+$/, '').length;
  return BigInt(valN) < -e ? null : fdiv(n, 10n ** -e);
}
const LOG10_CORR = { 1: 100, 2: 70, 3: 53, 4: 40, 5: 31, 6: 23, 7: 16, 8: 10, 9: 5 };
function log10lb(c) {
  const s = c.toString();
  return 100 * s.length - LOG10_CORR[s[0]];
}
function powerExact(self, other, p) {
  const x = workRep(self);
  let xc = x.int;
  let xe = BigInt(x.exp);
  while (xc % 10n === 0n) {
    xc /= 10n;
    xe += 1n;
  }
  const y = workRep(other);
  let yc = y.int;
  let ye = BigInt(y.exp);
  while (yc % 10n === 0n) {
    yc /= 10n;
    ye += 1n;
  }
  if (xc === 1n) {
    xe *= yc;
    while (xe % 10n === 0n) {
      xe /= 10n;
      ye += 1n;
    }
    if (ye < 0n) return null;
    if (ye > 40n) return null;
    let exponent = xe * 10n ** ye;
    if (y.sign === 1) exponent = -exponent;
    let z;
    if (isInteger(other) && other.sign === 0) {
      const ideal = BigInt(self.exp) * intOf(other);
      z = bmin(exponent - ideal, BigInt(p - 1));
    } else z = 0n;
    return dft(0, '1' + zeros(Number(z)), toNum(exponent - z));
  }
  if (y.sign === 1) {
    const last = xc % 10n;
    let e;
    if (last === 2n || last === 4n || last === 6n || last === 8n) {
      if ((xc & -xc) !== xc) return null;
      e = BigInt(nbits(xc) - 1);
      const emax = BigInt(Math.floor((p * 93) / 65));
      if (ye >= BigInt(emax.toString().length)) return null;
      e = decimalLshiftExact(e * yc, ye);
      xe = decimalLshiftExact(xe * yc, ye);
      if (e === null || xe === null) return null;
      if (e > emax) return null;
      xc = 5n ** e;
    } else if (last === 5n) {
      e = BigInt(Math.floor((nbits(xc) * 28) / 65));
      const big = 5n ** e;
      const q = big / xc;
      const rem = big % xc;
      if (rem) return null;
      xc = q;
      while (xc % 5n === 0n) {
        xc /= 5n;
        e -= 1n;
      }
      const emax = BigInt(Math.floor((p * 10) / 3));
      if (ye >= BigInt(emax.toString().length)) return null;
      e = decimalLshiftExact(e * yc, ye);
      xe = decimalLshiftExact(xe * yc, ye);
      if (e === null || xe === null) return null;
      if (e > emax) return null;
      xc = 2n ** e;
    } else return null;
    const strxc = xc.toString();
    if (strxc.length > p) return null;
    xe = -e - xe;
    return dft(0, strxc, toNum(xe));
  }
  let m;
  let n;
  let xcBits = 0;
  if (ye >= 0n) {
    if (ye > 40n) return null;
    m = yc * 10n ** ye;
    n = 1n;
  } else {
    if (xe !== 0n && babs(yc * xe).toString().length <= -ye) return null;
    xcBits = nbits(xc);
    if ((babs(yc) * BigInt(xcBits)).toString().length <= -ye) return null;
    m = yc;
    n = 10n ** -ye;
    while (m % 2n === n % 2n && n % 2n === 0n) {
      m /= 2n;
      n /= 2n;
    }
    while (m % 5n === n % 5n && n % 5n === 0n) {
      m /= 5n;
      n /= 5n;
    }
  }
  if (n > 1n) {
    if (BigInt(xcBits) <= n) return null;
    const [q0, rem0] = fdivmod(xe, n);
    xe = q0;
    if (rem0 !== 0n) return null;
    const nn = Number(n);
    let a = 1n << BigInt(Math.ceil(nbits(xc) / nn));
    let q;
    let r;
    for (;;) {
      const ap = a ** (n - 1n);
      q = xc / ap;
      r = xc % ap;
      if (a <= q) break;
      a = (a * (n - 1n) + q) / n;
    }
    if (!(a === q && r === 0n)) return null;
    xc = a;
  }
  if (xc > 1n && m > BigInt(Math.floor((p * 100) / log10lb(xc)))) return null;
  xc **= m;
  xe *= m;
  const strXc = xc.toString();
  if (strXc.length > p) return null;
  let z;
  if (isInteger(other) && other.sign === 0) {
    const ideal = BigInt(self.exp) * intOf(other);
    z = bmin(xe - ideal, BigInt(p - strXc.length));
  } else z = 0n;
  return dft(0, strXc + zeros(Number(z)), toNum(xe - z));
}

// int(d) for a finite Decimal, as BigInt (truncates)
function intOf(d) {
  if (d.exp >= 0) {
    if (d.exp > 4 * DIGIT_LIMIT) demoLimit('integers this large are too large for the in-browser demo');
    return (d.sign ? -1n : 1n) * BigInt(d.int) * p10(d.exp);
  }
  return (d.sign ? -1n : 1n) * BigInt(d.int.slice(0, d.exp) || '0');
}

// x ** y as libmpdec's mpd_qpow computes it (the C module does not use
// _pydecimal's correctly rounded algorithm): integer exponents by binary
// exponentiation at a higher working precision (ROUND_HALF_EVEN, the
// context's exponent range), other exponents as exp(y * ln(x)) at
// max(digits, prec) + 23 digits — both then rounded once more to the
// context. The results are "almost always correctly rounded", and this
// port reproduces them exactly.
const MPD_EXP_INF = 2e15;   // stands for libmpdec's MPD_EXP_INF
const MAXCTX_E = 8e15;      // stands for the maxcontext exponent range
const expDigits = (n) => String(Math.abs(n)).length;
const isErrorBit = (b) => IEEE_SET.has(b) || b === 'DivisionByZero';
// *status |= bits
function addStatus(ctx, bits) {
  for (const b of bits) {
    if (ctx._ignoreAll) continue;
    ctx.flags.add(b);
    ctx._pend.bits.add(b);
  }
}
function workCtx(o) {
  return new Context({ capitals: 1, clamp: 0, rounding: ROUND_HALF_EVEN, flags: new Set(), traps: new Set(), ...o });
}
// _qcheck_pow_one: x == 1 exactly → the power-of-one result (not finalized)
function qcheckPowOne(base, exp, resultsign, ctx) {
  if (cmp(copyAbs(base), ONE) !== 0) return null;
  let shift;
  if (isInteger(exp)) {
    if (exp.sign) return dft(resultsign, '1', 0);
    let s = intOf(exp) * BigInt(-base.exp);
    if (s > BigInt(ctx.prec - 1)) {
      s = BigInt(ctx.prec - 1);
      addStatus(ctx, ['Rounded']);
    }
    shift = Number(s);
  } else {
    shift = ctx.prec - 1;
    addStatus(ctx, ['Inexact', 'Rounded']);
  }
  return dft(resultsign, '1' + zeros(shift), -shift);
}
// _lower_bound_zeta: a lower bound for floor(log10(abs(log10(x)))), x > 0, x != 1
function lowerBoundZeta(x) {
  const t = adjusted(x);
  if (t > 0) return expDigits(t) - 1;
  if (t < -1) return expDigits(t + 1) - 1;
  // u = adjexp(x - 1), computed exactly
  let v;
  let e = 0;
  if (x.exp >= 0) v = BigInt(x.int) * p10(x.exp) - 1n;
  else {
    v = BigInt(x.int) - p10(-x.exp);
    e = x.exp;
  }
  const u = babs(v).toString().length - 1 + e;
  return t === 0 ? u - 2 : u - 1;
}
// _qcheck_pow_bounds: certain overflow / underflow → the finalized result
function qcheckPowBounds(x, y, resultsign, ctx) {
  const absx = copyAbs(x);
  const lbTheta = adjusted(y);
  const lbZeta = lowerBoundZeta(absx);
  const sign = (adjusted(absx) < 0 ? 1 : 0) ^ y.sign;
  if (sign === 0) {
    if (expDigits(ctx.Emax) < lbZeta + lbTheta) return fix(dft(resultsign, '1', MPD_EXP_INF), ctx);
  } else if (expDigits(ctx.Etiny()) < lbZeta + lbTheta) {
    return fix(dft(resultsign, '1', ctx.Etiny() - 1), ctx);
  }
  return null;
}
const stopPow = (r, ws) => r.special || (r.int === '0' && ws.has('Clamped'));
// _mpd_qpow_uint: left-to-right binary exponentiation, n >= 1
function qpowUint(base, n, resultsign, wctx, ctx) {
  let result = base;
  const bits = n.toString(2);
  for (let i = 1; i < bits.length; i += 1) {
    result = mul(result, result, wctx);
    if (bits[i] === '1') result = mul(result, base, wctx);
    if (stopPow(result, wctx.flags)) break;
  }
  addStatus(ctx, wctx.flags);
  return dft(resultsign, result.int, result.exp, result.special);
}
// _mpd_qpow_mpd: right-to-left, for exponents that do not fit in 64 bits
function qpowMpd(tbase, n, resultsign, wctx, ctx) {
  let result = ONE;
  let b = tbase;
  let k = n;
  while (k !== 0n) {
    if (k & 1n) {
      result = mul(result, b, wctx);
      addStatus(ctx, wctx.flags);
      if (stopPow(result, wctx.flags)) break;
    }
    b = mul(b, b, wctx);
    k /= 2n;
  }
  return dft(resultsign, result.int, result.exp, result.special);
}
// _mpd_qpow_int
function qpowInt(base, exp, resultsign, ctx) {
  const wctx = workCtx({ prec: ctx.prec + exp.int.length + exp.exp + 2, Emin: ctx.Emin, Emax: ctx.Emax });
  if (wctx.prec > PREC_LIMIT) demoLimit('exponents with this many digits are outside what the in-browser demo computes');
  let tbase = base;
  let result;
  let failed = false;
  if (exp.sign) {
    wctx.prec += 1;
    const dctx = workCtx({ prec: wctx.prec, Emin: ctx.Emin, Emax: ctx.Emax });
    tbase = truediv(ONE, base, dctx);
    addStatus(ctx, dctx.flags);
    if ([...dctx.flags].some(isErrorBit)) {
      result = NAN;
      failed = true;
    }
  }
  if (!failed) {
    const n = babs(intOf(exp));
    if (n > 0xffffffffffffffffn) result = qpowMpd(tbase, n, resultsign, wctx, ctx);
    else result = qpowUint(tbase, n, resultsign, wctx, ctx);
    if (isinf(result)) result = dft(resultsign, '1', MPD_EXP_INF);
  }
  return fix(result, ctx);
}
// _mpd_qpow_real: exp(y * ln(x)) at max(digits(x), prec) + 4 + 19 digits
function qpowReal(base, exp, ctx) {
  const wp = Math.max(base.int.length, ctx.prec) + 4 + 19;
  const w = workCtx({ prec: wp, Emin: -MAXCTX_E, Emax: MAXCTX_E });
  let r = lnDec(base, w);
  r = mul(r, exp, w);
  if (!r.special && adjusted(r) >= 15) demoLimit('powers this far outside the exponent range are not computed by the in-browser demo');
  const w2 = workCtx({ prec: wp, Emin: -MAXCTX_E, Emax: MAXCTX_E });
  r = expDec(r, w2);
  addStatus(ctx, w2.flags);
  addStatus(ctx, [...w.flags].filter(isErrorBit));
  addStatus(ctx, ['Inexact', 'Rounded']);
  return r;
}
// mpd_qpow
function powDec(base, exp, ctx) {
  if (base.special || exp.special) {
    const ans = checkNans(base, exp, ctx);
    if (ans) return ans;
  }
  let intexp = false;
  let resultsign = 0;
  if (isInteger(exp)) {
    intexp = true;
    resultsign = (base.sign === 1 && !isEven(exp)) ? 1 : 0;
  }
  if (!base.special && base.int === '0') {
    if (!exp.special && exp.int === '0') return ctx._raise('InvalidOperation');
    if (exp.sign) return dft(resultsign, '0', 'F', true);
    return dft(resultsign, '0', 0);
  }
  if (base.sign === 1 && (!intexp || isinf(exp))) return ctx._raise('InvalidOperation');
  if (isinf(exp)) {
    const c = cmp(base, ONE);
    if (c === 0) {
      addStatus(ctx, ['Inexact', 'Rounded']);
      return dft(resultsign, '1' + zeros(ctx.prec - 1), -(ctx.prec - 1));
    }
    if (c * (exp.sign ? -1 : 1) < 0) return dft(resultsign, '0', 0);
    return dft(resultsign, '0', 'F', true);
  }
  if (isinf(base)) {
    if (exp.int === '0') return dft(resultsign, '1', 0);
    if (exp.sign) return dft(resultsign, '0', 0);
    return dft(resultsign, '0', 'F', true);
  }
  if (exp.int === '0') return dft(resultsign, '1', 0);
  const one = qcheckPowOne(base, exp, resultsign, ctx);
  if (one) return one;
  const bounded = qcheckPowBounds(base, exp, resultsign, ctx);
  if (bounded) return bounded;
  if (intexp) return qpowInt(base, exp, resultsign, ctx);
  let result = qpowReal(base, exp, ctx);
  if (!result.special && cmp(result, ONE) === 0) {
    const shift = ctx.prec - 1;
    result = dft(0, '1' + zeros(shift), -shift);
  }
  if (isinf(result)) result = dft(0, '1', MPD_EXP_INF);
  return fix(result, ctx);
}

function powerModulo(self, other, modulo, ctx) {
  const sn = isnan(self);
  const on = isnan(other);
  const mn = isnan(modulo);
  if (sn || on || mn) {
    if (sn === 2) return ctx._raise('InvalidOperation', self);
    if (on === 2) return ctx._raise('InvalidOperation', other);
    if (mn === 2) return ctx._raise('InvalidOperation', modulo);
    if (sn) return fixNan(self, ctx);
    if (on) return fixNan(other, ctx);
    return fixNan(modulo, ctx);
  }
  if (!(isInteger(self) && isInteger(other) && isInteger(modulo))) return ctx._raise('InvalidOperation');
  if (cmp(other, ZERO) < 0) return ctx._raise('InvalidOperation');
  if (!truthy(modulo)) return ctx._raise('InvalidOperation');
  if (adjusted(modulo) >= ctx.prec) return ctx._raise('InvalidOperation');
  if (!truthy(other) && !truthy(self)) return ctx._raise('InvalidOperation');
  const sign = isEven(other) ? 0 : self.sign;
  const mod = babs(intOf(modulo));
  const base0 = workRep(toIntegralValue(self, null, ctx));
  const exponent = workRep(toIntegralValue(other, null, ctx));
  let base = (base0.int % mod) * modPow(10n, BigInt(base0.exp), mod) % mod;
  for (let i = 0; i < exponent.exp; i += 1) base = modPow(base, 10n, mod);
  base = modPow(base, exponent.int, mod);
  return dft(sign, base.toString(), 0);
}
function modPow(b, e, m) {
  if (m === 1n) return 0n;
  let r = 1n;
  b %= m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

// ── exp / ln / log10 / sqrt helpers (_pydecimal's integer algorithms) ──
function sqrtNearest(n, a) {
  let b = 0n;
  while (a !== b) {
    const na = (a - fdiv(-n, a)) >> 1n;
    b = a;
    a = na;
  }
  return a;
}
function rshiftNearest(x, shift) {
  const b = 1n << BigInt(shift);
  const q = x >> BigInt(shift);
  return q + ((2n * (x & (b - 1n)) + (q & 1n) > b) ? 1n : 0n);
}
function divNearest(a, b) {
  const [q, r] = fdivmod(a, b);
  return q + ((2n * r + (q & 1n) > b) ? 1n : 0n);
}
function ilog(x, M, L = 8) {
  let y = x - M;
  let R = 0;
  const Lb = BigInt(L);
  while ((R <= L && (babs(y) << (Lb - BigInt(R))) >= M) || (R > L && (babs(y) >> (BigInt(R) - Lb)) >= M)) {
    y = divNearest((M * y) << 1n, M + sqrtNearest(M * (M + rshiftNearest(y, R)), M));
    R += 1;
  }
  const T = Math.ceil((10 * M.toString().length) / (3 * L));
  const yshift = rshiftNearest(y, R);
  let w = divNearest(M, BigInt(T));
  for (let k = T - 1; k > 0; k -= 1) w = divNearest(M, BigInt(k)) - divNearest(yshift * w, M);
  return divNearest(w * y, M);
}
let LOG10_DIGITS = '23025850929940456840179914546843642076011014886';
function log10Digits(p) {
  if (p < 0) throw new Error('p should be nonnegative');
  if (p >= LOG10_DIGITS.length) {
    let extra = 3;
    let digits;
    for (;;) {
      const M = p10(p + extra + 2);
      digits = divNearest(ilog(10n * M, M), 100n).toString();
      if (digits.slice(-extra) !== '0'.repeat(extra)) break;
      extra += 3;
    }
    LOG10_DIGITS = digits.replace(/0+$/, '').slice(0, -1);
  }
  return BigInt(LOG10_DIGITS.slice(0, p + 1));
}
function dlog10(c, e, p) {
  p += 2;
  const l = c.toString().length;
  const f = e + l - ((e + l >= 1) ? 1 : 0);
  let logD;
  let logTenpower;
  if (p > 0) {
    const M = p10(p);
    const k = e + p - f;
    if (k >= 0) c *= p10(k);
    else c = divNearest(c, p10(-k));
    logD = ilog(c, M);
    const log10 = log10Digits(p);
    logD = divNearest(logD * M, log10);
    logTenpower = BigInt(f) * M;
  } else {
    logD = 0n;
    logTenpower = divNearest(BigInt(f), p10(-p));
  }
  return divNearest(logTenpower + logD, 100n);
}
function dlog(c, e, p) {
  p += 2;
  const l = c.toString().length;
  const f = e + l - ((e + l >= 1) ? 1 : 0);
  let logD;
  if (p > 0) {
    const k = e + p - f;
    if (k >= 0) c *= p10(k);
    else c = divNearest(c, p10(-k));
    logD = ilog(c, p10(p));
  } else logD = 0n;
  let fLogTen;
  if (f) {
    const extra = String(Math.abs(f)).length - 1;
    if (p + extra >= 0) fLogTen = divNearest(BigInt(f) * log10Digits(p + extra), p10(extra));
    else fLogTen = 0n;
  } else fLogTen = 0n;
  return divNearest(fLogTen + logD, 100n);
}
function iexp(x, M, L = 8) {
  const R = nbits(fdiv(x << BigInt(L), M));
  const T = Math.ceil((10 * M.toString().length) / (3 * L));
  let y = divNearest(x, BigInt(T));
  let Mshift = M << BigInt(R);
  for (let i = T - 1; i > 0; i -= 1) y = divNearest(x * (Mshift + y), Mshift * BigInt(i));
  for (let k = R - 1; k >= 0; k -= 1) {
    Mshift = M << BigInt(k + 2);
    y = divNearest(y * (y + Mshift), Mshift);
  }
  return M + y;
}
function dexp(c, e, p) {
  p += 2;
  const extra = Math.max(0, e + c.toString().length - 1);
  const q = p + extra;
  const shift = e + q;
  const cshift = shift >= 0 ? c * p10(shift) : fdiv(c, p10(-shift));
  let [quot, rem] = fdivmod(cshift, log10Digits(q));
  rem = divNearest(rem, p10(extra));
  return [divNearest(iexp(rem, p10(p)), 1000n), toNum(quot) - p + 3];
}
function dpower(xc, xe, yc, ye, p) {
  const b = babs(yc).toString().length + ye;
  const lxc = dlog(xc, xe, p + b + 1);
  const shift = ye - b;
  const pc = shift >= 0 ? lxc * yc * p10(shift) : divNearest(lxc * yc, p10(-shift));
  let coeff;
  let exp;
  if (pc === 0n) {
    if ((xc.toString().length + xe >= 1) === (yc > 0n)) {
      coeff = p10(p - 1) + 1n;
      exp = 1 - p;
    } else {
      coeff = p10(p) - 1n;
      exp = -p;
    }
  } else {
    [coeff, exp] = dexp(pc, -(p + 1), p + 1);
    coeff = divNearest(coeff, 10n);
    exp += 1;
  }
  return [coeff, exp];
}
function lnExpBound(self) {
  const adj = self.exp + self.int.length - 1;
  if (adj >= 1) return String(Math.floor((adj * 23) / 10)).length - 1;
  if (adj <= -2) return String(Math.floor(((-1 - adj) * 23) / 10)).length - 1;
  const c = BigInt(self.int);
  const e = self.exp;
  if (adj === 0) {
    const num = (c - p10(-e)).toString();
    const den = c.toString();
    return num.length - den.length - (num < den ? 1 : 0);
  }
  return e + (p10(-e) - c).toString().length - 1;
}
function log10ExpBound(self) {
  const adj = self.exp + self.int.length - 1;
  if (adj >= 1) return String(adj).length - 1;
  if (adj <= -2) return String(-1 - adj).length - 1;
  const c = BigInt(self.int);
  const e = self.exp;
  if (adj === 0) {
    const num = (c - p10(-e)).toString();
    const den = (231n * c).toString();
    return num.length - den.length - (num < den ? 1 : 0) + 2;
  }
  const num = (p10(-e) - c).toString();
  return num.length + e - (num < '231' ? 1 : 0) - 1;
}
// ROUND_HALF_EVEN _fix on a shallow copy (exp, ln, log10, sqrt)
function fixHalfEven(ans, ctx) {
  const c = ctx._shallow();
  c.rounding = ROUND_HALF_EVEN;
  return fix(ans, c);
}

function expDec(self, ctx) {
  const ans0 = checkNans(self, null, ctx);
  if (ans0) return ans0;
  if (isinf(self) === -1) return ZERO;
  if (!truthy(self)) return ONE;
  if (isinf(self) === 1) return self;
  const p = ctx.prec;
  const adj = adjusted(self);
  let ans;
  if (self.sign === 0 && adj > String((ctx.Emax + 1) * 3).length) ans = dft(0, '1', ctx.Emax + 1);
  else if (self.sign === 1 && adj > String((-ctx.Etiny() + 1) * 3).length) ans = dft(0, '1', ctx.Etiny() - 1);
  else if (self.sign === 0 && adj < -p) ans = dft(0, '1' + zeros(p - 1) + '1', -p);
  else if (self.sign === 1 && adj < -p - 1) ans = dft(0, '9'.repeat(p + 1), -p - 1);
  else {
    let c = BigInt(self.int);
    const e = self.exp;
    if (self.sign === 1) c = -c;
    let extra = 3;
    let coeff;
    let exp;
    for (;;) {
      [coeff, exp] = dexp(c, e, p + extra);
      if (coeff % (5n * p10(coeff.toString().length - p - 1))) break;
      extra += 3;
    }
    ans = dft(0, coeff.toString(), exp);
  }
  return fixHalfEven(ans, ctx);
}
function lnDec(self, ctx) {
  const ans0 = checkNans(self, null, ctx);
  if (ans0) return ans0;
  if (!truthy(self)) return NEG_INF;
  if (isinf(self) === 1) return INF;
  if (cmp(self, ONE) === 0) return ZERO;
  if (self.sign === 1) return ctx._raise('InvalidOperation');
  const c = BigInt(self.int);
  const e = self.exp;
  const p = ctx.prec;
  let places = p - lnExpBound(self) + 2;
  let coeff;
  for (;;) {
    coeff = dlog(c, e, places);
    if (coeff % (5n * p10(babs(coeff).toString().length - p - 1))) break;
    places += 3;
  }
  return fixHalfEven(dft(coeff < 0n ? 1 : 0, babs(coeff).toString(), -places), ctx);
}
function log10Dec(self, ctx) {
  const ans0 = checkNans(self, null, ctx);
  if (ans0) return ans0;
  if (!truthy(self)) return NEG_INF;
  if (isinf(self) === 1) return INF;
  if (self.sign === 1) return ctx._raise('InvalidOperation');
  let ans;
  if (self.int[0] === '1' && /^0*$/.test(self.int.slice(1))) {
    ans = intToDec(BigInt(self.exp + self.int.length - 1));
  } else {
    const c = BigInt(self.int);
    const e = self.exp;
    const p = ctx.prec;
    let places = p - log10ExpBound(self) + 2;
    let coeff;
    for (;;) {
      coeff = dlog10(c, e, places);
      if (coeff % (5n * p10(babs(coeff).toString().length - p - 1))) break;
      places += 3;
    }
    ans = dft(coeff < 0n ? 1 : 0, babs(coeff).toString(), -places);
  }
  return fixHalfEven(ans, ctx);
}
function sqrtDec(self, ctx) {
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
    if (isinf(self) && self.sign === 0) return self;
  }
  if (!truthy(self)) return fix(dft(self.sign, '0', Math.floor(self.exp / 2)), ctx);
  if (self.sign === 1) return ctx._raise('InvalidOperation');
  const prec = ctx.prec + 1;
  let e = Math.floor(self.exp / 2);
  let c;
  let l;
  if (pmod(self.exp, 2) === 1) {
    c = BigInt(self.int) * 10n;
    l = (self.int.length >> 1) + 1;
  } else {
    c = BigInt(self.int);
    l = (self.int.length + 1) >> 1;
  }
  const shift = prec - l;
  let exact;
  if (shift >= 0) {
    c *= 100n ** BigInt(shift);
    exact = true;
  } else {
    const d = 100n ** BigInt(-shift);
    const rem = c % d;
    c /= d;
    exact = !rem;
  }
  e -= shift;
  let n = p10(prec);
  for (;;) {
    const q = c / n;
    if (n <= q) break;
    n = (n + q) >> 1n;
  }
  exact = exact && n * n === c;
  if (exact) {
    if (shift >= 0) n /= p10(shift);
    else n *= p10(-shift);
    e += shift;
  } else if (n % 5n === 0n) n += 1n;
  return fixHalfEven(dft(0, n.toString(), e), ctx);
}

// ── quantize, rounding to integers, normalize ─────────────────
function quantize(self, exp, rounding, ctx) {
  if (self.special || exp.special) {
    const ans = checkNans(self, exp, ctx);
    if (ans) return ans;
    if (isinf(exp) || isinf(self)) {
      if (isinf(exp) && isinf(self)) return self;
      return ctx._raise('InvalidOperation');
    }
  }
  if (!(ctx.Etiny() <= exp.exp && exp.exp <= ctx.Emax)) return ctx._raise('InvalidOperation');
  if (!truthy(self)) return fix(dft(self.sign, '0', exp.exp), ctx);
  const selfAdj = adjusted(self);
  if (selfAdj > ctx.Emax) return ctx._raise('InvalidOperation');
  if (selfAdj - exp.exp + 1 > ctx.prec) return ctx._raise('InvalidOperation');
  let ans = rescale(self, exp.exp, rounding);
  if (adjusted(ans) > ctx.Emax) return ctx._raise('InvalidOperation');
  if (ans.int.length > ctx.prec) return ctx._raise('InvalidOperation');
  if (truthy(ans) && adjusted(ans) < ctx.Emin) ctx._raise('Subnormal');
  if (ans.exp > self.exp) {
    if (cmp(ans, self) !== 0) ctx._raise('Inexact');
    ctx._raise('Rounded');
  }
  ans = fix(ans, ctx);
  return ans;
}
function sameQuantum(self, other) {
  if (self.special || other.special) {
    return (isnan(self) > 0 && isnan(other) > 0) || (isinf(self) !== 0 && isinf(other) !== 0);
  }
  return self.exp === other.exp;
}
function toIntegralExact(self, rounding, ctx) {
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
    return self;
  }
  if (self.exp >= 0) return self;
  if (!truthy(self)) return dft(self.sign, '0', 0);
  const r = rounding === null ? ctx.rounding : rounding;
  const ans = rescale(self, 0, r);
  if (cmp(ans, self) !== 0) ctx._raise('Inexact');
  ctx._raise('Rounded');
  return ans;
}
function toIntegralValue(self, rounding, ctx) {
  const r = rounding === null ? ctx.rounding : rounding;
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
    return self;
  }
  if (self.exp >= 0) return self;
  return rescale(self, 0, r);
}
function normalizeDec(self, ctx) {
  if (self.special) {
    const ans = checkNans(self, null, ctx);
    if (ans) return ans;
  }
  const dup = fix(self, ctx);
  if (isinf(dup)) return dup;
  if (!truthy(dup)) return dft(dup.sign, '0', 0);
  const expMax = ctx.clamp ? ctx.Etop() : ctx.Emax;
  let end = dup.int.length;
  let exp = dup.exp;
  while (dup.int[end - 1] === '0' && exp < expMax) {
    exp += 1;
    end -= 1;
  }
  return dft(dup.sign, dup.int.slice(0, end), exp);
}

// ── max / min / compare family ────────────────────────────────
function compareTotal(self, other) {
  if (self.sign && !other.sign) return NEG_ONE;
  if (!self.sign && other.sign) return ONE;
  const sign = self.sign;
  const sn = isnan(self);
  const on = isnan(other);
  if (sn || on) {
    if (sn === on) {
      const ka = self.int.length;
      const kb = other.int.length;
      const lt = ka < kb || (ka === kb && self.int < other.int);
      const gt = ka > kb || (ka === kb && self.int > other.int);
      if (lt) return sign ? ONE : NEG_ONE;
      if (gt) return sign ? NEG_ONE : ONE;
      return ZERO;
    }
    if (sign) {
      if (sn === 1) return NEG_ONE;
      if (on === 1) return ONE;
      if (sn === 2) return NEG_ONE;
      if (on === 2) return ONE;
    } else {
      if (sn === 1) return ONE;
      if (on === 1) return NEG_ONE;
      if (sn === 2) return ONE;
      if (on === 2) return NEG_ONE;
    }
  }
  const c = cmp(self, other);
  if (c < 0) return NEG_ONE;
  if (c > 0) return ONE;
  if (self.exp < other.exp) return sign ? ONE : NEG_ONE;
  if (self.exp > other.exp) return sign ? NEG_ONE : ONE;
  return ZERO;
}
const totalInt = (d) => (d === ONE ? 1 : d === NEG_ONE ? -1 : 0);
function compareDec(self, other, ctx) {
  if (self.special || other.special) {
    const ans = checkNans(self, other, ctx);
    if (ans) return ans;
  }
  return intToDec(BigInt(cmp(self, other)));
}
function compareSignal(self, other, ctx) {
  const ans = compareCheckNans(self, other, ctx);
  if (ans) return ans;
  return compareDec(self, other, ctx);
}
function maxMin(self, other, ctx, wantMax, mag) {
  if (self.special || other.special) {
    const sn = isnan(self);
    const on = isnan(other);
    if (sn || on) {
      if (on === 1 && sn === 0) return fix(self, ctx);
      if (sn === 1 && on === 0) return fix(other, ctx);
      return checkNans(self, other, ctx);
    }
  }
  let c = mag ? cmp(copyAbs(self), copyAbs(other)) : cmp(self, other);
  if (c === 0) c = totalInt(compareTotal(self, other));
  let ans;
  if (wantMax) ans = c === -1 ? other : self;
  else ans = c === -1 ? self : other;
  return fix(ans, ctx);
}

// ── logb / scaleb / logical / rotate / shift / next ──────────
function logbDec(self, ctx) {
  const ans = checkNans(self, null, ctx);
  if (ans) return ans;
  if (isinf(self)) return INF;
  if (!truthy(self)) return ctx._raise('DivisionByZero', 1);
  return fix(intToDec(BigInt(adjusted(self))), ctx);
}
function scalebDec(self, other, ctx) {
  const ans = checkNans(self, other, ctx);
  if (ans) return ans;
  if (other.exp !== 0) return ctx._raise('InvalidOperation');
  const lim = 2n * (BigInt(ctx.Emax) + BigInt(ctx.prec));
  const n = intOf(other);
  if (!(-lim <= n && n <= lim)) return ctx._raise('InvalidOperation');
  if (isinf(self)) return self;
  return fix(dft(self.sign, self.int, self.exp + Number(n)), ctx);
}
const isLogical = (d) => !d.special && d.sign === 0 && d.exp === 0 && /^[01]+$/.test(d.int);
function fillLogical(ctx, opa, opb) {
  let dif = ctx.prec - opa.length;
  if (dif > 0) opa = zeros(dif) + opa;
  else if (dif < 0) opa = opa.slice(-ctx.prec);
  dif = ctx.prec - opb.length;
  if (dif > 0) opb = zeros(dif) + opb;
  else if (dif < 0) opb = opb.slice(-ctx.prec);
  return [opa, opb];
}
function logical(self, other, ctx, fn) {
  if (!isLogical(self) || !isLogical(other)) return ctx._raise('InvalidOperation');
  const [a, b] = fillLogical(ctx, self.int, other.int);
  let r = '';
  for (let i = 0; i < a.length; i += 1) r += String(fn(Number(a[i]), Number(b[i])));
  return dft(0, r.replace(/^0+/, '') || '0', 0);
}
function rotateShift(self, other, ctx, isRotate) {
  const ans = checkNans(self, other, ctx);
  if (ans) return ans;
  if (other.exp !== 0) return ctx._raise('InvalidOperation');
  const n = intOf(other);
  if (!(BigInt(-ctx.prec) <= n && n <= BigInt(ctx.prec))) return ctx._raise('InvalidOperation');
  if (isinf(self)) return self;
  const torot = Number(n);
  let rotdig = self.int;
  const topad = ctx.prec - rotdig.length;
  if (topad > 0) rotdig = zeros(topad) + rotdig;
  else if (topad < 0) rotdig = rotdig.slice(-topad);
  let res;
  if (isRotate) res = rotdig.slice(torot) + rotdig.slice(0, torot);
  else if (torot < 0) res = rotdig.slice(0, torot);
  else res = (rotdig + zeros(torot)).slice(-ctx.prec);
  return dft(self.sign, res.replace(/^0+/, '') || '0', self.exp);
}
function nextMinus(self, ctx) {
  const ans = checkNans(self, null, ctx);
  if (ans) return ans;
  if (isinf(self) === -1) return NEG_INF;
  if (isinf(self) === 1) return dft(0, '9'.repeat(ctx.prec), ctx.Etop());
  const c = ctx.copy();
  c.rounding = ROUND_FLOOR;
  c._ignoreAll = true;
  const newSelf = fix(self, c);
  if (cmp(newSelf, self) !== 0) return newSelf;
  return sub(self, dft(0, '1', c.Etiny() - 1), c);
}
function nextPlus(self, ctx) {
  const ans = checkNans(self, null, ctx);
  if (ans) return ans;
  if (isinf(self) === 1) return INF;
  if (isinf(self) === -1) return dft(1, '9'.repeat(ctx.prec), ctx.Etop());
  const c = ctx.copy();
  c.rounding = ROUND_CEILING;
  c._ignoreAll = true;
  const newSelf = fix(self, c);
  if (cmp(newSelf, self) !== 0) return newSelf;
  return add(self, dft(0, '1', c.Etiny() - 1), c);
}
function nextToward(self, other, ctx) {
  const ans0 = checkNans(self, other, ctx);
  if (ans0) return ans0;
  const comparison = cmp(self, other);
  if (comparison === 0) return dft(other.sign, self.int, self.exp, self.special);
  const ans = comparison === -1 ? nextPlus(self, ctx) : nextMinus(self, ctx);
  if (isinf(ans)) {
    ctx._raise('Overflow', ans.sign);
    ctx._raise('Inexact');
    ctx._raise('Rounded');
  } else if (adjusted(ans) < ctx.Emin) {
    ctx._raise('Underflow');
    ctx._raise('Subnormal');
    ctx._raise('Inexact');
    ctx._raise('Rounded');
    if (!truthy(ans)) ctx._raise('Clamped');
  }
  return ans;
}
function numberClass(self, ctx) {
  if (self.exp === 'N') return 'sNaN';
  if (self.exp === 'n') return 'NaN';
  const inf = isinf(self);
  if (inf === 1) return '+Infinity';
  if (inf === -1) return '-Infinity';
  if (!self.special && self.int === '0') return self.sign ? '-Zero' : '+Zero';
  if (adjusted(self) < ctx.Emin) return self.sign ? '-Subnormal' : '+Subnormal';
  return self.sign ? '-Normal' : '+Normal';
}

// ── as_tuple / as_integer_ratio / int / float / round ─────────
export function asTuple(d) {
  const digits = d.int.split('').map((ch) => BigInt(ch));
  return { dtuple: { sign: d.sign, digits, exponent: d.special ? d.exp : d.exp } };
}
export function asIntegerRatio(d) {
  if (d.special) {
    if (isnan(d)) pyErr('ValueError', 'cannot convert NaN to integer ratio');
    pyErr('OverflowError', 'cannot convert Infinity to integer ratio');
  }
  if (!truthy(d)) return { tuple: [0n, 1n] };
  let n = BigInt(d.int);
  let den;
  if (d.exp >= 0) {
    n *= p10(d.exp);
    den = 1n;
  } else {
    let d5 = -d.exp;
    while (d5 > 0 && n % 5n === 0n) {
      n /= 5n;
      d5 -= 1;
    }
    let d2 = -d.exp;
    const tz = nbits(n & -n) - 1;
    const shift2 = Math.min(tz, d2);
    if (shift2) {
      n >>= BigInt(shift2);
      d2 -= shift2;
    }
    den = (5n ** BigInt(d5)) << BigInt(d2);
  }
  if (d.sign) n = -n;
  return { tuple: [n, den] };
}
// int(d) — truncates toward zero
export function toInt(d) {
  if (d.special) {
    if (isnan(d)) pyErr('ValueError', 'cannot convert NaN to integer');
    pyErr('OverflowError', 'cannot convert Infinity to integer');
  }
  return intOf(d);
}
// float(d)
export function toFloat(d) {
  if (isnan(d)) {
    if (d.exp === 'N') pyErr('ValueError', 'cannot convert signaling NaN to float');
    return F(NaN);
  }
  if (isinf(d)) return F(d.sign ? -Infinity : Infinity);
  return F(Number(decStr(d, false, 1)));
}
// round(d) / math.floor / math.ceil → int
function roundToInt(d, rounding) {
  if (d.special) {
    if (isnan(d)) pyErr('ValueError', 'cannot convert NaN to integer');
    pyErr('OverflowError', 'cannot convert Infinity to integer');
  }
  return intOf(rescale(d, 0, rounding));
}
export function round(d, n = null) {
  if (n === null) return roundToInt(d, ROUND_HALF_EVEN);
  if (!isIntV(n)) pyErr('TypeError', 'optional arg must be an integer');
  const nn = asBig(n);
  if (nn > BigInt(EXP_LIMIT) || nn < BigInt(-EXP_LIMIT)) demoLimit('this many places is outside what the in-browser demo computes');
  return methodQuantize(d, dft(0, '1', -Number(nn)));
}
export const floor = (d) => roundToInt(d, ROUND_FLOOR);
export const ceil = (d) => roundToInt(d, ROUND_CEILING);

// ── Python-facing operators (current context) ─────────────────
const OP_SYMBOL = { add: '+', sub: '-', mul: '*', truediv: '/', floordiv: '//', mod: '%', divmod: 'divmod()', pow: '** or pow()' };
// binary operator a <op> b where at least one side is a Decimal
function operand(v) {
  if (v instanceof Dec) return v;
  if (isIntV(v)) return intToDec(asBig(v));
  return null;
}
function binop(name, a, b, fn) {
  const x = operand(a);
  const y = operand(b);
  if (x === null || y === null || (!(a instanceof Dec) && !(b instanceof Dec))) {
    pyErr('TypeError', `unsupported operand type(s) for ${OP_SYMBOL[name]}: '${typeName(a)}' and '${typeName(b)}'`);
  }
  const ctx = CUR;
  return op(ctx, () => fn(x, y, ctx));
}
export const opAdd = (a, b) => binop('add', a, b, add);
export const opSub = (a, b) => binop('sub', a, b, sub);
export const opMul = (a, b) => binop('mul', a, b, mul);
export const opTruediv = (a, b) => binop('truediv', a, b, truediv);
export const opFloordiv = (a, b) => binop('floordiv', a, b, floordivDec);
export const opMod = (a, b) => binop('mod', a, b, modDec);
export const opDivmod = (a, b) => ({ tuple: binop('divmod', a, b, divmodDec) });
export function opPow(a, b, m = null) {
  if (m === null) return binop('pow', a, b, powDec);
  const x = operand(a);
  const y = operand(b);
  const z = operand(m);
  if (x === null || y === null || z === null) {
    pyErr('TypeError', `unsupported operand type(s) for ** or pow(): '${typeName(a)}', '${typeName(b)}', '${typeName(m)}'`);
  }
  const ctx = CUR;
  return op(ctx, () => powerModulo(x, y, z, ctx));
}
export const opNeg = (a) => op(CUR, () => negDec(a, CUR));
export const opPos = (a) => op(CUR, () => posDec(a, CUR));
export const opAbs = (a) => op(CUR, () => absDec(a, CUR));
export const opBool = (a) => truthy(a);

// rich comparison a <op> b, a a Decimal (b: Decimal, int, float,
// { frac: [n, d] } for a Fraction)
const CMP_SYM = { lt: '<', le: '<=', gt: '>', ge: '>=', eq: '==', ne: '!=' };
export function compare(opName, a, b) {
  let x = a;
  let y;
  const ctx = CUR;
  const isEq = opName === 'eq' || opName === 'ne';
  begin(ctx);
  if (b instanceof Dec) y = b;
  else if (isIntV(b)) y = intToDec(asBig(b));
  else if (b && b.frac) {
    const [n, d] = b.frac;
    if (!x.special) x = dft(x.sign, (BigInt(x.int) * d).toString(), x.exp);
    y = intToDec(n);
  } else if (isFloatV(b)) {
    ctx._raise('FloatOperation');
    if (isEq) {
      // equality comparisons only set the flag
      ctx._pend.bits.delete('FloatOperation');
    } else commit(ctx);
    y = floatToDec(b.float);
  } else {
    if (isEq) return opName === 'ne';
    return pyErr('TypeError', `'${CMP_SYM[opName]}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
  }
  const sNan = x.exp === 'N' || y.exp === 'N';
  if (isnan(x) || isnan(y)) {
    if (sNan || !isEq) {
      ctx._raise('InvalidOperation');
      commit(ctx);
    }
    return opName === 'ne';
  }
  const c = cmp(x, y);
  switch (opName) {
    case 'lt': return c < 0;
    case 'le': return c <= 0;
    case 'gt': return c > 0;
    case 'ge': return c >= 0;
    case 'eq': return c === 0;
    default: return c !== 0;
  }
}

// ── Decimal methods (Python signatures) ──────────────────────
function roundingArg(r) {
  return r === null || r === undefined ? null : checkRounding(r);
}
export function methodQuantize(a, exp, rounding = null, context = null) {
  const ctx = ctxOf(context);
  const r = roundingArg(rounding);
  const e = conv(exp);
  return op(ctx, () => quantize(a, e, r === null ? ctx.rounding : r, ctx));
}
// unary methods taking an optional context
const UNARY = {
  exp: expDec,
  ln: lnDec,
  log10: log10Dec,
  sqrt: sqrtDec,
  logb: logbDec,
  normalize: normalizeDec,
  next_minus: nextMinus,
  next_plus: nextPlus,
  logical_invert: (a, ctx) => logical(a, dft(0, '1'.repeat(ctx.prec), 0), ctx, (x, y) => x ^ y),
};
// binary methods taking other and an optional context
const BINARY = {
  compare: compareDec,
  compare_signal: compareSignal,
  max: (a, b, ctx) => maxMin(a, b, ctx, true, false),
  min: (a, b, ctx) => maxMin(a, b, ctx, false, false),
  max_mag: (a, b, ctx) => maxMin(a, b, ctx, true, true),
  min_mag: (a, b, ctx) => maxMin(a, b, ctx, false, true),
  next_toward: nextToward,
  logical_and: (a, b, ctx) => logical(a, b, ctx, (x, y) => x & y),
  logical_or: (a, b, ctx) => logical(a, b, ctx, (x, y) => x | y),
  logical_xor: (a, b, ctx) => logical(a, b, ctx, (x, y) => x ^ y),
  rotate: (a, b, ctx) => rotateShift(a, b, ctx, true),
  shift: (a, b, ctx) => rotateShift(a, b, ctx, false),
  scaleb: scalebDec,
  remainder_near: remainderNear,
};
// d.name(*args, context=None) for the context-using methods
export function method(name, a, ...args) {
  if (name in UNARY) {
    const ctx = ctxOf(args[0]);
    return op(ctx, () => UNARY[name](a, ctx));
  }
  if (name in BINARY) {
    const ctx = ctxOf(args[1]);
    const b = conv(args[0]);
    return op(ctx, () => BINARY[name](a, b, ctx));
  }
  switch (name) {
    case 'fma': {
      const ctx = ctxOf(args[2]);
      const b = conv(args[0]);
      const c = conv(args[1]);
      return op(ctx, () => fma(a, b, c, ctx));
    }
    case 'quantize': return methodQuantize(a, args[0], args[1], args[2]);
    case 'to_integral':
    case 'to_integral_value': {
      const r = roundingArg(args[0]);
      const ctx = ctxOf(args[1]);
      return op(ctx, () => toIntegralValue(a, r, ctx));
    }
    case 'to_integral_exact': {
      const r = roundingArg(args[0]);
      const ctx = ctxOf(args[1]);
      return op(ctx, () => toIntegralExact(a, r, ctx));
    }
    case 'compare_total': ctxOf(args[1]); return compareTotal(a, conv(args[0]));
    case 'compare_total_mag': ctxOf(args[1]); return compareTotal(copyAbs(a), copyAbs(conv(args[0])));
    case 'copy_sign': ctxOf(args[1]); { const b = conv(args[0]); return dft(b.sign, a.int, a.exp, a.special); }
    case 'same_quantum': ctxOf(args[1]); return sameQuantum(a, conv(args[0]));
    case 'copy_abs': return copyAbs(a);
    case 'copy_negate': return copyNegate(a);
    case 'adjusted': return BigInt(adjusted(a));
    case 'canonical': return a;
    case 'conjugate': return a;
    case 'radix': return intToDec(10n);
    case 'is_canonical': return true;
    case 'is_finite': return !a.special;
    case 'is_infinite': return a.exp === 'F';
    case 'is_nan': return a.exp === 'n' || a.exp === 'N';
    case 'is_qnan': return a.exp === 'n';
    case 'is_snan': return a.exp === 'N';
    case 'is_signed': return a.sign === 1;
    case 'is_zero': return !a.special && a.int === '0';
    case 'is_normal': {
      const ctx = ctxOf(args[0]);
      if (a.special || !truthy(a)) return false;
      return ctx.Emin <= adjusted(a);
    }
    case 'is_subnormal': {
      const ctx = ctxOf(args[0]);
      if (a.special || !truthy(a)) return false;
      return adjusted(a) < ctx.Emin;
    }
    case 'number_class': return numberClass(a, ctxOf(args[0]));
    case 'to_eng_string': return decStr(a, true, ctxOf(args[0]).capitals);
    case 'as_tuple': return asTuple(a);
    case 'as_integer_ratio': return asIntegerRatio(a);
    default: throw new Error(`no such Decimal method: ${name}`);
  }
}
// d.real / d.imag
export const real = (a) => a;
export const imag = () => ZERO;

// ── Context methods ───────────────────────────────────────────
const CTX_BINARY = {
  add, subtract: sub, multiply: mul, divide: truediv, divide_int: floordivDec, remainder: modDec,
  remainder_near: remainderNear, compare: compareDec, compare_signal: compareSignal,
  max: BINARY.max, min: BINARY.min, max_mag: BINARY.max_mag, min_mag: BINARY.min_mag,
  next_toward: nextToward, logical_and: BINARY.logical_and, logical_or: BINARY.logical_or,
  logical_xor: BINARY.logical_xor, rotate: BINARY.rotate, shift: BINARY.shift, scaleb: scalebDec,
};
const CTX_UNARY = {
  abs: absDec, minus: negDec, plus: posDec, exp: expDec, ln: lnDec, log10: log10Dec, sqrt: sqrtDec,
  logb: logbDec, normalize: normalizeDec, next_minus: nextMinus, next_plus: nextPlus,
  logical_invert: UNARY.logical_invert, to_integral: (a, ctx) => toIntegralValue(a, null, ctx),
  to_integral_value: (a, ctx) => toIntegralValue(a, null, ctx), to_integral_exact: (a, ctx) => toIntegralExact(a, null, ctx),
};
export function ctxMethod(ctx, name, ...args) {
  if (name in CTX_UNARY) {
    const a = conv(args[0]);
    return op(ctx, () => CTX_UNARY[name](a, ctx));
  }
  if (name in CTX_BINARY) {
    const a = conv(args[0]);
    const b = conv(args[1]);
    return op(ctx, () => CTX_BINARY[name](a, b, ctx));
  }
  switch (name) {
    case 'divmod': {
      const a = conv(args[0]);
      const b = conv(args[1]);
      return { tuple: op(ctx, () => divmodDec(a, b, ctx)) };
    }
    case 'power': {
      const a = conv(args[0]);
      const b = conv(args[1]);
      if (args[2] === undefined || args[2] === null) return op(ctx, () => powDec(a, b, ctx));
      const m = conv(args[2]);
      return op(ctx, () => powerModulo(a, b, m, ctx));
    }
    case 'fma': {
      const a = conv(args[0]);
      const b = conv(args[1]);
      const c = conv(args[2]);
      return op(ctx, () => fma(a, b, c, ctx));
    }
    case 'quantize': {
      const a = conv(args[0]);
      const b = conv(args[1]);
      return op(ctx, () => quantize(a, b, ctx.rounding, ctx));
    }
    case 'same_quantum': return sameQuantum(conv(args[0]), conv(args[1]));
    case 'compare_total': return compareTotal(conv(args[0]), conv(args[1]));
    case 'compare_total_mag': return compareTotal(copyAbs(conv(args[0])), copyAbs(conv(args[1])));
    case 'copy_abs': return copyAbs(conv(args[0]));
    case 'copy_negate': return copyNegate(conv(args[0]));
    case 'copy_decimal': return conv(args[0]);
    case 'copy_sign': {
      const a = conv(args[0]);
      const b = conv(args[1]);
      return dft(b.sign, a.int, a.exp, a.special);
    }
    case 'canonical':
    case 'is_canonical': {
      if (!(args[0] instanceof Dec)) pyErr('TypeError', 'argument must be a Decimal');
      return name === 'canonical' ? args[0] : true;
    }
    case 'is_finite': case 'is_infinite': case 'is_nan': case 'is_qnan': case 'is_snan': case 'is_signed': case 'is_zero':
      return method(name, conv(args[0]));
    case 'is_normal': case 'is_subnormal': case 'number_class':
      return method(name, conv(args[0]), ctx);
    case 'to_sci_string': return decStr(conv(args[0]), false, ctx.capitals);
    case 'to_eng_string': return decStr(conv(args[0]), true, ctx.capitals);
    case 'radix': return intToDec(10n);
    case 'Etiny': return BigInt(ctx.Etiny());
    case 'Etop': return BigInt(ctx.Etop());
    case 'create_decimal': return createDecimal(ctx, args.length ? args[0] : '0');
    case 'create_decimal_from_float': return createDecimalFromFloat(ctx, args[0]);
    case 'copy': return ctx.copy();
    case 'clear_flags': ctx.flags.clear(); return null;
    case 'clear_traps': ctx.traps.clear(); return null;
    default: throw new Error(`no such Context method: ${name}`);
  }
}

// ── format(d, spec) ───────────────────────────────────────────
// _decimal's dec_format: the spec is parsed by libmpdec's mpd_parse_fmt_str
// ([[fill]align][sign][z][0][width][,][.precision][type], ASCII digits).
// A spec libmpdec rejects (it knows no '#' and no non-ASCII digits) goes to
// _pydecimal's Decimal.__format__ instead, whose regex is stricter
// elsewhere (no leading zeros in the precision, no 'N').
// Rejected by both → ValueError: invalid format string.
const ALIGNS = '<>=^';
const isAsciiDigit = (ch) => ch !== undefined && ch >= '0' && ch <= '9';
const PY_FMT_RE = /^(?:([\s\S])?([<>=^]))?([-+ ])?(z)?(#)?(0)?((?!0)\p{Nd}+)?(,)?(?:\.(0|(?!0)\p{Nd}+))?([eEfFgGn%])?$/u;
// int() of a run of Unicode decimal digits
const ndInt = (s) => Number([...s].map((ch) => digitValue(ch.codePointAt(0))).join(''));

function mpdParseSpec(cps) {
  let i = 0;
  let fill = ' ';
  let align = '>';
  let haveAlign = false;
  if (cps.length >= 2 && ALIGNS.includes(cps[1])) {
    fill = cps[0];
    align = cps[1];
    i = 2;
    haveAlign = true;
  } else if (cps.length >= 1 && ALIGNS.includes(cps[0])) {
    align = cps[0];
    i = 1;
    haveAlign = true;
  }
  let sign = '-';
  if (cps[i] === '+' || cps[i] === '-' || cps[i] === ' ') sign = cps[i++];
  let noNeg0 = false;
  if (cps[i] === 'z') {
    noNeg0 = true;
    i += 1;
  }
  let zeropad = false;
  if (cps[i] === '0') {
    if (haveAlign) return null;
    zeropad = true;
    i += 1;
  }
  const digits = () => {
    let s = '';
    while (isAsciiDigit(cps[i])) s += cps[i++];
    return s;
  };
  let minimumwidth = 0;
  if (isAsciiDigit(cps[i])) {
    if (cps[i] === '0') return null;
    minimumwidth = Number(digits());
  }
  let thousandsSep = '';
  if (cps[i] === ',') {
    thousandsSep = ',';
    i += 1;
  }
  let precision = null;
  if (cps[i] === '.') {
    i += 1;
    if (!isAsciiDigit(cps[i])) return null;
    precision = Number(digits());
  }
  let type = null;
  if (cps[i] !== undefined && 'eEfFgG%'.includes(cps[i])) type = cps[i++];
  else if (cps[i] === 'n' || cps[i] === 'N') {
    // locale-dependent; in the C locale no separators, like 'g' / 'G'
    if (thousandsSep) return null;
    type = cps[i] === 'N' ? 'G' : 'g';
    i += 1;
  }
  if (i !== cps.length) return null;
  return { fill, align, sign, noNeg0, alt: false, zeropad, minimumwidth, thousandsSep, precision, type };
}

function pyParseSpec(specifier) {
  const m = PY_FMT_RE.exec(specifier);
  if (!m) return null;
  const spec = {
    fill: m[1] !== undefined ? m[1] : ' ',
    align: m[2] !== undefined ? m[2] : '>',
    sign: m[3] !== undefined ? m[3] : '-',
    noNeg0: m[4] !== undefined,
    alt: m[5] !== undefined,
    zeropad: m[6] !== undefined,
    minimumwidth: m[7] !== undefined ? ndInt(m[7]) : 0,
    thousandsSep: m[8] !== undefined ? ',' : '',
    precision: m[9] !== undefined ? ndInt(m[9]) : null,
    type: m[10] !== undefined ? m[10] : null,
  };
  if (spec.zeropad && (m[1] !== undefined || m[2] !== undefined)) return null;
  if (spec.type === 'n') {
    if (spec.thousandsSep) return null;
    spec.type = 'g';
  }
  return spec;
}

export function format(d, specifier) {
  if (typeof specifier !== 'string') pyErr('TypeError', `format() argument 2 must be str, not ${typeName(specifier)}`);
  const spec = mpdParseSpec([...specifier]) || pyParseSpec(specifier);
  if (!spec) pyErr('ValueError', 'invalid format string');
  if (spec.minimumwidth > DIGIT_LIMIT || (spec.precision !== null && spec.precision > DIGIT_LIMIT)) demoLimit('widths and precisions this large are too large for the in-browser demo');
  if (spec.precision === 0 && (spec.type === null || 'gG'.includes(spec.type))) spec.precision = 1;
  const ctx = CUR;
  if (d.special) {
    const sign = formatSign(d.sign, spec);
    let body = decStr(copyAbs(d));
    if (spec.type === '%') body += '%';
    return formatAlign(sign, body, spec);
  }
  if (spec.type === null) spec.type = ctx.capitals ? 'G' : 'g';
  let self = d;
  if (spec.type === '%') self = dft(self.sign, self.int, self.exp + 2);
  const rounding = ctx.rounding;
  const precision = spec.precision;
  if (precision !== null) {
    if ('eE'.includes(spec.type)) self = roundPlaces(self, precision + 1, rounding);
    else if ('fF%'.includes(spec.type)) self = rescale(self, -precision, rounding);
    else if ('gG'.includes(spec.type) && self.int.length > precision) self = roundPlaces(self, precision, rounding);
  }
  if (!truthy(self) && self.exp > 0 && 'fF%'.includes(spec.type)) self = rescale(self, 0, rounding);
  const adjustedSign = (!truthy(self) && spec.noNeg0 && self.sign) ? 0 : self.sign;
  const leftdigits = self.exp + self.int.length;
  let dotplace;
  if ('eE'.includes(spec.type)) {
    dotplace = (!truthy(self) && precision !== null) ? 1 - precision : 1;
  } else if ('fF%'.includes(spec.type)) {
    dotplace = leftdigits;
  } else {
    dotplace = (self.exp <= 0 && leftdigits > -6) ? leftdigits : 1;
  }
  let intpart;
  let fracpart;
  if (dotplace < 0) {
    intpart = '0';
    fracpart = zeros(-dotplace) + self.int;
  } else if (dotplace > self.int.length) {
    intpart = self.int + zeros(dotplace - self.int.length);
    fracpart = '';
  } else {
    intpart = self.int.slice(0, dotplace) || '0';
    fracpart = self.int.slice(dotplace);
  }
  const exp = leftdigits - dotplace;
  return formatNumber(adjustedSign, intpart, fracpart, exp, spec);
}
function formatSign(neg, spec) {
  if (neg) return '-';
  if (spec.sign === ' ' || spec.sign === '+') return spec.sign;
  return '';
}
function formatAlign(sign, body, spec) {
  const padLen = spec.minimumwidth - [...sign].length - [...body].length;
  const padding = padLen > 0 ? spec.fill.repeat(padLen) : '';
  switch (spec.align) {
    case '<': return sign + body + padding;
    case '>': return padding + sign + body;
    case '=': return sign + padding + body;
    default: {
      const pad = [...padding];
      const half = Math.floor(pad.length / 2);
      return pad.slice(0, half).join('') + sign + body + pad.slice(half).join('');
    }
  }
}
function insertThousandsSep(digits, spec, minWidth = 1) {
  const sep = spec.thousandsSep;
  const groups = [];
  let mw = minWidth;
  let ds = digits;
  for (;;) {
    let l = 3;
    l = Math.min(Math.max(ds.length, mw, 1), l);
    groups.push(zeros(l - ds.length) + ds.slice(Math.max(0, ds.length - l)));
    ds = ds.slice(0, Math.max(0, ds.length - l));
    mw -= l;
    if (!ds && mw <= 0) break;
    mw -= sep.length;
  }
  return groups.reverse().join(sep);
}
function formatNumber(isNeg, intpart, fracpart, exp, spec) {
  const sign = formatSign(isNeg, spec);
  let frac = fracpart;
  if (frac || spec.alt) frac = '.' + frac;
  if (exp !== 0 || 'eE'.includes(spec.type)) {
    const echar = { E: 'E', e: 'e', G: 'E', g: 'e' }[spec.type];
    frac += echar + (exp >= 0 ? '+' : '-') + Math.abs(exp);
  }
  if (spec.type === '%') frac += '%';
  const minWidth = spec.zeropad ? spec.minimumwidth - frac.length - sign.length : 0;
  const ip = insertThousandsSep(intpart, spec, minWidth);
  return formatAlign(sign, ip + frac, spec);
}

// ── Python reprs of everything the demos return ──────────────
export function repr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return intRepr(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : pyFloatRepr(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof Dec) return decRepr(v);
  if (v instanceof Context) return contextRepr(v);
  if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
  if (isFloatV(v)) return pyFloatRepr(v.float);
  if (v.tuple) {
    const items = v.tuple.map(repr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v.dtuple) {
    const t = v.dtuple;
    const digits = '(' + t.digits.map((x) => String(x)).join(', ') + (t.digits.length === 1 ? ',' : '') + ')';
    const exponent = typeof t.exponent === 'string' ? `'${t.exponent}'` : String(t.exponent);
    return `DecimalTuple(sign=${t.sign}, digits=${digits}, exponent=${exponent})`;
  }
  if (v.cls) return `<class '${v.cls}'>`;
  if (v.sigdict) return signalDictRepr(v.sigdict);
  if (v.dict) return '{' + v.dict.map(([k, x]) => `${repr(k)}: ${repr(x)}`).join(', ') + '}';
  if (v.raw !== undefined) return v.raw;
  throw new Error('repr: unknown value');
}
// what an emulator returns: the repr, raw
export const out = (v) => ({ __pyRaw: repr(v) });
// str(v)
export function str(v) {
  if (v instanceof Dec) return decStr(v);
  if (typeof v === 'string') return v;
  return repr(v);
}
// a fresh interpreter's decimal state, then fn(); the result's repr
export function run(fn) {
  fresh();
  return out(fn());
}
// with localcontext(**kw) as ctx: return fn(ctx)
export const local = (kw, fn) => withContext(localcontext(kw), fn);
// [s.__name__ for s, on in ctx.flags.items() if on]
export const flagNames = (ctx) => setSignals(ctx.flags);
// a float demo parameter as the Python literal the snippet shows: inf and
// nan are not literals (pyFloatRepr prints them as bare names)
export function floatLit(x) {
  if (Number.isNaN(x)) pyErr('NameError', "name 'nan' is not defined");
  if (!Number.isFinite(x)) pyErr('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
  return F(x);
}
// str(x) of a Python float
export const floatStr = (x) => pyFloatRepr(x);
// a tuple
export const T = (...items) => ({ tuple: items });
