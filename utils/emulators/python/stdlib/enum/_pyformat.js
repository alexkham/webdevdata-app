// utils/emulators/python/stdlib/enum/_pyformat.js
//
// format() for the two data types enum mixes in, ported from CPython 3.13
// Python/formatter_unicode.c:
//   formatInt(n, spec, typeName, strOf)  int.__format__  (b c d o x X n, and
//                                        e E f F g G % through float())
//   formatStr(s, spec, typeName)         str.__format__
// typeName is type(obj).__name__ — the error messages name the enum class
// ('Unknown format code 's' for object of type 'Priority'').
//
// Locale: CPython starts with LC_NUMERIC = "C", where 'n' has no grouping
// and '.' as decimal point — so 'n' behaves like 'd' here, as it does in a
// fresh interpreter.
//
// Float presentation types on an int: the int is converted to float first
// (correctly rounded, OverflowError when too large). Every such double is an
// integer, so its exact decimal expansion is a BigInt and the rounding of
// PyOS_double_to_string (round-half-even on the exact value) is done
// exactly here.

import { PyException } from '../../../../py-exceptions.js';

const raise = (type, msg = '') => { throw new PyException(type, msg); };

// Output larger than this stops the browser demo (CPython would build it).
export const DEMO_MAX_CHARS = 100000;
const demoLimit = () => raise('DemoLimit', 'the browser demo stops at 100,000 characters (CPython would build the whole string)');

const LT_NO_LOCALE = 0;
const LT_DEFAULT_LOCALE = 0x2c; // ','
const LT_UNDERSCORE_LOCALE = 0x5f; // '_'
const LT_UNDER_FOUR_LOCALE = 1000;
const LT_CURRENT_LOCALE = 1001;

const SSIZE_MAX = (1n << 63n) - 1n;
const ND = /\p{Nd}/u;

// Value of a Unicode decimal digit (Nd digits come in contiguous runs of 10,
// 0 to 9), -1 for anything else.
function decimalValue(cp) {
  if (cp >= 0x30 && cp <= 0x39) return cp - 0x30;
  const ch = String.fromCodePoint(cp);
  if (!ND.test(ch)) return -1;
  let n = 0;
  let c = cp - 1;
  while (c >= 0 && ND.test(String.fromCodePoint(c))) { n += 1; c -= 1; }
  return n % 10;
}

// get_integer(): [value, newPos, consumed]
function getInteger(cps, pos, end) {
  let acc = 0n;
  let n = 0;
  for (; pos < end; pos++, n++) {
    const d = decimalValue(cps[pos]);
    if (d < 0) break;
    if (acc > (SSIZE_MAX - BigInt(d)) / 10n) raise('ValueError', 'Too many decimal digits in format string');
    acc = acc * 10n + BigInt(d);
  }
  return [acc, pos, n];
}

const isAlign = (c) => c === 0x3c || c === 0x3e || c === 0x3d || c === 0x5e; // < > = ^
const isSign = (c) => c === 0x20 || c === 0x2b || c === 0x2d; // space + -
const chr = (c) => String.fromCodePoint(c);
const typeText = (t) => (t > 32 && t < 128 ? chr(t) : `\\x${t.toString(16)}`);

