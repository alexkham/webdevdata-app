// utils/emulators/python/stdlib/logging/_pyfmt.js
//
// The string formatting a logging record goes through, ported from CPython
// 3.13 C code so the emulators print exactly what CPython prints:
//
//   percentFormat(fmt, args)   str % args          Objects/unicodeobject.c
//                                                  (PyUnicode_Format, every
//                                                  error message and quirk)
//   doubleToString(x, code, precision, flags)
//                              PyOS_double_to_string / format_float_short
//                              (Python/pystrtod.c) on exact BigInt decimals,
//                              round-half-even like dtoa
//   formatValue(v, spec)       format(v, spec) for str / int / bool / float /
//                              None / containers (Python/formatter_unicode.c)
//   strFormat(fmt, kwargs)     fmt.format(**kwargs)  (Objects/stringlib/
//                              unicode_format.h) — what '{'-style uses
//
// Value model (shared with _pylogging.js):
//   str → JS string (indexed by code point where Python counts)
//   int → BigInt, bool → JS boolean, None → null
//   float → PyFloat { v }, tuple → PyTuple { items }, list → JS Array,
//   dict → PyDict (insertion-ordered Map)
//   anything else → an object with pyTypeName / pyRepr() / pyStr()
//
// Machine-dependent values (timestamps, pids, file paths) are MachineValue
// objects: touching one in output raises DemoLimit — the browser cannot
// know what CPython would print there.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { formatStr, formatterParser, fieldNameSplit, asciiRepr, suggest } from '../string/_pystring.js';

export const raise = (type, msg = '') => { throw new PyException(type, msg); };

// Output longer than this stops the browser demo (CPython would build it).
export const DEMO_MAX_CHARS = 100000;
const demoLimitChars = () => raise('DemoLimit', 'the browser demo stops at 100,000 characters (CPython would build the whole string)');

// ── value model ──────────────────────────────────────────────
export class PyFloat { constructor(v) { this.v = v; } }
export const pyFloat = (v) => new PyFloat(v);
export class PyTuple { constructor(items) { this.items = items; } }
export const tuple = (...items) => new PyTuple(items);
export class PyDict {
  constructor(entries = []) { this.map = new Map(entries); }
  has(k) { return this.map.has(k); }
  get(k) { return this.map.get(k); }
  set(k, v) { this.map.set(k, v); return this; }
  get size() { return this.map.size; }
}

// A value that depends on the machine / clock / file the code runs in.
// `message` replaces the default explanation (e.g. for values that differ
// between Windows and Linux rather than from run to run).
export class MachineValue {
  constructor(what, message = null) { this.what = what; this.message = message; }
}
export function demoLimitFor(what, message = null) {
  return raise('DemoLimit', message || `${what} depends on the machine and the moment the code runs, so the browser demo cannot show it — run the snippet in CPython to see the real value`);
}
const touch = (v) => (v instanceof MachineValue ? demoLimitFor(v.what, v.message) : v);

export function typeName(v) {
  if (typeof v === 'string') return 'str';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'boolean') return 'bool';
  if (v === null || v === undefined) return 'NoneType';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof PyTuple) return 'tuple';
  if (Array.isArray(v)) return 'list';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof MachineValue) return demoLimitFor(v.what, v.message);
  if (v && v.pyTypeName) return v.pyTypeName;
  return 'object';
}

export function pyRepr(v) {
  if (typeof v === 'string') return pyStrRepr(v);
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (v === null || v === undefined) return 'None';
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (v instanceof PyTuple) {
    const items = v.items.map(pyRepr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
  if (v instanceof PyDict) return '{' + [...v.map.entries()].map(([k, x]) => `${pyRepr(k)}: ${pyRepr(x)}`).join(', ') + '}';
  if (v instanceof MachineValue) return demoLimitFor(v.what, v.message);
  if (v && typeof v.pyRepr === 'function') return v.pyRepr();
  return String(v);
}

export function pyStr(v) {
  if (typeof v === 'string') return v;
  if (v instanceof MachineValue) return demoLimitFor(v.what, v.message);
  if (v && typeof v.pyStr === 'function') return v.pyStr();
  return pyRepr(v);
}

// ascii(): repr with every non-ASCII character escaped
export function pyAscii(v) {
  const r = pyRepr(v);
  let out = '';
  for (const ch of r) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) out += ch;
    else if (cp <= 0xff) out += '\\x' + cp.toString(16).padStart(2, '0');
    else if (cp <= 0xffff) out += '\\u' + cp.toString(16).padStart(4, '0');
    else out += '\\U' + cp.toString(16).padStart(8, '0');
  }
  return out;
}
void asciiRepr;

export function truthy(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'bigint') return v !== 0n;
  if (typeof v === 'string') return v.length > 0;
  if (v instanceof PyFloat) return v.v !== 0;
  if (v instanceof PyTuple) return v.items.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof PyDict) return v.size > 0;
  if (v instanceof MachineValue) return true;
  if (v && typeof v.pyBool === 'function') return v.pyBool();
  return true;
}

const cpsOf = (s) => Array.from(s, (c) => c.codePointAt(0));
const fromCps = (a) => String.fromCodePoint(...a);
export const pyLen = (s) => { let n = 0; for (const c of s) { void c; n++; } return n; };
function cpSlice(s, a, b) {
  const arr = Array.from(s);
  return arr.slice(a, b).join('');
}

// str.splitlines() — every line boundary Python knows
const LINE_BREAKS = new Set([0x0a, 0x0b, 0x0c, 0x0d, 0x1c, 0x1d, 0x1e, 0x85, 0x2028, 0x2029]);
export function splitlines(s, keepends = false) {
  const cps = cpsOf(s);
  const out = [];
  let start = 0;
  let i = 0;
  while (i < cps.length) {
    if (LINE_BREAKS.has(cps[i])) {
      let eol = i + 1;
      if (cps[i] === 0x0d && cps[i + 1] === 0x0a) eol = i + 2;
      out.push(fromCps(cps.slice(start, keepends ? eol : i)));
      start = eol;
      i = eol;
    } else i++;
  }
  if (start < cps.length) out.push(fromCps(cps.slice(start)));
  return out;
}

