// utils/emulators/python/stdlib/sys/_pysys.js
//
// Shared pieces of the sys demos, modelled on CPython 3.13 (the version the
// demos are verified against). Not a content page (leading underscore), so
// the catalog generator never maps it.
//
//   intFromStr(s, limit)   int(s) for a str, base 10 — Objects/longobject.c
//                          PyLong_FromUnicodeObject + _PyLong_FromString,
//                          including the integer string conversion length
//                          limit (sys.set_int_max_str_digits)
//   setIntMaxStrDigits(n)  argument checks of sys.set_int_max_str_digits
//   setRecursionLimit(n)   argument checks of sys.setrecursionlimit
//   VERSION_INFO           sys.version_info of the modelled interpreter
//   tupleGe(a, b)          Python tuple >= on ints/strs
//   pyLiteralOf(v)         the Python value the demo's literal stands for

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

export const DEFAULT_MAX_STR_DIGITS = 4300; // sys.int_info.default_max_str_digits
export const STR_DIGITS_CHECK_THRESHOLD = 640; // sys.int_info.str_digits_check_threshold
export const DEFAULT_RECURSION_LIMIT = 1000;

// The demos run as CPython 3.13 (micro and serial do not matter for the
// (major, minor) comparisons the demos make).
export const VERSION_INFO = [3, 13, 3, 'final', 0];

const INT_MIN = -(2 ** 31);
const INT_MAX = 2 ** 31 - 1;

// C int conversion (PyLong_AsInt) of a demo number, after the literal the
// snippet shows for it is evaluated (pyLiteralOf).
export function asCInt(n) {
  const lit = pyLiteralOf(n);
  if (lit.kind === 'float') throw new PyException('TypeError', "'float' object cannot be interpreted as an integer");
  if (lit.kind === 'str') throw new PyException('TypeError', "'str' object cannot be interpreted as an integer");
  if (lit.value < BigInt(INT_MIN) || lit.value > BigInt(INT_MAX)) {
    throw new PyException('OverflowError', 'Python int too large to convert to C int');
  }
  return Number(lit.value);
}

// ── int(str) ─────────────────────────────────────────────────
// Characters above U+007F that str.isspace() accepts (Unicode 15.1).
const PY_SPACE_NON_ASCII = new Set([
  0x85, 0xa0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
  0x2007, 0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
]);
// Code point of DIGIT ZERO of every Unicode decimal-digit run (category Nd,
// unicodedata 15.1.0 as shipped with Python 3.13): each run is zero..zero+9.
const DECIMAL_ZEROS = [
  0x30, 0x660, 0x6F0, 0x7C0, 0x966, 0x9E6, 0xA66, 0xAE6, 0xB66, 0xBE6, 0xC66, 0xCE6, 0xD66, 0xDE6,
  0xE50, 0xED0, 0xF20, 0x1040, 0x1090, 0x17E0, 0x1810, 0x1946, 0x19D0, 0x1A80, 0x1A90, 0x1B50,
  0x1BB0, 0x1C40, 0x1C50, 0xA620, 0xA8D0, 0xA900, 0xA9D0, 0xA9F0, 0xAA50, 0xABF0, 0xFF10, 0x104A0,
  0x10D30, 0x11066, 0x110F0, 0x11136, 0x111D0, 0x112F0, 0x11450, 0x114D0, 0x11650, 0x116C0, 0x11730,
  0x118E0, 0x11950, 0x11C50, 0x11D50, 0x11DA0, 0x11F50, 0x16A60, 0x16AC0, 0x16B50, 0x1D7CE, 0x1D7D8,
  0x1D7E2, 0x1D7EC, 0x1D7F6, 0x1E140, 0x1E2F0, 0x1E4F0, 0x1E950, 0x1FBF0,
];
const decimalValue = (cp) => {
  for (const z of DECIMAL_ZEROS) if (cp >= z && cp <= z + 9) return cp - z;
  return -1;
};
// Py_ISSPACE: the ASCII whitespace the C parser skips
const C_SPACE = new Set([' ', '\t', '\n', '\x0b', '\x0c', '\r']);
const isAsciiDigit = (c) => c >= '0' && c <= '9';

// "%.200R": repr() cut to 200 code points
const repr200 = (s) => [...pyStrRepr(s)].slice(0, 200).join('');

export function limitMessage(limit, digits) {
  return digits === undefined
    ? `Exceeds the limit (${limit} digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit`
    : `Exceeds the limit (${limit} digits) for integer string conversion: value has ${digits} digits; use sys.set_int_max_str_digits() to increase the limit`;
}