// parse_internal_render_format_spec
function parseSpec(spec, typeName, defaultType, defaultAlign) {
  const cps = Array.from(spec, (c) => c.codePointAt(0));
  const end = cps.length;
  let pos = 0;
  const f = {
    fill: 0x20, align: defaultAlign, alternate: false, noNeg0: false, sign: 0,
    width: -1n, thousands: LT_NO_LOCALE, precision: -1n, type: defaultType,
  };
  let alignSpecified = false;
  let fillSpecified = false;
  if (end - pos >= 2 && isAlign(cps[pos + 1])) {
    f.align = cps[pos + 1]; f.fill = cps[pos]; fillSpecified = true; alignSpecified = true; pos += 2;
  } else if (end - pos >= 1 && isAlign(cps[pos])) {
    f.align = cps[pos]; alignSpecified = true; pos += 1;
  }
  if (end - pos >= 1 && isSign(cps[pos])) { f.sign = cps[pos]; pos += 1; }
  if (end - pos >= 1 && cps[pos] === 0x7a) { f.noNeg0 = true; pos += 1; } // z
  if (end - pos >= 1 && cps[pos] === 0x23) { f.alternate = true; pos += 1; } // #
  if (!fillSpecified && end - pos >= 1 && cps[pos] === 0x30) {
    f.fill = 0x30;
    if (!alignSpecified && defaultAlign === 0x3e) f.align = 0x3d;
    pos += 1;
  }
  let consumed;
  [f.width, pos, consumed] = getInteger(cps, pos, end);
  if (consumed === 0) f.width = -1n;
  if (end - pos && cps[pos] === 0x2c) { f.thousands = LT_DEFAULT_LOCALE; pos += 1; }
  if (end - pos && cps[pos] === 0x5f) {
    if (f.thousands !== LT_NO_LOCALE) raise('ValueError', "Cannot specify both ',' and '_'.");
    f.thousands = LT_UNDERSCORE_LOCALE; pos += 1;
  }
  if (end - pos && cps[pos] === 0x2c && f.thousands === LT_UNDERSCORE_LOCALE) {
    raise('ValueError', "Cannot specify both ',' and '_'.");
  }
  if (end - pos && cps[pos] === 0x2e) {
    pos += 1;
    [f.precision, pos, consumed] = getInteger(cps, pos, end);
    if (consumed === 0) raise('ValueError', 'Format specifier missing precision');
  }
  if (end - pos > 1) raise('ValueError', `Invalid format specifier '${spec}' for object of type '${typeName}'`);
  if (end - pos === 1) { f.type = cps[pos]; pos += 1; }
  if (f.thousands) {
    const t = f.type;
    // d e f g E G % F and "no type" (0)
    if ([0x64, 0x65, 0x66, 0x67, 0x45, 0x47, 0x25, 0x46, 0].includes(t)) {
      // allowed (PEP 378)
    } else if ([0x62, 0x6f, 0x78, 0x58].includes(t) && f.thousands === LT_UNDERSCORE_LOCALE) {
      f.thousands = LT_UNDER_FOUR_LOCALE; // every four digits in bin/oct/hex (PEP 515)
    } else {
      raise('ValueError', `Cannot specify '${chr(f.thousands)}' with '${typeText(t)}'.`);
    }
  }
  return f;
}

function unknownType(t, typeName) {
  raise('ValueError', `Unknown format code '${typeText(t)}' for object of type '${typeName}'`);
}

// get_locale_info → [thousandsSep, grouping] (grouping: group size, 0 = none)
function localeInfo(kind) {
  if (kind === LT_DEFAULT_LOCALE) return [',', 3];
  if (kind === LT_UNDERSCORE_LOCALE) return ['_', 3];
  if (kind === LT_UNDER_FOUR_LOCALE) return ['_', 4];
  return ['', 0]; // LT_NO_LOCALE, and LT_CURRENT_LOCALE in the "C" locale
}

// _PyUnicode_InsertThousandsGrouping with a single repeating group size;
// digits is an array of characters.
// Groups are filled right to left: each is its digits with zero padding on
// the left (the zeros make up min_width for '0'/'=' padding), separators go
// between groups.
function groupDigits(digits, minWidth, sep, group) {
  minWidth = Math.max(0, minWidth);
  const chunks = [];
  let remaining = digits.length;
  let dpos = digits.length;
  let broken = false;
  const take = (len) => {
    const nZeros = Math.max(0, len - remaining);
    const nChars = Math.max(0, Math.min(remaining, len));
    chunks.push('0'.repeat(nZeros) + digits.slice(dpos - nChars, dpos).join(''));
    dpos -= nChars;
    return nChars;
  };
  if (group > 0) {
    for (;;) {
      const len = Math.min(group, Math.max(remaining, minWidth, 1));
      remaining -= take(len);
      minWidth -= len;
      if (remaining <= 0 && minWidth <= 0) { broken = true; break; }
      minWidth -= sep.length;
    }
  }
  if (!broken) take(Math.max(remaining, minWidth, 1));
  return chunks.reverse().join(sep);
}