// ── int / float conversions ──────────────────────────────────
// int(x) for a float: truncation, exact
export function floatToInt(x) {
  if (Number.isNaN(x)) raise('ValueError', 'cannot convert float NaN to integer');
  if (!Number.isFinite(x)) raise('OverflowError', 'cannot convert float infinity to integer');
  const t = Math.trunc(x);
  if (Number.isSafeInteger(t)) return BigInt(t);
  const { neg, N, k } = exactDecimal(t);
  const v = N / 10n ** BigInt(k);
  return neg ? -v : v;
}
// float(n) for an int: correctly rounded (Number(BigInt) rounds half-even)
const FLOAT_MAX_INT = (2n ** 1024n) - (2n ** 970n); // ints >= this round to inf
export function intToFloat(n) {
  const a = n < 0n ? -n : n;
  if (a >= FLOAT_MAX_INT) raise('OverflowError', 'int too large to convert to float');
  return Number(n);
}

// ── exact decimal expansion of a double ──────────────────────
// value = (neg ? -1 : 1) * N / 10**k, N >= 0
export function exactDecimal(x) {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, x);
  const hi = dv.getUint32(0);
  const lo = dv.getUint32(4);
  const neg = hi >>> 31 === 1;
  const expBits = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e;
  if (expBits === 0) e = -1074;
  else { mant |= 1n << 52n; e = expBits - 1075; }
  if (mant === 0n) return { neg, N: 0n, k: 0 };
  if (e >= 0) return { neg, N: mant << BigInt(e), k: 0 };
  return { neg, N: mant * 5n ** BigInt(-e), k: -e };
}

// round-half-even of N / 10**d (d > 0)
function divRound(N, d) {
  const p = 10n ** BigInt(d);
  let q = N / p;
  const r = N % p;
  const twice = r * 2n;
  if (twice > p || (twice === p && (q & 1n) === 1n)) q += 1n;
  return q;
}
const stripZeros = (s) => s.replace(/0+$/, '');

// _Py_dg_dtoa for the three modes PyOS_double_to_string uses.
// Returns { sign, digits, decpt } with value = 0.digits * 10**decpt.
function dtoa(x, mode, ndigits) {
  const { neg, N, k } = exactDecimal(x);
  const sign = neg ? 1 : 0;
  if (N === 0n) return { sign, digits: '0', decpt: 1 };
  if (mode === 0) {
    const [mant, ex] = Math.abs(x).toExponential().split('e');
    return { sign, digits: mant.replace('.', ''), decpt: Number(ex) + 1 };
  }
  const D = N.toString();
  const L = D.length;
  if (mode === 2) {
    const nd = Math.max(1, ndigits);
    let decpt = L - k;
    if (L <= nd) return { sign, digits: stripZeros(D), decpt };
    let q = divRound(N, L - nd);
    if (q === 10n ** BigInt(nd)) { q = 10n ** BigInt(nd - 1); decpt += 1; }
    return { sign, digits: stripZeros(q.toString()), decpt };
  }
  // mode 3: ndigits past the decimal point
  const q = k > ndigits ? divRound(N, k - ndigits) : N * 10n ** BigInt(ndigits - k);
  if (q === 0n) return { sign, digits: '', decpt: -ndigits };
  const qs = q.toString();
  return { sign, digits: stripZeros(qs), decpt: qs.length - ndigits };
}

export const DTSF_SIGN = 1;
export const DTSF_ADD_DOT_0 = 2;
export const DTSF_ALT = 4;
export const DTSF_NO_NEG_0 = 8;

// PyOS_double_to_string(val, format_code, precision, flags)
export function doubleToString(x, formatCode, precision, flags = 0) {
  let code = formatCode;
  let upper = false;
  let mode;
  let prec = precision;
  switch (code) {
    case 'E': upper = true; code = 'e'; // fall through
    case 'e': mode = 2; prec += 1; break;
    case 'F': upper = true; code = 'f'; // fall through
    case 'f': mode = 3; break;
    case 'G': upper = true; code = 'g'; // fall through
    case 'g': mode = 2; if (prec === 0) prec = 1; break;
    case 'r': mode = 0; prec = 0; break;
    default: throw new Error(`bad format code ${formatCode}`);
  }
  // output size guard (CPython would build it)
  if (mode === 3 && prec > DEMO_MAX_CHARS) demoLimitChars();
  if (mode === 2 && prec > DEMO_MAX_CHARS) demoLimitChars();
  return formatFloatShort(x, code, mode, prec, (flags & DTSF_SIGN) !== 0, (flags & DTSF_ADD_DOT_0) !== 0,
    (flags & DTSF_ALT) !== 0, (flags & DTSF_NO_NEG_0) !== 0, upper);
}

