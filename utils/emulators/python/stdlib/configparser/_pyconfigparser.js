// utils/emulators/python/stdlib/configparser/_pyconfigparser.js
//
// Line-by-line port of CPython 3.13.3's Lib/configparser.py for the
// configparser demos — shared by the module hub and every member emulator.
// Not a content page (leading underscore), so the catalog generator never
// maps it.
//
// Covered: RawConfigParser / ConfigParser (every constructor option),
// _read with _Line comment stripping, continuation lines, strict duplicate
// checks and ParsingError collection, the getters with int()/float()
// conversion exactly as CPython parses strings, items/options/has_*,
// set/remove_*, write(), the mapping protocol, SectionProxy,
// ConverterMapping, Interpolation / BasicInterpolation /
// ExtendedInterpolation and every exception message.
//
// Value model (JS side):
//   str → string · None → null · int → bigint · float → PyFloat
//   bool → true/false · list → Array · tuple → { __pyTuple: [...] }
//   dict → Map · section names are strings, or UNNAMED_SECTION
// pyv(value) renders repr() exactly.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

export class PyFloat {
  constructor(v) { this.v = v; }
}
export const tuple = (...items) => ({ __pyTuple: items });
const raise = (type, msg = '') => { throw new PyException(type, msg); };
export const limit = (msg) => { throw new PyException('DemoLimit', msg); };

export const DEFAULTSECT = 'DEFAULT';
export const MAX_INTERPOLATION_DEPTH = 10;

// the _UnnamedSection sentinel (repr '<UNNAMED_SECTION>')
export const UNNAMED_SECTION = Object.freeze({ __pyRaw: '<UNNAMED_SECTION>' });
const UNSET = Symbol('_UNSET');
export { UNSET };

// ─── Python str helpers ─────────────────────────────────────
// str.isspace() / re's \s for str patterns
const WS_SRC = '\\t\\n\\x0b\\x0c\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000';
const WS_RE = new RegExp(`[${WS_SRC}]`);
const NONSPACE_RE = new RegExp(`[^${WS_SRC}]`);
const isWs = (c) => WS_RE.test(c);
export function pyStrip(s) {
  let a = 0;
  let b = s.length;
  while (a < b && isWs(s[a])) a += 1;
  while (b > a && isWs(s[b - 1])) b -= 1;
  return s.slice(a, b);
}
export function pyRstrip(s) {
  let b = s.length;
  while (b > 0 && isWs(s[b - 1])) b -= 1;
  return s.slice(0, b);
}
// index of a UTF-16 offset counted in code points (Python str index)
const cpIndex = (s, unitIndex) => Array.from(s.slice(0, unitIndex)).length;
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

// repr() of any engine value
export function pyv(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (v instanceof SectionProxy) return `<Section: ${pyStr(v._name)}>`;
  if (v instanceof Map) return '{' + [...v].map(([k, x]) => `${pyv(k)}: ${pyv(x)}`).join(', ') + '}';
  if (Array.isArray(v)) return '[' + v.map(pyv).join(', ') + ']';
  if (v.__pyTuple) return '(' + v.__pyTuple.map(pyv).join(', ') + (v.__pyTuple.length === 1 ? ',' : '') + ')';
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  return String(v);
}
export const asPy = (v) => ({ __pyRaw: pyv(v) });

// str() of an engine value
export function pyStr(v) {
  if (typeof v === 'string') return v;
  return pyv(v);
}
export function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'string') return 'str';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof Map) return 'dict';
  if (Array.isArray(v)) return 'list';
  if (v.__pyTuple) return 'tuple';
  if (v instanceof SectionProxy) return 'SectionProxy';
  if (v === UNNAMED_SECTION) return '_UnnamedSection';
  return 'object';
}
const truthy = (v) => {
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === 'string') return v.length > 0;
  if (typeof v === 'bigint') return v !== 0n;
  if (v instanceof PyFloat) return v.v !== 0;
  if (v instanceof Map) return v.size > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
};
// `needle in v` for a str needle
function pyContains(v, needle) {
  if (typeof v !== 'string') raise('TypeError', `argument of type '${pyTypeName(v)}' is not iterable`);
  return v.includes(needle);
}

// ─── int() / float() of a str, as CPython parses it ─────────
// _PyUnicode_TransformDecimalAndSpaceToASCII: non-ASCII whitespace → ' ',
// Unicode decimal digits → ASCII, any other non-ASCII char → invalid.
// Leading/trailing ASCII whitespace (' \t\n\v\f\r') is then skipped.
const ND_ZEROS = [0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xde6, 0xe50, 0xed0, 0xf20, 0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0, 0x1c40, 0x1c50, 0xa620, 0xa8d0, 0xa900, 0xa9d0, 0xa9f0, 0xaa50, 0xabf0, 0xff10, 0x104a0, 0x10d30, 0x11066, 0x110f0, 0x11136, 0x111d0, 0x112f0, 0x11450, 0x114d0, 0x11650, 0x116c0, 0x11730, 0x118e0, 0x11950, 0x11c50, 0x11d50, 0x11da0, 0x11f50, 0x16a60, 0x16ac0, 0x16b50, 0x1d7ce, 0x1d7d8, 0x1d7e2, 0x1d7ec, 0x1d7f6, 0x1e140, 0x1e2f0, 0x1e4f0, 0x1e950, 0x1fbf0];
function toAsciiNumber(s) {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp < 128) { out += ch; continue; }
    if (isWs(ch)) { out += ' '; continue; }
    const z = ND_ZEROS.find((zero) => cp >= zero && cp <= zero + 9);
    if (z !== undefined) { out += String(cp - z); continue; }
    return null;
  }
  return out;
}
const ASCII_WS = /^[ \t\n\x0b\x0c\r]+|[ \t\n\x0b\x0c\r]+$/g;
export const INT_MAX_STR_DIGITS = 4300;