// calc_number_widths + fill_number.
//   signChar: '-' or '' (sign of the number), prefix: '0x' etc. (already in
//   its final case), digits: integer digits (array of chars), decimal: '.' or
//   '', remainder: text after the decimal point (or exponent part).
function assembleNumber(f, signChar, prefix, digits, decimal, remainder, sep, group) {
  let sign = '';
  if (f.sign === 0x2b) sign = signChar === '-' ? '-' : '+';
  else if (f.sign === 0x20) sign = signChar === '-' ? '-' : ' ';
  else if (signChar === '-') sign = '-';
  const nonDigit = sign.length + prefix.length + decimal.length + [...remainder].length;
  const width = Number(f.width);
  const minWidth = f.fill === 0x30 && f.align === 0x3d ? width - nonDigit : 0;
  if (width > DEMO_MAX_CHARS) demoLimit();
  const grouped = digits.length === 0 ? '' : groupDigits(digits, minWidth, sep, group);
  const padding = width - (nonDigit + grouped.length);
  let lpad = 0;
  let spad = 0;
  let rpad = 0;
  if (padding > 0) {
    if (f.align === 0x3c) rpad = padding;
    else if (f.align === 0x5e) { lpad = Math.floor(padding / 2); rpad = padding - lpad; } else if (f.align === 0x3d) spad = padding;
    else lpad = padding;
  }
  const fc = chr(f.fill);
  return fc.repeat(lpad) + sign + prefix + fc.repeat(spad) + grouped + decimal + remainder + fc.repeat(rpad);
}

// ── exact decimal formatting of an integer-valued double ─────
// Round the non-negative integer m (BigInt) to `sig` significant digits,
// half-even. Returns [digitString, exponent] with digitString of length sig
// (exponent = position of the first digit, as in d.ddd × 10^exponent).
function roundSig(m, sig) {
  if (m === 0n) return ['0'.repeat(sig), 0];
  const s = m.toString();
  let exp = s.length - 1;
  if (s.length <= sig) return [s + '0'.repeat(sig - s.length), exp];
  let head = BigInt(s.slice(0, sig));
  const rest = s.slice(sig);
  const first = rest.charCodeAt(0) - 48;
  const tailNonZero = /[1-9]/.test(rest.slice(1));
  if (first > 5 || (first === 5 && (tailNonZero || head % 2n === 1n))) head += 1n;
  let hs = head.toString();
  if (hs.length > sig) { hs = hs.slice(0, sig); exp += 1; }
  return [hs, exp];
}

const expText = (e, upper) => `${upper ? 'E' : 'e'}${e < 0 ? '-' : '+'}${String(Math.abs(e)).padStart(2, '0')}`;

// PyOS_double_to_string(val, type, precision, flags) for an integer value
// m >= 0 (the sign is handled by the caller). type: 'e' 'E' 'f' 'F' 'g' 'G'.
function doubleToString(m, type, precision, alt) {
  const upper = type === 'E' || type === 'G';
  const t = type.toLowerCase();
  if (t === 'f') {
    return m.toString() + (precision > 0 ? '.' + '0'.repeat(precision) : alt ? '.' : '');
  }
  if (t === 'e') {
    const [d, e] = roundSig(m, precision + 1);
    const frac = d.slice(1);
    return d[0] + (frac.length ? '.' + frac : alt ? '.' : '') + expText(e, upper);
  }
  // 'g'
  const p = precision === 0 ? 1 : precision;
  const [d, e] = roundSig(m, p);
  if (e >= -4 && e < p) {
    // fixed: p significant digits, e+1 of them before the point
    let intPart = d.slice(0, e + 1);
    let frac = d.slice(e + 1);
    if (intPart.length < e + 1) intPart += '0'.repeat(e + 1 - intPart.length);
    if (!alt) frac = frac.replace(/0+$/, '');
    return intPart + (frac.length ? '.' + frac : alt ? '.' : '');
  }
  let frac = d.slice(1);
  if (!alt) frac = frac.replace(/0+$/, '');
  return d[0] + (frac.length ? '.' + frac : alt ? '.' : '') + expText(e, upper);
}

// int.__format__(n, spec). strOf() gives str(obj) for the empty spec
// (format_obj): for an IntEnum member that is its own __str__.
export function formatInt(n, spec, typeName = 'int', strOf = null) {
  if (spec === '') return strOf ? strOf() : n.toString();
  const f = parseSpec(spec, typeName, 0x64, 0x3e);
  const t = f.type;
  if ([0x62, 0x63, 0x64, 0x6f, 0x78, 0x58, 0x6e].includes(t)) return formatLong(n, f);
  if ([0x65, 0x45, 0x66, 0x46, 0x67, 0x47, 0x25].includes(t)) return formatFloatOfInt(n, f);
  return unknownType(t, typeName);
}

