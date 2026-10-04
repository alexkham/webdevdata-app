// utils/emulators/python/stdlib/csv/_pycsv.js
//
// Port of CPython 3.13's csv module for the csv demos — shared by the csv
// hub and member emulators. Not a content page (leading underscore), so the
// catalog generator never maps it.
//
//   Modules/_csv.c  — Dialect validation (dialect_new), the reader state
//                     machine (parse_process_char / Reader_iternext), the
//                     writer (join_append_data / csv_writerow), the dialect
//                     registry and field_size_limit, with their exact
//                     error messages.
//   Lib/csv.py      — excel / excel_tab / unix_dialect, DictReader,
//                     DictWriter, Sniffer (sniff + has_header heuristics).
//   io.StringIO     — line splitting and newline translation for every
//                     newline= value (None, '', '\n', '\r', '\r\n').
//   float() / complex() string parsing — QUOTE_NONNUMERIC / QUOTE_STRINGS
//                     reading and Sniffer.has_header's type test.
//
// Value model is the json port's (../json/_pyjson.js): None → null,
// bool → boolean, int → bigint, float → PyFloat, str → string,
// list → Array, tuple → { __pyTuple }, dict → PyDict. Strings are handled
// as code points ([...s]), like Python str.
//
// Every emulator call builds a fresh module state (newCsv()), so registered
// dialects and field_size_limit never leak between demo runs.

import { PyFloat, PyDict, asPy, pyValRepr } from '../json/_pyjson.js';
import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

export { PyFloat, PyDict, asPy, pyValRepr };

export const QUOTE_MINIMAL = 0;
export const QUOTE_ALL = 1;
export const QUOTE_NONNUMERIC = 2;
export const QUOTE_NONE = 3;
export const QUOTE_STRINGS = 4;
export const QUOTE_NOTNULL = 5;
export const QUOTE_NAMES = ['QUOTE_MINIMAL', 'QUOTE_ALL', 'QUOTE_NONNUMERIC', 'QUOTE_NONE', 'QUOTE_STRINGS', 'QUOTE_NOTNULL'];

// csv.Error — tracebacks show it by its defining module: _csv.Error
export class CsvError extends PyException {
  constructor(msg) { super('_csv.Error', msg); }
}
const pyErr = (type, msg) => new PyException(type, msg);

const cps = (s) => [...s];

// type(v).__name__ in the value model
export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (v instanceof PyFloat) return 'float';
  if (typeof v === 'string') return 'str';
  if (Array.isArray(v)) return 'list';
  if (v instanceof PyDict) return 'dict';
  if (v && v.__pyTuple) return 'tuple';
  if (v && v.__bytes !== undefined) return 'bytes';
  return 'object';
}

// str(v)
export function pyStr(v) {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  return pyValRepr(v);
}

// bool(v)
function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (typeof v === 'bigint') return v !== 0n;
  if (typeof v === 'number') return v !== 0;
  if (v instanceof PyFloat) return v.v !== 0;
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof PyDict) return v.size > 0;
  return true;
}

// ─── float() / complex() of a str ───────────────────────────
// _PyUnicode_TransformDecimalAndSpaceToASCII: Unicode whitespace → ' ',
// Unicode decimal digits → ASCII digits, anything else non-ASCII (and DEL)
// → '?' and the string is cut there.
const PY_UNI_SPACE = new Set([0x85, 0xa0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000]);
const ND = /^\p{Nd}$/u;
function decimalValue(cp) {
  let start = cp;
  while (ND.test(String.fromCodePoint(start - 1))) start -= 1;
  return (cp - start) % 10;
}
function toAsciiNumber(s) {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp < 127) out += ch;
    else if (PY_UNI_SPACE.has(cp)) out += ' ';
    else if (ND.test(ch)) out += String(decimalValue(cp));
    else { out += '?'; break; }
  }
  return out;
}
// _Py_string_to_number_with_underscores: null when the underscores are bad
function stripUnderscores(s) {
  if (!s.includes('_')) return s;
  let out = '';
  let prev = '';
  for (const c of s) {
    if (c === '\0') return null; // embedded NUL
    if (c === '_') {
      if (!(prev >= '0' && prev <= '9')) return null;
    } else {
      out += c;
      if (prev === '_' && !(c >= '0' && c <= '9')) return null;
    }
    prev = c;
  }
  if (prev === '_') return null;
  return out;
}
const isPySpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\x0b' || c === '\x0c';
const isDigit = (c) => c >= '0' && c <= '9';
// PyOS_string_to_double prefix: _Py_dg_strtod (no leading space; sign,
// digits with optional point, optional exponent) else inf/infinity/nan.
// Returns { end, value } — end === i when nothing parses.
function strtod(s, i) {
  let j = i;
  let neg = false;
  if (s[j] === '+' || s[j] === '-') { neg = s[j] === '-'; j += 1; }
  const ds = j;
  while (isDigit(s[j] || '')) j += 1;
  let nd = j - ds;
  if (s[j] === '.') {
    j += 1;
    const fs = j;
    while (isDigit(s[j] || '')) j += 1;
    nd += j - fs;
  }
  if (nd > 0) {
    if (s[j] === 'e' || s[j] === 'E') {
      let k = j + 1;
      if (s[k] === '+' || s[k] === '-') k += 1;
      if (isDigit(s[k] || '')) {
        while (isDigit(s[k] || '')) k += 1;
        j = k;
      }
    }
    return { end: j, value: Number(s.slice(i, j)) };
  }
  // _Py_parse_inf_or_nan
  j = i;
  neg = false;
  if (s[j] === '-') { neg = true; j += 1; } else if (s[j] === '+') j += 1;
  const low = s.slice(j).toLowerCase();
  if (low.startsWith('inf')) {
    j += low.startsWith('infinity') ? 8 : 3;
    return { end: j, value: neg ? -Infinity : Infinity };
  }
  if (low.startsWith('nan')) return { end: j + 3, value: NaN };
  return { end: i, value: -1 };
}