// int(s) for a Python str s, base 10, under the given max_str_digits
// (0 = no limit). Returns a BigInt or throws ValueError like CPython.
export function intFromStr(s, limit = DEFAULT_MAX_STR_DIGITS) {
  const invalid = () => new PyException('ValueError', `invalid literal for int() with base 10: ${repr200(s)}`);
  // _PyUnicode_TransformDecimalAndSpaceToASCII: non-ASCII whitespace → ' ',
  // non-ASCII decimal digits → their ASCII digit, anything else non-ASCII → '?'
  let t = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp < 128) t += ch;
    else if (PY_SPACE_NON_ASCII.has(cp)) t += ' ';
    else {
      const d = decimalValue(cp);
      t += d >= 0 ? String(d) : '?';
    }
  }
  // The C parser works on a NUL-terminated buffer: it stops at the first NUL.
  const nul = t.indexOf('\0');
  const c = nul === -1 ? t : t.slice(0, nul);

  let i = 0;
  while (i < c.length && C_SPACE.has(c[i])) i += 1;
  let neg = false;
  if (c[i] === '+' || c[i] === '-') { neg = c[i] === '-'; i += 1; }
  // digits, single underscores only between two digits
  let digits = '';
  if (!isAsciiDigit(c[i] || '')) throw invalid();
  while (i < c.length) {
    if (isAsciiDigit(c[i])) { digits += c[i]; i += 1; continue; }
    if (c[i] === '_' && isAsciiDigit(c[i + 1] || '')) { i += 1; continue; }
    break;
  }
  while (i < c.length && C_SPACE.has(c[i])) i += 1;
  if (i !== c.length) throw invalid();
  // the digit limit is checked once the syntax is known to be valid
  if (limit > 0 && digits.length > limit) {
    throw new PyException('ValueError', limitMessage(limit, digits.length));
  }
  // a NUL inside the str: the C parser succeeded on the part before it,
  // the full string is still not a valid literal
  if (nul !== -1) throw invalid();
  const v = BigInt(digits);
  return neg ? -v : v;
}

// str(n) for an int under the limit: digits counted without the sign.
export function intToStr(n, limit = DEFAULT_MAX_STR_DIGITS) {
  const s = String(n);
  const digits = s.replace('-', '').length;
  if (limit > 0 && digits > limit) throw new PyException('ValueError', limitMessage(limit));
  return s;
}

// sys.set_int_max_str_digits(n) → the new limit, or raises like CPython.
export function setIntMaxStrDigits(n) {
  const v = asCInt(n);
  if (v !== 0 && v < STR_DIGITS_CHECK_THRESHOLD) {
    throw new PyException('ValueError', `maxdigits must be 0 or larger than ${STR_DIGITS_CHECK_THRESHOLD}`);
  }
  return v;
}

// sys.setrecursionlimit(n) called from a top-level script (recursion depth 1).
export function setRecursionLimit(n, depth = 1) {
  const v = asCInt(n);
  if (v < 1) throw new PyException('ValueError', 'recursion limit must be greater or equal than 1');
  if (v <= depth) {
    throw new PyException('RecursionError', `cannot set the recursion limit to ${v} at the recursion depth ${depth}: the limit is too low`);
  }
  return v;
}

// ── tuples and literals ──────────────────────────────────────
const cmp = (a, b) => {
  if (typeof a !== typeof b) {
    const tn = (x) => (typeof x === 'string' ? 'str' : 'int');
    throw new PyException('TypeError', `'<' not supported between instances of '${tn(a)}' and '${tn(b)}'`);
  }
  return a < b ? -1 : a > b ? 1 : 0;
};
// Python a >= b for two tuples of ints/strs (lexicographic, shorter-is-smaller)
export function tupleGe(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    if (a[i] === b[i]) continue;
    return cmp(a[i], b[i]) > 0;
  }
  return a.length >= b.length;
}

// The Python value a coerced 'auto'/'number' demo argument stands for. The
// snippet shows a number as pyRepr(v): String(v), except that infinities
// print as inf / -inf — a name, not a literal, so Python raises NameError
// (the closest builtin it suggests is int).
export function pyLiteralOf(v) {
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) {
      throw new PyException('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
    }
    const lit = String(v);
    if (/[.e]/.test(lit)) return { kind: 'float', value: v, repr: pyFloatRepr(v) };
    return { kind: 'int', value: BigInt(lit), repr: lit };
  }
  return { kind: 'str', value: v, repr: pyStrRepr(v) };
}