function formatLong(n, f) {
  if (f.precision !== -1n) raise('ValueError', 'Precision not allowed in integer format specifier');
  if (f.noNeg0) raise('ValueError', 'Negative zero coercion (z) not allowed in integer format specifier');
  if (f.type === 0x63) { // 'c'
    if (f.sign !== 0) raise('ValueError', "Sign not allowed with integer format specifier 'c'");
    if (f.alternate) raise('ValueError', "Alternate form (#) not allowed with integer format specifier 'c'");
    if (n > 9223372036854775807n || n < -9223372036854775808n) raise('OverflowError', 'Python int too large to convert to C long');
    if (n < 0n || n > 0x10ffffn) raise('OverflowError', '%c arg not in range(0x110000)');
    return assembleNumber(f, '', '', [], '', chr(Number(n)), '', 0);
  }
  let base = 10;
  let prefix = '';
  if (f.type === 0x62) { base = 2; prefix = '0b'; } else if (f.type === 0x6f) { base = 8; prefix = '0o'; } else if (f.type === 0x78 || f.type === 0x58) { base = 16; prefix = '0x'; }
  const neg = n < 0n;
  let digits = (neg ? -n : n).toString(base);
  if (f.type === 0x58) { digits = digits.toUpperCase(); prefix = prefix.toUpperCase(); }
  if (!f.alternate) prefix = '';
  const kind = f.type === 0x6e ? LT_CURRENT_LOCALE : f.thousands;
  const [sep, group] = localeInfo(kind);
  return assembleNumber(f, neg ? '-' : '', prefix, [...digits], '', '', sep, group);
}

function formatFloatOfInt(n, f) {
  if (f.precision > 2147483647n) raise('ValueError', 'precision too big');
  let val = Number(n);
  if (!Number.isFinite(val)) raise('OverflowError', 'int too large to convert to float');
  let type = chr(f.type);
  let precision = Number(f.precision);
  let pct = false;
  if (type === '%') { type = 'f'; val *= 100; pct = true; }
  if (precision < 0) precision = 6;
  if (precision > DEMO_MAX_CHARS) demoLimit();
  const neg = val < 0;
  const m = BigInt(Math.abs(val)); // exact: every double this large is an integer
  let body = doubleToString(m, type, precision, f.alternate);
  if (pct) body += '%';
  // parse_number: integer digits, then '.' (decimal) and the remainder
  let i = 0;
  while (i < body.length && body[i] >= '0' && body[i] <= '9') i += 1;
  const digits = [...body.slice(0, i)];
  let decimal = '';
  let rem = body.slice(i);
  if (rem[0] === '.') { decimal = '.'; rem = rem.slice(1); }
  const [sep, group] = localeInfo(f.thousands);
  return assembleNumber(f, neg ? '-' : '', '', digits, decimal, rem, sep, group);
}

// str.__format__(s, spec). For a str SUBCLASS (a StrEnum member) CPython
// hands back the object itself when the spec changes nothing (no width or
// precision that applies) — `self` is returned in that case; the empty spec
// gives str(obj) (strOf). Plain str callers pass self = null.
export function formatStr(s, spec, typeName = 'str', self = null, strOf = null) {
  if (spec === '') return strOf ? strOf() : s;
  const f = parseSpec(spec, typeName, 0x73, 0x3c);
  if (f.type !== 0x73) unknownType(f.type, typeName);
  if (f.sign !== 0) raise('ValueError', f.sign === 0x20 ? 'Space not allowed in string format specifier' : 'Sign not allowed in string format specifier');
  if (f.noNeg0) raise('ValueError', 'Negative zero coercion (z) not allowed in string format specifier');
  if (f.alternate) raise('ValueError', 'Alternate form (#) not allowed in string format specifier');
  if (f.align === 0x3d) raise('ValueError', "'=' alignment not allowed in string format specifier");
  const cps = Array.from(s);
  let len = BigInt(cps.length);
  if ((f.width === -1n || f.width <= len) && (f.precision === -1n || f.precision >= len)) {
    // _PyUnicodeWriter_WriteStr keeps the object itself — unless it is empty
    return self !== null && cps.length > 0 ? self : s;
  }
  if (f.precision >= 0n && len >= f.precision) len = f.precision;
  const total = f.width >= 0n && f.width > len ? f.width : len;
  if (total > BigInt(DEMO_MAX_CHARS)) demoLimit();
  let lpad;
  if (f.align === 0x3e) lpad = total - len;
  else if (f.align === 0x5e) lpad = (total - len) / 2n;
  else lpad = 0n;
  const rpad = total - len - lpad;
  const fc = chr(f.fill);
  return fc.repeat(Number(lpad)) + cps.slice(0, Number(len)).join('') + fc.repeat(Number(rpad));
}
