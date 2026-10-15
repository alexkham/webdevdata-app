// utils/emulators/python/stdlib/logging/_pylogging.js
//
// Port of CPython 3.13's Lib/logging/__init__.py for the logging demos:
// levels and level names, Manager / PlaceHolder / Logger / RootLogger (the
// dotted-name hierarchy, effective levels, the isEnabledFor cache,
// propagation, lastResort), LogRecord, Formatter with the three styles
// (%-, {- and $-formatting via the exact ports in _pyfmt.js), Filter /
// Filterer, Handler / StreamHandler / FileHandler / NullHandler /
// _StderrHandler, BufferingFormatter, LoggerAdapter, basicConfig, disable,
// shutdown, captureWarnings, getHandlerByName / getHandlerNames,
// setLoggerClass / setLogRecordFactory / makeLogRecord — plus
// BufferingHandler / MemoryHandler from Lib/logging/handlers.py.
//
// One LoggingModule instance = the logging module of one fresh
// interpreter. Every demo builds its own, runs the snippet's statements
// against it and reads the StringIO / stderr / file contents back.
//
// Calls use Python's names. Positional args are Python values (see
// _pyfmt.js); keyword arguments go in a trailing kw({...}):
//   log.info('user %s', 'ada', kw({ extra: new PyDict([['ip', '1.2.3.4']]) }))
//
// What the browser cannot know is a MachineValue — the record's pathname /
// filename / module, created / msecs / relativeCreated / asctime from the
// clock, thread and process ids, lineno unless the demo passes the line
// (kw site) — and printing one raises DemoLimit instead of inventing it.

import {
  raise, PyFloat, PyTuple, PyDict, MachineValue, typeName, pyRepr, pyStr, truthy,
  percentFormat, strFormat, doubleToString, pyFloat, tuple,
} from './_pyfmt.js';
import { PyException } from '../../../../py-exceptions.js';
import { Template, formatterParser } from '../string/_pystring.js';

export const CRITICAL = 50n;
export const FATAL = CRITICAL;
export const ERROR = 40n;
export const WARNING = 30n;
export const WARN = WARNING;
export const INFO = 20n;
export const DEBUG = 10n;
export const NOTSET = 0n;
export const BASIC_FORMAT = '%(levelname)s:%(name)s:%(message)s';

// keyword-argument bag for the trailing argument of a call
class KW { constructor(o) { Object.assign(this, o); } }
export const kw = (o = {}) => new KW(o);
function splitKw(rest) {
  if (rest.length && rest[rest.length - 1] instanceof KW) return [rest.slice(0, -1), { ...rest[rest.length - 1] }];
  return [rest, {}];
}

// dict-key identity the way Python hashes the values a level can be
function hashKey(v) {
  if (typeof v === 'string') return `s:${v}`;
  if (typeof v === 'bigint') return `n:${v}`;
  if (typeof v === 'boolean') return `n:${v ? 1 : 0}`;
  if (v === null || v === undefined) return 'None';
  if (v instanceof PyFloat) {
    if (Number.isInteger(v.v)) return `n:${BigInt(v.v)}`;
    return `f:${Number.isNaN(v.v) ? `nan${Math.random()}` : v.v}`;
  }
  if (v instanceof PyTuple) return `t:(${v.items.map(hashKey).join(',')})`;
  return raise('TypeError', `unhashable type: '${typeName(v)}'`);
}