// int(x) for the values a parser can hold
export function pyInt(v) {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'boolean') return v ? 1n : 0n;
  if (v instanceof PyFloat) {
    if (!Number.isFinite(v.v)) raise(Number.isNaN(v.v) ? 'ValueError' : 'OverflowError', Number.isNaN(v.v) ? 'cannot convert float NaN to integer' : 'cannot convert float infinity to integer');
    return BigInt(Math.trunc(v.v));
  }
  if (typeof v !== 'string') raise('TypeError', `int() argument must be a string, a bytes-like object or a real number, not '${pyTypeName(v)}'`);
  const bad = () => raise('ValueError', `invalid literal for int() with base 10: ${pyStrRepr(v)}`);
  const a = toAsciiNumber(v);
  if (a === null) bad();
  const t = a.replace(ASCII_WS, '');
  const m = /^([+-]?)(\d(?:_?\d)*)$/.exec(t);
  if (!m) bad();
  const digits = m[2].replace(/_/g, '');
  if (digits.length > INT_MAX_STR_DIGITS) {
    raise('ValueError', `Exceeds the limit (${INT_MAX_STR_DIGITS} digits) for integer string conversion: value has ${digits.length} digits; use sys.set_int_max_str_digits() to increase the limit`);
  }
  const n = BigInt(digits);
  return m[1] === '-' ? -n : n;
}

// float(x)
export function pyFloat(v) {
  if (v instanceof PyFloat) return v;
  if (typeof v === 'bigint') return new PyFloat(Number(v));
  if (typeof v === 'boolean') return new PyFloat(v ? 1 : 0);
  if (typeof v !== 'string') raise('TypeError', `float() argument must be a string or a real number, not '${pyTypeName(v)}'`);
  const bad = () => raise('ValueError', `could not convert string to float: ${pyStrRepr(v)}`);
  const a = toAsciiNumber(v);
  if (a === null) bad();
  const t = a.replace(ASCII_WS, '');
  const special = /^([+-]?)(inf|infinity|nan)$/i.exec(t);
  if (special) {
    if (special[2].toLowerCase() === 'nan') return new PyFloat(NaN);
    return new PyFloat(special[1] === '-' ? -Infinity : Infinity);
  }
  const D = '\\d(?:_?\\d)*';
  const re = new RegExp(`^[+-]?(?:${D}(?:\\.(?:${D})?)?|\\.${D})(?:[eE][+-]?${D})?$`);
  if (!re.test(t)) bad();
  return new PyFloat(Number(t.replace(/_/g, '')));
}

// ─── exceptions ─────────────────────────────────────────────
// configparser.Error: str(e) is e.message; tracebacks show configparser.<Name>
export class ConfigError extends PyException {
  constructor(name, msg = '') {
    super(`configparser.${name}`, msg);
    this.pyName = name;
  }
}
export class NoSectionError extends ConfigError {
  constructor(section) {
    super('NoSectionError', `No section: ${pyv(section)}`);
    this.section = section;
    this.args = [section];
  }
}
export class DuplicateSectionError extends ConfigError {
  constructor(section, source = null, lineno = null, name = 'DuplicateSectionError') {
    let msg = `${pyv(section)} already exists`;
    if (source !== null) {
      let m = `While reading from ${pyv(source)}`;
      if (lineno !== null) m += ` [line ${String(lineno).padStart(2)}]`;
      msg = `${m}: section ${msg}`;
    } else msg = `Section ${msg}`;
    super(name, msg);
    Object.assign(this, { section, source, lineno, args: [section, source, lineno] });
  }
}
export class DuplicateOptionError extends ConfigError {
  constructor(section, option, source = null, lineno = null) {
    let msg = `${pyv(option)} in section ${pyv(section)} already exists`;
    if (source !== null) {
      let m = `While reading from ${pyv(source)}`;
      if (lineno !== null) m += ` [line ${String(lineno).padStart(2)}]`;
      msg = `${m}: option ${msg}`;
    } else msg = `Option ${msg}`;
    super('DuplicateOptionError', msg);
    Object.assign(this, { section, option, source, lineno, args: [section, option, source, lineno] });
  }
}
export class NoOptionError extends ConfigError {
  constructor(option, section) {
    super('NoOptionError', `No option ${pyv(option)} in section: ${pyv(section)}`);
    Object.assign(this, { option, section, args: [option, section] });
  }
}
export class InterpolationError extends ConfigError {
  constructor(option, section, msg, name = 'InterpolationError') {
    super(name, msg);
    Object.assign(this, { option, section, args: [option, section, msg] });
  }
}
export class InterpolationMissingOptionError extends InterpolationError {
  constructor(option, section, rawval, reference) {
    super(option, section, `Bad value substitution: option ${pyv(option)} in section ${pyv(section)} contains an interpolation key ${pyv(reference)} which is not a valid option name. Raw value: ${pyv(rawval)}`, 'InterpolationMissingOptionError');
    this.reference = reference;
    this.args = [option, section, rawval, reference];
  }
}
export class InterpolationSyntaxError extends InterpolationError {
  constructor(option, section, msg) {
    super(option, section, msg, 'InterpolationSyntaxError');
  }
}
export class InterpolationDepthError extends InterpolationError {
  constructor(option, section, rawval) {
    super(option, section, `Recursion limit exceeded in value substitution: option ${pyv(option)} in section ${pyv(section)} contains an interpolation key which cannot be substituted in ${MAX_INTERPOLATION_DEPTH} steps. Raw value: ${pyv(rawval)}`, 'InterpolationDepthError');
    this.args = [option, section, rawval];
  }
}
export class ParsingError extends ConfigError {
  constructor(source, lineno, line, name = 'ParsingError') {
    super(name, `Source contains parsing errors: ${pyv(source)}`);
    this.source = source;
    this.errors = [];
    this.args = [source];
    if (lineno !== undefined) this.append(lineno, line);
  }
  append(lineno, line) {
    this.errors.push([lineno, line]);
    this.message += `\n\t[line ${String(lineno).padStart(2)}]: ${pyv(line)}`;
  }
  combine(others) {
    for (const o of others) for (const [lineno, line] of o.errors) this.append(lineno, line);
    return this;
  }
}
export class MissingSectionHeaderError extends ConfigError {
  constructor(filename, lineno, line) {
    super('MissingSectionHeaderError', `File contains no section headers.\nfile: ${pyv(filename)}, line: ${lineno}\n${pyv(line)}`);
    Object.assign(this, { source: filename, lineno, line, errors: [], args: [filename, lineno, line] });
  }
}
export class MultilineContinuationError extends ConfigError {
  constructor(filename, lineno, line) {
    super('MultilineContinuationError', `Key without value continued with an indented line.\nfile: ${pyv(filename)}, line: ${lineno}\n${pyv(line)}`);
    Object.assign(this, { source: filename, lineno, line, errors: [], args: [filename, lineno, line] });
  }
}
// isinstance checks by Python class name (the MRO below configparser.Error)
const MRO = {
  NoSectionError: ['NoSectionError', 'Error'],
  DuplicateSectionError: ['DuplicateSectionError', 'Error'],
  DuplicateOptionError: ['DuplicateOptionError', 'Error'],
  NoOptionError: ['NoOptionError', 'Error'],
  InterpolationError: ['InterpolationError', 'Error'],
  InterpolationMissingOptionError: ['InterpolationMissingOptionError', 'InterpolationError', 'Error'],
  InterpolationSyntaxError: ['InterpolationSyntaxError', 'InterpolationError', 'Error'],
  InterpolationDepthError: ['InterpolationDepthError', 'InterpolationError', 'Error'],
  ParsingError: ['ParsingError', 'Error'],
  MissingSectionHeaderError: ['MissingSectionHeaderError', 'ParsingError', 'Error'],
  MultilineContinuationError: ['MultilineContinuationError', 'ParsingError', 'Error'],
};
export function isA(e, className) {
  if (!(e instanceof ConfigError)) return false;
  if (className === 'Exception') return true;
  return (MRO[e.pyName] || []).includes(className);
}
// str(e) as Python prints it (Error.__str__ returns .message)
export const excStr = (e) => e.message;