function formatFloatShort(d, code, mode, precision, alwaysAddSign, addDot0, alt, noNeg0, upper) {
  if (!Number.isFinite(d)) {
    let s = '';
    if (Number.isNaN(d)) {
      if (alwaysAddSign) s += '+';
      s += upper ? 'NAN' : 'nan';
    } else {
      if (d < 0) s += '-';
      else if (alwaysAddSign) s += '+';
      s += upper ? 'INF' : 'inf';
    }
    return s;
  }
  let { sign, digits, decpt } = dtoa(d, mode, precision);
  const digitsLen = digits.length;
  if (noNeg0 && sign === 1 && (digitsLen === 0 || (digitsLen === 1 && digits[0] === '0'))) sign = 0;
  let vdigitsEnd = digitsLen;
  let useExp = false;
  let exp = 0;
  switch (code) {
    case 'e': useExp = true; vdigitsEnd = precision; break;
    case 'f': vdigitsEnd = decpt + precision; break;
    case 'g':
      if (decpt <= -4 || decpt > (addDot0 ? precision - 1 : precision)) useExp = true;
      if (alt) vdigitsEnd = precision;
      break;
    case 'r':
      if (decpt <= -4 || decpt > 16) useExp = true;
      break;
    default: break;
  }
  if (useExp) { exp = decpt - 1; decpt = 1; }
  const vdigitsStart = decpt <= 0 ? decpt - 1 : 0;
  if (!useExp && addDot0) vdigitsEnd = vdigitsEnd > decpt ? vdigitsEnd : decpt + 1;
  else vdigitsEnd = vdigitsEnd > decpt ? vdigitsEnd : decpt;
  if (vdigitsEnd - vdigitsStart > DEMO_MAX_CHARS) demoLimitChars();
  let p = '';
  if (sign === 1) p += '-';
  else if (alwaysAddSign) p += '+';
  if (decpt <= 0) {
    p += '0'.repeat(decpt - vdigitsStart) + '.' + '0'.repeat(-decpt);
  } else {
    p += '0'.repeat(-vdigitsStart);
  }
  if (decpt > 0 && decpt <= digitsLen) {
    p += digits.slice(0, decpt) + '.' + digits.slice(decpt);
  } else {
    p += digits;
  }
  if (digitsLen < decpt) {
    p += '0'.repeat(decpt - digitsLen) + '.' + '0'.repeat(vdigitsEnd - decpt);
  } else {
    p += '0'.repeat(vdigitsEnd - digitsLen);
  }
  if (p[p.length - 1] === '.' && !alt) p = p.slice(0, -1);
  if (useExp) {
    const e = Math.abs(exp);
    p += (upper ? 'E' : 'e') + (exp < 0 ? '-' : '+') + String(e).padStart(2, '0');
  }
  return p;
}

// ── str % args (PyUnicode_Format) ────────────────────────────
const F_LJUST = 1;
const F_SIGN = 2;
const F_BLANK = 4;
const F_ALT = 8;
const F_ZERO = 16;
const SSIZE_MAX = (1n << 63n) - 1n;
const INT_MAX = 2147483647;

const isNumber = (v) => typeof v === 'bigint' || typeof v === 'boolean' || v instanceof PyFloat;
const isInt = (v) => typeof v === 'bigint' || typeof v === 'boolean';
const asBig = (v) => (typeof v === 'boolean' ? (v ? 1n : 0n) : v);
// PyMapping_Check(args) && !tuple && !str
const isMappingArg = (v) => v instanceof PyDict || Array.isArray(v) || (v && v.pyMapping === true);

function getItem(obj, key) {
  // PyObject_GetItem(mapping, key) with a str key
  if (obj instanceof PyDict) {
    if (!obj.has(key)) raise('KeyError', pyRepr(key));
    return obj.get(key);
  }
  if (Array.isArray(obj)) raise('TypeError', `list indices must be integers or slices, not ${typeName(key)}`);
  if (obj && typeof obj.pyGetItem === 'function') return obj.pyGetItem(key);
  return raise('TypeError', `'${typeName(obj)}' object is not subscriptable`);
}

// the base-N text of an int as PyNumber_ToBase gives it ('-0xff')
function toBase(n, base) {
  const neg = n < 0n;
  const a = neg ? -n : n;
  const body = a.toString(base);
  const prefix = base === 16 ? '0x' : base === 8 ? '0o' : base === 2 ? '0b' : '';
  return (neg ? '-' : '') + prefix + body;
}

function formatLongPercent(val, alt, prec, type) {
  if (prec > INT_MAX - 3) raise('OverflowError', 'precision too large');
  let numnondigits = 0;
  let s;
  if (type === 'd' || type === 'i' || type === 'u') s = toBase(val, 10);
  else if (type === 'o') { numnondigits = 2; s = toBase(val, 8); } else { numnondigits = 2; s = toBase(val, 16); }
  const sign = s[0] === '-' ? 1 : 0;
  numnondigits += sign;
  let buf = s;
  if (!alt && (type === 'o' || type === 'x' || type === 'X')) {
    numnondigits -= 2;
    buf = (sign ? '-' : '') + s.slice(sign + 2);
  }
  const numdigits = buf.length - numnondigits;
  if (prec > numdigits) {
    if (prec > DEMO_MAX_CHARS) demoLimitChars();
    buf = buf.slice(0, numnondigits) + '0'.repeat(prec - numdigits) + buf.slice(numnondigits);
  }
  if (type === 'X') buf = buf.replace(/[a-x]/g, (c) => c.toUpperCase());
  return buf;
}

// PyFloat_AsDouble for the %-formats and format()
function asDouble(v) {
  if (v instanceof PyFloat) return v.v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'bigint') return intToFloat(v);
  return raise('TypeError', `must be real number, not ${typeName(v)}`);
}

