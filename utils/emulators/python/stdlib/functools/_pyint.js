// utils/emulators/python/stdlib/functools/_pyint.js
//
// Port of CPython 3.13's int(str, base) for the functools demos (partial
// with base=, total_ordering on version strings): PyLong_FromUnicodeObject
// → _PyUnicode_TransformDecimalAndSpaceToASCII → PyLong_FromString →
// long_from_string_base (Objects/longobject.c, Objects/unicodeobject.c).
// Not a content page (leading underscore), so the catalog generator never
// maps it.
//
// pyIntFromStr(text, base) → bigint, or throws ValueError with CPython's
// exact message (invalid literal / base range / 4300-digit limit).

import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

const raise = (type, msg) => { throw new PyException(type, msg); };

// Unicode 15.1 (Python 3.13's database): the code points with decimal
// value 0; every decimal digit is zero + value, in runs of ten.
const ZEROS = [
  0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xde6,
  0xe50, 0xed0, 0xf20, 0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0,
  0x1c40, 0x1c50, 0xa620, 0xa8d0, 0xa900, 0xa9d0, 0xa9f0, 0xaa50, 0xabf0, 0xff10, 0x104a0, 0x10d30,
  0x11066, 0x110f0, 0x11136, 0x111d0, 0x112f0, 0x11450, 0x114d0, 0x11650, 0x116c0, 0x11730, 0x118e0,
  0x11950, 0x11c50, 0x11d50, 0x11da0, 0x11f50, 0x16a60, 0x16ac0, 0x16b50, 0x1d7ce, 0x1d7d8, 0x1d7e2,
  0x1d7ec, 0x1d7f6, 0x1e140, 0x1e2f0, 0x1e4f0, 0x1e950, 0x1fbf0,
];
function toDecimal(cp) {
  for (const z of ZEROS) if (cp >= z && cp < z + 10) return cp - z;
  return -1;
}

// str.isspace() code points (Py_UNICODE_ISSPACE)
const UNI_SPACE = new Set([
  0x9, 0xa, 0xb, 0xc, 0xd, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x85, 0xa0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
]);

// _PyUnicode_TransformDecimalAndSpaceToASCII: ASCII strings unchanged;
// otherwise spaces → ' ', decimal digits → '0'..'9', and the first other
// non-ASCII character → '?' (the result ends there).
function toAscii(s) {
  const cps = [...s].map((c) => c.codePointAt(0));
  if (cps.every((c) => c < 128)) return s;
  let out = '';
  for (const ch of cps) {
    if (ch < 127) out += String.fromCharCode(ch);
    else if (UNI_SPACE.has(ch)) out += ' ';
    else {
      const d = toDecimal(ch);
      if (d < 0) return out + '?';
      out += String(d);
    }
  }
  return out;
}

const ASCII_SPACE = ' \t\n\v\f\r';
const isSpace = (c) => c !== undefined && c !== '' && ASCII_SPACE.includes(c);
function digitValue(c) {
  if (c === undefined) return 37;
  const k = c.charCodeAt(0);
  if (k >= 48 && k <= 57) return k - 48;
  if (k >= 97 && k <= 122) return k - 87;
  if (k >= 65 && k <= 90) return k - 55;
  return 37;
}

export const INT_MAX_STR_DIGITS = 4300;

// PyLong_FromString on the transformed text: { value } or { error: true }
// (a syntax error) — the digit-limit ValueError is thrown directly.
function fromString(text, base0) {
  // the C string ends at the first NUL
  const nul = text.indexOf('\0');
  const s = nul === -1 ? text : text.slice(0, nul);
  let i = 0;
  let base = base0;
  let sign = 1n;
  let errorIfNonzero = false;
  while (i < s.length && isSpace(s[i])) i++;
  if (s[i] === '+') i++;
  else if (s[i] === '-') {
    i++;
    sign = -1n;
  }
  const lo = (c) => (c === undefined ? '' : c.toLowerCase());
  if (base === 0) {
    if (s[i] !== '0') base = 10;
    else if (lo(s[i + 1]) === 'x') base = 16;
    else if (lo(s[i + 1]) === 'o') base = 8;
    else if (lo(s[i + 1]) === 'b') base = 2;
    else {
      errorIfNonzero = true;
      base = 10;
    }
  }
  if (s[i] === '0' && ((base === 16 && lo(s[i + 1]) === 'x') || (base === 8 && lo(s[i + 1]) === 'o') || (base === 2 && lo(s[i + 1]) === 'b'))) {
    i += 2;
    if (s[i] === '_') i++;
  }
  // long_from_string_base
  const start = i;
  if (s[start] === '_') return { error: true };
  let prev = '';
  let digits = 0;
  let p = start;
  while (p < s.length && (digitValue(s[p]) < base || s[p] === '_')) {
    if (s[p] === '_') {
      if (prev === '_') return { error: true };
    } else digits++;
    prev = s[p];
    p++;
  }
  if (prev === '_') return { error: true };
  const end = p;
  if (start === end) return { error: true };
  while (p < s.length && isSpace(s[p])) p++;
  if (p < s.length) return { error: true };
  const isBinaryBase = (base & (base - 1)) === 0;
  if (!isBinaryBase && digits > 640 && digits > INT_MAX_STR_DIGITS) {
    raise('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${digits} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  let v = 0n;
  const b = BigInt(base);
  for (let k = start; k < end; k++) {
    if (s[k] !== '_') v = v * b + BigInt(digitValue(s[k]));
  }
  if (errorIfNonzero && v !== 0n) return { error: true };
  // a NUL cut the string short: the parse did not reach the real end
  if (nul !== -1) return { error: true };
  return { value: sign * v };
}

// "%.200R": the repr, cut to 200 code points
const repr200 = (s) => [...pyStrRepr(s)].slice(0, 200).join('');

// int(text, base) for a str text and an int base (bigint or number)
export function pyIntFromStr(text, base = 10n) {
  const b = BigInt(base);
  if (b !== 0n && (b < 2n || b > 36n)) raise('ValueError', 'int() base must be >= 2 and <= 36, or 0');
  const r = fromString(toAscii(text), Number(b));
  if (r.error) raise('ValueError', `invalid literal for int() with base ${b}: ${repr200(text)}`);
  return r.value;
}
