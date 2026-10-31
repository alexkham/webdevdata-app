// utils/emulators/python/stdlib/tomllib/_pytomllib.js
//
// Line-by-line port of CPython 3.13's tomllib (Lib/tomllib/_parser.py and
// _re.py) for the tomllib demos — shared by the module hub and the member
// emulators. Not a content page (leading underscore), so the catalog
// generator never maps it.
//
// The parser works on an ARRAY of code points, because Python str indexes
// (and therefore the "(at line L, column C)" positions) count code points.
// The three regular expressions of _re.py (RE_NUMBER, RE_DATETIME,
// RE_LOCALTIME) are hand-written matchers with the same greedy semantics —
// they only ever match ASCII.
//
// Dates and times are built with the datetime port in
// ../datetime/_pydatetime.js (imported, not copied), so their repr() is the
// C datetime module's.
//
// Value model (JS side):
//   table / inline table → Map (insertion-ordered, str keys)
//   array → Array · str → string · int → bigint · float → PyFloat
//   bool → true/false · datetime/date/time → the datetime port's objects
//   parse_float=Decimal → PyDecimal · parse_float=str → string
// pyRepr(value) renders repr() exactly.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { PyDate, PyDateTime, PyTime, date as mkDate, datetime as mkDatetime, time as mkTime, timezone, td, dtRepr, dateRepr, timeRepr } from '../datetime/_pydatetime.js';

export class PyFloat {
  constructor(v) { this.v = v; }
}