export function percentFormat(fmt, args) {
  const cps = cpsOf(fmt);
  const READ = (i) => (i < cps.length ? cps[i] : 0);
  let fmtcnt = cps.length;
  let fmtpos = 0;
  let out = '';
  const isTuple = args instanceof PyTuple;
  let curArgs = args;
  let arglen = isTuple ? args.items.length : -1;
  let argidx = isTuple ? 0 : -2;
  const dict = !isTuple && typeof args !== 'string' && isMappingArg(args) ? args : null;

  const getnextarg = () => {
    if (argidx < arglen) {
      const i = argidx;
      argidx += 1;
      if (arglen < 0) return curArgs;
      return curArgs.items[i];
    }
    return raise('TypeError', 'not enough arguments for format string');
  };
  const write = (s) => {
    out += s;
    if (out.length > DEMO_MAX_CHARS * 2) demoLimitChars();
  };

  function formatArg() {
    const arg = { ch: READ(fmtpos), flags: 0, width: -1, prec: -1, sign: false };
    if (arg.ch === 0x25) {
      fmtpos++;
      fmtcnt--;
      write('%');
      return;
    }
    // ── unicode_format_arg_parse
    if (READ(fmtpos) === 0x28) {
      if (dict === null) raise('TypeError', 'format requires a mapping');
      ++fmtpos;
      --fmtcnt;
      const keystart = fmtpos;
      let pcount = 1;
      while (pcount > 0 && --fmtcnt >= 0) {
        const c = READ(fmtpos);
        if (c === 0x29) --pcount;
        else if (c === 0x28) ++pcount;
        fmtpos++;
      }
      const keylen = fmtpos - keystart - 1;
      if (fmtcnt < 0 || pcount > 0) raise('ValueError', 'incomplete format key');
      const key = fromCps(cps.slice(keystart, keystart + keylen));
      curArgs = touch(getItem(dict, key));
      arglen = -1;
      argidx = -2;
    }
    while (--fmtcnt >= 0) {
      arg.ch = READ(fmtpos);
      fmtpos++;
      if (arg.ch === 0x2d) { arg.flags |= F_LJUST; continue; }
      if (arg.ch === 0x2b) { arg.flags |= F_SIGN; continue; }
      if (arg.ch === 0x20) { arg.flags |= F_BLANK; continue; }
      if (arg.ch === 0x23) { arg.flags |= F_ALT; continue; }
      if (arg.ch === 0x30) { arg.flags |= F_ZERO; continue; }
      break;
    }
    if (arg.ch === 0x2a) {
      const v = touch(getnextarg());
      if (!isInt(v)) raise('TypeError', '* wants int');
      const w = asBig(v);
      if (w > SSIZE_MAX || w < -SSIZE_MAX - 1n) raise('OverflowError', 'Python int too large to convert to C ssize_t');
      let width = w;
      if (width < 0n) { arg.flags |= F_LJUST; width = -width; }
      arg.width = width;
      if (--fmtcnt >= 0) { arg.ch = READ(fmtpos); fmtpos++; }
    } else if (arg.ch >= 0x30 && arg.ch <= 0x39) {
      let width = BigInt(arg.ch - 0x30);
      while (--fmtcnt >= 0) {
        arg.ch = READ(fmtpos);
        fmtpos++;
        if (arg.ch < 0x30 || arg.ch > 0x39) break;
        const d = BigInt(arg.ch - 0x30);
        if (width > (SSIZE_MAX - d) / 10n) raise('ValueError', 'width too big');
        width = width * 10n + d;
      }
      arg.width = width;
    }
    if (arg.ch === 0x2e) {
      arg.prec = 0;
      if (--fmtcnt >= 0) { arg.ch = READ(fmtpos); fmtpos++; }
      if (arg.ch === 0x2a) {
        const v = touch(getnextarg());
        if (!isInt(v)) raise('TypeError', '* wants int');
        const p = asBig(v);
        if (p > BigInt(INT_MAX) || p < -BigInt(INT_MAX) - 1n) raise('OverflowError', 'Python int too large to convert to C int');
        arg.prec = p < 0n ? 0 : Number(p);
        if (--fmtcnt >= 0) { arg.ch = READ(fmtpos); fmtpos++; }
      } else if (arg.ch >= 0x30 && arg.ch <= 0x39) {
        let prec = arg.ch - 0x30;
        while (--fmtcnt >= 0) {
          arg.ch = READ(fmtpos);
          fmtpos++;
          if (arg.ch < 0x30 || arg.ch > 0x39) break;
          const d = arg.ch - 0x30;
          if (prec > Math.floor((INT_MAX - d) / 10)) raise('ValueError', 'precision too big');
          prec = prec * 10 + d;
        }
        arg.prec = prec;
      }
    }
    if (fmtcnt >= 0) {
      if (arg.ch === 0x68 || arg.ch === 0x6c || arg.ch === 0x4c) {
        if (--fmtcnt >= 0) { arg.ch = READ(fmtpos); fmtpos++; }
      }
    }
    if (fmtcnt < 0) raise('ValueError', 'incomplete format');
    if (typeof arg.width === 'bigint') {
      if (arg.width > BigInt(DEMO_MAX_CHARS)) demoLimitChars();
      arg.width = Number(arg.width);
    }

    // ── unicode_format_arg_format
    const v = touch(getnextarg());
    const c = String.fromCodePoint(arg.ch);
    let str = null;
    switch (c) {
      case 's': case 'r': case 'a': {
        if (typeof v === 'bigint' && arg.width === -1 && arg.prec === -1) { write(v.toString()); return finish(); }
        if (c === 's') str = pyStr(v);
        else if (c === 'r') str = pyRepr(v);
        else str = pyAscii(v);
        break;
      }
      case 'i': case 'd': case 'u': case 'o': case 'x': case 'X': {
        const wrongtype = () => raise('TypeError', (c === 'o' || c === 'x' || c === 'X')
          ? `%${c} format: an integer is required, not ${typeName(v)}`
          : `%${c} format: a real number is required, not ${typeName(v)}`);
        if (!isNumber(v)) wrongtype();
        let iobj;
        if (!isInt(v)) {
          if (c === 'o' || c === 'x' || c === 'X') wrongtype();
          iobj = floatToInt(v.v);
        } else iobj = asBig(v);
        str = formatLongPercent(iobj, (arg.flags & F_ALT) !== 0, arg.prec, c);
        arg.sign = true;
        break;
      }
      case 'e': case 'E': case 'f': case 'F': case 'g': case 'G': {
        const x = asDouble(v);
        const prec = arg.prec < 0 ? 6 : arg.prec;
        const s = doubleToString(x, c, prec, (arg.flags & F_ALT) ? DTSF_ALT : 0);
        if (arg.width === -1 && arg.prec === -1 && !(arg.flags & (F_SIGN | F_BLANK))) { write(s); return finish(); }
        arg.sign = true;
        str = s;
        break;
      }
      case 'c': {
        let chv;
        if (typeof v === 'string') {
          if (pyLen(v) !== 1) raise('TypeError', '%c requires int or char');
          chv = v;
        } else if (isInt(v)) {
          const x = asBig(v);
          if (x < 0n || x > 0x10ffffn) raise('OverflowError', '%c arg not in range(0x110000)');
          chv = String.fromCodePoint(Number(x));
        } else raise('TypeError', '%c requires int or char');
        if (arg.width === -1 && arg.prec === -1) { write(chv); return finish(); }
        str = chv;
        break;
      }
      default: {
        const shown = arg.ch >= 31 && arg.ch <= 126 ? c : '?';
        raise('ValueError', `unsupported format character '${shown}' (0x${arg.ch.toString(16)}) at index ${fmtpos - 1}`);
      }
    }
    output(arg, str);
    return finish();
  }

  function finish() {
    if (dict && argidx < arglen) raise('TypeError', 'not all arguments converted during string formatting');
  }

  // unicode_format_arg_output
  function output(arg, s) {
    const fill = arg.sign && (arg.flags & F_ZERO) ? '0' : ' ';
    let buf = Array.from(s);
    let len = buf.length;
    if ((arg.width === -1 || arg.width <= len) && (arg.prec === -1 || arg.prec >= len) && !(arg.flags & (F_SIGN | F_BLANK))) {
      write(s);
      return;
    }
    if ((arg.ch === 0x73 || arg.ch === 0x72 || arg.ch === 0x61) && arg.prec >= 0 && len > arg.prec) len = arg.prec;
    let pindex = 0;
    let signchar = '';
    let sign = arg.sign;
    if (sign) {
      const ch0 = buf[0];
      if (ch0 === '-' || ch0 === '+') { signchar = ch0; len--; pindex++; }
      else if (arg.flags & F_SIGN) signchar = '+';
      else if (arg.flags & F_BLANK) signchar = ' ';
      else sign = false;
    }
    let width = arg.width;
    if (width < len) width = len;
    if (sign) {
      if (fill !== ' ') write(signchar);
      if (width > len) width--;
    }
    const altPrefix = (arg.flags & F_ALT) && (arg.ch === 0x78 || arg.ch === 0x58 || arg.ch === 0x6f);
    if (altPrefix) {
      if (fill !== ' ') { write('0' + String.fromCodePoint(arg.ch)); pindex += 2; }
      width -= 2;
      if (width < 0) width = 0;
      len -= 2;
    }
    if (width > len && !(arg.flags & F_LJUST)) {
      write(fill.repeat(width - len));
      width = len;
    }
    if (fill === ' ') {
      if (sign) write(signchar);
      if (altPrefix) { write('0' + String.fromCodePoint(arg.ch)); pindex += 2; }
    }
    if (len > 0) write(buf.slice(pindex, pindex + len).join(''));
    if (width > len) write(' '.repeat(width - len));
    buf = null;
  }

  while (--fmtcnt >= 0) {
    if (READ(fmtpos) !== 0x25) {
      const nonfmtpos = fmtpos++;
      while (fmtcnt >= 0 && READ(fmtpos) !== 0x25) { fmtpos++; fmtcnt--; }
      if (fmtcnt < 0) fmtpos--;
      write(fromCps(cps.slice(nonfmtpos, fmtpos)));
    } else {
      fmtpos++;
      formatArg();
    }
  }
  if (argidx < arglen && !dict) raise('TypeError', 'not all arguments converted during string formatting');
  return out;
}

