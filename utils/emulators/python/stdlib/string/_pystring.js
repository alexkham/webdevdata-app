// utils/emulators/python/stdlib/string/_pystring.js
//
// Port of CPython 3.13's Lib/string.py — the constants, capwords(),
// Template and Formatter — plus the C pieces they lean on:
//   str.split / str.capitalize / str.splitlines   (Objects/unicodeobject.c)
//   _string.formatter_parser / formatter_field_name_split
//                                                  (Objects/stringlib/unicode_format.h)
//   str.__format__ (format(s, spec) for a str)     (Python/formatter_unicode.c)
// Shared by the string module hub and member emulators. Not a content page
// (leading underscore), so the catalog generator never maps it.
//
// Value model: a Python str is a JS string; strings are indexed by CODE
// POINT (Array.from), like Python. Formatter field values are strs. A tuple
// result is { __pyTuple: [...] }, None is null. Character data comes from
// _unidata.js (generated from CPython), not from the browser's Unicode.
//
// Known edge: '{name.upper}' on a str value formats a bound method, whose
// repr contains a memory address — non-deterministic in CPython itself; the
// emulator shows 'at 0x...' in its place.

import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import {
  LOWER_RUNS, LOWER_MULTI, TITLE_RUNS, TITLE_MULTI, DECIMAL_ZEROS,
  DIGIT_RANGES, SPACE_RANGES, LINEBREAK_RANGES, CASED_RANGES, CASE_IGNORABLE_RANGES,
} from './_unidata.js';

const raise = (type, msg) => { throw new PyException(type, msg); };

// ── constants ────────────────────────────────────────────────
export const whitespace = ' \t\n\r\v\f';
export const ascii_lowercase = 'abcdefghijklmnopqrstuvwxyz';
export const ascii_uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ascii_letters = ascii_lowercase + ascii_uppercase;
export const digits = '0123456789';
export const hexdigits = digits + 'abcdef' + 'ABCDEF';
export const octdigits = '01234567';
export const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
export const printable = digits + ascii_letters + punctuation + whitespace;
export const CONSTANTS = {
  ascii_letters, ascii_lowercase, ascii_uppercase, digits, hexdigits,
  octdigits, punctuation, printable, whitespace,
};

// ── character data ───────────────────────────────────────────
const inRanges = (ranges, cp) => {
  let lo = 0;
  let hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cp < ranges[mid][0]) hi = mid - 1;
    else if (cp > ranges[mid][1]) lo = mid + 1;
    else return true;
  }
  return false;
};
function buildMap(runs, multi) {
  const m = new Map();
  for (const [start, count, delta, step] of runs) {
    for (let i = 0; i < count; i++) {
      const cp = start + i * step;
      m.set(cp, String.fromCodePoint(cp + delta));
    }
  }
  for (const [cp, s] of Object.entries(multi)) m.set(Number(cp), s);
  return m;
}
let LOWER = null;
let TITLE = null;
const lowerFull = (cp) => {
  if (!LOWER) LOWER = buildMap(LOWER_RUNS, LOWER_MULTI);
  return LOWER.get(cp) ?? String.fromCodePoint(cp);
};
const titleFull = (cp) => {
  if (!TITLE) TITLE = buildMap(TITLE_RUNS, TITLE_MULTI);
  return TITLE.get(cp) ?? String.fromCodePoint(cp);
};
export const isSpace = (cp) => inRanges(SPACE_RANGES, cp);
export const isDigit = (cp) => inRanges(DIGIT_RANGES, cp);
const isLineBreak = (cp) => inRanges(LINEBREAK_RANGES, cp);
const isCased = (cp) => inRanges(CASED_RANGES, cp);
const isCaseIgnorable = (cp) => inRanges(CASE_IGNORABLE_RANGES, cp);
// Py_UNICODE_TODECIMAL: 0-9, or -1
function toDecimal(cp) {
  let lo = 0;
  let hi = DECIMAL_ZEROS.length - 1;
  let z = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (DECIMAL_ZEROS[mid] <= cp) { z = DECIMAL_ZEROS[mid]; lo = mid + 1; } else hi = mid - 1;
  }
  return z !== -1 && cp - z <= 9 ? cp - z : -1;
}