// float(s) for a str → PyFloat, or ValueError like CPython
export function pyFloatFromStr(orig) {
  const fail = () => pyErr('ValueError', `could not convert string to float: ${pyStrRepr(orig)}`);
  const s = stripUnderscores(toAsciiNumber(orig));
  if (s === null) throw fail();
  let a = 0;
  let b = s.length;
  while (a < b && isPySpace(s[a])) a += 1;
  while (b - 1 > a && isPySpace(s[b - 1])) b -= 1;
  const t = s.slice(0, b);
  const r = strtod(t, a);
  if (r.end === a || r.end !== b) throw fail();
  return new PyFloat(r.value);
}

// complex(s) for a str: does it parse? (complex_from_string_inner)
export function complexParses(orig) {
  let s = stripUnderscores(toAsciiNumber(orig));
  if (s === null) return false;
  let i = 0;
  while (isPySpace(s[i] || '')) i += 1;
  let bracket = false;
  if (s[i] === '(') {
    bracket = true;
    i += 1;
    while (isPySpace(s[i] || '')) i += 1;
  }
  const isJ = (c) => c === 'j' || c === 'J';
  const z = strtod(s, i);
  if (z.end !== i) {
    i = z.end;
    if (s[i] === '+' || s[i] === '-') {
      const y = strtod(s, i);
      if (y.end !== i) i = y.end;
      else i += 1;
      if (!isJ(s[i])) return false;
      i += 1;
    } else if (isJ(s[i])) {
      i += 1;
    }
  } else {
    if (s[i] === '+' || s[i] === '-') i += 1;
    if (!isJ(s[i])) return false;
    i += 1;
  }
  while (isPySpace(s[i] || '')) i += 1;
  if (bracket) {
    if (s[i] !== ')') return false;
    i += 1;
    while (isPySpace(s[i] || '')) i += 1;
  }
  return i === s.length;
}

// ─── io.StringIO ────────────────────────────────────────────
// What StringIO(initial_value, newline) stores: newline=None translates
// \r\n and \r to \n; '\r' / '\r\n' translate \n to themselves.
export function stringIOTranslate(text, newline = '\n') {
  if (newline === null) return text.replace(/\r\n?/g, '\n');
  if (newline === '\r' || newline === '\r\n') return text.replace(/\n/g, newline);
  return text;
}
// list(StringIO(text, newline)) — the lines a csv.reader receives
export function stringIOLines(text, newline = '\n') {
  const t = stringIOTranslate(text, newline);
  const lines = [];
  if (newline === '') {
    // universal: a line ends at \n, \r\n or \r
    let start = 0;
    for (let i = 0; i < t.length; i += 1) {
      if (t[i] === '\n') { lines.push(t.slice(start, i + 1)); start = i + 1; }
      else if (t[i] === '\r') {
        const e = t[i + 1] === '\n' ? i + 2 : i + 1;
        lines.push(t.slice(start, e));
        start = e;
        i = e - 1;
      }
    }
    if (start < t.length) lines.push(t.slice(start));
    return lines;
  }
  const sep = newline === null ? '\n' : newline;
  let start = 0;
  for (;;) {
    const k = t.indexOf(sep, start);
    if (k === -1) break;
    lines.push(t.slice(start, k + sep.length));
    start = k + sep.length;
  }
  if (start < t.length) lines.push(t.slice(start));
  return lines;
}

// A StringIO used as a writer target: write() returns the number of code
// points written (what writerow returns).
export class StringIOOut {
  constructor(newline = '\n') { this.newline = newline; this.buf = ''; }
  write(s) {
    this.buf += stringIOTranslate(s, this.newline);
    return BigInt(cps(s).length);
  }
  getvalue() { return this.buf; }
}