// ── format(value, spec) (Python/formatter_unicode.c) ─────────
const LT_NO_LOCALE = 0;
const LT_DEFAULT_LOCALE = 1;
const LT_UNDERSCORE_LOCALE = 2;
const LT_UNDER_FOUR_LOCALE = 3;
const LT_CURRENT_LOCALE = 4;

const isAlign = (c) => c === '<' || c === '>' || c === '=' || c === '^';
const isDecimalDigit = (c) => /^\p{Nd}$/u.test(c);
function decimalValue(c) {
  const cp = c.codePointAt(0);
  if (cp >= 0x30 && cp <= 0x39) return cp - 0x30;
  if (!isDecimalDigit(c)) return -1;
  let n = 0;
  let x = cp - 1;
  while (x >= 0 && isDecimalDigit(String.fromCodePoint(x))) { n++; x--; }
  return n % 10;
}

function getInteger(spec, pos, end) {
  let acc = 0n;
  let n = 0;
  for (; pos < end; pos++, n++) {
    const d = decimalValue(spec[pos]);
    if (d < 0) break;
    if (acc > (SSIZE_MAX - BigInt(d)) / 10n) raise('ValueError', 'Too many decimal digits in format string');
    acc = acc * 10n + BigInt(d);
  }
  return [acc, pos, n];
}