const cpsOf = (s) => Array.from(s, (c) => c.codePointAt(0));
const fromCps = (cps) => cps.map((c) => String.fromCodePoint(c)).join('');

// ── str methods ──────────────────────────────────────────────
// str.split(sep) — sep None: runs of whitespace, no empty strings
export function split(s, sep = null) {
  if (sep === null) {
    const out = [];
    let cur = '';
    let inWord = false;
    for (const ch of s) {
      if (isSpace(ch.codePointAt(0))) {
        if (inWord) { out.push(cur); cur = ''; inWord = false; }
      } else { cur += ch; inWord = true; }
    }
    if (inWord) out.push(cur);
    return out;
  }
  if (sep === '') raise('ValueError', 'empty separator');
  return s.split(sep);
}

// str.capitalize(): first character titlecased, the rest lowercased
// (with the final-sigma rule, like CPython's do_capitalize/lower_ucs4)
export function capitalize(s) {
  const cps = cpsOf(s);
  if (cps.length === 0) return '';
  let out = titleFull(cps[0]);
  for (let i = 1; i < cps.length; i++) {
    const c = cps[i];
    if (c === 0x3a3) out += finalSigma(cps, i) ? 'ς' : 'σ';
    else out += lowerFull(c);
  }
  return out;
}
function finalSigma(cps, i) {
  let j;
  let c = 0;
  for (j = i - 1; j >= 0; j--) {
    c = cps[j];
    if (!isCaseIgnorable(c)) break;
  }
  let fin = j >= 0 && isCased(c);
  if (fin) {
    for (j = i + 1; j < cps.length; j++) {
      c = cps[j];
      if (!isCaseIgnorable(c)) break;
    }
    fin = j === cps.length || !isCased(c);
  }
  return fin;
}

// str.splitlines(keepends=True), on code points
function splitlinesKeep(cps) {
  const lines = [];
  let start = 0;
  let i = 0;
  while (i < cps.length) {
    const c = cps[i];
    if (isLineBreak(c)) {
      let eol = i + 1;
      if (c === 13 && cps[i + 1] === 10) eol = i + 2;
      lines.push(cps.slice(start, eol));
      start = eol;
      i = eol;
    } else i++;
  }
  if (start < cps.length) lines.push(cps.slice(start));
  return lines;
}

// ascii(s) for a str: repr() with every non-ASCII character escaped
export function asciiRepr(s) {
  let out = '';
  for (const ch of pyStrRepr(s)) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) out += ch;
    else if (cp <= 0xff) out += '\\x' + cp.toString(16).padStart(2, '0');
    else if (cp <= 0xffff) out += '\\u' + cp.toString(16).padStart(4, '0');
    else out += '\\U' + cp.toString(16).padStart(8, '0');
  }
  return out;
}

// ── capwords ─────────────────────────────────────────────────
// (sep or ' ').join(map(str.capitalize, s.split(sep)))
export function capwords(s, sep = null) {
  const joiner = sep === null || sep === '' ? ' ' : sep;
  return split(s, sep).map(capitalize).join(joiner);
}

// ── Template ─────────────────────────────────────────────────
// Default pattern: delimiter '$', idpattern (?a:[_a-z][_a-z0-9]*) with
// re.IGNORECASE — i.e. ASCII letters of either case. Subclasses may change
// delimiter / idpattern / braceidpattern (as JS regex source, ASCII only).
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ID = '[_a-zA-Z][_a-zA-Z0-9]*';

export class Template {
  constructor(template, { delimiter = '$', idpattern = ID, braceidpattern = null } = {}) {
    this.template = template;
    this.delimiter = delimiter;
    const d = reEscape(delimiter);
    const bid = braceidpattern || idpattern;
    this.pattern = new RegExp(`${d}(?:(${d})|(${idpattern})|\\{(${bid})\\}|())`, 'gu');
  }

  *matches() {
    this.pattern.lastIndex = 0;
    for (const m of this.template.matchAll(this.pattern)) {
      yield {
        index: m.index,
        whole: m[0],
        escaped: m[1],
        named: m[2],
        braced: m[3],
        invalid: m[4],
        // start of the (empty) invalid group = right after the delimiter
        invalidStart: m.index + m[0].length,
      };
    }
  }