// ─── Dialects ───────────────────────────────────────────────
// A Python dialect CLASS (csv.Dialect subclass, e.g. excel, a Sniffer
// result): { __class: name, attrs, base } — getattr walks the bases.
export class DialectClass {
  constructor(name, attrs, base = null) { this.name = name; this.attrs = attrs; this.base = base; }
  getattr(n) {
    for (let c = this; c; c = c.base) if (Object.prototype.hasOwnProperty.call(c.attrs, n)) return c.attrs[n];
    return undefined; // AttributeError → cleared
  }
}
// Lib/csv.py class Dialect: every setting is a None placeholder
export const DialectBase = new DialectClass('Dialect', {
  delimiter: null, quotechar: null, escapechar: null, doublequote: null,
  skipinitialspace: null, lineterminator: null, quoting: null,
});
export const excel = new DialectClass('excel', {
  delimiter: ',', quotechar: '"', doublequote: true, skipinitialspace: false, lineterminator: '\r\n', quoting: 0n,
}, DialectBase);
export const excel_tab = new DialectClass('excel_tab', { delimiter: '\t' }, excel);
export const unix_dialect = new DialectClass('unix_dialect', {
  delimiter: ',', quotechar: '"', doublequote: true, skipinitialspace: false, lineterminator: '\n', quoting: 1n,
}, DialectBase);

// _csv.Dialect instance (the validated, immutable settings)
export class CDialect {
  constructor(f) { Object.assign(this, f); }
  // attribute values as Python shows them
  attr(n) {
    switch (n) {
      case 'quoting': return BigInt(this.quoting);
      case 'delimiter': case 'quotechar': case 'escapechar': return this[n]; // null = None
      default: return this[n];
    }
  }
}

const SETTINGS = ['delimiter', 'doublequote', 'escapechar', 'lineterminator', 'quotechar', 'quoting', 'skipinitialspace', 'strict'];

function setChar(name, src, dflt) {
  if (src === undefined) return dflt;
  if (typeof src !== 'string') throw pyErr('TypeError', `"${name}" must be string, not ${typeName(src)}`);
  const c = cps(src);
  if (c.length !== 1) throw pyErr('TypeError', `"${name}" must be a 1-character string`);
  return c[0];
}
function setCharOrNone(name, src, dflt) {
  if (src === undefined) return dflt;
  if (src === null) return null;
  if (typeof src !== 'string') throw pyErr('TypeError', `"${name}" must be string or None, not ${typeName(src)}`);
  const c = cps(src);
  if (c.length !== 1) throw pyErr('TypeError', `"${name}" must be a 1-character string`);
  return c[0];
}
function setInt(name, src, dflt) {
  if (src === undefined) return dflt;
  let v;
  if (typeof src === 'bigint') v = src;
  else if (typeof src === 'number' && Number.isInteger(src)) v = BigInt(src);
  else throw pyErr('TypeError', `"${name}" must be an integer`);
  if (v > 2147483647n || v < -2147483648n) throw pyErr('OverflowError', 'Python int too large to convert to C int');
  return Number(v);
}
function setStr(name, src, dflt) {
  if (src === undefined) return dflt;
  if (src === null) return null;
  if (typeof src !== 'string') throw pyErr('TypeError', `"${name}" must be a string`);
  return src;
}
const setBool = (src, dflt) => (src === undefined ? dflt : truthy(src));

function checkChar(name, c, lineterminator, allowspace) {
  if (c === '\r' || c === '\n' || (c === ' ' && !allowspace)) throw pyErr('ValueError', `bad ${name} value`);
  if (c !== null && cps(lineterminator).includes(c)) throw pyErr('ValueError', `bad ${name} or lineterminator value`);
}
function checkChars(n1, n2, c1, c2) {
  if (c1 === c2 && c1 !== null) throw pyErr('ValueError', `bad ${n1} or ${n2} value`);
}

// Module state: dialect registry (insertion ordered) + field limit.
export function newCsv() {
  // fieldLimit: exact (bigint); limitNum: the same as a JS number for comparisons
  const mod = { dialects: new Map(), fieldLimit: 131072n, limitNum: 131072 };
  registerDialect(mod, 'excel', excel);
  registerDialect(mod, 'excel-tab', excel_tab);
  registerDialect(mod, 'unix', unix_dialect);
  return mod;
}