// ─── interpolation ──────────────────────────────────────────
export class Interpolation {
  get pyName() { return 'Interpolation'; }
  before_get(parser, section, option, value) { return value; }
  before_set(parser, section, option, value) { return value; }
  before_read(parser, section, option, value) { return value; }
  before_write(parser, section, option, value) { return value; }
}

const BASIC_KEYCRE = /^%\(([^)]+)\)s/;
export class BasicInterpolation extends Interpolation {
  get pyName() { return 'BasicInterpolation'; }
  before_get(parser, section, option, value, defaults) {
    const L = [];
    this._interpolate_some(parser, option, L, value, section, defaults, 1);
    return joinAccum(L);
  }
  before_set(parser, section, option, value) {
    if (typeof value !== 'string') raise('AttributeError', `'${pyTypeName(value)}' object has no attribute 'replace'`);
    let tmp = value.replace(/%%/g, '');
    tmp = tmp.replace(/%\(([^)]+)\)s/g, '');
    if (tmp.includes('%')) {
      raise('ValueError', `invalid interpolation syntax in ${pyv(value)} at position ${cpIndex(tmp, tmp.indexOf('%'))}`);
    }
    return value;
  }
  _interpolate_some(parser, option, accum, rest, section, map, depth) {
    const rawval = parser.get(section, option, { raw: true, fallback: rest });
    if (depth > MAX_INTERPOLATION_DEPTH) throw new InterpolationDepthError(option, section, rawval);
    while (truthy(rest)) {
      const p = rest.indexOf('%');
      if (p < 0) { accum.push(rest); return; }
      if (p > 0) { accum.push(rest.slice(0, p)); rest = rest.slice(p); }
      const c = rest.slice(1, 2);
      if (c === '%') {
        accum.push('%');
        rest = rest.slice(2);
      } else if (c === '(') {
        const m = BASIC_KEYCRE.exec(rest);
        if (!m) throw new InterpolationSyntaxError(option, section, `bad interpolation variable reference ${pyv(rest)}`);
        const v = parser.optionxform(m[1]);
        rest = rest.slice(m[0].length);
        if (!map.has(v)) throw new InterpolationMissingOptionError(option, section, rawval, v);
        const val = map.get(v);
        if (pyContains(val, '%')) this._interpolate_some(parser, option, accum, val, section, map, depth + 1);
        else accum.push(val);
      } else {
        throw new InterpolationSyntaxError(option, section, `'%' must be followed by '%' or '(', found: ${pyv(rest)}`);
      }
    }
  }
}