  invalid(mo) {
    // i counts code points, like Python
    const i = cpsOf(this.template.slice(0, mo.invalidStart)).length;
    const lines = splitlinesKeep(cpsOf(this.template).slice(0, i));
    let colno;
    let lineno;
    if (lines.length === 0) {
      colno = 1;
      lineno = 1;
    } else {
      colno = i - lines.slice(0, -1).reduce((n, l) => n + l.length, 0);
      lineno = lines.length;
    }
    raise('ValueError', `Invalid placeholder in string: line ${lineno}, col ${colno}`);
  }

  sub(convert) {
    let out = '';
    let last = 0;
    for (const mo of this.matches()) {
      out += this.template.slice(last, mo.index) + convert(mo);
      last = mo.index + mo.whole.length;
    }
    return out + this.template.slice(last);
  }

  // mapping: a Map (or plain object) of name -> str
  substitute(mapping) {
    return this.sub((mo) => {
      const named = mo.named || mo.braced;
      if (named !== undefined) return lookupKey(mapping, named);
      if (mo.escaped !== undefined) return this.delimiter;
      return this.invalid(mo);
    });
  }

  safe_substitute(mapping) {
    return this.sub((mo) => {
      const named = mo.named || mo.braced;
      if (named !== undefined) {
        const v = getKey(mapping, named);
        return v === undefined ? mo.whole : v;
      }
      if (mo.escaped !== undefined) return this.delimiter;
      return mo.whole;
    });
  }

  is_valid() {
    for (const mo of this.matches()) if (mo.invalid !== undefined) return false;
    return true;
  }

  get_identifiers() {
    const ids = [];
    for (const mo of this.matches()) {
      const named = mo.named || mo.braced;
      if (named !== undefined && !ids.includes(named)) ids.push(named);
    }
    return ids;
  }
}

function getKey(mapping, k) {
  if (mapping instanceof Map) return mapping.has(k) ? mapping.get(k) : undefined;
  return Object.prototype.hasOwnProperty.call(mapping, k) ? mapping[k] : undefined;
}
function lookupKey(mapping, k) {
  const v = getKey(mapping, k);
  if (v === undefined) raise('KeyError', pyStrRepr(k));
  return v;
}

// ── format(s, spec) for a str (Python/formatter_unicode.c) ───
const SSIZE_MAX = (1n << 63n) - 1n;
// get_integer: consume decimal digits from cps[pos]; returns [value|-1, pos, consumed]
function specInteger(cps, pos, end) {
  let acc = 0n;
  let n = 0;
  for (; pos < end; pos++, n++) {
    const d = toDecimal(cps[pos]);
    if (d < 0) break;
    if (acc > (SSIZE_MAX - BigInt(d)) / 10n) raise('ValueError', 'Too many decimal digits in format string');
    acc = acc * 10n + BigInt(d);
  }
  return [acc, pos, n];
}
const isAlign = (c) => c === 0x3c || c === 0x3e || c === 0x3d || c === 0x5e; // < > = ^
const ch = (c) => String.fromCodePoint(c);