function parseSpec(v, specStr, defaultType, defaultAlign) {
  const spec = Array.from(specStr);
  const end = spec.length;
  let pos = 0;
  const f = {
    fill: ' ', align: defaultAlign, alternate: false, noNeg0: false, sign: '', width: -1n,
    thousands: LT_NO_LOCALE, precision: -1n, type: defaultType,
  };
  let alignSpecified = false;
  let fillSpecified = false;
  if (end - pos >= 2 && isAlign(spec[pos + 1])) {
    f.align = spec[pos + 1]; f.fill = spec[pos]; fillSpecified = true; alignSpecified = true; pos += 2;
  } else if (end - pos >= 1 && isAlign(spec[pos])) {
    f.align = spec[pos]; alignSpecified = true; pos++;
  }
  if (end - pos >= 1 && (spec[pos] === ' ' || spec[pos] === '+' || spec[pos] === '-')) { f.sign = spec[pos]; pos++; }
  if (end - pos >= 1 && spec[pos] === 'z') { f.noNeg0 = true; pos++; }
  if (end - pos >= 1 && spec[pos] === '#') { f.alternate = true; pos++; }
  if (!fillSpecified && end - pos >= 1 && spec[pos] === '0') {
    f.fill = '0';
    if (!alignSpecified && defaultAlign === '>') f.align = '=';
    pos++;
  }
  let consumed;
  [f.width, pos, consumed] = getInteger(spec, pos, end);
  if (consumed === 0) f.width = -1n;
  if (end - pos && spec[pos] === ',') { f.thousands = LT_DEFAULT_LOCALE; pos++; }
  if (end - pos && spec[pos] === '_') {
    if (f.thousands !== LT_NO_LOCALE) raise('ValueError', "Cannot specify both ',' and '_'.");
    f.thousands = LT_UNDERSCORE_LOCALE;
    pos++;
  }
  if (end - pos && spec[pos] === ',' && f.thousands === LT_UNDERSCORE_LOCALE) raise('ValueError', "Cannot specify both ',' and '_'.");
  if (end - pos && spec[pos] === '.') {
    pos++;
    [f.precision, pos, consumed] = getInteger(spec, pos, end);
    if (consumed === 0) raise('ValueError', 'Format specifier missing precision');
  }
  if (end - pos > 1) raise('ValueError', `Invalid format specifier '${specStr}' for object of type '${typeName(v)}'`);
  if (end - pos === 1) { f.type = spec[pos]; pos++; }
  if (f.thousands) {
    const t = f.type;
    if (['d', 'e', 'f', 'g', 'E', 'G', '%', 'F', ''].includes(t)) { /* allowed */ } else if (['b', 'o', 'x', 'X'].includes(t) && f.thousands === LT_UNDERSCORE_LOCALE) {
      f.thousands = LT_UNDER_FOUR_LOCALE;
    } else {
      const sepCh = f.thousands === LT_UNDERSCORE_LOCALE ? '_' : ',';
      const cp = t.codePointAt(0);
      const shown = cp > 32 && cp < 128 ? `'${t}'` : `'\\x${cp.toString(16)}'`;
      raise('ValueError', `Cannot specify '${sepCh}' with ${shown}.`);
    }
  }
  return f;
}

function unknownPresentation(type, v) {
  const cp = type.codePointAt(0);
  if (cp > 32 && cp < 128) raise('ValueError', `Unknown format code '${type}' for object of type '${typeName(v)}'`);
  raise('ValueError', `Unknown format code '\\x${cp.toString(16)}' for object of type '${typeName(v)}'`);
}

function localeInfo(kind) {
  switch (kind) {
    case LT_DEFAULT_LOCALE: return { decimal: '.', sep: ',', group: 3 };
    case LT_UNDERSCORE_LOCALE: return { decimal: '.', sep: '_', group: 3 };
    case LT_UNDER_FOUR_LOCALE: return { decimal: '.', sep: '_', group: 4 };
    case LT_CURRENT_LOCALE: // C locale: no grouping
    case LT_NO_LOCALE:
    default: return { decimal: '.', sep: '', group: 0 };
  }
}

// _PyUnicode_InsertThousandsGrouping: grouped digits, zero-padded to minWidth
function groupDigits(digits, minWidth0, locale) {
  let remaining = digits.length;
  let minWidth = minWidth0;
  let pos = digits.length;
  const parts = [];
  let useSep = false;
  let broken = false;
  const sepLen = locale.sep.length;
  const take = (len) => {
    const nZeros = Math.max(0, len - remaining);
    const nChars = Math.max(0, Math.min(remaining, len));
    const chunk = '0'.repeat(nZeros) + digits.slice(pos - nChars, pos);
    pos -= nChars;
    parts.unshift(chunk + (useSep ? locale.sep : ''));
    return nChars;
  };
  if (locale.group > 0) {
    for (;;) {
      let len = locale.group;
      len = Math.min(len, Math.max(Math.max(remaining, minWidth), 1));
      const nChars = take(len);
      useSep = true;
      remaining -= nChars;
      minWidth -= len;
      if (remaining <= 0 && minWidth <= 0) { broken = true; break; }
      minWidth -= sepLen;
      if (minWidth > DEMO_MAX_CHARS * 2) demoLimitChars();
    }
  }
  if (!broken) {
    const len = Math.max(Math.max(remaining, minWidth), 1);
    take(len);
  }
  return parts.join('');
}

// calc_number_widths + fill_number
function fillNumber(f, signChar, prefix, digits, hasDecimal, remainder, upper) {
  const locale = localeInfo(f.type === 'n' ? LT_CURRENT_LOCALE : f.thousands);
  let nSign = 0;
  let sign = '';
  if (f.sign === '+') { nSign = 1; sign = signChar === '-' ? '-' : '+'; } else if (f.sign === ' ') { nSign = 1; sign = signChar === '-' ? '-' : ' '; } else if (signChar === '-') { nSign = 1; sign = '-'; }
  const nDecimal = hasDecimal ? 1 : 0;
  const nonDigit = nSign + prefix.length + nDecimal + pyLen(remainder);
  const width = f.width > BigInt(DEMO_MAX_CHARS) ? demoLimitChars() : Number(f.width);
  const minWidth = f.fill === '0' && f.align === '=' ? width - nonDigit : 0;
  const grouped = digits.length === 0 ? '' : groupDigits(digits, minWidth, locale);
  const nPadding = width - (nonDigit + grouped.length);
  let l = 0;
  let s = 0;
  let r = 0;
  if (nPadding > 0) {
    if (f.align === '<') r = nPadding;
    else if (f.align === '^') { l = Math.floor(nPadding / 2); r = nPadding - l; } else if (f.align === '=') s = nPadding;
    else l = nPadding;
  }
  const up = (x) => (upper ? x.toUpperCase() : x);
  return f.fill.repeat(l) + sign + up(prefix) + f.fill.repeat(s) + up(grouped) + (hasDecimal ? locale.decimal : '') + remainder + f.fill.repeat(r);
}