const EXT_KEYCRE = /^\$\{([^}]+)\}/;
export class ExtendedInterpolation extends Interpolation {
  get pyName() { return 'ExtendedInterpolation'; }
  before_get(parser, section, option, value, defaults) {
    const L = [];
    this._interpolate_some(parser, option, L, value, section, defaults, 1);
    return joinAccum(L);
  }
  before_set(parser, section, option, value) {
    if (typeof value !== 'string') raise('AttributeError', `'${pyTypeName(value)}' object has no attribute 'replace'`);
    let tmp = value.replace(/\$\$/g, '');
    tmp = tmp.replace(/\$\{([^}]+)\}/g, '');
    if (tmp.includes('$')) {
      raise('ValueError', `invalid interpolation syntax in ${pyv(value)} at position ${cpIndex(tmp, tmp.indexOf('$'))}`);
    }
    return value;
  }
  _interpolate_some(parser, option, accum, rest, section, map, depth) {
    const rawval = parser.get(section, option, { raw: true, fallback: rest });
    if (depth > MAX_INTERPOLATION_DEPTH) throw new InterpolationDepthError(option, section, rawval);
    while (truthy(rest)) {
      const p = rest.indexOf('$');
      if (p < 0) { accum.push(rest); return; }
      if (p > 0) { accum.push(rest.slice(0, p)); rest = rest.slice(p); }
      const c = rest.slice(1, 2);
      if (c === '$') {
        accum.push('$');
        rest = rest.slice(2);
      } else if (c === '{') {
        const m = EXT_KEYCRE.exec(rest);
        if (!m) throw new InterpolationSyntaxError(option, section, `bad interpolation variable reference ${pyv(rest)}`);
        const path = m[1].split(':');
        rest = rest.slice(m[0].length);
        let sect = section;
        let opt = option;
        let v;
        try {
          if (path.length === 1) {
            opt = parser.optionxform(path[0]);
            if (!map.has(opt)) throw new MissingKey();
            v = map.get(opt);
          } else if (path.length === 2) {
            sect = path[0];
            opt = parser.optionxform(path[1]);
            v = parser.get(sect, opt, { raw: true });
          } else {
            throw new InterpolationSyntaxError(option, section, `More than one ':' found: ${pyv(rest)}`);
          }
        } catch (e) {
          if (e instanceof MissingKey || e instanceof NoSectionError || e instanceof NoOptionError) {
            throw new InterpolationMissingOptionError(option, section, rawval, path.join(':'));
          }
          throw e;
        }
        if (v === null) {
          limit('A reference to a key without a value (allow_no_value=True) differs between Python versions: 3.13.3 raises TypeError, later 3.13 releases substitute nothing.');
        }
        if (pyContains(v, '$')) {
          this._interpolate_some(parser, opt, accum, v, sect, new Map(parser.items(sect, { raw: true }).map((t) => t.__pyTuple)), depth + 1);
        } else accum.push(v);
      } else {
        throw new InterpolationSyntaxError(option, section, `'$' must be followed by '$' or '{', found: ${pyv(rest)}`);
      }
    }
  }
}
class MissingKey extends Error {}
// ''.join(L): every item must be a str
function joinAccum(L) {
  L.forEach((x, i) => {
    if (typeof x !== 'string') raise('TypeError', `sequence item ${i}: expected str instance, ${pyTypeName(x)} found`);
  });
  return L.join('');
}

// ChainMap(vardict, sectiondict, defaults) lookups
class ChainMap {
  constructor(...maps) { this.maps = maps; }
  has(k) { return this.maps.some((m) => m.has(k)); }
  get(k) {
    for (const m of this.maps) if (m.has(k)) return m.get(k);
    return undefined;
  }
}

// ─── the parsers ────────────────────────────────────────────
// RawConfigParser.SECTCRE: \[(?P<header>.+)\]  (re.match → anchored at the start)
export const DEFAULT_SECTCRE = {
  match(s) {
    const m = /^\[([^\n]+)\]/.exec(s);
    return m ? { header: m[1] } : null;
  },
};
// _OPT_TMPL / _OPT_NV_TMPL with the given delimiter alternation
function makeOptcre(delims, allowNoValue) {
  const d = delims.map(reEscape).join('|');
  const W = `[${WS_SRC}]*`;
  const re = allowNoValue
    ? new RegExp(`^([^\\n]*?)${W}(?:(${d})${W}([^\\n]*))?$`)
    : new RegExp(`^([^\\n]*?)${W}(${d})${W}([^\\n]*)$`);
  return {
    match(s) {
      const m = re.exec(s);
      if (!m) return null;
      return { option: m[1], vi: m[2] === undefined ? null : m[2], value: m[3] === undefined ? null : m[3] };
    },
  };
}

// the class attributes OPTCRE / OPTCRE_NV (default delimiters) and NONSPACECRE.search
export const OPTCRE = makeOptcre(['=', ':'], false);
export const OPTCRE_NV = makeOptcre(['=', ':'], true);
export const nonspaceSearch = (s) => {
  const m = NONSPACE_RE.exec(s);
  return m ? m.index : null;
};

const BOOLEAN_STATES = () => new Map([['1', true], ['yes', true], ['true', true], ['on', true], ['0', false], ['no', false], ['false', false], ['off', false]]);
const sectKey = (s) => (s === UNNAMED_SECTION ? '\u0000UNNAMED' : 's' + String(s));
const pairKey = (s, o) => JSON.stringify([sectKey(s), o]);

export class RawConfigParser {
  get pyName() { return 'RawConfigParser'; }
  defaultInterpolation() { return new Interpolation(); }