export function formatStr(value, spec) {
  if (spec === '') return value;
  const cps = cpsOf(spec);
  const end = cps.length;
  let pos = 0;
  let fill = 0x20;
  let align = 0x3c;
  let alignSpecified = false;
  let fillSpecified = false;
  let sign = 0;
  let noNeg0 = false;
  let alternate = false;
  let thousands = 0;
  let type = 0x73; // 's'
  if (end - pos >= 2 && isAlign(cps[pos + 1])) {
    align = cps[pos + 1]; fill = cps[pos]; fillSpecified = true; alignSpecified = true; pos += 2;
  } else if (end - pos >= 1 && isAlign(cps[pos])) {
    align = cps[pos]; alignSpecified = true; pos++;
  }
  if (end - pos >= 1 && (cps[pos] === 0x20 || cps[pos] === 0x2b || cps[pos] === 0x2d)) { sign = cps[pos]; pos++; }
  if (end - pos >= 1 && cps[pos] === 0x7a) { noNeg0 = true; pos++; } // z
  if (end - pos >= 1 && cps[pos] === 0x23) { alternate = true; pos++; } // #
  if (!fillSpecified && end - pos >= 1 && cps[pos] === 0x30) {
    fill = 0x30;
    // default_align is '<' for str, so '0' never switches to '='
    pos++;
  }
  void alignSpecified;
  let width;
  let consumed;
  [width, pos, consumed] = specInteger(cps, pos, end);
  if (consumed === 0) width = -1n;
  if (end - pos && cps[pos] === 0x2c) { thousands = 0x2c; pos++; }
  if (end - pos && cps[pos] === 0x5f) {
    if (thousands) raise('ValueError', "Cannot specify both ',' and '_'.");
    thousands = 0x5f; pos++;
  }
  if (end - pos && cps[pos] === 0x2c && thousands === 0x5f) raise('ValueError', "Cannot specify both ',' and '_'.");
  let precision = -1n;
  if (end - pos && cps[pos] === 0x2e) {
    pos++;
    [precision, pos, consumed] = specInteger(cps, pos, end);
    if (consumed === 0) raise('ValueError', 'Format specifier missing precision');
  }
  if (end - pos > 1) raise('ValueError', `Invalid format specifier '${spec}' for object of type 'str'`);
  if (end - pos === 1) { type = cps[pos]; pos++; }
  const typeName = (t) => (t > 32 && t < 128 ? `'${ch(t)}'` : `'\\x${t.toString(16)}'`);
  if (thousands) {
    const allowed = [0x64, 0x65, 0x66, 0x67, 0x45, 0x47, 0x25, 0x46, 0];
    const binlike = [0x62, 0x6f, 0x78, 0x58];
    if (!allowed.includes(type) && !(binlike.includes(type) && thousands === 0x5f)) {
      raise('ValueError', `Cannot specify '${ch(thousands)}' with ${typeName(type)}.`);
    }
  }
  if (type !== 0x73) raise('ValueError', `Unknown format code ${typeName(type)} for object of type 'str'`);
  // format_string_internal
  const v = cpsOf(value);
  let len = BigInt(v.length);
  if (sign) raise('ValueError', sign === 0x20 ? 'Space not allowed in string format specifier' : 'Sign not allowed in string format specifier');
  if (noNeg0) raise('ValueError', 'Negative zero coercion (z) not allowed in string format specifier');
  if (alternate) raise('ValueError', 'Alternate form (#) not allowed in string format specifier');
  if (align === 0x3d) raise('ValueError', "'=' alignment not allowed in string format specifier");
  if ((width === -1n || width <= len) && (precision === -1n || precision >= len)) return value;
  if (precision >= 0n && len >= precision) len = precision;
  const total = width >= 0n && width > len ? width : len;
  if (total > 50000000n) raise('MemoryError', '');
  let lpad;
  if (align === 0x3e) lpad = total - len;
  else if (align === 0x5e) lpad = (total - len) / 2n;
  else lpad = 0n;
  const rpad = total - len - lpad;
  const f = ch(fill);
  return f.repeat(Number(lpad)) + fromCps(v.slice(0, Number(len))) + f.repeat(Number(rpad));
}

// ── _string.formatter_parser (MarkupIterator) ────────────────
// Yields [literal, fieldName|null, formatSpec|null, conversion|null].
// Lazy, like CPython: an error is raised when the bad piece is reached.
export function* formatterParser(s) {
  const cps = cpsOf(s);
  const end = cps.length;
  let p = 0;
  const sub = (a, b) => fromCps(cps.slice(a, b));
  while (p < end) {
    const start = p;
    let c = 0;
    let markupFollows = false;
    while (p < end) {
      c = cps[p++];
      if (c === 0x7b || c === 0x7d) { markupFollows = true; break; }
    }
    const atEnd = p >= end;
    let len = p - start;
    if (c === 0x7d && (atEnd || c !== cps[p])) raise('ValueError', "Single '}' encountered in format string");
    if (atEnd && c === 0x7b) raise('ValueError', "Single '{' encountered in format string");
    if (!atEnd) {
      if (c === cps[p]) { p++; markupFollows = false; } else len--;
    }
    const literal = sub(start, start + len);
    if (!markupFollows) { yield [literal, null, null, null]; continue; }
    // parse_field
    let conversion = null;
    let specStart = -1;
    let specEnd = -1;
    const fnStart = p;
    c = 0;
    while (p < end) {
      c = cps[p++];
      if (c === 0x7b) raise('ValueError', "unexpected '{' in field name");
      if (c === 0x5b) {
        for (; p < end; p++) if (cps[p] === 0x5d) break;
        continue;
      }
      if (c === 0x7d || c === 0x3a || c === 0x21) break;
    }
    const fieldName = sub(fnStart, p - 1);
    if (c === 0x21 || c === 0x3a) {
      let done = false;
      if (c === 0x21) {
        if (p >= end) raise('ValueError', 'end of string while looking for conversion specifier');
        conversion = ch(cps[p++]);
        if (p < end) {
          const c2 = cps[p++];
          if (c2 === 0x7d) done = true;
          else if (c2 !== 0x3a) raise('ValueError', "expected ':' after conversion specifier");
        }
      }
      if (!done) {
        specStart = p;
        let count = 1;
        let closed = false;
        while (p < end) {
          const c3 = cps[p++];
          if (c3 === 0x7b) count++;
          else if (c3 === 0x7d) {
            count--;
            if (count === 0) { specEnd = p - 1; closed = true; break; }
          }
        }
        if (!closed) raise('ValueError', "unmatched '{' in format spec");
      }
    } else if (c !== 0x7d) {
      raise('ValueError', "expected '}' before end of string");
    }
    yield [literal, fieldName, specStart === -1 ? '' : sub(specStart, specEnd), conversion];
  }
}

