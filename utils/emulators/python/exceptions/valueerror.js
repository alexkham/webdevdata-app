// utils/emulators/python/exceptions/valueerror.js
//
// Emulator for the ValueError demo modes, plus the small Python-semantics
// helpers the type-value pages share (typeerror.js and the unicode pages
// import them from here):
//   strRepr(s)      — repr(str) exactly as CPython prints it (escapes
//                     non-printable characters, picks the quote style)
//   floatRepr(x)    — repr(float): shortest round-trip digits, 1e+16 style
//   pyValue(v)      — classify a demo argument as a Python int/float/str
//                     the way its literal appears in the snippet
//   intFromStr(s)   — int(s) for a str, with CPython's parsing rules and
//                     ValueError messages (Unicode digits/spaces, '_'
//                     separators, 4300-digit limit, 200-char repr cut)

import { raise } from '../../../py-exceptions.js';

// ── repr(str) ──────────────────────────────────────────────────
// str.isprintable() is False for categories Cc Cf Cs Co Cn Zl Zp Zs,
// except the ASCII space. repr() escapes exactly those characters.
const NON_PRINTABLE = /[\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}\p{Zl}\p{Zp}\p{Zs}]/u;

const hex = (n, w) => n.toString(16).padStart(w, '0');

export function escapeCodePoint(cp) {
  if (cp <= 0xff) return '\\x' + hex(cp, 2);
  if (cp <= 0xffff) return '\\u' + hex(cp, 4);
  return '\\U' + hex(cp, 8);
}

// Code points of a JS string. A lone surrogate stays a single code point,
// the way CPython would hold it.
export function codePoints(s) {
  const out = [];
  for (const ch of s) out.push(ch.codePointAt(0));
  return out;
}

export function strRepr(s) {
  const useDouble = s.includes("'") && !s.includes('"');
  const q = useDouble ? '"' : "'";
  let body = '';
  for (const cp of codePoints(s)) {
    const ch = String.fromCodePoint(cp);
    if (ch === '\\') body += '\\\\';
    else if (ch === q) body += '\\' + q;
    else if (ch === '\t') body += '\\t';
    else if (ch === '\n') body += '\\n';
    else if (ch === '\r') body += '\\r';
    else if (cp < 0x20 || cp === 0x7f) body += '\\x' + hex(cp, 2);
    else if (cp < 0x7f) body += ch;
    else if (cp >= 0xd800 && cp <= 0xdfff) body += escapeCodePoint(cp);
    else if (NON_PRINTABLE.test(ch)) body += escapeCodePoint(cp);
    else body += ch;
  }
  return q + body + q;
}

// ── repr(float) ────────────────────────────────────────────────
export function floatRepr(x) {
  if (Number.isNaN(x)) return 'nan';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const sign = x < 0 ? '-' : '';
  const [mant, expStr] = Math.abs(x).toExponential().split('e');
  const digits = mant.replace('.', '');
  const exp = parseInt(expStr, 10);
  if (exp >= -4 && exp < 16) {
    if (exp < 0) return sign + '0.' + '0'.repeat(-exp - 1) + digits;
    const intPart = digits.slice(0, exp + 1).padEnd(exp + 1, '0');
    const frac = digits.slice(exp + 1);
    return sign + intPart + '.' + (frac || '0');
  }
  const m = digits.length > 1 ? digits[0] + '.' + digits.slice(1) : digits;
  const e = (exp < 0 ? '-' : '+') + String(Math.abs(exp)).padStart(2, '0');
  return sign + m + 'e' + e;
}

// ── demo argument → Python value ──────────────────────────────
// An 'auto' argument is put into the snippet as pyRepr(v): integral JS
// numbers below 1e21 print as plain digits (a Python int), anything else
// as a float literal, and ±Infinity as `inf` — which is a NameError in
// Python source.
export function pyValue(v) {
  if (typeof v === 'string') return { t: 'str', v };
  if (typeof v === 'bigint') return { t: 'int', v };
  if (v === null || v === undefined) return { t: 'NoneType', v: null };
  if (!Number.isFinite(v)) return raise('NameError', `name '${Number.isNaN(v) ? 'nan' : 'inf'}' is not defined`);
  if (Number.isInteger(v) && Math.abs(v) < 1e21) return { t: 'int', v: BigInt(String(v)) };
  return { t: 'float', v };
}