  constructor({
    defaults = null,
    allowNoValue = false,
    delimiters = ['=', ':'],
    commentPrefixes = ['#', ';'],
    inlineCommentPrefixes = null,
    strict = true,
    emptyLinesInValues = true,
    defaultSection = DEFAULTSECT,
    interpolation = UNSET,
    converters = UNSET,
    allowUnnamedSection = false,
  } = {}) {
    this._sections = new Map();
    this._defaults = new Map();
    this._instGetters = new Map(); // instance attributes set by ConverterMapping (get<name>)
    this._converters = new ConverterMapping(this);
    this._proxies = new Map();
    this._proxies.set(defaultSection, new SectionProxy(this, defaultSection));
    this._delimiters = [...delimiters];
    this._optcre = makeOptcre(this._delimiters, allowNoValue);
    this._prefixes = { full: [...(commentPrefixes || [])], inline: [...(inlineCommentPrefixes || [])] };
    this._inlineRe = this._prefixes.inline.length
      ? new RegExp(this._prefixes.inline.map((p) => `(^|[${WS_SRC}])(${reEscape(p)})`).join('|'))
      : null;
    this._strict = strict;
    this._allowNoValue = allowNoValue;
    this._emptyLinesInValues = emptyLinesInValues;
    this.default_section = defaultSection;
    this.SECTCRE = DEFAULT_SECTCRE;
    this.BOOLEAN_STATES = BOOLEAN_STATES();
    this.optionxform = (s) => {
      if (typeof s !== 'string') raise('AttributeError', `'${pyTypeName(s)}' object has no attribute 'lower'`);
      return s.toLowerCase();
    };
    let interp = interpolation;
    if (interp === UNSET) interp = this.defaultInterpolation();
    if (interp === null) interp = new Interpolation();
    if (!(interp instanceof Interpolation)) {
      raise('TypeError', `interpolation= must be None or an instance of Interpolation; got an object of type ${interp.typeRepr || "<class 'type'>"}`);
    }
    this._interpolation = interp;
    if (converters !== UNSET) {
      for (const [k, fn] of converters) this._converters.setitem(k, fn);
    }
    if (defaults && (defaults instanceof Map ? defaults.size : defaults.length)) this._read_defaults(defaults);
    this._allowUnnamedSection = allowUnnamedSection;
  }

  defaults() { return this._defaults; }

  sections() { return [...this._sections.keys()]; }

  add_section(section) {
    if (section === this.default_section) raise('ValueError', `Invalid section name: ${pyv(section)}`);
    if (this._sections.has(section)) throw new DuplicateSectionError(section);
    this._sections.set(section, new Map());
    this._proxies.set(section, new SectionProxy(this, section));
  }

  has_section(section) { return this._sections.has(section); }

  options(section) {
    if (!this._sections.has(section)) throw new NoSectionError(section);
    const opts = new Map(this._sections.get(section));
    for (const [k, v] of this._defaults) opts.set(k, v);
    return [...opts.keys()];
  }

  // read(filenames): `files` maps name → text for the files the snippet created
  read(filenames, files) {
    const names = typeof filenames === 'string' ? [filenames] : filenames;
    const ok = [];
    for (const name of names) {
      if (!files.has(name)) continue; // OSError → skipped
      this._read(textLines(files.get(name)), name);
      ok.push(name);
    }
    return ok;
  }

  // read_file(f, source=None): lines is any iterable of str; name is f.name
  read_file(lines, source = null, name = null) {
    if (source === null) source = name === null ? '<???>' : name;
    this._read(lines, source);
  }

  read_string(string, source = '<string>') {
    this.read_file(stringIOLines(string), source);
  }

  // dictionary: Map or array of [key, value] pairs; values Map / pairs / SectionProxy
  read_dict(dictionary, source = '<dict>') {
    const added = new Set();
    for (let [section, keys] of pairsOf(dictionary)) {
      section = pyStr(section);
      try {
        this.add_section(section);
      } catch (e) {
        if (e instanceof DuplicateSectionError || e.name === 'ValueError') {
          if (this._strict && added.has(sectKey(section))) throw e;
        } else throw e;
      }
      added.add(sectKey(section));
      for (let [key, value] of pairsOf(keys)) {
        key = this.optionxform(pyStr(key));
        if (value !== null) value = pyStr(value);
        if (this._strict && added.has(pairKey(section, key))) throw new DuplicateOptionError(section, key, source);
        added.add(pairKey(section, key));
        this.set(section, key, value);
      }
    }
  }

  get(section, option, { raw = false, vars = null, fallback = UNSET } = {}) {
    let d;
    try {
      d = this._unify_values(section, vars);
    } catch (e) {
      if (e instanceof NoSectionError) {
        if (fallback === UNSET) throw e;
        return fallback;
      }
      throw e;
    }
    option = this.optionxform(option);
    if (!d.has(option)) {
      if (fallback === UNSET) throw new NoOptionError(option, section);
      return fallback;
    }
    const value = d.get(option);
    if (truthy(raw) || value === null) return value;
    return this._interpolation.before_get(this, section, option, value, d);
  }

  _get_conv(section, option, conv, { raw = false, vars = null, fallback = UNSET } = {}) {
    try {
      return conv(this.get(section, option, { raw, vars }));
    } catch (e) {
      if (e instanceof NoSectionError || e instanceof NoOptionError) {
        if (fallback === UNSET) throw e;
        return fallback;
      }
      throw e;
    }
  }

  getint(section, option, opts = {}) { return this._get_conv(section, option, pyInt, opts); }
  getfloat(section, option, opts = {}) { return this._get_conv(section, option, pyFloat, opts); }
  getboolean(section, option, opts = {}) { return this._get_conv(section, option, (v) => this._convert_to_boolean(v), opts); }

  // parser.get<name>(...) — instance attribute first (ConverterMapping), then the class
  callGetter(name, section, option, opts = {}) {
    if (this._instGetters.has(name)) return this._instGetters.get(name)(section, option, opts);
    if (name === 'getint' || name === 'getfloat' || name === 'getboolean' || name === 'get') return this[name](section, option, opts);
    raise('AttributeError', `'${this.pyName}' object has no attribute '${name}'`);
  }
  hasGetter(name) {
    return this._instGetters.has(name) || name === 'getint' || name === 'getfloat' || name === 'getboolean';
  }