// _string.formatter_field_name_split → [first (BigInt index | str), rest generator]
function getIntegerWhole(cps) {
  if (cps.length === 0) return -1n;
  let acc = 0n;
  for (const c of cps) {
    const d = toDecimal(c);
    if (d < 0) return -1n;
    if (acc > (SSIZE_MAX - BigInt(d)) / 10n) raise('ValueError', 'Too many decimal digits in format string');
    acc = acc * 10n + BigInt(d);
  }
  return acc;
}
export function fieldNameSplit(name) {
  const cps = cpsOf(name);
  let i = 0;
  while (i < cps.length && cps[i] !== 0x2e && cps[i] !== 0x5b) i++;
  const firstCps = cps.slice(0, i);
  const idx = getIntegerWhole(firstCps);
  const first = idx !== -1n ? idx : fromCps(firstCps);
  function* rest() {
    let p = i;
    while (p < cps.length) {
      const c = cps[p++];
      let isAttr;
      let s;
      let e;
      let key;
      if (c === 0x2e) {
        isAttr = true;
        s = p;
        while (p < cps.length && cps[p] !== 0x2e && cps[p] !== 0x5b) p++;
        e = p;
        key = fromCps(cps.slice(s, e));
      } else if (c === 0x5b) {
        isAttr = false;
        s = p;
        let seen = false;
        while (p < cps.length) { if (cps[p++] === 0x5d) { seen = true; break; } }
        if (!seen) raise('ValueError', "Missing ']' in format string");
        e = p - 1;
        const n = getIntegerWhole(cps.slice(s, e));
        key = n !== -1n ? n : fromCps(cps.slice(s, e));
      } else {
        raise('ValueError', "Only '.' or '[' may follow ']' in format field specifier");
      }
      if (s === e) raise('ValueError', 'Empty attribute in format string');
      yield [isAttr, key];
    }
  }
  return [first, rest()];
}

// ── Formatter (Lib/string.py) ────────────────────────────────
// Python-side objects a field can reach from a str value
class BoundMethod {
  constructor(name) { this.name = name; }
  toString() { return `<built-in method ${this.name} of str object at 0x...>`; }
}
const STR_METHODS = new Set(('capitalize casefold center count encode endswith expandtabs find format format_map index isalnum ' +
  'isalpha isascii isdecimal isdigit isidentifier islower isnumeric isprintable isspace istitle isupper join ljust lower ' +
  'lstrip maketrans partition removeprefix removesuffix replace rfind rindex rjust rpartition rsplit rstrip split ' +
  'splitlines startswith strip swapcase title translate upper zfill').split(' '));

const typeOf = (v) => (typeof v === 'string' ? 'str' : 'builtin_function_or_method');
export const pyStr = (v) => (typeof v === 'string' ? v : String(v));
export const pyRepr = (v) => (typeof v === 'string' ? pyStrRepr(v) : String(v));