// dialect_new(dialect=None, **kw)
export function makeDialect(mod, dialect, kw = {}) {
  let d = dialect;
  const src = {};
  for (const k of SETTINGS) src[k] = kw[k];
  if (d !== undefined && d !== null) {
    if (typeof d === 'string') d = getDialect(mod, d);
    if (d instanceof CDialect && SETTINGS.every((k) => src[k] === undefined)) return d;
    for (const k of SETTINGS) {
      if (src[k] !== undefined) continue;
      if (d instanceof CDialect) src[k] = d.attr(k);
      else if (d instanceof DialectClass) src[k] = d.getattr(k);
    }
  }
  const self = {};
  self.delimiter = setChar('delimiter', src.delimiter, ',');
  self.doublequote = setBool(src.doublequote, true);
  self.escapechar = setCharOrNone('escapechar', src.escapechar, null);
  self.lineterminator = setStr('lineterminator', src.lineterminator, '\r\n');
  self.quotechar = setCharOrNone('quotechar', src.quotechar, '"');
  self.quoting = setInt('quoting', src.quoting, QUOTE_MINIMAL);
  self.skipinitialspace = setBool(src.skipinitialspace, false);
  self.strict = setBool(src.strict, false);

  if (!(self.quoting >= 0 && self.quoting <= 5)) throw pyErr('TypeError', 'bad "quoting" value');
  if (self.delimiter === null) throw pyErr('TypeError', '"delimiter" must be a 1-character string');
  if (src.quotechar === null && src.quoting === undefined) self.quoting = QUOTE_NONE;
  if (self.quoting !== QUOTE_NONE && self.quotechar === null) throw pyErr('TypeError', 'quotechar must be set if quoting enabled');
  if (self.lineterminator === null) throw pyErr('TypeError', 'lineterminator must be set');
  checkChar('delimiter', self.delimiter, self.lineterminator, true);
  checkChar('escapechar', self.escapechar, self.lineterminator, !self.skipinitialspace);
  checkChar('quotechar', self.quotechar, self.lineterminator, !self.skipinitialspace);
  checkChars('delimiter', 'escapechar', self.delimiter, self.escapechar);
  checkChars('delimiter', 'quotechar', self.delimiter, self.quotechar);
  checkChars('escapechar', 'quotechar', self.escapechar, self.quotechar);
  return new CDialect(self);
}

export function registerDialect(mod, name, dialect, kw = {}) {
  if (typeof name !== 'string') throw pyErr('TypeError', 'dialect name must be a string');
  const d = makeDialect(mod, dialect, kw);
  mod.dialects.set(name, d);
}
export function getDialect(mod, name) {
  if (typeof name === 'string' && mod.dialects.has(name)) return mod.dialects.get(name);
  throw new CsvError('unknown dialect');
}
export function unregisterDialect(mod, name) {
  if (typeof name === 'string' && mod.dialects.has(name)) { mod.dialects.delete(name); return null; }
  throw new CsvError('unknown dialect');
}
export const listDialects = (mod) => [...mod.dialects.keys()];

// field_size_limit([new_limit]) → old limit (bigint)
export function fieldSizeLimit(mod, newLimit) {
  const old = mod.fieldLimit;
  if (newLimit !== undefined) {
    let v;
    if (typeof newLimit === 'bigint') v = newLimit;
    else if (typeof newLimit === 'number' && Number.isInteger(newLimit)) v = BigInt(newLimit);
    else throw pyErr('TypeError', 'limit must be an integer');
    if (v > 9223372036854775807n || v < -9223372036854775808n) throw pyErr('OverflowError', 'Python int too large to convert to C ssize_t');
    mod.fieldLimit = v;
    mod.limitNum = Number(v);
  }
  return old;
}

// ─── Reader ─────────────────────────────────────────────────
const START_RECORD = 0;
const START_FIELD = 1;
const ESCAPED_CHAR = 2;
const IN_FIELD = 3;
const IN_QUOTED_FIELD = 4;
const ESCAPE_IN_QUOTED_FIELD = 5;
const QUOTE_IN_QUOTED_FIELD = 6;
const EAT_CRNL = 7;
const AFTER_ESCAPED_CRNL = 8;
const EOL = Symbol('EOL');

export class Reader {
  // lines: array (or iterator) of str; dialect/kw as for csv.reader
  constructor(mod, lines, dialect, kw = {}) {
    this.mod = mod;
    this.it = (Array.isArray(lines) ? lines : [...lines])[Symbol.iterator]();
    this.dialect = makeDialect(mod, dialect, kw);
    this.line_num = 0;
    this.fields = [];
    this.field = [];
    this.state = START_RECORD;
    this.unquoted = false;
  }

  saveField() {
    const q = this.dialect.quoting;
    let v;
    if (this.unquoted && this.field.length === 0 && (q === QUOTE_NOTNULL || q === QUOTE_STRINGS)) {
      v = null;
    } else {
      v = this.field.join('');
      if (this.unquoted && this.field.length !== 0 && (q === QUOTE_NONNUMERIC || q === QUOTE_STRINGS)) {
        v = pyFloatFromStr(v);
      }
      this.field = [];
    }
    this.fields.push(v);
  }

  addChar(c) {
    if (this.field.length >= this.mod.limitNum) throw new CsvError(`field larger than field limit (${this.mod.fieldLimit})`);
    this.field.push(c);
  }