function formatLongInternal(v, f) {
  const value = asBig(v);
  if (f.precision !== -1n) raise('ValueError', 'Precision not allowed in integer format specifier');
  if (f.noNeg0) raise('ValueError', 'Negative zero coercion (z) not allowed in integer format specifier');
  if (f.type === 'c') {
    if (f.sign !== '') raise('ValueError', "Sign not allowed with integer format specifier 'c'");
    if (f.alternate) raise('ValueError', "Alternate form (#) not allowed with integer format specifier 'c'");
    if (value > 9223372036854775807n || value < -9223372036854775808n) raise('OverflowError', 'Python int too large to convert to C long');
    if (value < 0n || value > 0x10ffffn) raise('OverflowError', '%c arg not in range(0x110000)');
    return fillNumber(f, '', '', '', false, String.fromCodePoint(Number(value)), false);
  }
  let base = 10;
  if (f.type === 'b') base = 2;
  else if (f.type === 'o') base = 8;
  else if (f.type === 'x' || f.type === 'X') base = 16;
  const neg = value < 0n;
  const digits = (neg ? -value : value).toString(base);
  const prefix = f.alternate && base !== 10 ? (base === 2 ? '0b' : base === 8 ? '0o' : '0x') : '';
  return fillNumber(f, neg ? '-' : '', prefix, digits, false, '', f.type === 'X');
}

function formatFloatInternal(x0, f) {
  let x = x0;
  let type = f.type;
  let flags = 0;
  let addPct = false;
  let defaultPrecision = 6;
  if (f.precision > BigInt(INT_MAX)) raise('ValueError', 'precision too big');
  let precision = Number(f.precision);
  if (f.alternate) flags |= DTSF_ALT;
  if (f.noNeg0) flags |= DTSF_NO_NEG_0;
  if (type === '') { flags |= DTSF_ADD_DOT_0; type = 'r'; defaultPrecision = 0; }
  if (type === 'n') type = 'g';
  if (type === '%') { type = 'f'; x *= 100; addPct = true; }
  if (precision < 0) precision = defaultPrecision;
  else if (type === 'r') type = 'g';
  let buf = doubleToString(x, type, precision, flags);
  if (addPct) buf += '%';
  let signChar = '';
  if (buf[0] === '-') { signChar = '-'; buf = buf.slice(1); }
  const m = /^[0-9]*/.exec(buf);
  const digits = m[0];
  let rest = buf.slice(digits.length);
  const hasDecimal = rest[0] === '.';
  if (hasDecimal) rest = rest.slice(1);
  return fillNumber(f, signChar, '', digits, hasDecimal, rest, false);
}

// format(value, spec)
export function formatValue(v0, spec) {
  const v = touch(v0);
  if (typeof v === 'string') return formatStr(v, spec);
  if (typeof v === 'bigint' || typeof v === 'boolean') {
    if (spec === '') return pyStr(v);
    const f = parseSpec(v, spec, 'd', '>');
    switch (f.type) {
      case 'b': case 'c': case 'd': case 'o': case 'x': case 'X': case 'n':
        return formatLongInternal(v, f);
      case 'e': case 'E': case 'f': case 'F': case 'g': case 'G': case '%':
        return formatFloatInternal(typeof v === 'boolean' ? (v ? 1 : 0) : intToFloat(v), f);
      default:
        return unknownPresentation(f.type, v);
    }
  }
  if (v instanceof PyFloat) {
    if (spec === '') return pyStr(v);
    const f = parseSpec(v, spec, '', '>');
    switch (f.type) {
      case '': case 'e': case 'E': case 'f': case 'F': case 'g': case 'G': case 'n': case '%':
        return formatFloatInternal(v.v, f);
      default:
        return unknownPresentation(f.type, v);
    }
  }
  if (v && typeof v.pyFormat === 'function') return v.pyFormat(spec);
  // object.__format__
  if (spec !== '') raise('TypeError', `unsupported format string passed to ${typeName(v)}.__format__`);
  return pyStr(v);
}

// ── fmt.format(**kwargs) (C str.format) ──────────────────────
// Attributes a field like {levelno.real} can reach. Anything in dir() we
// do not model (bound methods print a memory address) is a DemoLimit;
// a name not in dir() is CPython's AttributeError.
const OBJ_DIR = '__class__ __delattr__ __dir__ __doc__ __eq__ __format__ __ge__ __getattribute__ __getstate__ __gt__ __hash__ __init__ __init_subclass__ __le__ __lt__ __ne__ __new__ __reduce__ __reduce_ex__ __repr__ __setattr__ __sizeof__ __str__ __subclasshook__';
const DIRS = {
  str: `${OBJ_DIR} __add__ __contains__ __getitem__ __getnewargs__ __iter__ __len__ __mod__ __mul__ __rmod__ __rmul__ capitalize casefold center count encode endswith expandtabs find format format_map index isalnum isalpha isascii isdecimal isdigit isidentifier islower isnumeric isprintable isspace istitle isupper join ljust lower lstrip maketrans partition removeprefix removesuffix replace rfind rindex rjust rpartition rsplit rstrip split splitlines startswith strip swapcase title translate upper zfill`,
  int: `${OBJ_DIR} __abs__ __add__ __and__ __bool__ __ceil__ __divmod__ __float__ __floor__ __floordiv__ __getnewargs__ __index__ __int__ __invert__ __lshift__ __mod__ __mul__ __neg__ __or__ __pos__ __pow__ __radd__ __rand__ __rdivmod__ __rfloordiv__ __rlshift__ __rmod__ __rmul__ __ror__ __round__ __rpow__ __rrshift__ __rshift__ __rsub__ __rtruediv__ __rxor__ __sub__ __truediv__ __trunc__ __xor__ as_integer_ratio bit_count bit_length conjugate denominator from_bytes imag is_integer numerator real to_bytes`,
  float: `${OBJ_DIR} __abs__ __add__ __bool__ __ceil__ __divmod__ __float__ __floor__ __floordiv__ __getformat__ __getnewargs__ __int__ __mod__ __mul__ __neg__ __pos__ __pow__ __radd__ __rdivmod__ __rfloordiv__ __rmod__ __rmul__ __round__ __rpow__ __rsub__ __rtruediv__ __sub__ __truediv__ __trunc__ as_integer_ratio conjugate fromhex hex imag is_integer real`,
  NoneType: `${OBJ_DIR} __bool__`,
  tuple: `${OBJ_DIR} __add__ __class_getitem__ __contains__ __getitem__ __getnewargs__ __iter__ __len__ __mul__ __rmul__ count index`,
};
DIRS.bool = DIRS.int;
const dirOf = (v) => (DIRS[typeName(v)] || OBJ_DIR).split(' ').sort();