function getattr(obj, name) {
  if (typeof obj === 'string') {
    if (STR_METHODS.has(name)) return new BoundMethod(name);
    if (name === '__class__') return { toString: () => "<class 'str'>" };
  }
  raise('AttributeError', `'${typeOf(obj)}' object has no attribute ${pyStrRepr(name)}`);
}
function getitem(obj, key) {
  if (typeof obj === 'string') {
    if (typeof key === 'bigint') {
      const cps = cpsOf(obj);
      if (key >= BigInt(cps.length)) raise('IndexError', 'string index out of range');
      return ch(cps[Number(key)]);
    }
    raise('TypeError', "string indices must be integers, not 'str'");
  }
  raise('TypeError', `'${typeOf(obj)}' object is not subscriptable`);
}

export class Formatter {
  // args: array of str; kwargs: Map name -> str
  format(formatString, args = [], kwargs = new Map()) {
    return this.vformat(formatString, args, kwargs);
  }

  vformat(formatString, args, kwargs) {
    const usedArgs = new Set();
    const [result] = this._vformat(formatString, args, kwargs, usedArgs, 2);
    this.check_unused_args(usedArgs, args, kwargs);
    return result;
  }

  _vformat(formatString, args, kwargs, usedArgs, recursionDepth, autoArgIndex = 0) {
    if (recursionDepth < 0) raise('ValueError', 'Max string recursion exceeded');
    const result = [];
    for (const [literal, fieldName0, formatSpec0, conversion] of this.parse(formatString)) {
      if (literal) result.push(literal);
      if (fieldName0 !== null) {
        let fieldName = fieldName0;
        if (fieldName === '') {
          if (autoArgIndex === false) {
            raise('ValueError', 'cannot switch from manual field specification to automatic field numbering');
          }
          fieldName = String(autoArgIndex);
          autoArgIndex += 1;
        } else if (isdigitStr(fieldName)) {
          if (autoArgIndex) {
            raise('ValueError', 'cannot switch from manual field specification to automatic field numbering');
          }
          autoArgIndex = false;
        }
        let [obj, argUsed] = this.get_field(fieldName, args, kwargs);
        usedArgs.add(typeof argUsed === 'bigint' ? `#${argUsed}` : argUsed);
        obj = this.convert_field(obj, conversion);
        let formatSpec;
        [formatSpec, autoArgIndex] = this._vformat(formatSpec0, args, kwargs, usedArgs, recursionDepth - 1, autoArgIndex);
        result.push(this.format_field(obj, formatSpec));
      }
    }
    return [result.join(''), autoArgIndex];
  }

  get_value(key, args, kwargs) {
    if (typeof key === 'bigint') {
      if (key >= BigInt(args.length)) raise('IndexError', 'tuple index out of range');
      return args[Number(key)];
    }
    if (!kwargs.has(key)) raise('KeyError', pyStrRepr(key));
    return kwargs.get(key);
  }

  check_unused_args() {}

  format_field(value, formatSpec) {
    if (typeof value === 'string') return formatStr(value, formatSpec);
    if (formatSpec === '') return String(value);
    if (value instanceof BoundMethod) {
      raise('TypeError', 'unsupported format string passed to builtin_function_or_method.__format__');
    }
    raise('TypeError', 'unsupported format string passed to type.__format__');
  }

  convert_field(value, conversion) {
    if (conversion === null) return value;
    if (conversion === 's') return pyStr(value);
    if (conversion === 'r') return pyRepr(value);
    if (conversion === 'a') return typeof value === 'string' ? asciiRepr(value) : String(value);
    raise('ValueError', `Unknown conversion specifier ${conversion}`);
  }

  parse(formatString) {
    return formatterParser(formatString);
  }

  get_field(fieldName, args, kwargs) {
    const [first, rest] = fieldNameSplit(fieldName);
    let obj = this.get_value(first, args, kwargs);
    for (const [isAttr, i] of rest) {
      obj = isAttr ? getattr(obj, i) : getitem(obj, i);
    }
    return [obj, first];
  }
}

// str.isdigit() of a whole string
export function isdigitStr(s) {
  if (s === '') return false;
  for (const c of s) if (!isDigit(c.codePointAt(0))) return false;
  return true;
}

// repr() of one parse() tuple
export const parseTuple = ([lit, name, spec, conv]) => ({ __pyTuple: [lit, name, spec, conv] });