  items(section = UNSET, { raw = false, vars = null } = {}) {
    if (section === UNSET) return this.keys().map((k) => tuple(k, this.getitem(k)));
    const d = new Map(this._defaults);
    if (this._sections.has(section)) {
      for (const [k, v] of this._sections.get(section)) d.set(k, v);
    } else if (section !== this.default_section) {
      throw new NoSectionError(section);
    }
    const origKeys = [...d.keys()];
    if (vars && truthy(vars)) for (const [k, v] of vars) d.set(this.optionxform(k), v);
    const getter = truthy(raw)
      ? (o) => d.get(o)
      : (o) => this._interpolation.before_get(this, section, o, d.get(o), d);
    return origKeys.map((o) => tuple(o, getter(o)));
  }

  popitem() {
    for (const key of this.sections()) {
      const value = this.getitem(key);
      this.delitem(key);
      return tuple(key, value);
    }
    raise('KeyError');
  }

  has_option(section, option) {
    if (!truthy(section) || section === this.default_section) {
      return this._defaults.has(this.optionxform(option));
    }
    if (!this._sections.has(section)) return false;
    option = this.optionxform(option);
    return this._sections.get(section).has(option) || this._defaults.has(option);
  }

  set(section, option, value = null) {
    if (truthy(value)) value = this._interpolation.before_set(this, section, option, value);
    let sectdict;
    if (!truthy(section) || section === this.default_section) sectdict = this._defaults;
    else {
      if (!this._sections.has(section)) throw new NoSectionError(section);
      sectdict = this._sections.get(section);
    }
    sectdict.set(this.optionxform(option), value);
  }

  // write(fp, space_around_delimiters=True) → the text written
  write(spaceAroundDelimiters = true) {
    if (this._delimiters.length === 0) raise('IndexError', 'tuple index out of range');
    const d = truthy(spaceAroundDelimiters) ? ` ${this._delimiters[0]} ` : this._delimiters[0];
    let out = '';
    if (this._defaults.size) out += this._write_section(this.default_section, this._defaults, d);
    if (this._sections.has(UNNAMED_SECTION)) out += this._write_section(UNNAMED_SECTION, this._sections.get(UNNAMED_SECTION), d, true);
    for (const [section, items] of this._sections) {
      if (section === UNNAMED_SECTION) continue;
      out += this._write_section(section, items, d);
    }
    return out;
  }
  _write_section(sectionName, items, delimiter, unnamed = false) {
    let out = unnamed ? '' : `[${pyStr(sectionName)}]\n`;
    for (const [key, v] of items) {
      let value = this._interpolation.before_write(this, sectionName, key, v);
      if (value !== null || !this._allowNoValue) value = delimiter + pyStr(value).replace(/\n/g, '\n\t');
      else value = '';
      out += `${pyStr(key)}${value}\n`;
    }
    return out + '\n';
  }

  remove_option(section, option) {
    let sectdict;
    if (!truthy(section) || section === this.default_section) sectdict = this._defaults;
    else {
      if (!this._sections.has(section)) throw new NoSectionError(section);
      sectdict = this._sections.get(section);
    }
    option = this.optionxform(option);
    const existed = sectdict.has(option);
    if (existed) sectdict.delete(option);
    return existed;
  }

  remove_section(section) {
    const existed = this._sections.has(section);
    if (existed) {
      this._sections.delete(section);
      this._proxies.delete(section);
    }
    return existed;
  }

  // mapping protocol
  getitem(key) {
    if (key !== this.default_section && !this.has_section(key)) raise('KeyError', pyv(key));
    return this._proxies.get(key);
  }
  setitem(key, value) {
    if (this.contains(key) && this.getitem(key) === value) return;
    if (key === this.default_section) this._defaults.clear();
    else if (this._sections.has(key)) this._sections.get(key).clear();
    this.read_dict([[key, value]]);
  }
  delitem(key) {
    if (key === this.default_section) raise('ValueError', 'Cannot remove the default section.');
    if (!this.has_section(key)) raise('KeyError', pyv(key));
    this.remove_section(key);
  }
  contains(key) { return key === this.default_section || this.has_section(key); }
  len() { return this._sections.size + 1; }
  keys() { return [this.default_section, ...this._sections.keys()]; }
  values() { return this.keys().map((k) => this.getitem(k)); }
  // MutableMapping.clear(): popitem() until KeyError
  clear() {
    for (;;) {
      try { this.popitem(); } catch (e) { if (e.name === 'KeyError') return; throw e; }
    }
  }

  get converters() { return this._converters; }

  // ── reading ──
  _read(lines, fpname) {
    try {
      const errors = this._read_inner(lines, fpname);
      if (errors.length) throw errors[0].combine(errors.slice(1));
    } finally {
      this._join_multiline_values();
    }
  }

  _line(raw) {
    const stripped = pyStrip(raw);
    let clean;
    if (this._prefixes.full.some((p) => stripped.startsWith(p))) clean = '';
    else {
      const m = this._inlineRe ? this._inlineRe.exec(raw) : null;
      clean = pyStrip(m ? raw.slice(0, m.index) : raw);
    }
    return { raw, clean, hasComments: stripped !== clean };
  }