function getattr(obj, name) {
  const t = typeName(obj);
  const dir = dirOf(obj);
  if (!dir.includes(name)) {
    const s = suggest(dir, name);
    const msg = `'${t}' object has no attribute '${name}'`;
    raise('AttributeError', s === null ? msg : `${msg}. Did you mean: ${pyStrRepr(s)}?`);
  }
  if (isInt(obj)) {
    const n = asBig(obj);
    if (name === 'real' || name === 'numerator') return n;
    if (name === 'imag') return 0n;
    if (name === 'denominator') return 1n;
  }
  if (obj instanceof PyFloat) {
    if (name === 'real') return obj;
    if (name === 'imag') return pyFloat(0);
  }
  if (name === '__class__') return { pyTypeName: 'type', pyRepr: () => `<class '${t}'>` };
  return raise('DemoLimit', `{…${name}} reaches an attribute the browser demo does not model — run the snippet in CPython`);
}

function getitem(obj, key) {
  if (typeof obj === 'string') {
    if (typeof key === 'bigint') {
      const cps = cpsOf(obj);
      if (key >= BigInt(cps.length)) raise('IndexError', 'string index out of range');
      return String.fromCodePoint(cps[Number(key)]);
    }
    raise('TypeError', `string indices must be integers, not '${typeName(key)}'`);
  }
  if (obj instanceof PyTuple || Array.isArray(obj)) {
    const items = obj instanceof PyTuple ? obj.items : obj;
    const kind = obj instanceof PyTuple ? 'tuple' : 'list';
    if (typeof key === 'bigint') {
      if (key >= BigInt(items.length)) raise('IndexError', `${kind} index out of range`);
      return items[Number(key)];
    }
    raise('TypeError', `${kind} indices must be integers or slices, not ${typeName(key)}`);
  }
  if (obj instanceof PyDict) {
    if (!obj.has(key)) raise('KeyError', pyRepr(key));
    return obj.get(key);
  }
  return raise('TypeError', `'${typeName(obj)}' object is not subscriptable`);
}

// kwargs: a Map-like with has/get (values are Python values). There are
// never positional args (logging calls fmt.format(**values)), so every
// numbered or auto-numbered field is an IndexError.
const ANS_INIT = 0;
const ANS_AUTO = 1;
const ANS_MANUAL = 2;
export function strFormat(fmt, kwargs, recursionDepth = 2, state = { an: ANS_INIT, next: 0 }) {
  if (recursionDepth <= 0) raise('ValueError', 'Max string recursion exceeded');
  let out = '';
  for (const [literal, fieldName, spec, conversion] of formatterParser(fmt)) {
    out += literal;
    if (fieldName === null) continue;
    // field_name_split: auto numbering state, then the lookup
    const [first, rest] = fieldNameSplit(fieldName);
    const empty = first === '';
    let obj;
    if (empty || typeof first === 'bigint') {
      if (state.an === ANS_INIT) state.an = empty ? ANS_AUTO : ANS_MANUAL;
      if (state.an === ANS_MANUAL && empty) raise('ValueError', 'cannot switch from manual field specification to automatic field numbering');
      if (state.an === ANS_AUTO && !empty) raise('ValueError', 'cannot switch from automatic field numbering to manual field specification');
      const idx = empty ? state.next++ : first;
      raise('IndexError', `Replacement index ${idx} out of range for positional args tuple`);
    } else {
      if (!kwargs.has(first)) raise('KeyError', pyRepr(first));
      obj = kwargs.get(first);
    }
    for (const [isAttr, key] of rest) {
      obj = touch(obj);
      obj = isAttr ? getattr(obj, key) : getitem(obj, key);
    }
    if (conversion !== null) {
      obj = touch(obj);
      if (conversion === 'r') obj = pyRepr(obj);
      else if (conversion === 's') obj = pyStr(obj);
      else if (conversion === 'a') obj = pyAscii(obj);
      else {
        const cp = conversion.codePointAt(0);
        raise('ValueError', cp > 32 && cp < 127 ? `Unknown conversion specifier ${conversion}` : `Unknown conversion specifier \\x${cp.toString(16)}`);
      }
    }
    // only a spec with a nested field is expanded (format_spec_needs_expanding)
    const fullSpec = spec.includes('{') ? strFormat(spec, kwargs, recursionDepth - 1, state) : spec;
    out += formatValue(obj, fullSpec);
    if (out.length > DEMO_MAX_CHARS * 2) demoLimitChars();
  }
  return out;
}

export { cpsOf, fromCps, cpSlice };