  processChar(c) {
    const d = this.dialect;
    switch (this.state) {
      case START_RECORD:
        if (c === EOL) break;
        if (c === '\n' || c === '\r') { this.state = EAT_CRNL; break; }
        this.state = START_FIELD;
      // fallthrough
      case START_FIELD:
        this.unquoted = true;
        if (c === '\n' || c === '\r' || c === EOL) {
          this.saveField();
          this.state = c === EOL ? START_RECORD : EAT_CRNL;
        } else if (c === d.quotechar && d.quoting !== QUOTE_NONE) {
          this.unquoted = false;
          this.state = IN_QUOTED_FIELD;
        } else if (c === d.escapechar) {
          this.state = ESCAPED_CHAR;
        } else if (c === ' ' && d.skipinitialspace) {
          // ignore spaces at start of field
        } else if (c === d.delimiter) {
          this.saveField();
        } else {
          this.addChar(c);
          this.state = IN_FIELD;
        }
        break;

      case ESCAPED_CHAR:
        if (c === '\n' || c === '\r') {
          this.addChar(c);
          this.state = AFTER_ESCAPED_CRNL;
          break;
        }
        this.addChar(c === EOL ? '\n' : c);
        this.state = IN_FIELD;
        break;

      case AFTER_ESCAPED_CRNL:
        if (c === EOL) break;
      // fallthrough
      case IN_FIELD:
        if (c === '\n' || c === '\r' || c === EOL) {
          this.saveField();
          this.state = c === EOL ? START_RECORD : EAT_CRNL;
        } else if (c === d.escapechar) {
          this.state = ESCAPED_CHAR;
        } else if (c === d.delimiter) {
          this.saveField();
          this.state = START_FIELD;
        } else {
          this.addChar(c);
        }
        break;

      case IN_QUOTED_FIELD:
        if (c === EOL) {
          // a line break inside quotes: keep reading lines
        } else if (c === d.escapechar) {
          this.state = ESCAPE_IN_QUOTED_FIELD;
        } else if (c === d.quotechar && d.quoting !== QUOTE_NONE) {
          this.state = d.doublequote ? QUOTE_IN_QUOTED_FIELD : IN_FIELD;
        } else {
          this.addChar(c);
        }
        break;

      case ESCAPE_IN_QUOTED_FIELD:
        this.addChar(c === EOL ? '\n' : c);
        this.state = IN_QUOTED_FIELD;
        break;

      case QUOTE_IN_QUOTED_FIELD:
        if (d.quoting !== QUOTE_NONE && c === d.quotechar) {
          this.addChar(c);
          this.state = IN_QUOTED_FIELD;
        } else if (c === d.delimiter) {
          this.saveField();
          this.state = START_FIELD;
        } else if (c === '\n' || c === '\r' || c === EOL) {
          this.saveField();
          this.state = c === EOL ? START_RECORD : EAT_CRNL;
        } else if (!d.strict) {
          this.addChar(c);
          this.state = IN_FIELD;
        } else {
          throw new CsvError(`'${d.delimiter}' expected after '${d.quotechar}'`);
        }
        break;

      case EAT_CRNL:
        if (c === '\n' || c === '\r') break;
        if (c === EOL) { this.state = START_RECORD; break; }
        throw new CsvError("new-line character seen in unquoted field - do you need to open the file with newline=''?");

      default:
        break;
    }
  }

  // next(reader): a row (list), or DONE at the end
  next() {
    this.fields = [];
    this.field = [];
    this.state = START_RECORD;
    this.unquoted = false;
    do {
      const r = this.it.next();
      if (r.done) {
        if (this.field.length !== 0 || this.state === IN_QUOTED_FIELD) {
          if (this.dialect.strict) throw new CsvError('unexpected end of data');
          this.saveField();
          break;
        }
        return DONE;
      }
      const line = r.value;
      if (typeof line !== 'string') {
        throw new CsvError(`iterator should return strings, not ${typeName(line)} (the file should be opened in text mode)`);
      }
      this.line_num += 1;
      for (const c of line) this.processChar(c);
      this.processChar(EOL);
    } while (this.state !== START_RECORD);
    const f = this.fields;
    this.fields = [];
    return f;
  }

  // list(reader)
  all() {
    const rows = [];
    for (let r = this.next(); r !== DONE; r = this.next()) rows.push(r);
    return rows;
  }
}
export const DONE = Symbol('StopIteration');

// list(csv.reader(io.StringIO(text, newline=newline), dialect, **kw))
export function readAll(text, kw = {}, { newline = '', dialect, mod = newCsv() } = {}) {
  return new Reader(mod, stringIOLines(text, newline), dialect, kw).all();
}

// ─── Writer ─────────────────────────────────────────────────
const isNumber = (v) => typeof v === 'bigint' || typeof v === 'boolean' || v instanceof PyFloat;

export class Writer {
  constructor(mod, out, dialect, kw = {}) {
    this.mod = mod;
    this.out = out;
    this.dialect = makeDialect(mod, dialect, kw);
  }

  // join_append: returns the record text so far
  joinAppend(field, quoted) {
    const d = this.dialect;
    const chars = field === null ? [] : cps(field);
    if (chars.length === 0 && d.delimiter === ' ' && d.skipinitialspace) {
      if (d.quoting === QUOTE_NONE || (field === null && (d.quoting === QUOTE_STRINGS || d.quoting === QUOTE_NOTNULL))) {
        throw new CsvError('empty field must be quoted if delimiter is a space and skipinitialspace is true');
      }
      quoted = true;
    }
    const lt = cps(d.lineterminator);
    let body = '';
    for (const c of chars) {
      if (c === d.delimiter || c === d.escapechar || c === d.quotechar || c === '\n' || c === '\r' || lt.includes(c)) {
        let wantEscape = false;
        if (d.quoting === QUOTE_NONE) wantEscape = true;
        else {
          if (c === d.quotechar) {
            if (d.doublequote) body += d.quotechar;
            else wantEscape = true;
          } else if (c === d.escapechar) {
            wantEscape = true;
          }
          if (!wantEscape) quoted = true;
        }
        if (wantEscape) {
          if (d.escapechar === null) throw new CsvError('need to escape, but no escapechar set');
          body += d.escapechar;
        }
      }
      body += c;
    }
    const q = quoted ? d.quotechar : '';
    this.rec += (this.numFields > 0 ? d.delimiter : '') + q + body + q;
    this.numFields += 1;
  }