  _read_inner(lines, fpname) {
    const st = { elementsAdded: new Set(), cursect: null, sectname: null, optname: null, lineno: 0, indentLevel: 0, curIndentLevel: 0, errors: [] };
    for (const raw of lines) {
      if (typeof raw !== 'string') limit('read_file() here takes lines of text (str) only.');
      st.lineno += 1;
      const line = this._line(raw);
      if (!line.clean) {
        if (this._emptyLinesInValues) {
          if (!line.hasComments && st.cursect !== null && truthy(st.optname) && st.cursect.get(st.optname) !== null) {
            st.cursect.get(st.optname).push('');
          }
        } else {
          st.indentLevel = Infinity; // sys.maxsize
        }
        continue;
      }
      const first = NONSPACE_RE.exec(raw); // NONSPACECRE = re.compile(r"\S")
      st.curIndentLevel = first ? first.index : 0;
      if (this._handle_continuation_line(st, line, fpname)) continue;
      this._handle_rest(st, line, fpname);
    }
    return st.errors;
  }

  _handle_continuation_line(st, line, fpname) {
    const isContinue = st.cursect !== null && truthy(st.optname) && st.curIndentLevel > st.indentLevel;
    if (isContinue) {
      if (st.cursect.get(st.optname) === null) throw new MultilineContinuationError(fpname, st.lineno, line.raw);
      st.cursect.get(st.optname).push(line.clean);
    }
    return isContinue;
  }

  _handle_rest(st, line, fpname) {
    if (this._allowUnnamedSection && st.cursect === null) this._handle_header(st, UNNAMED_SECTION, fpname);
    st.indentLevel = st.curIndentLevel;
    const mo = this.SECTCRE.match(line.clean);
    if (!mo && st.cursect === null) throw new MissingSectionHeaderError(fpname, st.lineno, line.raw);
    if (mo) this._handle_header(st, mo.header, fpname);
    else this._handle_option(st, line, fpname);
  }

  _handle_header(st, sectname, fpname) {
    st.sectname = sectname;
    if (this._sections.has(sectname)) {
      if (this._strict && st.elementsAdded.has(sectKey(sectname))) throw new DuplicateSectionError(sectname, fpname, st.lineno);
      st.cursect = this._sections.get(sectname);
      st.elementsAdded.add(sectKey(sectname));
    } else if (sectname === this.default_section) {
      st.cursect = this._defaults;
    } else {
      st.cursect = new Map();
      this._sections.set(sectname, st.cursect);
      this._proxies.set(sectname, new SectionProxy(this, sectname));
      st.elementsAdded.add(sectKey(sectname));
    }
    st.optname = null;
  }

  _handle_option(st, line, fpname) {
    st.indentLevel = st.curIndentLevel;
    const mo = this._optcre.match(line.clean);
    if (!mo) {
      st.errors.push(new ParsingError(fpname, st.lineno, line.raw));
      return;
    }
    st.optname = mo.option;
    const optval = mo.value;
    if (!st.optname) st.errors.push(new ParsingError(fpname, st.lineno, line.raw));
    st.optname = this.optionxform(pyRstrip(st.optname));
    if (this._strict && st.elementsAdded.has(pairKey(st.sectname, st.optname))) {
      throw new DuplicateOptionError(st.sectname, st.optname, fpname, st.lineno);
    }
    st.elementsAdded.add(pairKey(st.sectname, st.optname));
    if (optval !== null) st.cursect.set(st.optname, [pyStrip(optval)]);
    else st.cursect.set(st.optname, null);
  }

  _join_multiline_values() {
    const all = [[this.default_section, this._defaults], ...this._sections];
    for (const [section, options] of all) {
      for (const [name, v] of options) {
        let val = v;
        if (Array.isArray(val)) val = pyRstrip(val.join('\n'));
        options.set(name, this._interpolation.before_read(this, section, name, val));
      }
    }
  }

  _read_defaults(defaults) {
    for (const [k, v] of pairsOf(defaults)) this._defaults.set(this.optionxform(k), v);
  }

  _unify_values(section, vars) {
    let sectiondict = new Map();
    if (this._sections.has(section)) sectiondict = this._sections.get(section);
    else if (section !== this.default_section) throw new NoSectionError(section);
    const vardict = new Map();
    if (vars && truthy(vars)) {
      for (const [k, v] of pairsOf(vars)) vardict.set(this.optionxform(k), v === null ? null : pyStr(v));
    }
    return new ChainMap(vardict, sectiondict, this._defaults);
  }

  _convert_to_boolean(value) {
    if (typeof value !== 'string') raise('AttributeError', `'${pyTypeName(value)}' object has no attribute 'lower'`);
    const low = value.toLowerCase();
    if (!this.BOOLEAN_STATES.has(low)) raise('ValueError', `Not a boolean: ${value}`);
    return this.BOOLEAN_STATES.get(low);
  }

  _validate_value_types({ section = '', option = '', value = '' } = {}) {
    if (typeof section !== 'string') raise('TypeError', 'section names must be strings');
    if (typeof option !== 'string') raise('TypeError', 'option keys must be strings');
    if (!this._allowNoValue || truthy(value)) {
      if (typeof value !== 'string') raise('TypeError', 'option values must be strings');
    }
  }
}

export class ConfigParser extends RawConfigParser {
  get pyName() { return 'ConfigParser'; }
  defaultInterpolation() { return new BasicInterpolation(); }
  set(section, option, value = null) {
    this._validate_value_types({ option, value });
    super.set(section, option, value);
  }
  add_section(section) {
    this._validate_value_types({ section });
    super.add_section(section);
  }
  _read_defaults(defaults) {
    const hold = this._interpolation;
    try {
      this._interpolation = new Interpolation();
      this.read_dict([[this.default_section, defaults]]);
    } finally {
      this._interpolation = hold;
    }
  }
}