const isIntLike = (v) => typeof v === 'bigint' || typeof v === 'boolean';
const big = (v) => (typeof v === 'boolean' ? (v ? 1n : 0n) : v);
// Python comparison a >= b for the numbers a level can be
function ge(a, b) {
  const num = (x) => {
    if (isIntLike(x)) return { i: big(x) };
    if (x instanceof PyFloat) return { f: x.v };
    return raise('TypeError', `'>=' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
  };
  const x = num(a);
  const y = num(b);
  if (x.i !== undefined && y.i !== undefined) return x.i >= y.i;
  const fx = x.f !== undefined ? x.f : Number(x.i);
  const fy = y.f !== undefined ? y.f : Number(y.i);
  if (Number.isNaN(fx) || Number.isNaN(fy)) return false;
  if (x.i !== undefined && Number.isFinite(fy) && Number.isInteger(fy)) return x.i >= BigInt(fy);
  if (y.i !== undefined && Number.isFinite(fx) && Number.isInteger(fx)) return BigInt(fx) >= y.i;
  return fx >= fy;
}

// ── io.StringIO (the parts handlers use) ─────────────────────
// (CPython's C StringIO says "closed file" without a period in write and
// getvalue; flush comes from IOBase, which adds one)
export class StringIO {
  constructor(name = null) { this.buf = ''; this.closed = false; this.name = name; }
  write(s) {
    if (this.closed) raise('ValueError', 'I/O operation on closed file');
    if (typeof s !== 'string') raise('TypeError', `string argument expected, got '${typeName(s)}'`);
    this.buf += s;
    if (this.buf.length > 200000) raise('DemoLimit', 'the browser demo stops at 200,000 characters of log output');
    return BigInt([...s].length);
  }
  flush() { if (this.closed) raise('ValueError', 'I/O operation on closed file.'); }
  getvalue() { if (this.closed) raise('ValueError', 'I/O operation on closed file'); return this.buf; }
  close() { this.closed = true; }
}

// frozenset of str (getHandlerNames): its iteration order follows the
// per-process string hash, so only 0 or 1 items have a fixed repr
export class PyFrozenset {
  constructor(items) { this.items = items; this.pyTypeName = 'frozenset'; }
  pyBool() { return this.items.length > 0; }
  pyRepr() {
    if (this.items.length === 0) return 'frozenset()';
    if (this.items.length === 1) return `frozenset({${pyRepr(this.items[0])}})`;
    return raise('DemoLimit', 'a frozenset of several strings prints in an order that changes from run to run (string hashing is randomized) — use sorted() to get a stable result');
  }
}

// ── exceptions as logging sees them ──────────────────────────
// A Python exception instance: type name, str() text, repr() text.
export class PyExc {
  constructor(type, msg = '', { repr = null, raised = true, module = null } = {}) {
    this.type = type;
    this.msg = msg;
    this.reprText = repr;
    this.raised = raised; // has a __traceback__ (was raised, not just built)
    this.module = module;
    this.pyTypeName = type;
  }
  pyStr() { return this.msg; }
  pyRepr() { return this.reprText !== null ? this.reprText : `${this.type}(${this.msg === '' ? '' : pyRepr(this.msg)})`; }
  // traceback.format_exception_only's last line
  line() { return this.msg === '' ? this.type : `${this.type}: ${this.msg}`; }
}
// (type, value, traceback) from sys.exc_info() or exc_info=exception
class ExcInfo {
  constructor(exc) { this.exc = exc; this.pyTypeName = 'tuple'; }
  pyBool() { return true; }
  pyRepr() { return raise('DemoLimit', 'the exc_info tuple holds a traceback object whose repr is a memory address — run the snippet in CPython to see it'); }
}
const TB_FRAME = '  File "…", line …, in <module>';

// ── LogRecord ────────────────────────────────────────────────
export class LogRecord {
  constructor(L, name, level, pathname, lineno, msg, args, excInfo, func = null, sinfo = null) {
    this.pyTypeName = 'LogRecord';
    const d = new PyDict();
    this.__dict__ = d;
    d.set('name', name);
    d.set('msg', msg);
    // if (args and len(args) == 1 and isinstance(args[0], Mapping)
    //         and args[0]): args = args[0]
    let a = args;
    if (truthy(a)) {
      let first;
      let n;
      if (a instanceof PyTuple) { n = a.items.length; first = a.items[0]; } else if (Array.isArray(a)) { n = a.length; first = a[0]; } else if (typeof a === 'string') { n = [...a].length; first = [...a][0]; } else if (a instanceof PyDict) {
        n = a.size;
        if (n === 1) {
          if (!a.has(0n)) raise('KeyError', '0');
          first = a.get(0n);
        }
      } else raise('TypeError', `object of type '${typeName(a)}' has no len()`);
      if (n === 1 && first instanceof PyDict && first.size > 0) a = first;
    }
    d.set('args', a);
    d.set('levelname', L.getLevelName(level));
    d.set('levelno', level);
    d.set('pathname', pathname);
    let filename;
    let module;
    if (typeof pathname === 'string' && /[\\:]/.test(pathname)) {
      // os.path is ntpath on Windows (splits on \ and drive colons) and
      // posixpath elsewhere (only /): the two disagree on such a path
      const msg = 'with a \\ or : in pathname, os.path.basename gives different results on Windows and on Linux/macOS, so the browser demo does not guess %(filename)s and %(module)s';
      filename = new MachineValue('the file name (%(filename)s)', msg);
      module = new MachineValue('the module name (%(module)s)', msg);
    } else if (typeof pathname === 'string') {
      filename = basename(pathname);
      module = splitextRoot(filename);
    } else if (pathname instanceof MachineValue) {
      filename = new MachineValue('the file name (%(filename)s)');
      module = new MachineValue('the module name (%(module)s)');
    } else {
      filename = pathname;
      module = 'Unknown module';
    }
    d.set('filename', filename);
    d.set('module', module);
    d.set('exc_info', excInfo);
    d.set('exc_text', null);
    d.set('stack_info', sinfo);
    d.set('lineno', lineno);
    d.set('funcName', func);
    d.set('created', new MachineValue('the creation time (%(created)f)'));
    d.set('msecs', new MachineValue('the millisecond part of the time (%(msecs)d)'));
    d.set('relativeCreated', new MachineValue('the time since logging was imported (%(relativeCreated)d)'));
    d.set('thread', new MachineValue('the thread id (%(thread)d)'));
    d.set('threadName', 'MainThread');
    d.set('processName', 'MainProcess');
    d.set('process', new MachineValue('the process id (%(process)d)'));
    d.set('taskName', null);
  }
  get(k) {
    if (!this.__dict__.has(k)) raise('AttributeError', `'LogRecord' object has no attribute '${k}'`);
    return this.__dict__.get(k);
  }
  set(k, v) { this.__dict__.set(k, v); }
  has(k) { return this.__dict__.has(k); }
  getMessage() {
    let msg = pyStr(this.get('msg'));
    const args = this.get('args');
    if (truthy(args)) msg = percentFormat(msg, args);
    return msg;
  }
  pyRepr() {
    const d = this.__dict__;
    return percentFormat('<LogRecord: %s, %s, %s, %s, "%s">', tuple(d.get('name'), d.get('levelno'), d.get('pathname'), d.get('lineno'), d.get('msg')));
  }
}
// os.path.basename / splitext for the posix-style names records carry
function basename(p) {
  const i = Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\'));
  return p.slice(i + 1);
}
function splitextRoot(p) {
  const i = p.lastIndexOf('.');
  if (i <= 0) return p;
  let j = i - 1;
  while (j >= 0 && p[j] === '.') j--;
  return j < 0 ? p : p.slice(0, i);
}

// ── Formatter styles ─────────────────────────────────────────
const W = '[\\p{L}\\p{N}_]';
const D = '\\p{Nd}';
// re.I char class [diouxefgcrsa%]: CPython also folds İ ı ſ into it
const PCT_VALIDATION = new RegExp(`%\\(${W}+\\)[#0+ -]*(\\*|${D}+)?(\\.(\\*|${D}+))?[diouxefgcrsa%DIOUXEFGCRSA\\u0130\\u0131\\u017f]`, 'u');
// Python '$' (no MULTILINE) also matches before a final newline; '.' is [^\n]
const PY_END = '(?:$|(?=\\n$))';
const FMT_SPEC = new RegExp(`^([^\\n]?[<>=^])?[+ -]?#?0?(${D}+|\\{${W}+\\})?[,_]?(\\.(${D}+|\\{${W}+\\}))?[bcdefgnosx%BCDEFGNOSX\\u017f]?${PY_END}`, 'u');
const FIELD_SPEC = new RegExp(`^(${D}+|${W}+)(\\.${W}+|\\[[^\\]]+\\])*${PY_END}`, 'u');

class PercentStyle {
  constructor(fmt, { defaults = null } = {}) {
    this._fmt = truthy(fmt) ? fmt : this.constructor.default_format;
    this._defaults = defaults;
  }
  usesTime() { return this._fmt.includes(this.constructor.asctime_search); }
  validate() {
    if (typeof this._fmt !== 'string') raise('TypeError', `expected string or bytes-like object, got '${typeName(this._fmt)}'`);
    if (!PCT_VALIDATION.test(this._fmt)) {
      raise('ValueError', `Invalid format '${this._fmt}' for '${this.constructor.default_format[0]}' style`);
    }
  }
  values(record) {
    if (this._defaults && truthy(this._defaults)) {
      const merged = new PyDict([...this._defaults.map.entries()]);
      for (const [k, v] of record.__dict__.map.entries()) merged.set(k, v);
      return merged;
    }
    return record.__dict__;
  }
  _format(record) { return percentFormat(this._fmt, this.values(record)); }
  format(record) {
    try {
      return this._format(record);
    } catch (e) {
      if (e instanceof PyException && e.name === 'KeyError') {
        const err = new PyException('ValueError', `Formatting field not found in record: ${e.message}`);
        err.context = e; // raised while handling the KeyError
        throw err;
      }
      throw e;
    }
  }
}
PercentStyle.default_format = '%(message)s';
PercentStyle.asctime_format = '%(asctime)s';
PercentStyle.asctime_search = '%(asctime)';

class StrFormatStyle extends PercentStyle {
  _format(record) { return strFormat(this._fmt, this.values(record)); }
  validate() {
    const fields = new Set();
    try {
      for (const [, fieldname, spec, conversion] of formatterParser(this._fmt)) {
        if (fieldname) {
          if (!FIELD_SPEC.test(fieldname)) raise('ValueError', `invalid field name/expression: ${pyRepr(fieldname)}`);
          fields.add(fieldname);
        }
        if (conversion && !'rsa'.includes(conversion)) raise('ValueError', `invalid conversion: ${pyRepr(conversion)}`);
        if (spec && !FMT_SPEC.test(spec)) raise('ValueError', `bad specifier: ${pyRepr(spec)}`);
      }
    } catch (e) {
      if (e instanceof PyException && e.name === 'ValueError') raise('ValueError', `invalid format: ${e.message}`);
      throw e;
    }
    if (fields.size === 0) raise('ValueError', 'invalid format: no fields');
  }
}
StrFormatStyle.default_format = '{message}';
StrFormatStyle.asctime_format = '{asctime}';
StrFormatStyle.asctime_search = '{asctime';

// str(value) of every record attribute, looked up lazily (Template.substitute)
class StrMapping extends Map {
  constructor(d) { super(); this.d = d; }
  has(k) { return this.d.has(k); }
  get(k) { return pyStr(this.d.get(k)); }
}
class StringTemplateStyle extends PercentStyle {
  constructor(fmt, opts) {
    super(fmt, opts);
    this._tpl = new Template(this._fmt);
  }
  usesTime() { return this._fmt.includes('$asctime') || this._fmt.includes(StringTemplateStyle.asctime_search); }
  validate() {
    const fields = new Set();
    for (const mo of this._tpl.matches()) {
      if (mo.named) fields.add(mo.named);
      else if (mo.braced) fields.add(mo.braced);
      else if (mo.whole === '$') raise('ValueError', "invalid format: bare '$' not allowed");
    }
    if (fields.size === 0) raise('ValueError', 'invalid format: no fields');
  }
  _format(record) { return this._tpl.substitute(new StrMapping(this.values(record))); }
}
StringTemplateStyle.default_format = '${message}';
StringTemplateStyle.asctime_format = '${asctime}';
StringTemplateStyle.asctime_search = '${asctime}';

const STYLES = {
  '%': [PercentStyle, BASIC_FORMAT],
  '{': [StrFormatStyle, '{levelname}:{name}:{message}'],
  '$': [StringTemplateStyle, '${levelname}:${name}:${message}'],
};

// ── time.gmtime / time.strftime for formatTime ───────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Windows' gmtime only covers 1970-01-01 … 3001-01-19 21:59:59 UTC (and
// gets the weekday of negative times wrong); Linux and macOS go further.
export const GMTIME_MAX = 32536850399;
export function gmtime(secs) {
  if (Number.isNaN(secs)) raise('ValueError', 'Invalid value NaN (not a number)');
  const t = Math.floor(secs);
  if (!(t >= 0 && t <= GMTIME_MAX)) {
    raise('DemoLimit', 'time.gmtime() of a time before 1970 or after the year 3000 differs between platforms (Windows raises OSError or gets the weekday wrong), so the browser demo does not guess it');
  }
  const days = Math.floor(t / 86400);
  const rem = t - days * 86400;
  const dt = new Date(days * 86400000);
  const year = dt.getUTCFullYear();
  const start = Date.UTC(year, 0, 1) / 86400000;
  return {
    year, mon: dt.getUTCMonth() + 1, mday: dt.getUTCDate(),
    hour: Math.floor(rem / 3600), min: Math.floor((rem % 3600) / 60), sec: rem % 60,
    wday: (dt.getUTCDay() + 6) % 7, yday: days - start + 1,
  };
}
const pad = (n, w) => String(n).padStart(w, '0');
// The directives that print the same on every platform in the C locale;
// anything else (%c %x %X %Z %z, platform extensions) is a DemoLimit.
export function strftime(fmt, tm) {
  let out = '';
  const cps = Array.from(fmt);
  for (let i = 0; i < cps.length; i++) {
    const c = cps[i];
    if (c !== '%') { out += c; continue; }
    const d = cps[++i];
    switch (d) {
      case 'Y': out += String(tm.year); break;
      case 'y': out += pad(tm.year % 100, 2); break;
      case 'm': out += pad(tm.mon, 2); break;
      case 'd': out += pad(tm.mday, 2); break;
      case 'H': out += pad(tm.hour, 2); break;
      case 'I': out += pad(tm.hour % 12 === 0 ? 12 : tm.hour % 12, 2); break;
      case 'M': out += pad(tm.min, 2); break;
      case 'S': out += pad(tm.sec, 2); break;
      case 'j': out += pad(tm.yday, 3); break;
      case 'a': out += DAYS[tm.wday].slice(0, 3); break;
      case 'A': out += DAYS[tm.wday]; break;
      case 'b': out += MONTHS[tm.mon - 1].slice(0, 3); break;
      case 'B': out += MONTHS[tm.mon - 1]; break;
      case 'p': out += tm.hour < 12 ? 'AM' : 'PM'; break;
      case 'w': out += String((tm.wday + 1) % 7); break;
      case '%': out += '%'; break;
      default:
        raise('DemoLimit', `time.strftime('%${d === undefined ? '' : d}') differs between platforms (Windows rejects or renders it differently from Linux/macOS), so the browser demo does not guess it`);
    }
  }
  return out;
}

export class Formatter {
  constructor(L, fmt = null, datefmt = null, style = '%', validate = true, { defaults = null } = {}) {
    this.L = L;
    if (!(typeof style === 'string' && Object.hasOwn(STYLES, style))) raise('ValueError', 'Style must be one of: %,{,$');
    this._style = new STYLES[style][0](fmt, { defaults });
    if (validate) this._style.validate();
    this._fmt = this._style._fmt;
    this.datefmt = datefmt;
    this.converter = 'localtime';
    this.default_time_format = '%Y-%m-%d %H:%M:%S';
    this.default_msec_format = '%s,%03d';
  }
  formatTime(record, datefmt = null) {
    const created = record.get('created');
    if (this.converter !== 'gmtime' || created instanceof MachineValue) {
      return new MachineValue('the formatted time (%(asctime)s)');
    }
    // time.gmtime(created): None means "now"; ints and floats only
    if (created === null || created === undefined) return new MachineValue('the formatted time (%(asctime)s)');
    if (!(created instanceof PyFloat) && !isIntLike(created)) raise('TypeError', `'${typeName(created)}' object cannot be interpreted as an integer`);
    const secs = created instanceof PyFloat ? created.v : Number(big(created));
    if (!Number.isNaN(secs) && !(Math.abs(secs) < 2 ** 63)) raise('OverflowError', 'timestamp out of range for platform time_t');
    const ct = gmtime(secs);
    if (truthy(datefmt)) return strftime(datefmt, ct);
    let s = strftime(this.default_time_format, ct);
    if (truthy(this.default_msec_format)) s = percentFormat(this.default_msec_format, tuple(s, record.get('msecs')));
    return s;
  }
  formatException(ei) {
    let s;
    if (ei instanceof ExcInfo) {
      const e = ei.exc;
      s = e.raised ? `Traceback (most recent call last):\n${TB_FRAME}\n${e.line()}\n` : `${e.line()}\n`;
    } else if (ei instanceof PyTuple && ei.items.length === 3 && ei.items.every((x) => x === null)) {
      s = 'NoneType: None\n';
    } else if (ei instanceof PyTuple && ei.items.length === 3 && ei.items[1] instanceof PyExc && ei.items[2] === null) {
      // (type, value, None): traceback.print_exception with no traceback
      // prints only the exception line
      s = `${ei.items[1].line()}\n`;
    } else {
      return raise('DemoLimit', 'this exc_info value is not modelled by the browser demo');
    }
    if (s.endsWith('\n')) s = s.slice(0, -1);
    return s;
  }
  usesTime() { return this._style.usesTime(); }
  formatMessage(record) { return this._style.format(record); }
  formatStack(stackInfo) { return stackInfo; }
  format(record) {
    record.set('message', record.getMessage());
    if (this.usesTime()) record.set('asctime', this.formatTime(record, this.datefmt));
    let s = this.formatMessage(record);
    if (truthy(record.get('exc_info'))) {
      if (!truthy(record.get('exc_text'))) record.set('exc_text', this.formatException(record.get('exc_info')));
    }
    if (truthy(record.get('exc_text'))) {
      if (!s.endsWith('\n')) s += '\n';
      s += pyStr(record.get('exc_text'));
    }
    if (truthy(record.get('stack_info'))) {
      if (!s.endsWith('\n')) s += '\n';
      s += this.formatStack(record.get('stack_info'));
    }
    return s;
  }
}

export class BufferingFormatter {
  constructor(L, linefmt = null) {
    this.linefmt = truthy(linefmt) ? linefmt : L._defaultFormatter;
    this.header = () => '';
    this.footer = () => '';
  }
  formatHeader(records) { return this.header(records); }
  formatFooter(records) { return this.footer(records); }
  // linefmt.format(record): a Formatter — or, by mistake, a str, whose
  // str.format(record) returns the text unchanged when it has no fields
  lineFormat(r) {
    const lf = this.linefmt;
    if (typeof lf === 'string') {
      if (/[{}]/.test(lf)) raise('DemoLimit', 'str.format with a LogRecord argument is not modelled by the browser demo');
      return lf;
    }
    return lf.format(r);
  }
  format(records) {
    let rv = '';
    if (!Array.isArray(records)) raise('TypeError', `object of type '${typeName(records)}' has no len()`);
    if (records.length > 0) {
      rv += this.formatHeader(records);
      for (const r of records) rv += this.lineFormat(r);
      rv += this.formatFooter(records);
    }
    return rv;
  }
}

// ── Filter / Filterer ────────────────────────────────────────
export class Filter {
  constructor(name = '') { this.name = name; this.nlen = [...name].length; }
  filter(record) {
    if (this.nlen === 0) return true;
    const rn = record.get('name');
    if (this.name === rn) return true;
    if (typeof rn !== 'string') return raise('AttributeError', `'${typeName(rn)}' object has no attribute 'find'`);
    const cps = [...rn];
    if (cps.slice(0, this.nlen).join('') !== this.name) return false;
    if (cps.length <= this.nlen) raise('IndexError', 'string index out of range');
    return cps[this.nlen] === '.';
  }
}

class Filterer {
  constructor() { this.filters = []; }
  addFilter(f) { if (!this.filters.includes(f)) this.filters.push(f); }
  removeFilter(f) { const i = this.filters.indexOf(f); if (i >= 0) this.filters.splice(i, 1); }
  filter(record0) {
    let record = record0;
    for (const f of this.filters) {
      const result = typeof f === 'function' ? f(record) : f.filter(record);
      if (!truthy(result)) return false;
      if (result instanceof LogRecord) record = result;
    }
    return record;
  }
}

// ── Handlers ─────────────────────────────────────────────────
export class Handler extends Filterer {
  constructor(L, level = NOTSET) {
    super();
    this.L = L;
    this._name = null;
    this.level = L._checkLevel(level);
    this.formatter = null;
    this._closed = false;
    L._handlerList.push(this);
    this.createLock();
    this.pyTypeName = 'Handler';
  }
  get_name() { return this._name; }
  set_name(name) {
    const L = this.L;
    if (L._handlers.has(this._name)) L._handlers.delete(this._name);
    this._name = name;
    if (truthy(name)) L._handlers.set(name, this);
  }
  get name() { return this.get_name(); }
  set name(v) { this.set_name(v); }
  createLock() { this.lock = true; }
  acquire() {}
  release() {}
  setLevel(level) { this.level = this.L._checkLevel(level); }
  format(record) { return (this.formatter || this.L._defaultFormatter).format(record); }
  emit() { raise('NotImplementedError', 'emit must be implemented by Handler subclasses'); }
  handle(record0) {
    let record = record0;
    const rv = this.filter(record);
    if (rv instanceof LogRecord) record = rv;
    if (truthy(rv)) this.emit(record);
    return rv;
  }
  setFormatter(fmt) { this.formatter = fmt; }
  flush() {}
  close() {
    this._closed = true;
    if (truthy(this._name) && this.L._handlers.has(this._name)) this.L._handlers.delete(this._name);
  }
  handleError(record, err) {
    const L = this.L;
    if (L.raiseExceptions && L.stderr) {
      let out = '--- Logging error ---\n';
      // the exception chain traceback.print_exception shows: the error's
      // implicit __context__ (a KeyError turned into ValueError, and the
      // exception being handled when the logging call ran in an except block)
      const chain = [];
      for (let x = err; x; x = x.context) chain.unshift(x instanceof PyExc ? x.line() : (x.message ? `${x.name}: ${x.message}` : x.name));
      const active = L._excStack[L._excStack.length - 1];
      if (active) chain.unshift(active.line());
      out += chain.map((ln) => `Traceback (most recent call last):\n${TB_FRAME}\n${ln}\n`).join('\nDuring handling of the above exception, another exception occurred:\n\n');
      out += `Call stack:\n${TB_FRAME}\n`;
      try {
        out += percentFormat('Message: %r\nArguments: %s\n', tuple(record.get('msg'), record.get('args')));
      } catch (e) {
        if (e instanceof PyException && e.name === 'DemoLimit') throw e;
        out += 'Unable to print the message and arguments - possible formatting error.\nUse the traceback above to help find the error.\n';
      }
      L.stderr.write(out);
    }
  }
  pyRepr() { return `<${this.pyTypeName} (${pyStr(this.L.getLevelName(this.level))})>`; }
}

// Python exceptions from formatting are swallowed by emit(); DemoLimit and
// emulator bugs are not.
const isPyError = (e) => e instanceof PyException && e.name !== 'DemoLimit';
// OSError, ValueError and their built-in subclasses (shutdown ignores them)
const OS_OR_VALUE_ERRORS = new Set([
  'OSError', 'BlockingIOError', 'BrokenPipeError', 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionError',
  'ConnectionRefusedError', 'ConnectionResetError', 'FileExistsError', 'FileNotFoundError', 'InterruptedError',
  'IsADirectoryError', 'NotADirectoryError', 'PermissionError', 'ProcessLookupError', 'TimeoutError',
  'ValueError', 'UnicodeError', 'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeTranslateError', 'io.UnsupportedOperation',
]);

export class StreamHandler extends Handler {
  constructor(L, stream = null) {
    super(L);
    this.pyTypeName = 'StreamHandler';
    this.terminator = '\n';
    this.stream = stream === null ? L.stderr : stream;
  }
  flush() { if (this.stream && typeof this.stream.flush === 'function') this.stream.flush(); }
  emit(record) {
    try {
      const msg = this.format(record);
      const t = this.terminator;
      if (typeof t !== 'string') raise('TypeError', `can only concatenate str (not "${typeName(t)}") to str`);
      this.stream.write(msg + t);
      this.flush();
    } catch (e) {
      if (!isPyError(e)) throw e;
      this.handleError(record, e);
    }
  }
  setStream(stream) {
    if (stream === this.stream) return null;
    const result = this.stream;
    this.flush();
    this.stream = stream;
    return result;
  }
  pyRepr() {
    const name = this.stream && this.stream.name !== null && this.stream.name !== undefined ? `${pyStr(this.stream.name)} ` : '';
    return `<${this.pyTypeName} ${name}(${pyStr(this.L.getLevelName(this.level))})>`;
  }
}

// open()'s mode checks, in the order _io.open and FileIO make them
function openFlags(mode, encoding, errors) {
  if (typeof mode !== 'string') raise('TypeError', `open() argument 'mode' must be str, not ${typeName(mode)}`);
  if (mode.includes('\0')) raise('ValueError', 'embedded null character');
  const f = { x: false, r: false, w: false, a: false, '+': false, t: false, b: false };
  const cps = [...mode];
  for (let i = 0; i < cps.length; i++) {
    const c = cps[i];
    if (!Object.hasOwn(f, c) || cps.slice(i + 1).includes(c)) raise('ValueError', `invalid mode: '${mode}'`);
    f[c] = true;
  }
  if (f.t && f.b) raise('ValueError', "can't have text and binary mode at once");
  if (f.x + f.r + f.w + f.a > 1) raise('ValueError', 'must have exactly one of create/read/write/append mode');
  if (f.b && encoding !== null) raise('ValueError', "binary mode doesn't take an encoding argument");
  if (f.b && errors !== null) raise('ValueError', "binary mode doesn't take an errors argument");
  if (!(f.x || f.r || f.w || f.a)) raise('ValueError', 'Must have exactly one of create/read/write/append mode and at most one plus');
  if (f.b) raise('DemoLimit', 'a log file opened in binary mode is not modelled by the browser demo — run the snippet in CPython');
  return f;
}

// a text file in the demo's in-memory file system
class FileStream {
  constructor(L, path, mode, encoding = null, errors = null) {
    this.L = L;
    this.encoding = encoding;
    this.path = path;
    this.name = path;
    this.closed = false;
    const f = openFlags(mode, encoding, errors);
    this.readOnly = f.r && !f['+'];
    // write position: null = always at the end (append, or a new empty
    // file); a number = mode 'r+', writing from the start
    this.pos = f.r ? 0 : null;
    // FileHandler opens the absolute path, so an error message naming the
    // file is machine-dependent
    const pathError = (what) => raise('DemoLimit', `${what} — its message shows the absolute path of the file, which depends on the machine`);
    if (f.w) L.files.set(path, '');
    else if (f.a) { if (!L.files.has(path)) L.files.set(path, ''); } else if (f.x) {
      if (L.files.has(path)) pathError('opening an existing file with mode \'x\' raises FileExistsError');
      L.files.set(path, '');
    } else if (!L.files.has(path)) pathError('opening a missing file with mode \'r\' raises FileNotFoundError');
  }
  write(s) {
    if (this.closed) raise('ValueError', 'I/O operation on closed file.');
    if (this.readOnly) raise('io.UnsupportedOperation', 'not writable');
    if (this.encoding === 'locale' && /[^\x00-\x7f]/.test(s)) {
      raise('DemoLimit', 'without encoding= the log file uses the locale encoding (UTF-8 on Linux/macOS, a code page on Windows), so non-ASCII text differs by platform — pass encoding="utf-8"');
    }
    const cur = this.L.files.get(this.path);
    if (this.pos === null) this.L.files.set(this.path, cur + s);
    else {
      // mode 'r+' writes over the old text from the start of the file; if
      // the old text is longer, its tail survives at a byte offset that
      // depends on the platform (\n is \r\n on disk on Windows) and on
      // UTF-8 widths, so only a write that covers it all is exact
      const next = cur.slice(0, this.pos) + s;
      const utf8 = (t) => new TextEncoder().encode(t).length;
      const lf = (t) => (t.match(/\n/g) || []).length;
      if (utf8(next) < utf8(cur) || utf8(next) + lf(next) < utf8(cur) + lf(cur)) {
        raise('DemoLimit', 'writing over the start of an existing file (mode \'r+\') leaves part of the old text at a byte offset that differs between platforms — run the snippet in CPython');
      }
      this.L.files.set(this.path, next);
      this.pos = next.length;
    }
    if (this.L.files.get(this.path).length > 200000) raise('DemoLimit', 'the browser demo stops at 200,000 characters of log output');
  }
  flush() { if (this.closed) raise('ValueError', 'I/O operation on closed file.'); }
  close() { this.closed = true; }
}

export class FileHandler extends StreamHandler {
  constructor(L, filename, mode = 'a', encoding = null, delay = false, errors = null) {
    if (typeof filename !== 'string') raise('TypeError', `expected str, bytes or os.PathLike object, not ${typeName(filename)}`);
    if (typeof mode !== 'string') raise('DemoLimit', 'a non-str mode is not modelled by the browser demo — run the snippet in CPython');
    if (encoding === null && !mode.includes('b')) {
      // io.text_encoding(None) → the locale encoding: UTF-8 on Linux/macOS,
      // a code page on Windows — non-ASCII text would differ
      encoding = 'locale';
    }
    if (delay) {
      super(L, { write() {}, flush() {} });
      this.stream = null;
    } else {
      super(L, new FileStream(L, filename, mode, encoding, errors));
    }
    this.pyTypeName = 'FileHandler';
    this.baseFilename = new MachineValue('the absolute path of the log file');
    this.filename = filename;
    this.mode = mode;
    this.encoding = encoding;
    this.errors = errors;
    this.delay = delay;
  }
  _open() { return new FileStream(this.L, this.filename, this.mode, this.encoding, this.errors); }
  emit(record) {
    if (this.stream === null) {
      if (this.mode !== 'w' || !this._closed) this.stream = this._open();
    }
    if (this.stream) StreamHandler.prototype.emit.call(this, record);
  }
  close() {
    try {
      if (this.stream) {
        try { this.flush(); } finally {
          const s = this.stream;
          this.stream = null;
          s.close();
        }
      }
    } finally {
      Handler.prototype.close.call(this);
    }
  }
  pyRepr() { return raise('DemoLimit', 'a FileHandler repr shows the absolute path of the file, which depends on the machine'); }
}

class StderrHandler extends StreamHandler {
  constructor(L, level = NOTSET) {
    super(L);
    this.level = L._checkLevel(level);
    this.pyTypeName = '_StderrHandler';
  }
  get stream() { return this.L.stderr; }
  set stream(v) { void v; }
}

export class NullHandler extends Handler {
  constructor(L, level = NOTSET) { super(L, level); this.pyTypeName = 'NullHandler'; }
  handle() { return null; }
  emit() {}
  createLock() { this.lock = null; }
}

// ── logging.handlers.BufferingHandler / MemoryHandler ────────
export class BufferingHandler extends Handler {
  constructor(L, capacity) {
    super(L);
    this.pyTypeName = 'BufferingHandler';
    this.capacity = capacity;
    this.buffer = [];
  }
  shouldFlush() { return ge(BigInt(this.buffer.length), this.capacity); }
  emit(record) {
    this.buffer.push(record);
    if (truthy(this.shouldFlush(record))) this.flush();
  }
  flush() { this.buffer.length = 0; }
  close() {
    try { this.flush(); } finally { Handler.prototype.close.call(this); }
  }
}

export class MemoryHandler extends BufferingHandler {
  constructor(L, capacity, flushLevel = ERROR, target = null, flushOnClose = true) {
    super(L, capacity);
    this.pyTypeName = 'MemoryHandler';
    this.flushLevel = flushLevel;
    this.target = target;
    this.flushOnClose = flushOnClose;
  }
  shouldFlush(record) {
    return ge(BigInt(this.buffer.length), this.capacity) || ge(record.get('levelno'), this.flushLevel);
  }
  setTarget(target) { this.target = target; }
  // records go to target.handle(): the target's filters apply, its level
  // does not (levels are checked by Logger.callHandlers)
  flush() {
    if (this.target) {
      for (const record of this.buffer) this.target.handle(record);
      this.buffer.length = 0;
    }
  }
  close() {
    try {
      if (truthy(this.flushOnClose)) this.flush();
    } finally {
      this.target = null;
      BufferingHandler.prototype.close.call(this);
    }
  }
}

// ── Loggers ──────────────────────────────────────────────────
class PlaceHolder {
  constructor(alogger) { this.loggerMap = new Map([[alogger, null]]); }
  append(alogger) { if (!this.loggerMap.has(alogger)) this.loggerMap.set(alogger, null); }
}

class Manager {
  constructor(L, rootnode) {
    this.L = L;
    this.root = rootnode;
    this._disable = 0n;
    this.emittedNoHandlerWarning = false;
    this.loggerDict = new Map();
    this.loggerClass = null;
    this.logRecordFactory = null;
  }
  get disable() { return this._disable; }
  set disable(v) { this._disable = this.L._checkLevel(v); }
  getLogger(name) {
    if (typeof name !== 'string') raise('TypeError', 'A logger name must be a string');
    const L = this.L;
    let rv;
    if (this.loggerDict.has(name)) {
      rv = this.loggerDict.get(name);
      if (rv instanceof PlaceHolder) {
        const ph = rv;
        rv = new (this.loggerClass || L._loggerClass)(L, name);
        rv.manager = this;
        this.loggerDict.set(name, rv);
        this._fixupChildren(ph, rv);
        this._fixupParents(rv);
      }
    } else {
      rv = new (this.loggerClass || L._loggerClass)(L, name);
      rv.manager = this;
      this.loggerDict.set(name, rv);
      this._fixupParents(rv);
    }
    return rv;
  }
  _fixupParents(alogger) {
    const name = alogger.name;
    let i = name.lastIndexOf('.');
    let rv = null;
    while (i > 0 && !rv) {
      const substr = name.slice(0, i);
      if (!this.loggerDict.has(substr)) this.loggerDict.set(substr, new PlaceHolder(alogger));
      else {
        const obj = this.loggerDict.get(substr);
        if (obj instanceof Logger) rv = obj;
        else obj.append(alogger);
      }
      // name.rfind('.', 0, i - 1): the character just before the dot is
      // never examined (so 'a..b' skips 'a')
      i = name.slice(0, i - 1).lastIndexOf('.');
    }
    if (!rv) rv = this.root;
    alogger.parent = rv;
  }
  _fixupChildren(ph, alogger) {
    const name = alogger.name;
    const namelen = [...name].length;
    for (const c of ph.loggerMap.keys()) {
      if ([...c.parent.name].slice(0, namelen).join('') !== name) {
        alogger.parent = c.parent;
        c.parent = alogger;
      }
    }
  }
  _clear_cache() {
    for (const logger of this.loggerDict.values()) if (logger instanceof Logger) logger._cache.clear();
    this.root._cache.clear();
  }
}

export class Logger extends Filterer {
  constructor(L, name, level = NOTSET) {
    super();
    this.L = L;
    this.name = name;
    this.level = L._checkLevel(level);
    this.parent = null;
    this.propagate = true;
    this.handlers = [];
    this.disabled = false;
    this._cache = new Map();
    this.pyTypeName = 'Logger';
    // Logger.manager is a class attribute in CPython: the one Manager
    if (L.manager) this.manager = L.manager;
  }
  get root() { return this.L.root; }
  setLevel(level) {
    this.level = this.L._checkLevel(level);
    this.manager._clear_cache();
  }
  debug(msg, ...rest) { if (this.isEnabledFor(DEBUG)) this._logRest(DEBUG, msg, rest); }
  info(msg, ...rest) { if (this.isEnabledFor(INFO)) this._logRest(INFO, msg, rest); }
  warning(msg, ...rest) { if (this.isEnabledFor(WARNING)) this._logRest(WARNING, msg, rest); }
  warn(msg, ...rest) {
    this.L._deprecation("The 'warn' method is deprecated, use 'warning' instead");
    this.warning(msg, ...rest);
  }
  error(msg, ...rest) { if (this.isEnabledFor(ERROR)) this._logRest(ERROR, msg, rest); }
  exception(msg, ...rest) {
    const [args, k] = splitKw(rest);
    if (!('exc_info' in k)) k.exc_info = true;
    this.error(msg, ...args, kw(k));
  }
  critical(msg, ...rest) { if (this.isEnabledFor(CRITICAL)) this._logRest(CRITICAL, msg, rest); }
  fatal(msg, ...rest) { this.critical(msg, ...rest); }
  log(level, msg, ...rest) {
    if (!isIntLike(level)) {
      if (this.L.raiseExceptions) raise('TypeError', 'level must be an integer');
      return;
    }
    if (this.isEnabledFor(level)) this._logRest(level, msg, rest);
  }
  _logRest(level, msg, rest) {
    const [args, k] = splitKw(rest);
    this._log(level, msg, new PyTuple(args), k);
  }
  // site: { lineno, func } of the call in the demo's code, or a list of
  // them (innermost first) when the demo nests calls for stacklevel
  findCaller(stackInfo = false, stacklevel = 1n, site = null) {
    const frames = site === null ? [] : Array.isArray(site) ? site : [site];
    const s = frames[Number(stacklevel) - 1] || null;
    const fn = new MachineValue('the source file path (%(pathname)s)');
    const lno = s && s.lineno !== undefined ? BigInt(s.lineno) : new MachineValue('the line number of the call (%(lineno)d)');
    const func = s && s.func !== undefined ? s.func : (Number(stacklevel) <= 1 ? '<module>' : new MachineValue('the calling function (%(funcName)s)'));
    let sinfo = null;
    if (truthy(stackInfo)) sinfo = `Stack (most recent call last):\n${TB_FRAME}`;
    return [fn, lno, func, sinfo];
  }
  makeRecord(name, level, fn, lno, msg, args, excInfo, func = null, extra = null, sinfo = null) {
    const rv = this.L._logRecordFactory(name, level, fn, lno, msg, args, excInfo, func, sinfo);
    if (extra !== null && extra !== undefined) {
      if (!(extra instanceof PyDict)) raise('DemoLimit', 'extra= must be a dict in the browser demo');
      for (const key of extra.map.keys()) {
        if (key === 'message' || key === 'asctime' || rv.has(key)) raise('KeyError', pyRepr(`Attempt to overwrite ${pyRepr(key)} in LogRecord`));
        rv.set(key, extra.get(key));
      }
    }
    return rv;
  }
  _log(level, msg, args, { exc_info = null, extra = null, stack_info = false, stacklevel = 1n, site = null } = {}) {
    const [fn, lno, func, sinfo] = this.findCaller(stack_info, stacklevel, site);
    let ei = exc_info;
    if (truthy(ei)) {
      if (ei instanceof PyExc) ei = new ExcInfo(ei);
      else if (!(ei instanceof PyTuple) && !(ei instanceof ExcInfo)) ei = this.L.exc_info();
    }
    const record = this.makeRecord(this.name, level, fn, lno, msg, args, ei, func, extra, sinfo);
    this.handle(record);
  }
  handle(record0) {
    let record = record0;
    if (this.disabled) return;
    const maybe = this.filter(record);
    if (!truthy(maybe)) return;
    if (maybe instanceof LogRecord) record = maybe;
    this.callHandlers(record);
  }
  addHandler(h) { if (!this.handlers.includes(h)) this.handlers.push(h); }
  removeHandler(h) { const i = this.handlers.indexOf(h); if (i >= 0) this.handlers.splice(i, 1); }
  hasHandlers() {
    let c = this;
    let rv = false;
    while (c) {
      if (c.handlers.length) { rv = true; break; }
      if (!truthy(c.propagate)) break;
      c = c.parent;
    }
    return rv;
  }
  callHandlers(record) {
    let c = this;
    let found = 0;
    const levelno = record.get('levelno');
    while (c) {
      for (const h of [...c.handlers]) {
        found += 1;
        if (ge(levelno, h.level)) h.handle(record);
      }
      c = truthy(c.propagate) ? c.parent : null;
    }
    if (found === 0) {
      const lr = this.L.lastResort;
      if (lr) {
        if (ge(levelno, lr.level)) lr.handle(record);
      } else if (this.L.raiseExceptions && !this.manager.emittedNoHandlerWarning) {
        this.L.stderr.write(`No handlers could be found for logger "${pyStr(this.name)}"\n`);
        this.manager.emittedNoHandlerWarning = true;
      }
    }
  }
  getEffectiveLevel() {
    let logger = this;
    while (logger) {
      if (truthy(logger.level)) return logger.level;
      logger = logger.parent;
    }
    return NOTSET;
  }
  isEnabledFor(level) {
    if (this.disabled) return false;
    const key = hashKey(level);
    if (this._cache.has(key)) return this._cache.get(key);
    let isEnabled;
    if (ge(this.manager.disable, level)) isEnabled = false;
    else isEnabled = ge(level, this.getEffectiveLevel());
    this._cache.set(key, isEnabled);
    return isEnabled;
  }
  getChild(suffix) {
    let s = suffix;
    if (this.root !== this) {
      if (typeof s !== 'string') raise('TypeError', `sequence item 1: expected str instance, ${typeName(s)} found`);
      s = `${this.name}.${s}`;
    }
    return this.manager.getLogger(s);
  }
  getChildren() {
    const hier = (lg) => (lg === lg.manager.root ? 0 : 1 + (lg.name.split('.').length - 1));
    const out = [];
    for (const item of this.manager.loggerDict.values()) {
      if (item instanceof Logger && item.parent === this && hier(item) === 1 + hier(item.parent)) out.push(item);
    }
    return out;
  }
  pyRepr() { return `<${this.pyTypeName} ${pyStr(this.name)} (${pyStr(this.L.getLevelName(this.getEffectiveLevel()))})>`; }
}

class RootLogger extends Logger {
  constructor(L, level) { super(L, 'root', level); this.pyTypeName = 'RootLogger'; }
}

export class LoggerAdapter {
  constructor(L, logger, extra = null, mergeExtra = false) {
    this.L = L;
    this.logger = logger;
    this.extra = extra;
    this.merge_extra = mergeExtra;
    this.pyTypeName = 'LoggerAdapter';
  }
  process(msg, kwargs) {
    if (this.merge_extra && 'extra' in kwargs) {
      if (!(this.extra instanceof PyDict)) raise('TypeError', `'${typeName(this.extra)}' object is not a mapping`);
      if (!(kwargs.extra instanceof PyDict)) raise('TypeError', `'${typeName(kwargs.extra)}' object is not a mapping`);
      const merged = new PyDict([...this.extra.map.entries()]);
      for (const [k, v] of kwargs.extra.map.entries()) merged.set(k, v);
      kwargs.extra = merged;
    } else kwargs.extra = this.extra;
    return [msg, kwargs];
  }
  debug(msg, ...rest) { this.log(DEBUG, msg, ...rest); }
  info(msg, ...rest) { this.log(INFO, msg, ...rest); }
  warning(msg, ...rest) { this.log(WARNING, msg, ...rest); }
  warn(msg, ...rest) {
    this.L._deprecation("The 'warn' method is deprecated, use 'warning' instead");
    this.warning(msg, ...rest);
  }
  error(msg, ...rest) { this.log(ERROR, msg, ...rest); }
  exception(msg, ...rest) {
    const [args, k] = splitKw(rest);
    if (!('exc_info' in k)) k.exc_info = true;
    this.log(ERROR, msg, ...args, kw(k));
  }
  critical(msg, ...rest) { this.log(CRITICAL, msg, ...rest); }
  log(level, msg0, ...rest) {
    if (this.isEnabledFor(level)) {
      const [args, k0] = splitKw(rest);
      const [msg, k] = this.process(msg0, k0);
      this.logger.log(level, msg, ...args, kw(k));
    }
  }
  isEnabledFor(level) { return this.logger.isEnabledFor(level); }
  setLevel(level) { this.logger.setLevel(level); }
  getEffectiveLevel() { return this.logger.getEffectiveLevel(); }
  hasHandlers() { return this.logger.hasHandlers(); }
  get manager() { return this.logger.manager; }
  get name() { return this.logger.name; }
  pyRepr() { return `<${this.pyTypeName} ${pyStr(this.logger.name)} (${pyStr(this.L.getLevelName(this.logger.getEffectiveLevel()))})>`; }
}

// ── the module ───────────────────────────────────────────────
export class LoggingModule {
  constructor() {
    this.raiseExceptions = true;
    this._levelToName = new Map();
    this._nameToLevel = new Map();
    for (const [lv, nm] of [[CRITICAL, 'CRITICAL'], [ERROR, 'ERROR'], [WARNING, 'WARNING'], [INFO, 'INFO'], [DEBUG, 'DEBUG'], [NOTSET, 'NOTSET']]) {
      this._levelToName.set(hashKey(lv), [lv, nm]);
    }
    for (const [nm, lv] of [['CRITICAL', CRITICAL], ['FATAL', FATAL], ['ERROR', ERROR], ['WARN', WARNING], ['WARNING', WARNING], ['INFO', INFO], ['DEBUG', DEBUG], ['NOTSET', NOTSET]]) {
      this._nameToLevel.set(hashKey(nm), [nm, lv]);
    }
    this._handlers = new Map();
    this._handlerList = [];
    this.stderr = new StringIO('<stderr>');
    this.files = new Map();
    this.warningsLog = []; // DeprecationWarnings raised by warn()
    this._excStack = [];
    this._loggerClass = Logger;
    this._logRecordFactory = (...a) => new LogRecord(this, ...a);
    this._defaultFormatter = new Formatter(this);
    this.lastResort = new StderrHandler(this, WARNING);
    this.root = new RootLogger(this, WARNING);
    this.manager = new Manager(this, this.root);
    this.root.manager = this.manager;
    this._warnings_showwarning = null;
    this.BASIC_FORMAT = BASIC_FORMAT;
  }

  // levels
  _checkLevel(level) {
    if (isIntLike(level)) return level;
    if (typeof level === 'string') {
      if (!this._nameToLevel.has(hashKey(level))) raise('ValueError', `Unknown level: ${pyRepr(level)}`);
      return this._nameToLevel.get(hashKey(level))[1];
    }
    return raise('TypeError', `Level not an integer or a valid string: ${pyRepr(level)}`);
  }
  getLevelName(level) {
    const k = hashKey(level);
    if (this._levelToName.has(k)) { const r = this._levelToName.get(k)[1]; if (r !== null) return r; }
    if (this._nameToLevel.has(k)) { const r = this._nameToLevel.get(k)[1]; if (r !== null) return r; }
    return percentFormat('Level %s', level);
  }
  addLevelName(level, levelName) {
    this._levelToName.set(hashKey(level), [level, levelName]);
    this._nameToLevel.set(hashKey(levelName), [levelName, level]);
  }
  getLevelNamesMapping() { return new PyDict([...this._nameToLevel.values()]); }

  // objects
  getLogger(name = null) {
    if (!truthy(name) || (typeof name === 'string' && name === this.root.name)) return this.root;
    return this.manager.getLogger(name);
  }
  getLoggerClass() { return this._loggerClass; }
  setLoggerClass(klass) {
    if (klass !== Logger && typeof klass !== 'function') raise('TypeError', 'issubclass() arg 1 must be a class');
    if (klass !== Logger && !(klass.prototype instanceof Logger)) raise('TypeError', `logger not derived from logging.Logger: ${klass.pyName || klass.name}`);
    this._loggerClass = klass;
  }
  getLogRecordFactory() { return this._logRecordFactory; }
  setLogRecordFactory(factory) { this._logRecordFactory = factory; }
  makeLogRecord(dict) {
    const rv = this._logRecordFactory(null, null, '', 0n, '', new PyTuple([]), null, null);
    for (const [k, v] of dict.map.entries()) rv.set(k, v);
    return rv;
  }
  LogRecord(...a) { return new LogRecord(this, ...a); }
  Formatter(fmt = null, datefmt = null, style = '%', validate = true, opts = {}) { return new Formatter(this, fmt, datefmt, style, validate, opts); }
  BufferingFormatter(linefmt = null) { return new BufferingFormatter(this, linefmt); }
  Filter(name = '') { return new Filter(name); }
  Handler(level = NOTSET) { return new Handler(this, level); }
  StreamHandler(stream = null) { return new StreamHandler(this, stream); }
  FileHandler(filename, mode = 'a', encoding = null, delay = false, errors = null) { return new FileHandler(this, filename, mode, encoding, delay, errors); }
  NullHandler(level = NOTSET) { return new NullHandler(this, level); }
  // logging.handlers.BufferingHandler / MemoryHandler
  BufferingHandler(capacity) { return new BufferingHandler(this, capacity); }
  MemoryHandler(capacity, flushLevel = ERROR, target = null, flushOnClose = true) { return new MemoryHandler(this, capacity, flushLevel, target, flushOnClose); }
  LoggerAdapter(logger, extra = null, mergeExtra = false) { return new LoggerAdapter(this, logger, extra, mergeExtra); }
  getHandlerByName(name) { return this._handlers.has(name) ? this._handlers.get(name) : null; }
  getHandlerNames() { return new PyFrozenset([...this._handlers.keys()]); }
  Logger(name, level = NOTSET) { return new Logger(this, name, level); }

  // sys.exc_info() as the demo's except-blocks set it
  exc_info() {
    const top = this._excStack[this._excStack.length - 1];
    return top ? new ExcInfo(top) : tuple(null, null, null);
  }
  // run fn as the body of `except` for exception exc
  handling(exc, fn) {
    this._excStack.push(exc);
    try { return fn(); } finally { this._excStack.pop(); }
  }
  _deprecation(msg) { this.warningsLog.push(msg); }

  // module-level functions
  basicConfig(kwargs = {}) {
    const k = { ...kwargs };
    const force = k.force || false; delete k.force;
    let encoding = 'encoding' in k ? k.encoding : null; delete k.encoding;
    let errors = 'errors' in k ? k.errors : 'backslashreplace'; delete k.errors;
    const root = this.root;
    if (truthy(force)) {
      for (const h of [...root.handlers]) { root.removeHandler(h); h.close(); }
    }
    if (root.handlers.length === 0) {
      let handlers = 'handlers' in k ? k.handlers : null; delete k.handlers;
      if (handlers === null) {
        if ('stream' in k && 'filename' in k) raise('ValueError', "'stream' and 'filename' should not be specified together");
      } else if ('stream' in k || 'filename' in k) raise('ValueError', "'stream' or 'filename' should not be specified together with 'handlers'");
      if (handlers === null) {
        const filename = 'filename' in k ? k.filename : null; delete k.filename;
        const mode = 'filemode' in k ? k.filemode : 'a'; delete k.filemode;
        let h;
        if (truthy(filename)) {
          if (mode.includes('b')) errors = null;
          else if (encoding === null) encoding = null;
          h = this.FileHandler(filename, mode, encoding, false, errors);
        } else {
          const stream = 'stream' in k ? k.stream : null; delete k.stream;
          h = this.StreamHandler(stream);
        }
        handlers = [h];
      }
      const dfs = 'datefmt' in k ? k.datefmt : null; delete k.datefmt;
      const style = 'style' in k ? k.style : '%'; delete k.style;
      if (!Object.hasOwn(STYLES, style)) raise('ValueError', 'Style must be one of: %,{,$');
      const fs = 'format' in k ? k.format : STYLES[style][1]; delete k.format;
      const fmt = this.Formatter(fs, dfs, style);
      for (const h of handlers) {
        if (h.formatter === null) h.setFormatter(fmt);
        root.addHandler(h);
      }
      const level = 'level' in k ? k.level : null; delete k.level;
      if (level !== null) root.setLevel(level);
      const keys = Object.keys(k);
      if (keys.length) raise('ValueError', `Unrecognised argument(s): ${keys.join(', ')}`);
    }
  }
  _rootCall(method, msg, rest) {
    if (this.root.handlers.length === 0) this.basicConfig();
    this.root[method](msg, ...rest);
  }
  critical(msg, ...rest) { this._rootCall('critical', msg, rest); }
  fatal(msg, ...rest) { this.critical(msg, ...rest); }
  error(msg, ...rest) { this._rootCall('error', msg, rest); }
  exception(msg, ...rest) {
    const [args, k] = splitKw(rest);
    if (!('exc_info' in k)) k.exc_info = true;
    this.error(msg, ...args, kw(k));
  }
  warning(msg, ...rest) { this._rootCall('warning', msg, rest); }
  warn(msg, ...rest) { this._deprecation("The 'warn' function is deprecated, use 'warning' instead"); this.warning(msg, ...rest); }
  info(msg, ...rest) { this._rootCall('info', msg, rest); }
  debug(msg, ...rest) { this._rootCall('debug', msg, rest); }
  log(level, msg, ...rest) {
    if (this.root.handlers.length === 0) this.basicConfig();
    this.root.log(level, msg, ...rest);
  }
  disable(level = CRITICAL) {
    this.root.manager.disable = level;
    this.root.manager._clear_cache();
  }
  // handlerList: the handlers themselves (CPython keeps weak references
  // and calls each one; a dead reference gives None and is skipped)
  shutdown(handlerList = this._handlerList) {
    for (const h of [...handlerList].reverse()) {
      if (!h) continue;
      try {
        h.acquire();
        if (h.flushOnClose === undefined || truthy(h.flushOnClose)) h.flush();
        h.close();
      } catch (e) {
        // except (OSError, ValueError): pass — anything else is re-raised
        // while raiseExceptions is true, swallowed otherwise
        if (e instanceof PyException && OS_OR_VALUE_ERRORS.has(e.name)) continue;
        if (this.raiseExceptions || !(e instanceof PyException) || e.name === 'DemoLimit') throw e;
      } finally {
        h.release();
      }
    }
  }

  // warnings → logging (warnings.formatwarning text, logged on 'py.warnings')
  captureWarnings(capture) {
    if (truthy(capture)) {
      if (this._warnings_showwarning === null) this._warnings_showwarning = 'original';
    } else if (this._warnings_showwarning !== null) this._warnings_showwarning = null;
  }
  // warnings.warn_explicit(message, category, filename, lineno) with the
  // 'always' filter and no source line
  warnExplicit(message, category, filename, lineno) {
    const s = `${pyStr(filename)}:${pyStr(lineno)}: ${category}: ${pyStr(message)}\n`;
    if (this._warnings_showwarning === null) { this.stderr.write(s); return; }
    const logger = this.getLogger('py.warnings');
    if (!logger.handlers.length) logger.addHandler(this.NullHandler());
    logger.warning(s);
  }
}

export { PyFloat, PyTuple, PyDict, MachineValue, pyFloat, tuple, pyRepr, pyStr, truthy, doubleToString };
