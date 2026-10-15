// utils/emulators/python/stdlib/argparse/_pyvalue.js
//
// The small slice of the Python object model the argparse port needs:
// values (str, int as BigInt, float, bool, None, list, tuple, dict, range),
// repr()/str()/==/in, printf-style % formatting, int()/float() parsing of
// command-line strings, str.strip/splitlines, textwrap.wrap/fill
// (Lib/textwrap.py) and shlex.split (Lib/shlex.py) — each ported from the
// CPython 3.13 sources so the argparse emulator prints what CPython prints.
//
// Value model:
//   None → null, bool → true/false, int → bigint, float → PyFloat,
//   str → string, list → Array, tuple → PyTuple, dict → PyDict (str keys),
//   range → PyRange, callables → PyCallable.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export { PyException };
export const raise = (type, message = '') => { throw new PyException(type, message); };

export class PyFloat { constructor(v) { this.v = v; } }
export class PyTuple { constructor(items) { this.items = items; } }
export class PyDict {
  constructor(entries = []) { this.map = new Map(entries); }
  get(k) { return this.map.get(k); }
  set(k, v) { this.map.set(k, v); }
  has(k) { return this.map.has(k); }
  keys() { return [...this.map.keys()]; }
}
export class PyRange {
  constructor(start, stop, step = 1n) {
    if (stop === undefined) { stop = start; start = 0n; }
    this.start = start; this.stop = stop; this.step = step;
  }
  items() {
    const out = [];
    const { start, stop, step } = this;
    if (step > 0n) for (let i = start; i < stop; i += step) out.push(i);
    else for (let i = start; i > stop; i += step) out.push(i);
    return out;
  }
  has(v) {
    const { start, stop, step } = this;
    if (step > 0n ? !(v >= start && v < stop) : !(v <= start && v > stop)) return false;
    return (v - start) % step === 0n;
  }
}

// A Python callable: built-in types (int, float, str, bool) and functions.
export class PyCallable {
  constructor(name, fn, { repr = null, isClass = false } = {}) {
    this.__name__ = name;
    this.fn = fn;
    this.isClass = isClass;
    this.reprText = repr || (isClass ? `<class '${name}'>` : `<function ${name} at 0x...>`);
  }
  call(...args) { return this.fn(...args); }
}

// ── code points and Python character classes ────────────────
export const cps = (s) => Array.from(s);
export const plen = (s) => { let n = 0; for (const _ of s) n += 1; return n; };
export const pslice = (s, a, b) => cps(s).slice(a, b).join('');

// str.isspace() / Py_UNICODE_ISSPACE (Unicode 15.1 — same set in Node)
const SPACE_CPS = new Set([9, 10, 11, 12, 13, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x85, 0xa0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000]);
export const isPySpace = (ch) => SPACE_CPS.has(ch.codePointAt(0));

export function pyStrip(s, chars = null) {
  const a = cps(s);
  const strip = chars === null ? isPySpace : (c) => chars.includes(c);
  let i = 0; let j = a.length;
  while (i < j && strip(a[i])) i += 1;
  while (j > i && strip(a[j - 1])) j -= 1;
  return a.slice(i, j).join('');
}
export const pyLstrip = (s, chars) => {
  const a = cps(s); let i = 0;
  while (i < a.length && chars.includes(a[i])) i += 1;
  return a.slice(i).join('');
};

// str.split() with no arguments: runs of whitespace (str.isspace) separate
// the words; leading and trailing whitespace is ignored
export function pySplitWhitespace(s) {
  const out = [];
  let word = '';
  for (const ch of s) {
    if (isPySpace(ch)) {
      if (word) out.push(word);
      word = '';
    } else word += ch;
  }
  if (word) out.push(word);
  return out;
}