// decimal.Decimal(text) for the strings tomllib hands to parse_float
// (TOML float syntax, inf / nan forms). Stores sign, coefficient digits and
// exponent like _pydecimal; repr() is Decimal('<to-sci-string>').
export class PyDecimal {
  constructor(text) {
    let t = text.replace(/_/g, '');
    let sign = '';
    if (t[0] === '+' || t[0] === '-') {
      if (t[0] === '-') sign = '-';
      t = t.slice(1);
    }
    this.sign = sign;
    const low = t.toLowerCase();
    if (low === 'inf' || low === 'infinity') { this.special = 'Infinity'; return; }
    if (low === 'nan') { this.special = 'NaN'; return; }
    const m = /^(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(t);
    const intPart = m[1];
    const frac = m[2] || '';
    let exp = BigInt(m[3] || '0') - BigInt(frac.length);
    let digits = (intPart + frac).replace(/^0+/, '');
    if (digits === '') digits = '0';
    this.digits = digits;
    this.exp = exp;
  }
  toString() {
    if (this.special) return this.sign + this.special;
    const n = BigInt(this.digits.length);
    const leftdigits = this.exp + n;
    let dotplace;
    if (this.exp <= 0n && leftdigits > -6n) dotplace = leftdigits;
    else dotplace = 1n;
    let intpart;
    let fracpart;
    if (dotplace <= 0n) {
      intpart = '0';
      fracpart = '.' + '0'.repeat(Number(-dotplace)) + this.digits;
    } else if (dotplace >= n) {
      intpart = this.digits + '0'.repeat(Number(dotplace - n));
      fracpart = '';
    } else {
      intpart = this.digits.slice(0, Number(dotplace));
      fracpart = '.' + this.digits.slice(Number(dotplace));
    }
    let exp = '';
    if (leftdigits !== dotplace) {
      const e = leftdigits - dotplace;
      exp = 'E' + (e < 0n ? '-' : '+') + (e < 0n ? -e : e).toString();
    }
    return this.sign + intpart + fracpart + exp;
  }
}

// ─── errors ─────────────────────────────────────────────────

// tomllib sets TOMLDecodeError.__module__ = 'tomllib', so tracebacks show
// tomllib.TOMLDecodeError
export class TOMLDecodeError extends PyException {
  constructor(message) {
    super('tomllib.TOMLDecodeError', message);
  }
}
const limit = (msg) => { throw new PyException('DemoLimit', msg); };

// int() str-conversion limit (sys.get_int_max_str_digits() default)
export const INT_MAX_STR_DIGITS = 4300;

// ─── character classes ──────────────────────────────────────
const isCtrl = (c) => {
  const n = c.codePointAt(0);
  return n < 32 || n === 127;
};
// ILLEGAL_BASIC_STR_CHARS = ASCII_CTRL - {'\t'}, and the multiline sets also allow '\n'
const illegalBasic = (c) => isCtrl(c) && c !== '\t';
const illegalMultiline = (c) => isCtrl(c) && c !== '\t' && c !== '\n';
const TOML_WS = ' \t';
const TOML_WS_AND_NEWLINE = ' \t\n';
const isBare = (c) => c !== undefined && /^[A-Za-z0-9_-]$/.test(c);
const isKeyInitial = (c) => isBare(c) || c === '"' || c === "'";
const isHex = (c) => c !== undefined && /^[0-9A-Fa-f]$/.test(c);
const isDigit = (c) => c !== undefined && c >= '0' && c <= '9';

const BASIC_STR_ESCAPE_REPLACEMENTS = {
  '\\b': '\u0008',
  '\\t': '\u0009',
  '\\n': '\u000A',
  '\\f': '\u000C',
  '\\r': '\u000D',
  '\\"': '"',
  '\\\\': '\\',
};

// ─── str helpers on code-point arrays ───────────────────────
const sub = (src, a, b) => src.slice(a, b).join('');
function startsWith(src, s, pos) {
  const cps = Array.from(s);
  if (pos + cps.length > src.length) return false;
  for (let i = 0; i < cps.length; i++) if (src[pos + i] !== cps[i]) return false;
  return true;
}
function indexOf(src, s, from) {
  for (let i = from; i < src.length; i++) if (startsWith(src, s, i)) return i;
  return -1;
}

// "(at line L, column C)" / "(at end of document)" — suffixed_err
function suffixedErr(src, pos, msg) {
  let coord;
  if (pos >= src.length) coord = 'end of document';
  else {
    let line = 1;
    let last = -1;
    for (let i = 0; i < pos; i++) {
      if (src[i] === '\n') { line += 1; last = i; }
    }
    const column = line === 1 ? pos + 1 : pos - last;
    coord = `line ${line}, column ${column}`;
  }
  return new TOMLDecodeError(`${msg} (at ${coord})`);
}

const keyRepr = (key) => '(' + key.map(pyStrRepr).join(', ') + (key.length === 1 ? ',' : '') + ')';

// ─── Flags / NestedDict ─────────────────────────────────────
const FROZEN = 0;
const EXPLICIT_NEST = 1;
const newFlagEntry = () => ({ flags: new Set(), recursive_flags: new Set(), nested: new Map() });

class Flags {
  constructor() {
    this._flags = new Map();
    this._pending = [];
  }
  add_pending(key, flag) { this._pending.push([key, flag]); }
  finalize_pending() {
    for (const [key, flag] of this._pending) this.set(key, flag, false);
    this._pending = [];
  }
  unset_all(key) {
    let cont = this._flags;
    for (const k of key.slice(0, -1)) {
      if (!cont.has(k)) return;
      cont = cont.get(k).nested;
    }
    cont.delete(key[key.length - 1]);
  }
  set(key, flag, recursive) {
    let cont = this._flags;
    const parent = key.slice(0, -1);
    const stem = key[key.length - 1];
    for (const k of parent) {
      if (!cont.has(k)) cont.set(k, newFlagEntry());
      cont = cont.get(k).nested;
    }
    if (!cont.has(stem)) cont.set(stem, newFlagEntry());
    cont.get(stem)[recursive ? 'recursive_flags' : 'flags'].add(flag);
  }
  is_(key, flag) {
    if (key.length === 0) return false; // document root has no flags
    let cont = this._flags;
    for (const k of key.slice(0, -1)) {
      if (!cont.has(k)) return false;
      const inner = cont.get(k);
      if (inner.recursive_flags.has(flag)) return true;
      cont = inner.nested;
    }
    const stem = key[key.length - 1];
    if (cont.has(stem)) {
      const c = cont.get(stem);
      return c.flags.has(flag) || c.recursive_flags.has(flag);
    }
    return false;
  }
}

class NestKeyError extends Error {}

class NestedDict {
  constructor() { this.dict = new Map(); }
  get_or_create_nest(key, accessLists = true) {
    let cont = this.dict;
    for (const k of key) {
      if (!cont.has(k)) cont.set(k, new Map());
      cont = cont.get(k);
      if (accessLists && Array.isArray(cont)) {
        if (cont.length === 0) throw new PyException('IndexError', 'list index out of range');
        cont = cont[cont.length - 1];
      }
      if (!(cont instanceof Map)) throw new NestKeyError('There is no nest behind this key');
    }
    return cont;
  }
  append_nest_to_list(key) {
    const cont = this.get_or_create_nest(key.slice(0, -1));
    const last = key[key.length - 1];
    if (cont.has(last)) {
      const list = cont.get(last);
      if (!Array.isArray(list)) throw new NestKeyError('An object other than list found behind this key');
      list.push(new Map());
    } else {
      cont.set(last, [new Map()]);
    }
  }
}

// ─── the parser ─────────────────────────────────────────────
// nesting of arrays / inline tables the browser demo follows (CPython's
// limit is its recursion limit; each level costs two Python frames)
const MAX_NESTING = 200;
// 3.13 patch releases after 3.13.3 cap keys at sys.getrecursionlimit() parts
const MAX_KEY_PARTS = 1000;

function skipChars(src, pos, chars) {
  while (pos < src.length && chars.includes(src[pos])) pos += 1;
  return pos;
}

function skipUntil(src, pos, expect, errorOn, errorOnEof) {
  let newPos = indexOf(src, expect, pos);
  if (newPos === -1) {
    newPos = src.length;
    if (errorOnEof) throw suffixedErr(src, newPos, `Expected ${pyStrRepr(expect)}`);
  }
  let bad = false;
  for (let i = pos; i < newPos; i++) if (errorOn(src[i])) { bad = true; break; }
  if (bad) {
    while (!errorOn(src[pos])) pos += 1;
    throw suffixedErr(src, pos, `Found invalid character ${pyStrRepr(src[pos])}`);
  }
  return newPos;
}

function skipComment(src, pos) {
  if (src[pos] === '#') return skipUntil(src, pos + 1, '\n', illegalBasic, false);
  return pos;
}

function skipCommentsAndArrayWs(src, pos) {
  for (;;) {
    const before = pos;
    pos = skipChars(src, pos, TOML_WS_AND_NEWLINE);
    pos = skipComment(src, pos);
    if (pos === before) return pos;
  }
}

function createDictRule(src, pos, out) {
  pos += 1; // skip "["
  pos = skipChars(src, pos, TOML_WS);
  let key;
  [pos, key] = parseKey(src, pos);
  if (out.flags.is_(key, EXPLICIT_NEST) || out.flags.is_(key, FROZEN)) {
    throw suffixedErr(src, pos, `Cannot declare ${keyRepr(key)} twice`);
  }
  out.flags.set(key, EXPLICIT_NEST, false);
  try {
    out.data.get_or_create_nest(key);
  } catch (e) {
    if (e instanceof NestKeyError) throw suffixedErr(src, pos, 'Cannot overwrite a value');
    throw e;
  }
  if (!startsWith(src, ']', pos)) throw suffixedErr(src, pos, "Expected ']' at the end of a table declaration");
  return [pos + 1, key];
}

function createListRule(src, pos, out) {
  pos += 2; // skip "[["
  pos = skipChars(src, pos, TOML_WS);
  let key;
  [pos, key] = parseKey(src, pos);
  if (out.flags.is_(key, FROZEN)) throw suffixedErr(src, pos, `Cannot mutate immutable namespace ${keyRepr(key)}`);
  out.flags.unset_all(key);
  out.flags.set(key, EXPLICIT_NEST, false);
  try {
    out.data.append_nest_to_list(key);
  } catch (e) {
    if (e instanceof NestKeyError) throw suffixedErr(src, pos, 'Cannot overwrite a value');
    throw e;
  }
  if (!startsWith(src, ']]', pos)) throw suffixedErr(src, pos, "Expected ']]' at the end of an array declaration");
  return [pos + 2, key];
}

function keyValueRule(src, pos, out, header, ctx) {
  let key;
  let value;
  [pos, key, value] = parseKeyValuePair(src, pos, ctx);
  const keyParent = key.slice(0, -1);
  const keyStem = key[key.length - 1];
  const absKeyParent = header.concat(keyParent);

  for (let i = 1; i < key.length; i++) {
    const contKey = header.concat(key.slice(0, i));
    if (out.flags.is_(contKey, EXPLICIT_NEST)) throw suffixedErr(src, pos, `Cannot redefine namespace ${keyRepr(contKey)}`);
    out.flags.add_pending(contKey, EXPLICIT_NEST);
  }
  if (out.flags.is_(absKeyParent, FROZEN)) throw suffixedErr(src, pos, `Cannot mutate immutable namespace ${keyRepr(absKeyParent)}`);
  let nest;
  try {
    nest = out.data.get_or_create_nest(absKeyParent);
  } catch (e) {
    if (e instanceof NestKeyError) throw suffixedErr(src, pos, 'Cannot overwrite a value');
    throw e;
  }
  if (nest.has(keyStem)) throw suffixedErr(src, pos, 'Cannot overwrite a value');
  if (value instanceof Map || Array.isArray(value)) out.flags.set(header.concat(key), FROZEN, true);
  nest.set(keyStem, value);
  return pos;
}

function parseKeyValuePair(src, pos, ctx) {
  let key;
  [pos, key] = parseKey(src, pos);
  if (src[pos] !== '=') throw suffixedErr(src, pos, "Expected '=' after a key in a key/value pair");
  pos += 1;
  pos = skipChars(src, pos, TOML_WS);
  let value;
  [pos, value] = parseValue(src, pos, ctx);
  return [pos, key, value];
}

function parseKey(src, pos) {
  let part;
  [pos, part] = parseKeyPart(src, pos);
  const key = [part];
  pos = skipChars(src, pos, TOML_WS);
  for (;;) {
    if (src[pos] !== '.') return [pos, key];
    pos += 1;
    pos = skipChars(src, pos, TOML_WS);
    [pos, part] = parseKeyPart(src, pos);
    key.push(part);
    if (key.length > MAX_KEY_PARTS) {
      limit(`A key with more than ${MAX_KEY_PARTS} dotted parts is not reproduced in the browser: Python 3.13.3 accepts it, later 3.13 releases raise RecursionError.`);
    }
    pos = skipChars(src, pos, TOML_WS);
  }
}

function parseKeyPart(src, pos) {
  const c = src[pos];
  if (isBare(c)) {
    const start = pos;
    while (isBare(src[pos])) pos += 1;
    return [pos, sub(src, start, pos)];
  }
  if (c === "'") return parseLiteralStr(src, pos);
  if (c === '"') return parseOneLineBasicStr(src, pos);
  throw suffixedErr(src, pos, 'Invalid initial character for a key part');
}

function parseOneLineBasicStr(src, pos) {
  return parseBasicStr(src, pos + 1, false);
}

function parseArray(src, pos, ctx) {
  pos += 1;
  const array = [];
  pos = skipCommentsAndArrayWs(src, pos);
  if (startsWith(src, ']', pos)) return [pos + 1, array];
  for (;;) {
    let val;
    [pos, val] = parseValue(src, pos, ctx);
    array.push(val);
    pos = skipCommentsAndArrayWs(src, pos);
    const c = sub(src, pos, pos + 1);
    if (c === ']') return [pos + 1, array];
    if (c !== ',') throw suffixedErr(src, pos, 'Unclosed array');
    pos += 1;
    pos = skipCommentsAndArrayWs(src, pos);
    if (startsWith(src, ']', pos)) return [pos + 1, array];
  }
}

function parseInlineTable(src, pos, ctx) {
  pos += 1;
  const nested = new NestedDict();
  const flags = new Flags();
  pos = skipChars(src, pos, TOML_WS);
  if (startsWith(src, '}', pos)) return [pos + 1, nested.dict];
  for (;;) {
    let key;
    let value;
    [pos, key, value] = parseKeyValuePair(src, pos, ctx);
    const keyParent = key.slice(0, -1);
    const keyStem = key[key.length - 1];
    if (flags.is_(key, FROZEN)) throw suffixedErr(src, pos, `Cannot mutate immutable namespace ${keyRepr(key)}`);
    let nest;
    try {
      nest = nested.get_or_create_nest(keyParent, false);
    } catch (e) {
      if (e instanceof NestKeyError) throw suffixedErr(src, pos, 'Cannot overwrite a value');
      throw e;
    }
    if (nest.has(keyStem)) throw suffixedErr(src, pos, `Duplicate inline table key ${pyStrRepr(keyStem)}`);
    nest.set(keyStem, value);
    pos = skipChars(src, pos, TOML_WS);
    const c = sub(src, pos, pos + 1);
    if (c === '}') return [pos + 1, nested.dict];
    if (c !== ',') throw suffixedErr(src, pos, 'Unclosed inline table');
    if (value instanceof Map || Array.isArray(value)) flags.set(key, FROZEN, true);
    pos += 1;
    pos = skipChars(src, pos, TOML_WS);
  }
}

function parseBasicStrEscape(src, pos, multiline) {
  const escapeId = sub(src, pos, pos + 2);
  pos += 2;
  if (multiline && (escapeId === '\\ ' || escapeId === '\\\t' || escapeId === '\\\n')) {
    if (escapeId !== '\\\n') {
      pos = skipChars(src, pos, TOML_WS);
      if (pos >= src.length) return [pos, ''];
      if (src[pos] !== '\n') throw suffixedErr(src, pos, "Unescaped '\\' in a string");
      pos += 1;
    }
    pos = skipChars(src, pos, TOML_WS_AND_NEWLINE);
    return [pos, ''];
  }
  if (escapeId === '\\u') return parseHexChar(src, pos, 4);
  if (escapeId === '\\U') return parseHexChar(src, pos, 8);
  if (Object.prototype.hasOwnProperty.call(BASIC_STR_ESCAPE_REPLACEMENTS, escapeId)) {
    return [pos, BASIC_STR_ESCAPE_REPLACEMENTS[escapeId]];
  }
  throw suffixedErr(src, pos, "Unescaped '\\' in a string");
}

function parseHexChar(src, pos, hexLen) {
  const hexCps = src.slice(pos, pos + hexLen);
  if (hexCps.length !== hexLen || !hexCps.every(isHex)) throw suffixedErr(src, pos, 'Invalid hex value');
  pos += hexLen;
  const n = parseInt(hexCps.join(''), 16);
  // is_unicode_scalar_value
  if (!((n >= 0 && n <= 55295) || (n >= 57344 && n <= 1114111))) {
    throw suffixedErr(src, pos, 'Escaped character is not a Unicode scalar value');
  }
  return [pos, String.fromCodePoint(n)];
}

function parseLiteralStr(src, pos) {
  pos += 1; // skip starting apostrophe
  const start = pos;
  pos = skipUntil(src, pos, "'", illegalBasic, true);
  return [pos + 1, sub(src, start, pos)];
}

function parseMultilineStr(src, pos, literal) {
  pos += 3;
  if (startsWith(src, '\n', pos)) pos += 1;
  let delim;
  let result;
  if (literal) {
    delim = "'";
    const end = skipUntil(src, pos, "'''", illegalMultiline, true);
    result = sub(src, pos, end);
    pos = end + 3;
  } else {
    delim = '"';
    [pos, result] = parseBasicStr(src, pos, true);
  }
  // at most two extra quotes when the end sequence is 4 or 5 long
  if (!startsWith(src, delim, pos)) return [pos, result];
  pos += 1;
  if (!startsWith(src, delim, pos)) return [pos, result + delim];
  pos += 1;
  return [pos, result + delim + delim];
}

function parseBasicStr(src, pos, multiline) {
  const errorOn = multiline ? illegalMultiline : illegalBasic;
  let result = '';
  let start = pos;
  for (;;) {
    if (pos >= src.length) throw suffixedErr(src, pos, 'Unterminated string');
    const c = src[pos];
    if (c === '"') {
      if (!multiline) return [pos + 1, result + sub(src, start, pos)];
      if (startsWith(src, '"""', pos)) return [pos + 3, result + sub(src, start, pos)];
      pos += 1;
      continue;
    }
    if (c === '\\') {
      result += sub(src, start, pos);
      let parsed;
      [pos, parsed] = parseBasicStrEscape(src, pos, multiline);
      result += parsed;
      start = pos;
      continue;
    }
    if (errorOn(c)) throw suffixedErr(src, pos, `Illegal character ${pyStrRepr(c)}`);
    pos += 1;
  }
}

// ─── _re.py matchers ────────────────────────────────────────
// _TIME_RE_STR = ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(?:\.([0-9]{1,6})[0-9]*)?
const isSexagesimalTens = (c) => c !== undefined && c >= '0' && c <= '5';
function matchTime(src, i) {
  const h1 = src[i];
  const h2 = src[i + 1];
  const hourOk = (h1 === '0' || h1 === '1') ? isDigit(h2) : (h1 === '2' && h2 !== undefined && h2 >= '0' && h2 <= '3');
  if (!hourOk || src[i + 2] !== ':') return null;
  if (!isSexagesimalTens(src[i + 3]) || !isDigit(src[i + 4]) || src[i + 5] !== ':') return null;
  if (!isSexagesimalTens(src[i + 6]) || !isDigit(src[i + 7])) return null;
  const g = { hour: sub(src, i, i + 2), minute: sub(src, i + 3, i + 5), second: sub(src, i + 6, i + 8), micros: null };
  let end = i + 8;
  if (src[end] === '.' && isDigit(src[end + 1])) {
    let j = end + 1;
    while (j < end + 7 && isDigit(src[j])) j += 1;
    g.micros = sub(src, end + 1, j);
    while (isDigit(src[j])) j += 1;
    end = j;
  }
  g.end = end;
  return g;
}

// RE_DATETIME: date, then optionally [Tt ] time and an optional offset
function matchDatetime(src, pos) {
  for (let k = 0; k < 4; k++) if (!isDigit(src[pos + k])) return null;
  if (src[pos + 4] !== '-') return null;
  const m1 = src[pos + 5];
  const m2 = src[pos + 6];
  if (!((m1 === '0' && isDigit(m2) && m2 !== '0') || (m1 === '1' && (m2 === '0' || m2 === '1' || m2 === '2')))) return null;
  if (src[pos + 7] !== '-') return null;
  const d1 = src[pos + 8];
  const d2 = src[pos + 9];
  if (!((d1 === '0' && isDigit(d2) && d2 !== '0') || ((d1 === '1' || d1 === '2') && isDigit(d2)) || (d1 === '3' && (d2 === '0' || d2 === '1')))) return null;
  const g = { year: sub(src, pos, pos + 4), month: m1 + m2, day: d1 + d2, time: null, zulu: false, offset: null, end: pos + 10 };
  const sep = src[pos + 10];
  if (sep === 'T' || sep === 't' || sep === ' ') {
    const t = matchTime(src, pos + 11);
    if (t) {
      g.time = t;
      g.end = t.end;
      const c = src[t.end];
      if (c === 'Z' || c === 'z') {
        g.zulu = true;
        g.end = t.end + 1;
      } else if (c === '+' || c === '-') {
        const j = t.end + 1;
        const h1 = src[j];
        const h2 = src[j + 1];
        const hOk = (h1 === '0' || h1 === '1') ? isDigit(h2) : (h1 === '2' && h2 >= '0' && h2 <= '3');
        const mOk = src[j + 2] === ':' && src[j + 3] >= '0' && src[j + 3] <= '5' && isDigit(src[j + 4]);
        if (hOk && mOk) {
          g.offset = { sign: c, hour: h1 + h2, minute: src[j + 3] + src[j + 4] };
          g.end = j + 5;
        }
      }
    }
  }
  return g;
}

// RE_NUMBER: 0x / 0b / 0o integers, else a decimal with an optional float part
function matchNumber(src, pos) {
  if (src[pos] === '0' && (src[pos + 1] === 'x' || src[pos + 1] === 'b' || src[pos + 1] === 'o')) {
    const ok = src[pos + 1] === 'x' ? isHex : src[pos + 1] === 'b' ? (c) => c === '0' || c === '1' : (c) => c !== undefined && c >= '0' && c <= '7';
    if (ok(src[pos + 2])) {
      let i = pos + 3;
      for (;;) {
        if (ok(src[i])) i += 1;
        else if (src[i] === '_' && ok(src[i + 1])) i += 2;
        else break;
      }
      return { end: i, floatpart: null };
    }
  }
  let i = pos;
  if (src[i] === '+' || src[i] === '-') i += 1;
  if (src[i] === '0') i += 1;
  else if (isDigit(src[i])) {
    i += 1;
    for (;;) {
      if (isDigit(src[i])) i += 1;
      else if (src[i] === '_' && isDigit(src[i + 1])) i += 2;
      else break;
    }
  } else return null;
  const fpStart = i;
  const digitsRun = (j) => {
    // [0-9](?:_?[0-9])* starting at j (which is a digit)
    j += 1;
    for (;;) {
      if (isDigit(src[j])) j += 1;
      else if (src[j] === '_' && isDigit(src[j + 1])) j += 2;
      else return j;
    }
  };
  if (src[i] === '.' && isDigit(src[i + 1])) i = digitsRun(i + 1);
  if (src[i] === 'e' || src[i] === 'E') {
    let j = i + 1;
    if (src[j] === '+' || src[j] === '-') j += 1;
    if (isDigit(src[j])) i = digitsRun(j);
  }
  return { end: i, floatpart: sub(src, fpStart, i) };
}

// int(text, 0) for the decimal / 0x / 0o / 0b forms RE_NUMBER produces
function pyIntBase0(text) {
  let t = text.replace(/_/g, '');
  let neg = false;
  if (t[0] === '+' || t[0] === '-') { neg = t[0] === '-'; t = t.slice(1); }
  if (/^0[xob]/.test(t)) return BigInt(t); // power-of-two bases have no digit limit
  if (t.length > INT_MAX_STR_DIGITS) {
    throw new PyException('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${t.length} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  const v = BigInt(t);
  return neg ? -v : v;
}

// float(text) for TOML float text and inf / nan forms
const pyFloatOf = (text) => {
  const t = text.replace(/_/g, '');
  if (/^[+-]?inf$/.test(t)) return new PyFloat(t[0] === '-' ? -Infinity : Infinity);
  if (/^[+-]?nan$/.test(t)) return new PyFloat(NaN);
  return new PyFloat(Number(t));
};

// parse_float choices the demos offer: float (default), decimal.Decimal, str
export const PARSE_FLOAT = {
  float: pyFloatOf,
  Decimal: (text) => new PyDecimal(text),
  str: (text) => text,
};

function matchToDatetime(g) {
  const year = Number(g.year);
  const month = Number(g.month);
  const day = Number(g.day);
  if (g.time === null) return mkDate(year, month, day);
  const t = g.time;
  const micros = t.micros ? Number(t.micros.padEnd(6, '0')) : 0;
  let tz = null;
  if (g.offset) {
    const sign = g.offset.sign === '+' ? 1 : -1;
    tz = timezone(td(0, sign * (Number(g.offset.hour) * 3600 + Number(g.offset.minute) * 60)));
  } else if (g.zulu) {
    tz = timezone(td(0, 0));
  }
  return mkDatetime(year, month, day, Number(t.hour), Number(t.minute), Number(t.second), micros, tz);
}

function parseValue(src, pos, ctx) {
  const c = src[pos];

  if (c === '"') {
    if (startsWith(src, '"""', pos)) return parseMultilineStr(src, pos, false);
    return parseOneLineBasicStr(src, pos);
  }
  if (c === "'") {
    if (startsWith(src, "'''", pos)) return parseMultilineStr(src, pos, true);
    return parseLiteralStr(src, pos);
  }
  if (c === 't' && startsWith(src, 'true', pos)) return [pos + 4, true];
  if (c === 'f' && startsWith(src, 'false', pos)) return [pos + 5, false];
  if (c === '[' || c === '{') {
    ctx.depth += 1;
    if (ctx.depth > MAX_NESTING) {
      limit(`Arrays and inline tables nested more than ${MAX_NESTING} deep are not followed in the browser demo; CPython stops only at its recursion limit (RecursionError).`);
    }
    const r = c === '[' ? parseArray(src, pos, ctx) : parseInlineTable(src, pos, ctx);
    ctx.depth -= 1;
    return r;
  }

  const dm = matchDatetime(src, pos);
  if (dm) {
    let obj;
    try {
      obj = matchToDatetime(dm);
    } catch (e) {
      if (e && e.name === 'ValueError') throw suffixedErr(src, pos, 'Invalid date or datetime');
      throw e;
    }
    return [dm.end, obj];
  }
  const lt = matchTime(src, pos);
  if (lt) {
    const micros = lt.micros ? Number(lt.micros.padEnd(6, '0')) : 0;
    return [lt.end, mkTime(Number(lt.hour), Number(lt.minute), Number(lt.second), micros)];
  }
  const nm = matchNumber(src, pos);
  if (nm) {
    const text = sub(src, pos, nm.end);
    if (nm.floatpart) return [nm.end, ctx.parseFloat(text)];
    return [nm.end, pyIntBase0(text)];
  }
  const three = sub(src, pos, pos + 3);
  if (three === 'inf' || three === 'nan') return [pos + 3, ctx.parseFloat(three)];
  const four = sub(src, pos, pos + 4);
  if (four === '-inf' || four === '+inf' || four === '-nan' || four === '+nan') return [pos + 4, ctx.parseFloat(four)];

  throw suffixedErr(src, pos, 'Invalid value');
}

// make_safe_parse_float: anything but the built-in float is checked
function makeSafeParseFloat(name) {
  const fn = PARSE_FLOAT[name];
  if (!fn) limit(`parse_float=${name} is not one of the callables the browser demo knows (float, Decimal, str).`);
  if (name === 'float') return fn;
  return (text) => {
    const v = fn(text);
    if (v instanceof Map || Array.isArray(v)) throw new PyException('ValueError', 'parse_float must not return dicts or lists');
    return v;
  };
}

// tomllib.loads(s, /, *, parse_float=float)
export function loads(s, { parseFloat = 'float' } = {}) {
  if (typeof s !== 'string') throw new PyException('TypeError', 'loads() argument must be str');
  const src = Array.from(s.replace(/\r\n/g, '\n'));
  let pos = 0;
  const out = { data: new NestedDict(), flags: new Flags() };
  let header = [];
  const ctx = { parseFloat: makeSafeParseFloat(parseFloat), depth: 0 };

  for (;;) {
    pos = skipChars(src, pos, TOML_WS);
    if (pos >= src.length) break;
    let c = src[pos];
    if (c === '\n') {
      pos += 1;
      continue;
    }
    if (isKeyInitial(c)) {
      pos = keyValueRule(src, pos, out, header, ctx);
      pos = skipChars(src, pos, TOML_WS);
    } else if (c === '[') {
      const second = src[pos + 1];
      out.flags.finalize_pending();
      if (second === '[') [pos, header] = createListRule(src, pos, out);
      else [pos, header] = createDictRule(src, pos, out);
      pos = skipChars(src, pos, TOML_WS);
    } else if (c !== '#') {
      throw suffixedErr(src, pos, 'Invalid statement');
    }
    pos = skipComment(src, pos);
    if (pos >= src.length) break;
    c = src[pos];
    if (c !== '\n') throw suffixedErr(src, pos, 'Expected newline or end of document after a statement');
    pos += 1;
  }
  return out.data.dict;
}

// tomllib.load(fp): fp.read() must give bytes; then bytes.decode() (UTF-8)
export const TEXT_MODE_ERROR = "File must be opened in binary mode, e.g. use `open('foo.toml', 'rb')`";

// ─── repr ───────────────────────────────────────────────────
export function intRepr(n) {
  const s = n.toString();
  const digits = s[0] === '-' ? s.length - 1 : s.length;
  if (digits > INT_MAX_STR_DIGITS) {
    throw new PyException('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit`);
  }
  return s;
}

export function pyRepr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return intRepr(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (v instanceof PyDecimal) return `Decimal('${v.toString()}')`;
  if (v instanceof PyDateTime) return dtRepr(v);
  if (v instanceof PyDate) return dateRepr(v);
  if (v instanceof PyTime) return timeRepr(v);
  if (v instanceof Map) return '{' + [...v].map(([k, x]) => `${pyRepr(k)}: ${pyRepr(x)}`).join(', ') + '}';
  if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
  if (v.__pyTuple) return '(' + v.__pyTuple.map(pyRepr).join(', ') + (v.__pyTuple.length === 1 ? ',' : '') + ')';
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  return String(v);
}
export const asPy = (v) => ({ __pyRaw: pyRepr(v) });

// type(v).__name__
export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'string') return 'str';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof PyDecimal) return 'Decimal';
  if (v instanceof PyDateTime) return 'datetime';
  if (v instanceof PyDate) return 'date';
  if (v instanceof PyTime) return 'time';
  if (v instanceof Map) return 'dict';
  if (Array.isArray(v)) return 'list';
  return 'object';
}

// '\n'.join(lines) — the demos build a document from one input per line
export const joinLines = (...lines) => lines.join('\n');