  // writerow(row) → what out.write returned
  writerow(row) {
    const d = this.dialect;
    let items;
    if (typeof row === 'string') items = cps(row);
    else if (Array.isArray(row)) items = row;
    else if (row && row.__pyTuple) items = row.__pyTuple;
    else if (row instanceof PyDict) items = row.entries.map(([k]) => k);
    else if (row && typeof row[Symbol.iterator] === 'function') items = [...row];
    else throw new CsvError(`iterable expected, not ${typeName(row)}`);
    this.rec = '';
    this.numFields = 0;
    let nullField = false;
    for (const field of items) {
      let quoted;
      switch (d.quoting) {
        case QUOTE_NONNUMERIC: quoted = !isNumber(field); break;
        case QUOTE_ALL: quoted = true; break;
        case QUOTE_STRINGS: quoted = typeof field === 'string'; break;
        case QUOTE_NOTNULL: quoted = field !== null; break;
        default: quoted = false;
      }
      nullField = field === null;
      this.joinAppend(nullField ? null : pyStr(field), quoted);
    }
    if (this.numFields > 0 && this.rec.length === 0) {
      if (d.quoting === QUOTE_NONE || (nullField && (d.quoting === QUOTE_STRINGS || d.quoting === QUOTE_NOTNULL))) {
        throw new CsvError('single empty field record must be quoted');
      }
      this.numFields -= 1;
      this.joinAppend(null, true);
    }
    return this.out.write(this.rec + d.lineterminator);
  }

  writerows(rows) {
    for (const r of rows) this.writerow(r);
    return null;
  }
}

// write rows with csv.writer(io.StringIO(newline=…), …) → getvalue()
export function writeAll(rows, kw = {}, { newline = '', dialect, mod = newCsv() } = {}) {
  const out = new StringIOOut(newline);
  const w = new Writer(mod, out, dialect, kw);
  for (const r of rows) w.writerow(r);
  return out.getvalue();
}

// ─── DictReader / DictWriter (Lib/csv.py) ───────────────────
export class DictReader {
  constructor(mod, lines, { fieldnames = null, restkey = null, restval = null, dialect = 'excel', kw = {} } = {}) {
    this._fieldnames = fieldnames;
    this.restkey = restkey;
    this.restval = restval;
    this.reader = new Reader(mod, lines, dialect, kw);
    this.line_num = 0;
  }
  get fieldnames() {
    if (this._fieldnames === null) {
      const r = this.reader.next();
      if (r !== DONE) this._fieldnames = r;
    }
    this.line_num = this.reader.line_num;
    return this._fieldnames;
  }
  next() {
    if (this.line_num === 0) this.fieldnames; // eslint-disable-line no-unused-expressions
    let row = this.reader.next();
    if (row === DONE) return DONE;
    this.line_num = this.reader.line_num;
    while (row.length === 0) {
      row = this.reader.next();
      if (row === DONE) return DONE;
    }
    const names = this.fieldnames;
    if (names === null) throw pyErr('TypeError', "'NoneType' object is not iterable");
    const d = new PyDict();
    const n = Math.min(names.length, row.length);
    for (let i = 0; i < n; i += 1) d.set(names[i], row[i]);
    if (names.length < row.length) d.set(this.restkey, row.slice(names.length));
    else if (names.length > row.length) for (const k of names.slice(row.length)) d.set(k, this.restval);
    return d;
  }
  all() {
    const out = [];
    for (let r = this.next(); r !== DONE; r = this.next()) out.push(r);
    return out;
  }
}

export class DictWriter {
  constructor(mod, out, fieldnames, { restval = '', extrasaction = 'raise', dialect = 'excel', kw = {} } = {}) {
    this.fieldnames = fieldnames;
    this.restval = restval;
    const ea = String(extrasaction).toLowerCase();
    if (ea !== 'raise' && ea !== 'ignore') throw pyErr('ValueError', `extrasaction (${ea}) must be 'raise' or 'ignore'`);
    this.extrasaction = ea;
    this.writer = new Writer(mod, out, dialect, kw);
  }
  writeheader() {
    const header = new PyDict(this.fieldnames.map((f) => [f, f]));
    return this.writerow(header);
  }
  // rowdict: PyDict. With several unknown keys CPython lists them in SET
  // order (hash-randomized per process); this lists them in dict order.
  dictToList(rowdict) {
    if (this.extrasaction === 'raise') {
      const wrong = rowdict.entries.map(([k]) => k).filter((k) => !this.fieldnames.includes(k));
      if (wrong.length) throw pyErr('ValueError', 'dict contains fields not in fieldnames: ' + wrong.map((x) => pyValRepr(x)).join(', '));
    }
    return this.fieldnames.map((k) => {
      const i = rowdict.indexOf(k);
      return i === -1 ? this.restval : rowdict.entries[i][1];
    });
  }
  writerow(rowdict) { return this.writer.writerow(this.dictToList(rowdict)); }
  // map() is lazy: earlier rows are written before a bad one raises
  writerows(rowdicts) {
    for (const r of rowdicts) this.writer.writerow(this.dictToList(r));
    return null;
  }
}