// str.splitlines(keepends)
const LINE_BREAKS = '\n\r\x0b\x0c\x1c\x1d\x1e\x85' + String.fromCodePoint(0x2028, 0x2029);
export function pySplitlines(s, keepends = false) {
  const a = cps(s);
  const out = [];
  let start = 0;
  let i = 0;
  while (i < a.length) {
    if (LINE_BREAKS.includes(a[i])) {
      let eol = i + 1;
      if (a[i] === '\r' && a[i + 1] === '\n') eol = i + 2;
      out.push(a.slice(start, keepends ? eol : i).join(''));
      start = eol;
      i = eol;
    } else i += 1;
  }
  if (start < a.length) out.push(a.slice(start).join(''));
  return out;
}

// Unicode decimal digits as Python 3.13 (Unicode 15.1) knows them: Node's
// \p{Nd} is Unicode 16, which added these seven digit sets.
const ND_NEW_IN_16 = [[0x10d40, 0x10d49], [0x116d0, 0x116e3], [0x11bf0, 0x11bf9], [0x16130, 0x16139],
  [0x16d70, 0x16d79], [0x1ccf0, 0x1ccf9], [0x1e5f1, 0x1e5fa]];
const isNd = (cp) => /\p{Nd}/u.test(String.fromCodePoint(cp)) && !ND_NEW_IN_16.some(([a, b]) => cp >= a && cp <= b);
// Py_UNICODE_TODECIMAL: digit sets come in runs of ten, 0..9
export function decimalValue(ch) {
  const cp = ch.codePointAt(0);
  if (cp >= 0x30 && cp <= 0x39) return cp - 0x30;
  if (cp < 0x80 || !isNd(cp)) return -1;
  let start = cp;
  while (isNd(start - 1)) start -= 1;
  return (cp - start) % 10;
}

// _PyUnicode_TransformDecimalAndSpaceToASCII: what int() and float() parse
function toAsciiNumeric(s) {
  let out = '';
  for (const ch of s) {
    if (isPySpace(ch)) out += ' ';
    else {
      const d = decimalValue(ch);
      if (d >= 0) out += String(d);
      else out += ch.codePointAt(0) < 127 ? ch : '?';
    }
  }
  return out;
}
const ASCII_SPACE = ' \t\n\x0b\x0c\r';