export class SectionProxy {
  constructor(parser, name) {
    this._parser = parser;
    this._name = name;
    this._getters = new Map();
    for (const conv of parser.converters.keys()) {
      const key = 'get' + conv;
      this._getters.set(key, (option, fallback = null, opts = {}) => this.get(option, fallback, { ...opts, _impl: (s, o, o2) => parser.callGetter(key, s, o, o2) }));
    }
  }
  get pyName() { return 'SectionProxy'; }
  getitem(key) {
    if (!this._parser.has_option(this._name, key)) raise('KeyError', pyv(key));
    return this._parser.get(this._name, key);
  }
  setitem(key, value) {
    this._parser._validate_value_types({ option: key, value });
    return this._parser.set(this._name, key, value);
  }
  delitem(key) {
    if (!(this._parser.has_option(this._name, key) && this._parser.remove_option(this._name, key))) raise('KeyError', pyv(key));
  }
  contains(key) { return this._parser.has_option(this._name, key); }
  len() { return this._options().length; }
  keys() { return this._options(); }
  _options() {
    if (this._name !== this._parser.default_section) return this._parser.options(this._name);
    return [...this._parser.defaults().keys()];
  }
  get parser() { return this._parser; }
  get name() { return this._name; }
  get(option, fallback = null, { raw = false, vars = null, _impl = null } = {}) {
    const impl = _impl || ((s, o, opts) => this._parser.get(s, o, opts));
    return impl(this._name, option, { raw, vars, fallback });
  }
  // proxy.get<name>(option, fallback=None, ...)
  callGetter(name, option, fallback = null, opts = {}) {
    if (!this._getters.has(name)) raise('AttributeError', `'SectionProxy' object has no attribute '${name}'`);
    return this._getters.get(name)(option, fallback, opts);
  }
  // dict(proxy) / list(proxy.items())
  items() { return this.keys().map((k) => tuple(k, this.getitem(k))); }
  values() { return this.keys().map((k) => this.getitem(k)); }
}

export class ConverterMapping {
  constructor(parser) {
    this._parser = parser;
    // dir(parser) is sorted: getboolean, getfloat, getint
    this._data = new Map([['boolean', null], ['float', null], ['int', null]]);
  }
  getitem(key) {
    if (!this._data.has(key)) raise('KeyError', pyv(key));
    return this._data.get(key);
  }
  setitem(key, value) {
    if (typeof key !== 'string') raise('ValueError', `Incompatible key: ${pyStr(key)} (type: <class '${pyTypeName(key)}'>)`);
    const k = 'get' + key;
    if (k === 'get') raise('ValueError', 'Incompatible key: cannot use "" as a name');
    this._data.set(key, value);
    const func = (section, option, opts) => this._parser._get_conv(section, option, value, opts);
    this._parser._instGetters.set(k, func);
    for (const proxy of this._parser.values()) {
      proxy._getters.set(k, (option, fallback = null, opts = {}) => proxy.get(option, fallback, { ...opts, _impl: func }));
    }
  }
  delitem(key) {
    if (!truthy(key)) raise('KeyError', pyv(key));
    const k = 'get' + key;
    if (!this._data.has(key)) raise('KeyError', pyv(key));
    this._data.delete(key);
    this._parser._instGetters.delete(k); // a class method (getint, …) stays on the parser
    for (const proxy of this._parser.values()) proxy._getters.delete(k);
  }
  keys() { return [...this._data.keys()]; }
  len() { return this._data.size; }
}

// ─── line sources ───────────────────────────────────────────
// iterating io.StringIO(s): lines end at '\n' only, the '\n' is kept
export function stringIOLines(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf('\n', i);
    if (j === -1) { out.push(s.slice(i)); break; }
    out.push(s.slice(i, j + 1));
    i = j + 1;
  }
  return out;
}
// iterating a file opened in text mode (universal newlines: \r\n and \r → \n)
export function textLines(s) {
  return stringIOLines(s.replace(/\r\n?/g, '\n'));
}
function pairsOf(d) {
  if (d instanceof Map) return [...d];
  if (d instanceof SectionProxy) return d.items().map((t) => t.__pyTuple);
  if (Array.isArray(d)) return d;
  if (d && typeof d === 'object') return Object.entries(d);
  raise('AttributeError', `'${pyTypeName(d)}' object has no attribute 'items'`);
  return [];
}

// the INI text the demos build: '\n'.join(lines)
export const joinLines = (...lines) => lines.join('\n');

// a demo 'auto' input as the Python value its literal denotes (int, float or str)
export function fromAuto(v) {
  if (typeof v !== 'number') return v;
  const n = fromLiteral(v);
  return n.int !== undefined ? n.int : new PyFloat(n.float);
}

// {name: dict(config[name]) for name in config.sections()}
export function sectionsDict(parser) {
  return new Map(parser.sections().map((name) => [name, new Map(parser.getitem(name).items().map((t) => t.__pyTuple))]));
}

// buf = io.StringIO(); config.write(buf); buf.getvalue().splitlines()
export const writeLines = (parser, space = true) => splitlines(parser.write(space));
// str.splitlines(): every line boundary Python knows, the last empty piece dropped
const LINE_BOUNDARY = new RegExp('\\r\\n|[\\n\\r\\x0b\\x0c\\x1c\\x1d\\x1e\\x85' + String.fromCharCode(0x2028, 0x2029) + ']');
export function splitlines(s) {
  const out = s.split(LINE_BOUNDARY);
  if (out[out.length - 1] === '') out.pop();
  return out;
}

// interpolation=<name> as the demos choose it
export function interpolationOf(name) {
  if (name === 'BasicInterpolation()') return new BasicInterpolation();
  if (name === 'ExtendedInterpolation()') return new ExtendedInterpolation();
  if (name === 'None') return null;
  limit(`interpolation=${name} is not one of the choices the browser demo knows.`);
  return null;
}