// repr() of a classified value, wrapped so the demo prints it verbatim
export function reprOf(p) {
  if (p.t === 'str') return strRepr(p.v);
  if (p.t === 'int') return p.v.toString();
  if (p.t === 'float') return floatRepr(p.v);
  return 'None';
}
export const raw = (text) => ({ __pyRaw: text });

// ── int(str) ───────────────────────────────────────────────────
// Non-ASCII whitespace (Py_UNICODE_ISSPACE) becomes ' ', any Unicode
// decimal digit becomes its ASCII digit, other non-ASCII → invalid.
// ASCII characters are kept as-is, and PyLong_FromString only skips
// ASCII whitespace — so '\x1c' (a str.isspace() char) is NOT allowed.
const UNI_SPACE = new Set([0x85, 0xa0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
  0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000]);
const ASCII_SPACE = new Set([' ', '\t', '\n', '\r', '\x0b', '\x0c']);
const IS_ND = /^\p{Nd}$/u;

function decimalValue(cp) {
  // Nd digits come in runs of ten starting at a zero; find the run start
  let z = cp;
  while (z > 0 && IS_ND.test(String.fromCodePoint(z - 1))) z -= 1;
  return (cp - z) % 10;
}

const INT_MAX_STR_DIGITS = 4300;

export function intFromStr(s) {
  const invalid = () => {
    // "%.200R": the repr is cut to its first 200 characters
    const r = codePoints(strRepr(s)).slice(0, 200).map((c) => String.fromCodePoint(c)).join('');
    return raise('ValueError', `invalid literal for int() with base 10: ${r}`);
  };
  let t = '';
  for (const cp of codePoints(s)) {
    if (cp < 0x80) t += String.fromCharCode(cp);
    else if (UNI_SPACE.has(cp)) t += ' ';
    else if (IS_ND.test(String.fromCodePoint(cp))) t += String(decimalValue(cp));
    else t += '?';
  }
  let i = 0;
  while (i < t.length && ASCII_SPACE.has(t[i])) i += 1;
  let neg = false;
  if (t[i] === '+' || t[i] === '-') { neg = t[i] === '-'; i += 1; }
  let digits = '';
  let prevDigit = false;
  for (; i < t.length; i += 1) {
    const c = t[i];
    if (c >= '0' && c <= '9') { digits += c; prevDigit = true; }
    else if (c === '_' && prevDigit && t[i + 1] >= '0' && t[i + 1] <= '9') { prevDigit = false; }
    else break;
  }
  while (i < t.length && ASCII_SPACE.has(t[i])) i += 1;
  if (digits === '' || i !== t.length) return invalid();
  if (digits.length > INT_MAX_STR_DIGITS) {
    return raise('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${digits.length} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  const n = BigInt(digits);
  return neg ? -n : n;
}

// ── the demo modes ─────────────────────────────────────────────
const setPercent = (arg) => {
  const p = pyValue(arg);
  if (p.t === 'str') {
    // 0 <= p is evaluated first: int vs str cannot be ordered
    return raise('TypeError', "'<=' not supported between instances of 'int' and 'str'");
  }
  const num = p.t === 'int' ? Number(p.v) : p.v;
  const inRange = p.t === 'int' ? (p.v >= 0n && p.v <= 100n) : (num >= 0 && num <= 100);
  if (!inRange) {
    return raise('ValueError', `percent must be 0-100, got ${reprOf(p)}`);
  }
  return raw(floatRepr(num / 100));
};

export default {
  trigger: (text) => raw(intFromStr(text).toString()),

  raise: (p) => setPercent(p),

  handle: (line) => {
    const parts = line.split(',');
    try {
      if (parts.length > 2) raise('ValueError', 'too many values to unpack (expected 2)');
      if (parts.length < 2) raise('ValueError', `not enough values to unpack (expected 2, got ${parts.length})`);
      const [name, qty] = parts;
      return { __pyTuple: [raw(strRepr(name)), raw(intFromStr(qty).toString())] };
    } catch (e) {
      if (e.name !== 'ValueError') throw e;
      return raw(strRepr(`skipped: ${e.message}`));
    }
  },
};