// ─── Sniffer (Lib/csv.py) ───────────────────────────────────
// Python str-pattern classes: \w = letters, numbers and _ (Unicode);
// MULTILINE ^ / $ only around \n; DOTALL . = any character.
const W = '\\p{L}\\p{N}_';
const BOL = '(?<![^\\n])';
const EOLX = '(?![^\\n])';
const ANY = '[^]';
const SNIFF_PATTERNS = [
  { re: `(?<delim>[^${W}\\n"'])(?<space> ?)(?<quote>["'])${ANY}*?\\k<quote>\\k<delim>`, groups: { delim: 1, space: 2, quote: 3 } },
  { re: `(?:${BOL}|\\n)(?<quote>["'])${ANY}*?\\k<quote>(?<delim>[^${W}\\n"'])(?<space> ?)`, groups: { quote: 1, delim: 2, space: 3 } },
  { re: `(?<delim>[^${W}\\n"'])(?<space> ?)(?<quote>["'])${ANY}*?\\k<quote>(?:${EOLX}|\\n)`, groups: { delim: 1, space: 2, quote: 3 } },
  { re: `(?:${BOL}|\\n)(?<quote>["'])${ANY}*?\\k<quote>(?:${EOLX}|\\n)`, groups: { quote: 1 } },
];
const reChar = (c) => (c === '' ? '' : `\\u{${c.codePointAt(0).toString(16)}}`);

// max(d, key=d.get) — the first key with the largest value
function maxKey(m) {
  let best;
  let bv;
  for (const [k, v] of m) if (best === undefined || v > bv) { best = k; bv = v; }
  return best;
}
const inDelims = (delimiters, k) => delimiters === null || delimiters === undefined || cps(delimiters).includes(k) || (Array.isArray(delimiters) && delimiters.includes(k));

function guessQuoteAndDelimiter(data, delimiters) {
  let matches = [];
  let groups = null;
  for (const p of SNIFF_PATTERNS) {
    matches = [...data.matchAll(new RegExp(p.re, 'gu'))];
    groups = p.groups;
    if (matches.length) break;
  }
  if (!matches.length) return { quotechar: '', doublequote: false, delim: null, skip: 0n };
  const quotes = new Map();
  const delims = new Map();
  let spaces = 0;
  for (const m of matches) {
    const key = m.groups.quote;
    if (key) quotes.set(key, (quotes.get(key) || 0) + 1);
    if (!groups.delim) continue;
    const dk = m.groups.delim;
    if (dk && inDelims(delimiters, dk)) delims.set(dk, (delims.get(dk) || 0) + 1);
    if (!groups.space) continue;
    if (m.groups.space) spaces += 1;
  }
  const quotechar = maxKey(quotes);
  let delim;
  let skip;
  if (delims.size) {
    delim = maxKey(delims);
    skip = delims.get(delim) === spaces;
    if (delim === '\n') delim = '';
  } else {
    delim = '';
    skip = 0n;
  }
  const D = reChar(delim);
  const Q = quotechar;
  const NW = `[^${W}]`;
  const dq = new RegExp(`((${D})|${BOL})${NW}*${Q}[^${D}\\n]*${Q}[^${D}\\n]*${Q}${NW}*((${D})|${EOLX})`, 'u');
  return { quotechar, doublequote: dq.test(data), delim, skip };
}