// int(s, base) for a str s, base 2..36 (PyLong_FromString). Returns a
// bigint or throws ValueError.
const digitValue = (c) => {
  if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
  if (c >= 'a' && c <= 'z') return c.charCodeAt(0) - 87;
  if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 55;
  return 37;
};
export function pyIntFromStr(s, base = 10) {
  const bad = () => raise('ValueError', `invalid literal for int() with base ${base}: ${cps(pyStrRepr(s)).slice(0, 200).join('')}`);
  const t = toAsciiNumeric(s);
  let i = 0;
  while (i < t.length && ASCII_SPACE.includes(t[i])) i += 1;
  let neg = false;
  if (t[i] === '+' || t[i] === '-') { neg = t[i] === '-'; i += 1; }
  const p = (t[i + 1] || '').toLowerCase();
  if (t[i] === '0' && ((base === 16 && p === 'x') || (base === 8 && p === 'o') || (base === 2 && p === 'b'))) {
    i += 2;
    if (t[i] === '_') i += 1;
  }
  if (t[i] === '_') bad();
  let digits = '';
  let prevUnderscore = false;
  for (; i < t.length; i += 1) {
    const c = t[i];
    if (c === '_') {
      if (prevUnderscore) bad();
      prevUnderscore = true;
    } else if (digitValue(c) < base) { digits += c; prevUnderscore = false; } else break;
  }
  if (prevUnderscore || !digits) bad();
  while (i < t.length && ASCII_SPACE.includes(t[i])) i += 1;
  if (i !== t.length) bad();
  if ((base & (base - 1)) !== 0 && digits.length > 4300) {
    raise('ValueError', `Exceeds the limit (4300 digits) for integer string conversion: value has ${digits.length} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  let v = 0n;
  const b = BigInt(base);
  for (const c of digits) v = v * b + BigInt(digitValue(c));
  return neg ? -v : v;
}

// float(s) for a str s. Returns a PyFloat or throws ValueError.
export function pyFloatFromStr(s) {
  const bad = () => raise('ValueError', `could not convert string to float: ${pyStrRepr(s)}`);
  let t = toAsciiNumeric(s);
  if (t.includes('_')) {
    // _Py_string_to_number_with_underscores: '_' only between two digits
    for (let i = 0; i < t.length; i += 1) {
      if (t[i] === '_' && !(/[0-9]/.test(t[i - 1] || '') && /[0-9]/.test(t[i + 1] || ''))) bad();
    }
    t = t.replace(/_/g, '');
  }
  let a = 0; let b = t.length;
  while (a < b && ASCII_SPACE.includes(t[a])) a += 1;
  while (b > a && ASCII_SPACE.includes(t[b - 1])) b -= 1;
  const body = t.slice(a, b);
  const m = /^([+-]?)(?:(inf|infinity)|(nan)|((?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?))$/i.exec(body);
  if (!m) bad();
  if (m[2]) return new PyFloat(m[1] === '-' ? -Infinity : Infinity);
  if (m[3]) return new PyFloat(NaN);
  return new PyFloat(Number(m[1] + m[4]));
}

// ── repr / str / == / in ─────────────────────────────────────
export const SUPPRESS = Object.freeze({ __suppress: true, toString: () => '==SUPPRESS==' });
export const isSuppress = (v) => v === SUPPRESS;

export function pyRepr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v === SUPPRESS) return "'==SUPPRESS=='";
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
  if (v instanceof PyTuple) return '(' + v.items.map(pyRepr).join(', ') + (v.items.length === 1 ? ',' : '') + ')';
  if (v instanceof PyDict) return '{' + [...v.map.entries()].map(([k, x]) => `${pyRepr(k)}: ${pyRepr(x)}`).join(', ') + '}';
  if (v instanceof PyRange) return v.step === 1n ? `range(${v.start}, ${v.stop})` : `range(${v.start}, ${v.stop}, ${v.step})`;
  if (v instanceof PyCallable) return v.reprText;
  if (typeof v.__repr__ === 'function') return v.__repr__();
  if (typeof v === 'function' && v.pyName) return `<class '${v.pyModule ? v.pyModule + '.' : ''}${v.pyName}'>`;
  return String(v);
}

export function pyStr(v) {
  if (typeof v === 'string') return v;
  if (v === SUPPRESS) return '==SUPPRESS==';
  if (v && typeof v.__str__ === 'function') return v.__str__();
  return pyRepr(v);
}

// ascii(): repr with every non-ASCII character escaped
export function pyAscii(v) {
  let out = '';
  for (const ch of pyRepr(v)) {
    const cp = ch.codePointAt(0);
    if (cp < 128) out += ch;
    else if (cp <= 0xff) out += '\\x' + cp.toString(16).padStart(2, '0');
    else if (cp <= 0xffff) out += '\\u' + cp.toString(16).padStart(4, '0');
    else out += '\\U' + cp.toString(16).padStart(8, '0');
  }
  return out;
}

const numOf = (v) => (v === true ? 1n : v === false ? 0n : v);
const isNum = (v) => typeof v === 'bigint' || typeof v === 'boolean' || v instanceof PyFloat;

export function pyEq(a, b) {
  if (a === b) return !(a instanceof PyFloat && Number.isNaN(a.v));
  // SUPPRESS is the str '==SUPPRESS==' (argparse's identity tests use === directly)
  if (a === SUPPRESS) a = '==SUPPRESS==';
  if (b === SUPPRESS) b = '==SUPPRESS==';
  if (isNum(a) && isNum(b)) {
    const x = numOf(a); const y = numOf(b);
    if (typeof x === 'bigint' && typeof y === 'bigint') return x === y;
    if (x instanceof PyFloat && y instanceof PyFloat) return x.v === y.v;
    const i = typeof x === 'bigint' ? x : y;
    const f = typeof x === 'bigint' ? y.v : x.v;
    return Number.isFinite(f) && Number.isInteger(f) && BigInt(f) === i;
  }
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => x === b[i] || pyEq(x, b[i]));
  if (a instanceof PyTuple && b instanceof PyTuple) return a.items.length === b.items.length && a.items.every((x, i) => x === b.items[i] || pyEq(x, b.items[i]));
  if (a && typeof a.__eq__ === 'function') return a.__eq__(b);
  return false;
}

export function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'string' || v === SUPPRESS) return 'str';
  if (v instanceof PyFloat) return 'float';
  if (Array.isArray(v)) return 'list';
  if (v instanceof PyTuple) return 'tuple';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof PyRange) return 'range';
  if (v instanceof PyCallable) return v.isClass ? 'type' : 'function';
  if (v && v.pyTypeName) return v.pyTypeName;
  return 'object';
}

const hashable = (v) => !(Array.isArray(v) || v instanceof PyDict);

// iter(x) for the containers argparse iterates (choices, metavar joins)
export function pyIter(x) {
  if (Array.isArray(x)) return x;
  if (x instanceof PyTuple) return x.items;
  if (x instanceof PyDict) return x.keys();
  if (x instanceof PyRange) return x.items();
  if (typeof x === 'string') return cps(x);
  if (x === SUPPRESS) return cps('==SUPPRESS==');
  if (x instanceof Set) return [...x];
  raise('TypeError', `'${pyTypeName(x)}' object is not iterable`);
}

// value in container
export function pyContains(container, v) {
  if (v === SUPPRESS) v = '==SUPPRESS==';
  if (container === SUPPRESS) container = '==SUPPRESS==';
  if (Array.isArray(container) || container instanceof PyTuple) {
    return pyIter(container).some((e) => e === v || pyEq(e, v));
  }
  if (container instanceof PyDict) {
    if (!hashable(v)) raise('TypeError', `unhashable type: '${pyTypeName(v)}'`);
    if (typeof v === 'string') return container.has(v);
    return container.keys().some((k) => pyEq(k, v));
  }
  if (container instanceof PyRange) {
    if (typeof v === 'bigint' || typeof v === 'boolean') return container.has(numOf(v));
    return container.items().some((e) => pyEq(e, v));
  }
  if (typeof container === 'string') {
    if (typeof v !== 'string') raise('TypeError', `'in <string>' requires string as left operand, not ${pyTypeName(v)}`);
    return container.includes(v);
  }
  if (container instanceof Set) {
    if (!hashable(v)) raise('TypeError', `unhashable type: '${pyTypeName(v)}'`);
    return [...container].some((e) => e === v || pyEq(e, v));
  }
  if (container && container.isIterator) return container.items.some((e) => e === v || pyEq(e, v));
  raise('TypeError', `argument of type '${pyTypeName(container)}' is not iterable`);
}

// ── printf-style formatting: fmt % args ─────────────────────
// args: a PyDict / Map (mapping), a PyTuple, or any single value.
// Conversions s r a d i u o x X c and %; float conversions are not
// needed by the argparse templates and raise an internal error.
function intForFormat(v, conv) {
  if (typeof v === 'boolean') return v ? 1n : 0n;
  if (typeof v === 'bigint') return v;
  if (v instanceof PyFloat && 'diu'.includes(conv)) {
    if (!Number.isFinite(v.v)) raise(Number.isNaN(v.v) ? 'ValueError' : 'OverflowError', Number.isNaN(v.v) ? 'cannot convert float NaN to integer' : 'cannot convert float infinity to integer');
    return BigInt(Math.trunc(v.v));
  }
  if ('diu'.includes(conv)) raise('TypeError', `%${conv} format: a real number is required, not ${pyTypeName(v)}`);
  raise('TypeError', `%${conv} format: an integer is required, not ${pyTypeName(v)}`);
}

function floatForFormat(v) {
  if (v instanceof PyFloat) return v.v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'bigint') {
    const f = Number(v);
    if (!Number.isFinite(f)) raise('OverflowError', 'int too large to convert to float');
    return f;
  }
  raise('TypeError', `must be real number, not ${pyTypeName(v)}`);
}

// exact x = m * 2**exp for a finite double x >= 0
function decompose(x) {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, x);
  const hi = dv.getUint32(0); const lo = dv.getUint32(4);
  const e = (hi >>> 20) & 0x7ff;
  let m = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let exp;
  if (e === 0) exp = -1074; else { m |= 1n << 52n; exp = e - 1075; }
  return { m, exp };
}
// round-half-even of m * 2**exp * 10**p, as a bigint
function scaledRound(m, exp, p) {
  let num = m; let den = 1n;
  if (exp >= 0) num <<= BigInt(exp); else den <<= BigInt(-exp);
  if (p >= 0) num *= 10n ** BigInt(p); else den *= 10n ** BigInt(-p);
  const q = num / den; const r2 = (num % den) * 2n;
  return r2 > den || (r2 === den && (q & 1n) === 1n) ? q + 1n : q;
}
// %e digits: [digit string of length prec+1, decimal exponent]
function eDigits(x, prec) {
  if (x === 0) return ['0'.repeat(prec + 1), 0];
  const { m, exp } = decompose(x);
  let X = Math.floor(Math.log10(x));
  const lo = 10n ** BigInt(prec); const hi = lo * 10n;
  let n = scaledRound(m, exp, prec - X);
  while (n >= hi) { X += 1; n = scaledRound(m, exp, prec - X); }
  while (n < lo) { X -= 1; n = scaledRound(m, exp, prec - X); }
  return [n.toString(), X];
}
function fFormat(x, prec, alt) {
  const { m, exp } = decompose(x);
  let s = scaledRound(m, exp, prec).toString();
  if (prec > 0) {
    s = s.padStart(prec + 1, '0');
    s = s.slice(0, s.length - prec) + '.' + s.slice(s.length - prec);
  } else if (alt) s += '.';
  return s;
}
function eFormat(x, prec, alt, e) {
  const [d, X] = eDigits(x, prec);
  const mant = d[0] + (prec > 0 || alt ? '.' : '') + d.slice(1);
  return `${mant}${e}${X < 0 ? '-' : '+'}${String(Math.abs(X)).padStart(2, '0')}`;
}
// %f %e %g of a non-negative double (the sign is handled by the caller)
function formatFloat(x, conv, prec, alt) {
  const upper = conv === conv.toUpperCase();
  if (!Number.isFinite(x)) return Number.isNaN(x) ? (upper ? 'NAN' : 'nan') : (upper ? 'INF' : 'inf');
  const c = conv.toLowerCase();
  if (prec < 0) prec = 6;
  if (c === 'f') return fFormat(x, prec, alt);
  if (c === 'e') return eFormat(x, prec, alt, upper ? 'E' : 'e');
  const P = prec === 0 ? 1 : prec;
  const X = eDigits(x, P - 1)[1];
  let s;
  if (X >= -4 && X < P) s = fFormat(x, P - 1 - X, alt);
  else s = eFormat(x, P - 1, alt, upper ? 'E' : 'e');
  if (!alt) {
    const k = s.search(/[eE]/);
    let mant = k === -1 ? s : s.slice(0, k);
    const tail = k === -1 ? '' : s.slice(k);
    if (mant.includes('.')) mant = mant.replace(/0+$/, '').replace(/\.$/, '');
    s = mant + tail;
  }
  return s;
}

export function pyPercent(fmt, args) {
  // CPython's argument cursor (Objects/unicodeobject.c): a %(key) lookup
  // replaces the current argument with the looked-up value, served once
  const dict = args instanceof PyDict || args instanceof Map ? args : null;
  let cur = args;
  let arglen; let argidx;
  if (args instanceof PyTuple) { arglen = args.items.length; argidx = 0; } else { arglen = -1; argidx = -2; }
  const nextArg = () => {
    if (argidx < arglen) {
      const k = argidx; argidx += 1;
      return arglen < 0 ? cur : cur.items[k];
    }
    raise('TypeError', 'not enough arguments for format string');
  };
  const a = cps(fmt);
  let out = '';
  let i = 0;
  while (i < a.length) {
    if (a[i] !== '%') { out += a[i]; i += 1; continue; }
    i += 1;
    if (a[i] === '%') { out += '%'; i += 1; continue; } // only a bare %% is a literal
    if (a[i] === '(') {
      if (dict === null) raise('TypeError', 'format requires a mapping');
      let depth = 1; let j = i + 1;
      while (j < a.length && depth > 0) { if (a[j] === '(') depth += 1; else if (a[j] === ')') depth -= 1; j += 1; }
      if (depth > 0) raise('ValueError', 'incomplete format key');
      const key = a.slice(i + 1, j - 1).join('');
      if (!dict.has(key)) raise('KeyError', pyRepr(key));
      cur = dict.get(key);
      arglen = -1; argidx = -2;
      i = j;
    }
    let flags = '';
    while (i < a.length && '-+ #0'.includes(a[i])) { flags += a[i]; i += 1; }
    let width = -1;
    if (a[i] === '*') {
      const w = nextArg();
      if (typeof w !== 'bigint' && typeof w !== 'boolean') raise('TypeError', '* wants int');
      width = Number(numOf(w));
      if (width < 0) { flags += '-'; width = -width; }
      i += 1;
    } else {
      let d = '';
      while (i < a.length && a[i] >= '0' && a[i] <= '9') { d += a[i]; i += 1; }
      if (d) width = Number(d);
    }
    let prec = -1;
    if (a[i] === '.') {
      i += 1;
      if (a[i] === '*') {
        const p = nextArg();
        if (typeof p !== 'bigint' && typeof p !== 'boolean') raise('TypeError', '* wants int');
        prec = Math.max(0, Number(numOf(p)));
        i += 1;
      } else {
        let d = '';
        while (i < a.length && a[i] >= '0' && a[i] <= '9') { d += a[i]; i += 1; }
        prec = d ? Number(d) : 0;
      }
    }
    while (i < a.length && 'hlL'.includes(a[i])) i += 1;
    if (i >= a.length) raise('ValueError', 'incomplete format');
    const conv = a[i];
    i += 1;
    const v = nextArg();
    let s;
    let numeric = false; let sign = '';
    if (conv === 's' || conv === 'r' || conv === 'a') {
      s = conv === 's' ? pyStr(v) : conv === 'r' ? pyRepr(v) : pyAscii(v);
      if (prec >= 0) s = pslice(s, 0, prec);
    } else if ('diuoxX'.includes(conv)) {
      const n = intForFormat(v, conv);
      numeric = true;
      const abs = n < 0n ? -n : n;
      let body = conv === 'o' ? abs.toString(8) : conv === 'x' ? abs.toString(16) : conv === 'X' ? abs.toString(16).toUpperCase() : abs.toString(10);
      if (prec >= 0 && body.length < prec) body = '0'.repeat(prec - body.length) + body;
      if (flags.includes('#')) body = (conv === 'o' ? '0o' : conv === 'x' ? '0x' : conv === 'X' ? '0X' : '') + body;
      sign = n < 0n ? '-' : flags.includes('+') ? '+' : flags.includes(' ') ? ' ' : '';
      s = body;
    } else if (conv === 'c') {
      if (typeof v === 'string' && plen(v) === 1) s = v;
      else if (typeof v === 'bigint' || typeof v === 'boolean') {
        const n = numOf(v);
        if (n < 0n || n > 0x10ffffn) raise('OverflowError', '%c arg not in range(0x110000)');
        s = String.fromCodePoint(Number(n));
      } else raise('TypeError', '%c requires int or char');
    } else if ('eEfFgG'.includes(conv)) {
      const x = floatForFormat(v);
      numeric = true;
      const neg = x < 0 || Object.is(x, -0);
      sign = neg && !Number.isNaN(x) ? '-' : flags.includes('+') ? '+' : flags.includes(' ') ? ' ' : '';
      s = formatFloat(Math.abs(x), conv, prec, flags.includes('#'));
    } else {
      const cp = conv.codePointAt(0);
      raise('ValueError', `unsupported format character '${conv}' (0x${cp.toString(16)}) at index ${i - 1}`);
    }
    const total = plen(sign) + plen(s);
    if (width > total) {
      const pad = width - total;
      if (flags.includes('-')) s = sign + s + ' '.repeat(pad);
      else if (numeric && flags.includes('0')) {
        // the 0x prefix stays in front of the zeros
        const pre = flags.includes('#') && 'oxX'.includes(conv) ? s.slice(0, 2) : '';
        s = sign + pre + '0'.repeat(pad) + s.slice(pre.length);
      } else s = ' '.repeat(pad) + sign + s;
    } else s = sign + s;
    out += s;
  }
  if (argidx < arglen && dict === null) raise('TypeError', 'not all arguments converted during string formatting');
  return out;
}

// ── textwrap (Lib/textwrap.py, default TextWrapper options) ──
const TW_WS = '[\\t\\n\\x0b\\x0c\\r ]';
const TW_NWS = '[^\\t\\n\\x0b\\x0c\\r ]';
const W = '[\\p{L}\\p{N}_]'; // \w for str patterns
const WP = '[\\p{L}\\p{N}_!"\'&.,?]'; // word_punct
const LT = '[\\p{L}\\p{Nl}\\p{No}_]'; // letter = [^\d\W]
const WORDSEP = new RegExp(
  `(${TW_WS}+`
  + `|(?<=${WP})-{2,}(?=${W})`
  + `|${TW_NWS}+?(?:-(?:(?<=${LT}{2}-)|(?<=${LT}-${LT}-))(?=${LT}-?${LT})|(?=${TW_WS}|$)|(?<=${WP})(?=-{2,}${W})))`,
  'u',
);

function twSplit(text) {
  // re.split with one capturing group, empty strings dropped
  const out = [];
  const re = new RegExp(WORDSEP.source, 'gu');
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[0] === '') { re.lastIndex += 1; continue; }
    out.push(text.slice(last, m.index));
    out.push(m[1]);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out.filter((c) => c);
}

function expandTabs(s, tabsize = 8) {
  let out = ''; let col = 0;
  for (const ch of s) {
    if (ch === '\t') { const n = tabsize - (col % tabsize); out += ' '.repeat(n); col += n; } else if (ch === '\n' || ch === '\r') { out += ch; col = 0; } else { out += ch; col += 1; }
  }
  return out;
}

export function textwrapWrap(text, width, { initialIndent = '', subsequentIndent = '' } = {}) {
  text = expandTabs(text).replace(/[\t\n\x0b\x0c\r]/g, ' ');
  const chunks = twSplit(text);
  const lines = [];
  if (width <= 0) raise('ValueError', `invalid width ${width} (must be > 0)`);
  chunks.reverse();
  while (chunks.length) {
    let curLine = [];
    let curLen = 0;
    const indent = lines.length ? subsequentIndent : initialIndent;
    const w = width - plen(indent);
    if (pyStrip(chunks[chunks.length - 1]) === '' && lines.length) chunks.pop();
    while (chunks.length) {
      const l = plen(chunks[chunks.length - 1]);
      if (curLen + l <= w) { curLine.push(chunks.pop()); curLen += l; } else break;
    }
    if (chunks.length && plen(chunks[chunks.length - 1]) > w) {
      // _handle_long_word
      const spaceLeft = w < 1 ? 1 : w - curLen;
      let end = spaceLeft;
      const chunk = chunks[chunks.length - 1];
      const ca = cps(chunk);
      if (ca.length > spaceLeft) {
        const hyphen = ca.slice(0, Math.max(spaceLeft, 0)).lastIndexOf('-');
        if (hyphen > 0 && ca.slice(0, hyphen).some((c) => c !== '-')) end = hyphen + 1;
      }
      curLine.push(ca.slice(0, Math.max(end, 0)).join(''));
      chunks[chunks.length - 1] = ca.slice(Math.max(end, 0)).join('');
      curLen = curLine.reduce((n, c) => n + plen(c), 0);
    }
    if (curLine.length && pyStrip(curLine[curLine.length - 1]) === '') {
      curLen -= plen(curLine[curLine.length - 1]);
      curLine.pop();
    }
    if (curLine.length) lines.push(indent + curLine.join(''));
    curLine = [];
  }
  return lines;
}

export const textwrapFill = (text, width, opts) => textwrapWrap(text, width, opts).join('\n');

// ── shlex.split (posix=True, whitespace_split=True) ──────────
// shlex.split(s, comments=False): with comments=True, '#' outside quotes
// starts a comment that runs to the end of the line (shlex reads the rest
// of the line with instream.readline()).
export function shlexSplit(s, { comments = false } = {}) {
  if (s === null || s === undefined) raise('ValueError', 's argument must not be None');
  const chars = cps(s);
  let pos = 0;
  const WS = ' \t\r\n';
  const QUOTES = '\'"';
  const isComment = (ch) => comments && ch === '#';
  // instream.readline(): skip past the next '\n' (or to the end)
  const readline = () => {
    while (pos < chars.length) { pos += 1; if (chars[pos - 1] === '\n') break; }
  };
  let state = ' ';
  const tokens = [];
  const readToken = () => {
    let quoted = false;
    let escapedstate = ' ';
    let token = '';
    for (;;) {
      const nextchar = pos < chars.length ? chars[pos++] : '';
      if (state === null) { token = ''; break; }
      if (state === ' ') {
        if (!nextchar) { state = null; break; }
        if (WS.includes(nextchar)) { if (token || quoted) break; continue; }
        if (isComment(nextchar)) { readline(); continue; }
        if (nextchar === '\\') { escapedstate = 'a'; state = nextchar; } else if (QUOTES.includes(nextchar)) state = nextchar;
        else { token = nextchar; state = 'a'; }
      } else if (QUOTES.includes(state)) {
        quoted = true;
        if (!nextchar) raise('ValueError', 'No closing quotation');
        if (nextchar === state) state = 'a';
        else if (nextchar === '\\' && state === '"') { escapedstate = state; state = nextchar; } else token += nextchar;
      } else if (state === '\\') {
        if (!nextchar) raise('ValueError', 'No escaped character');
        if (QUOTES.includes(escapedstate) && nextchar !== state && nextchar !== escapedstate) token += state;
        token += nextchar;
        state = escapedstate;
      } else if (state === 'a') {
        if (!nextchar) { state = null; break; }
        if (WS.includes(nextchar)) { state = ' '; if (token || quoted) break; continue; }
        if (isComment(nextchar)) { readline(); state = ' '; if (token || quoted) break; continue; }
        if (QUOTES.includes(nextchar)) state = nextchar;
        else if (nextchar === '\\') { escapedstate = 'a'; state = nextchar; } else token += nextchar;
      }
    }
    if (!quoted && token === '') return null;
    return token;
  };
  for (;;) {
    const t = readToken();
    if (t === null) break;
    tokens.push(t);
  }
  return tokens;
}

// ── io.StringIO, enough for print/redirect ──────────────────
export class StringIO {
  constructor() { this.buf = ''; }
  write(s) { this.buf += s; return plen(s); }
  getvalue() { return this.buf; }
}