function guessDelimiter(sniffer, dataText, delimiters) {
  const data = dataText.split('\n').filter((x) => x !== '');
  const counts = data.map((line) => {
    const c = new Array(127).fill(0);
    for (let i = 0; i < line.length; i += 1) {
      const k = line.charCodeAt(i);
      if (k < 127) c[k] += 1;
    }
    return c;
  });
  const chunkLength = Math.min(10, data.length);
  let iteration = 0;
  const charFrequency = new Map(); // char → Map(freq → count)
  const modes = new Map();
  const delims = new Map();
  let start = 0;
  let end = chunkLength;
  const skipOf = (d) => {
    const line = data[0];
    return line.split(d).length - 1 === line.split(d + ' ').length - 1;
  };
  while (start < data.length) {
    iteration += 1;
    for (let li = start; li < Math.min(end, data.length); li += 1) {
      for (let k = 0; k < 127; k += 1) {
        const ch = String.fromCharCode(k);
        const meta = charFrequency.get(ch) || new Map();
        const freq = counts[li][k];
        meta.set(freq, (meta.get(freq) || 0) + 1);
        charFrequency.set(ch, meta);
      }
    }
    for (const [ch, meta] of charFrequency) {
      const items = [...meta.entries()];
      if (items.length === 1 && items[0][0] === 0) continue;
      if (items.length > 1) {
        let mi = 0;
        for (let i = 1; i < items.length; i += 1) if (items[i][1] > items[mi][1]) mi = i;
        const mode = items[mi];
        let rest = 0;
        items.forEach((it, i) => { if (i !== mi) rest += it[1]; });
        modes.set(ch, [mode[0], mode[1] - rest]);
      } else {
        modes.set(ch, items[0]);
      }
    }
    const total = Math.min(chunkLength * iteration, data.length);
    let consistency = 1.0;
    const threshold = 0.9;
    while (delims.size === 0 && consistency >= threshold) {
      for (const [k, v] of modes) {
        if (v[0] > 0 && v[1] > 0) {
          if (v[1] / total >= consistency && inDelims(delimiters, k)) delims.set(k, v);
        }
      }
      consistency -= 0.01;
    }
    if (delims.size === 1) {
      const delim = [...delims.keys()][0];
      return { delim, skip: skipOf(delim) };
    }
    start = end;
    end += chunkLength;
  }
  if (!delims.size) return { delim: '', skip: 0n };
  if (delims.size > 1) {
    for (const d of sniffer.preferred) {
      if (delims.has(d)) return { delim: d, skip: skipOf(d) };
    }
  }
  // items = sorted((v, k)); the last one
  const items = [...delims.entries()].map(([k, v]) => [v, k]);
  items.sort((a, b) => (a[0][0] - b[0][0]) || (a[0][1] - b[0][1]) || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
  const delim = items[items.length - 1][1];
  return { delim, skip: skipOf(delim) };
}

export class Sniffer {
  constructor() { this.preferred = [',', '\t', ';', ' ', ':']; }

  // → a DialectClass named 'dialect' (subclass of csv.Dialect)
  sniff(sample, delimiters = null) {
    let { quotechar, doublequote, delim, skip } = guessQuoteAndDelimiter(sample, delimiters);
    if (!delim) ({ delim, skip } = guessDelimiter(this, sample, delimiters));
    if (!delim) throw new CsvError('Could not determine delimiter');
    return new DialectClass('dialect', {
      _name: 'sniffed', lineterminator: '\r\n', quoting: 0n,
      doublequote, delimiter: delim, quotechar: quotechar || '"', skipinitialspace: skip,
    }, DialectBase);
  }

  has_header(sample, mod = newCsv()) {
    const rdr = new Reader(mod, stringIOLines(sample, '\n'), this.sniff(sample));
    const header = rdr.next();
    if (header === DONE) throw new PyException('StopIteration', '');
    const columns = header.length;
    const columnTypes = new Map();
    for (let i = 0; i < columns; i += 1) columnTypes.set(i, null); // null = None
    let checked = 0;
    for (let row = rdr.next(); row !== DONE; row = rdr.next()) {
      if (checked > 20) break;
      checked += 1;
      if (row.length !== columns) continue;
      for (const col of [...columnTypes.keys()]) {
        // complex(row[col]) — else the length of the string
        const cell = row[col];
        const thisType = complexParses(cell) ? 'complex' : cps(cell).length;
        if (thisType !== columnTypes.get(col)) {
          if (columnTypes.get(col) === null) columnTypes.set(col, thisType);
          else columnTypes.delete(col);
        }
      }
    }
    let hasHeader = 0;
    for (const [col, colType] of columnTypes) {
      if (typeof colType === 'number') {
        if (cps(header[col]).length !== colType) hasHeader += 1;
        else hasHeader -= 1;
      } else if (colType === null) {
        hasHeader += 1; // None(header[col]) → TypeError
      } else if (complexParses(header[col])) hasHeader -= 1;
      else hasHeader += 1;
    }
    return hasHeader > 0;
  }
}

// ─── demo helpers ───────────────────────────────────────────
// The demos write {$text}.replace('\\n', '\n'): a typed backslash-n is a
// line break (input boxes are single-line).
export const typed = (text) => text.replace(/\\n/g, '\n');

// A value from an 'auto' input as CPython reads it from the demo code:
// a str stays a str; a number is whatever its literal text is (int or
// float; inf → NameError).
export function autoVal(v, suggest) {
  if (typeof v === 'string') return v;
  const n = fromLiteral(v, suggest);
  return n.int !== undefined ? n.int : new PyFloat(n.float);
}

// next(iterator) on an exhausted reader
export function nextRow(r) {
  const row = r.next();
  if (row === DONE) throw new PyException('StopIteration', '');
  return row;
}

// A sniffed / class dialect's settings as Python reads them off the class
export function dialectAttr(d, name) {
  if (d instanceof CDialect) return d.attr(name);
  return d.getattr(name);
}
