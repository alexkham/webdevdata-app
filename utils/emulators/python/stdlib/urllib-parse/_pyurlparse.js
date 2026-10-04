// utils/emulators/python/stdlib/urllib-parse/_pyurlparse.js
//
// Line-by-line port of CPython 3.13's Lib/urllib/parse.py (plus the parts
// of Lib/ipaddress.py that urlsplit's bracket check uses, and the utf-8 /
// latin-1 / ascii codecs with their error handlers) for the urllib.parse
// demos — shared by the module hub and every member emulator. Not a
// content page (leading underscore), so the catalog generator never maps it.
//
// Python value model:
//   None → null · bool → true/false · int → JS integer or bigint
//   float → PyFloat · str → string · bytes → PyBytes (a latin-1 "binary
//   string": one JS char per byte) · list → Array · tuple → { __pyTuple }
//   dict → PyDict (insertion-ordered) · the six result classes → UrlResult
// repr() renders any of them exactly; asPy() wraps a value for the demo box.

import { pyStrRepr, pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

// ── Value model ──────────────────────────────────────────────
export class PyBytes {
  constructor(s = '') { this.s = s; } // every char code 0..255
  get length() { return this.s.length; }
}
export const b = (s) => new PyBytes(s);
export const bytesFrom = (arr) => new PyBytes(String.fromCharCode(...arr));

export class PyFloat {
  constructor(v) { this.v = v; }
}

export class PyDict {
  constructor(entries = []) {
    this.entries = [];
    for (const [k, v] of entries) this.set(k, v);
  }
  indexOf(k) { return this.entries.findIndex(([kk]) => keyEq(kk, k)); }
  get(k) { const i = this.indexOf(k); return i === -1 ? undefined : this.entries[i][1]; }
  set(k, v) {
    const i = this.indexOf(k);
    if (i === -1) this.entries.push([k, v]);
    else this.entries[i] = [this.entries[i][0], v];
  }
  has(k) { return this.indexOf(k) !== -1; }
  get size() { return this.entries.length; }
}
function keyEq(a, c) {
  if (a instanceof PyBytes && c instanceof PyBytes) return a.s === c.s;
  if (a instanceof PyBytes || c instanceof PyBytes) return false;
  if (typeof a === 'boolean') a = a ? 1 : 0;
  if (typeof c === 'boolean') c = c ? 1 : 0;
  if (typeof a === 'bigint' || typeof c === 'bigint') {
    try { return BigInt(a) === BigInt(c); } catch { return false; }
  }
  return a === c;
}

export const tuple = (...items) => ({ __pyTuple: items });
const isTuple = (v) => v !== null && typeof v === 'object' && Array.isArray(v.__pyTuple);

const raise = (type, msg) => { throw new PyException(type, msg); };

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'string') return 'str';
  if (typeof v === 'function') return 'function';
  if (v instanceof PyBytes) return 'bytes';
  if (v instanceof PyFloat) return 'float';
  if (Array.isArray(v)) return 'list';
  if (isTuple(v)) return 'tuple';
  if (v instanceof PyDict) return 'dict';
  if (v instanceof UrlResult) return v.cls;
  return 'object';
}

export function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'bigint') return v !== 0n;
  if (typeof v === 'string') return v.length > 0;
  if (v instanceof PyBytes) return v.s.length > 0;
  if (v instanceof PyFloat) return v.v !== 0;
  if (Array.isArray(v)) return v.length > 0;
  if (isTuple(v)) return v.__pyTuple.length > 0;
  if (v instanceof PyDict) return v.size > 0;
  if (v instanceof UrlResult) return true;
  return true;
}

export function bytesRepr(bs) {
  const s = bs.s;
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = 'b' + q;
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    const ch = s[i];
    if (ch === q || ch === '\\') out += '\\' + ch;
    else if (ch === '\t') out += '\\t';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (c < 0x20 || c >= 0x7f) out += '\\x' + c.toString(16).padStart(2, '0');
    else out += ch;
  }
  return out + q;
}

export function repr(v) {
  if (v === null || v === undefined) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : pyFloatRepr(v);
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'string') return pyStrRepr(v);
  if (v instanceof PyBytes) return bytesRepr(v);
  if (v instanceof PyFloat) return pyFloatRepr(v.v);
  if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
  if (isTuple(v)) {
    const items = v.__pyTuple.map(repr);
    return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
  }
  if (v instanceof PyDict) return '{' + v.entries.map(([k, x]) => `${repr(k)}: ${repr(x)}`).join(', ') + '}';
  if (v instanceof UrlResult) return v.repr();
  if (v.__pyRaw !== undefined) return v.__pyRaw;
  if (typeof v === 'function') return `<function ${v.pyName || v.name}>`;
  return String(v);
}
export const asPy = (v) => ({ __pyRaw: repr(v) });

// str(v)
export function pyStr(v) {
  if (typeof v === 'string') return v;
  if (v instanceof UrlResult) return v.repr();
  return repr(v);
}

// ── Codecs: utf-8, latin-1, ascii ────────────────────────────
const CODECS = {
  utf_8: 'utf-8', utf8: 'utf-8', u8: 'utf-8', utf: 'utf-8', cp65001: 'utf-8',
  latin_1: 'latin-1', latin1: 'latin-1', iso_8859_1: 'latin-1', iso8859_1: 'latin-1', '8859': 'latin-1',
  cp819: 'latin-1', latin: 'latin-1', l1: 'latin-1',
  ascii: 'ascii', us_ascii: 'ascii', '646': 'ascii',
};
export function codecName(encoding) {
  if (typeof encoding !== 'string') raise('TypeError', `encode() argument 'encoding' must be str, not ${typeName(encoding)}`);
  const norm = encoding.trim().toLowerCase().replace(/[-\s]+/g, '_');
  const name = CODECS[norm];
  if (!name) raise('LookupError', `unknown encoding: ${encoding}`);
  return name;
}

const charEsc = (cp) => {
  if (cp < 0x100) return '\\x' + cp.toString(16).padStart(2, '0');
  if (cp < 0x10000) return '\\u' + cp.toString(16).padStart(4, '0');
  return '\\U' + cp.toString(16).padStart(8, '0');
};
const isSurr = (cp) => cp >= 0xd800 && cp <= 0xdfff;

function utf8Bytes(cp, out) {
  if (cp < 0x80) out.push(cp);
  else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
  else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
  else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
}

// str.encode(encoding, errors) → PyBytes
export function encode(str, encoding = 'utf-8', errors = 'strict') {
  const codec = codecName(encoding);
  if (typeof errors !== 'string') raise('TypeError', `encode() argument 'errors' must be str, not ${typeName(errors)}`);
  const cps = Array.from(str, (c) => c.codePointAt(0));
  const limit = codec === 'ascii' ? 0x80 : codec === 'latin-1' ? 0x100 : null;
  const bad = (cp) => (limit === null ? isSurr(cp) : cp >= limit);
  const reason = codec === 'utf-8' ? 'surrogates not allowed' : `ordinal not in range(${limit})`;
  const out = [];
  let i = 0;
  while (i < cps.length) {
    const cp = cps[i];
    if (!bad(cp)) {
      if (codec === 'utf-8') utf8Bytes(cp, out); else out.push(cp);
      i += 1;
      continue;
    }
    let end = i + 1;
    while (end < cps.length && bad(cps[end])) end += 1;
    const run = cps.slice(i, end);
    const fail = () => {
      const msg = end - i === 1
        ? `'${codec}' codec can't encode character '${charEsc(run[0])}' in position ${i}: ${reason}`
        : `'${codec}' codec can't encode characters in position ${i}-${end - 1}: ${reason}`;
      raise('UnicodeEncodeError', msg);
    };
    switch (errors) {
      case 'strict': fail(); break;
      case 'ignore': break;
      case 'replace': run.forEach(() => out.push(0x3f)); break;
      case 'backslashreplace':
        run.forEach((c) => { for (const ch of charEsc(c)) out.push(ch.charCodeAt(0)); });
        break;
      case 'xmlcharrefreplace':
        run.forEach((c) => { for (const ch of `&#${c};`) out.push(ch.charCodeAt(0)); });
        break;
      case 'surrogatepass':
        if (codec !== 'utf-8') fail();
        run.forEach((c) => utf8Bytes(c, out));
        break;
      case 'surrogateescape': {
        const lo = limit === null ? 0xdc80 : 0xdc80;
        if (!run.every((c) => c >= lo && c <= 0xdcff)) fail();
        run.forEach((c) => out.push(c - 0xdc00));
        break;
      }
      default: raise('LookupError', `unknown error handler name '${errors}'`);
    }
    i = end;
  }
  return bytesFrom(out);
}

// One utf-8 error at byte i: [end, reason], CPython's maximal-subpart rules.
function utf8Step(s, i) {
  const n = s.length;
  const c0 = s.charCodeAt(i);
  const cont = (j, lo = 0x80, hi = 0xbf) => j < n && s.charCodeAt(j) >= lo && s.charCodeAt(j) <= hi;
  let need;
  let lo2 = 0x80;
  let hi2 = 0xbf;
  if (c0 < 0x80) return { cp: c0, len: 1 };
  if (c0 >= 0xc2 && c0 <= 0xdf) need = 1;
  else if (c0 >= 0xe0 && c0 <= 0xef) {
    need = 2;
    if (c0 === 0xe0) lo2 = 0xa0;
    if (c0 === 0xed) hi2 = 0x9f;
  } else if (c0 >= 0xf0 && c0 <= 0xf4) {
    need = 3;
    if (c0 === 0xf0) lo2 = 0x90;
    if (c0 === 0xf4) hi2 = 0x8f;
  } else return { err: 'invalid start byte', end: i + 1 };
  for (let k = 1; k <= need; k += 1) {
    if (i + k >= n) return { err: 'unexpected end of data', end: n };
    const ok = k === 1 ? cont(i + 1, lo2, hi2) : cont(i + k);
    if (!ok) return { err: 'invalid continuation byte', end: i + k };
  }
  let cp = c0 & (need === 1 ? 0x1f : need === 2 ? 0x0f : 0x07);
  for (let k = 1; k <= need; k += 1) cp = (cp << 6) | (s.charCodeAt(i + k) & 63);
  return { cp, len: need + 1 };
}

// bytes.decode(encoding, errors) → str
export function decode(bs, encoding = 'utf-8', errors = 'strict') {
  if (typeof encoding !== 'string') raise('TypeError', `decode() argument 'encoding' must be str, not ${typeName(encoding)}`);
  if (typeof errors !== 'string') raise('TypeError', `decode() argument 'errors' must be str, not ${typeName(errors)}`);
  const codec = codecName(encoding);
  const s = bs.s;
  if (codec === 'latin-1') return s;
  let out = '';
  let i = 0;
  while (i < s.length) {
    let step;
    if (codec === 'ascii') {
      const c = s.charCodeAt(i);
      step = c < 0x80 ? { cp: c, len: 1 } : { err: 'ordinal not in range(128)', end: i + 1 };
    } else step = utf8Step(s, i);
    if (step.err === undefined) {
      out += String.fromCodePoint(step.cp);
      i += step.len;
      continue;
    }
    const { end } = step;
    switch (errors) {
      case 'strict': {
        const msg = end - i === 1
          ? `'${codec}' codec can't decode byte 0x${s.charCodeAt(i).toString(16).padStart(2, '0')} in position ${i}: ${step.err}`
          : `'${codec}' codec can't decode bytes in position ${i}-${end - 1}: ${step.err}`;
        raise('UnicodeDecodeError', msg);
        break;
      }
      case 'ignore': i = end; break;
      case 'replace': out += '�'; i = end; break;
      case 'backslashreplace':
        for (let k = i; k < end; k += 1) out += '\\x' + s.charCodeAt(k).toString(16).padStart(2, '0');
        i = end;
        break;
      case 'surrogateescape': {
        for (let k = i; k < end; k += 1) {
          const c = s.charCodeAt(k);
          if (c < 0x80) raise('UnicodeDecodeError', `'${codec}' codec can't decode byte 0x${c.toString(16).padStart(2, '0')} in position ${k}: ${step.err}`);
          out += String.fromCharCode(0xdc00 + c);
        }
        i = end;
        break;
      }
      case 'surrogatepass': {
        const c0 = s.charCodeAt(i);
        const c1 = s.charCodeAt(i + 1);
        const c2 = s.charCodeAt(i + 2);
        if (codec === 'utf-8' && i + 2 < s.length && c0 === 0xed && c1 >= 0xa0 && c1 <= 0xbf && c2 >= 0x80 && c2 <= 0xbf) {
          out += String.fromCharCode(((c0 & 0x0f) << 12) | ((c1 & 63) << 6) | (c2 & 63));
          i += 3;
        } else {
          const msg = end - i === 1
            ? `'${codec}' codec can't decode byte 0x${c0.toString(16).padStart(2, '0')} in position ${i}: ${step.err}`
            : `'${codec}' codec can't decode bytes in position ${i}-${end - 1}: ${step.err}`;
          raise('UnicodeDecodeError', msg);
        }
        break;
      }
      default: raise('LookupError', `unknown error handler name '${errors}'`);
    }
  }
  return out;
}

// ── small Python helpers ────────────────────────────────────
const partition = (s, sep) => {
  const i = s.indexOf(sep);
  return i === -1 ? [s, '', ''] : [s.slice(0, i), sep, s.slice(i + sep.length)];
};
const rpartition = (s, sep) => {
  const i = s.lastIndexOf(sep);
  return i === -1 ? ['', '', s] : [s.slice(0, i), sep, s.slice(i + sep.length)];
};
const isAscii = (s) => /^[\x00-\x7f]*$/.test(s);
const asciiLower = (s) => s.replace(/[A-Z]/g, (c) => c.toLowerCase());

// sequence unpacking: `a, b = v`
function unpack(v, n) {
  let items;
  if (Array.isArray(v)) items = v;
  else if (isTuple(v)) items = v.__pyTuple;
  else if (typeof v === 'string') items = Array.from(v);
  else if (v instanceof PyBytes) items = Array.from(v.s, (c) => c.charCodeAt(0));
  else if (v instanceof UrlResult) items = v.values;
  else if (v instanceof PyDict) items = v.entries.map(([k]) => k);
  else raise('TypeError', `cannot unpack non-iterable ${typeName(v)} object`);
  if (items.length > n) raise('ValueError', `too many values to unpack (expected ${n})`);
  if (items.length < n) raise('ValueError', `not enough values to unpack (expected ${n}, got ${items.length})`);
  return items;
}
function iterItems(v) {
  if (Array.isArray(v)) return v;
  if (isTuple(v)) return v.__pyTuple;
  if (typeof v === 'string') return Array.from(v);
  if (v instanceof PyBytes) return Array.from(v.s, (c) => c.charCodeAt(0));
  if (v instanceof UrlResult) return v.values;
  if (v instanceof PyDict) return v.entries.map(([k]) => k);
  return raise('TypeError', `'${typeName(v)}' object is not iterable`);
}
const hasLen = (v) => Array.isArray(v) || isTuple(v) || typeof v === 'string' || v instanceof PyBytes || v instanceof UrlResult || v instanceof PyDict;

// a[:n] / a[n:] for str (and lists), Python's error otherwise
function sub(v, start, end) {
  if (typeof v === 'string' || Array.isArray(v)) return v.slice(start, end);
  return raise('TypeError', `'${typeName(v)}' object is not subscriptable`);
}
function add(x, y) {
  if (typeof x === 'string' && typeof y === 'string') return x + y;
  if (typeof x === 'string') raise('TypeError', `can only concatenate str (not "${typeName(y)}") to str`);
  if (Array.isArray(x) && Array.isArray(y)) return x.concat(y);
  return raise('TypeError', `unsupported operand type(s) for +: '${typeName(x)}' and '${typeName(y)}'`);
}

// ── Scheme classification ────────────────────────────────────
export const uses_relative = ['', 'ftp', 'http', 'gopher', 'nntp', 'imap', 'wais', 'file', 'https', 'shttp', 'mms',
  'prospero', 'rtsp', 'rtsps', 'rtspu', 'sftp', 'svn', 'svn+ssh', 'ws', 'wss'];
export const uses_netloc = ['', 'ftp', 'http', 'gopher', 'nntp', 'telnet', 'imap', 'wais', 'file', 'mms', 'https', 'shttp',
  'snews', 'prospero', 'rtsp', 'rtsps', 'rtspu', 'rsync', 'svn', 'svn+ssh', 'sftp', 'nfs', 'git', 'git+ssh',
  'ws', 'wss', 'itms-services'];
export const uses_params = ['', 'ftp', 'hdl', 'prospero', 'http', 'imap', 'https', 'shttp', 'rtsp', 'rtsps', 'rtspu', 'sip',
  'sips', 'mms', 'sftp', 'tel'];
const inList = (list, v) => typeof v === 'string' && list.includes(v);
const SCHEME_CHARS = /^[A-Za-z0-9+\-.]*$/;
const C0_OR_SPACE = /[\x00-\x20]/;
const lstripC0 = (s) => { let i = 0; while (i < s.length && C0_OR_SPACE.test(s[i])) i += 1; return s.slice(i); };
const stripC0 = (s) => { let e = s.length; while (e > 0 && C0_OR_SPACE.test(s[e - 1])) e -= 1; return lstripC0(s.slice(0, e)); };

// ── _coerce_args ─────────────────────────────────────────────
// returns [args (as str), coerceResult]
function coerceArgs(args) {
  if (args.length === 0) raise('IndexError', 'tuple index out of range');
  const strInput = typeof args[0] === 'string';
  for (const a of args.slice(1)) {
    if (truthy(a) && (typeof a === 'string') !== strInput) raise('TypeError', 'Cannot mix str and non-str arguments');
  }
  if (strInput) return [args, (x) => x];
  const dec = args.map((x) => {
    if (!truthy(x)) return '';
    if (x instanceof PyBytes) return decode(x, 'ascii', 'strict');
    return raise('AttributeError', `'${typeName(x)}' object has no attribute 'decode'`);
  });
  return [dec, encodeResult];
}
function encodeResult(obj) {
  if (obj instanceof UrlResult) return obj.encode();
  return encode(obj, 'ascii', 'strict');
}

// ── Result classes ───────────────────────────────────────────
export const FIELDS = {
  DefragResult: ['url', 'fragment'],
  SplitResult: ['scheme', 'netloc', 'path', 'query', 'fragment'],
  ParseResult: ['scheme', 'netloc', 'path', 'params', 'query', 'fragment'],
};

export class UrlResult {
  // base: 'ParseResult' | 'SplitResult' | 'DefragResult'; isBytes → *Bytes class
  constructor(base, values, isBytes = false) {
    const fields = FIELDS[base];
    if (values.length > fields.length) {
      raise('TypeError', `${base}.__new__() takes ${fields.length + 1} positional arguments but ${values.length + 1} were given`);
    }
    if (values.length < fields.length) {
      const missing = fields.slice(values.length);
      const names = missing.map((f) => `'${f}'`);
      const list = names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} and ${names[1]}` : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
      raise('TypeError', `${base}.__new__() missing ${missing.length} required positional argument${missing.length > 1 ? 's' : ''}: ${list}`);
    }
    this.base = base;
    this.isBytes = isBytes;
    this.values = values;
  }
  get cls() { return this.base + (this.isBytes ? 'Bytes' : ''); }
  get fields() { return FIELDS[this.base]; }
  get(name) {
    const i = this.fields.indexOf(name);
    if (i === -1) return this.attr(name);
    return this.values[i];
  }
  repr() {
    return `${this.cls}(${this.fields.map((f, i) => `${f}=${repr(this.values[i])}`).join(', ')})`;
  }
  _replace(kw) {
    const rest = new Map(Object.entries(kw));
    const vals = this.fields.map((f, i) => {
      if (rest.has(f)) { const v = rest.get(f); rest.delete(f); return v; }
      return this.values[i];
    });
    if (rest.size) raise('TypeError', `Got unexpected field names: ${repr([...rest.keys()])}`);
    return new UrlResult(this.base, vals, this.isBytes);
  }
  _asdict() { return new PyDict(this.fields.map((f, i) => [f, this.values[i]])); }
  encode(encoding = 'ascii', errors = 'strict') {
    if (this.isBytes) raise('AttributeError', `'${this.cls}' object has no attribute 'encode'`);
    return new UrlResult(this.base, this.values.map((x) => {
      if (typeof x !== 'string') raise('AttributeError', `'${typeName(x)}' object has no attribute 'encode'`);
      return encode(x, encoding, errors);
    }), true);
  }
  decode(encoding = 'ascii', errors = 'strict') {
    if (!this.isBytes) raise('AttributeError', `'${this.cls}' object has no attribute 'decode'`);
    return new UrlResult(this.base, this.values.map((x) => {
      if (!(x instanceof PyBytes)) raise('AttributeError', `'${typeName(x)}' object has no attribute 'decode'`);
      return decode(x, encoding, errors);
    }), false);
  }
  geturl() {
    if (this.base === 'DefragResult') {
      const [url, frag] = this.values;
      if (truthy(frag)) {
        if (this.isBytes) {
          if (url instanceof PyBytes && frag instanceof PyBytes) return new PyBytes(url.s + '#' + frag.s);
          raise('TypeError', `can't concat ${typeName(frag)} to ${typeName(url)}`);
        }
        return add(add(url, '#'), frag);
      }
      return url;
    }
    return this.base === 'SplitResult' ? urlunsplit(this) : urlunparse(this);
  }
  // netloc mixin
  _netlocStr() {
    if (this.base === 'DefragResult') raise('AttributeError', `'${this.cls}' object has no attribute 'netloc'`);
    const n = this.get('netloc');
    if (this.isBytes) {
      if (!(n instanceof PyBytes)) raise('AttributeError', `'${typeName(n)}' object has no attribute 'rpartition'`);
      return n.s;
    }
    if (typeof n !== 'string') raise('AttributeError', `'${typeName(n)}' object has no attribute 'rpartition'`);
    return n;
  }
  _wrap(s) { return s === null ? null : this.isBytes ? new PyBytes(s) : s; }
  _userinfo() {
    const [userinfo, haveInfo] = rpartition(this._netlocStr(), '@');
    if (haveInfo) {
      const [username, havePw, pw] = partition(userinfo, ':');
      return [username, havePw ? pw : null];
    }
    return [null, null];
  }
  _hostinfo() {
    const [, , hostinfo] = rpartition(this._netlocStr(), '@');
    const [, haveOpen, bracketed] = partition(hostinfo, '[');
    let hostname;
    let port;
    if (haveOpen) {
      let rest;
      [hostname, , rest] = partition(bracketed, ']');
      [, , port] = partition(rest, ':');
    } else {
      [hostname, , port] = partition(hostinfo, ':');
    }
    return [hostname, port === '' ? null : port];
  }
  get username() { return this._wrap(this._userinfo()[0]); }
  get password() { return this._wrap(this._userinfo()[1]); }
  get hostname() {
    const h = this._hostinfo()[0];
    if (!h) return null;
    const [host, pct, zone] = partition(h, '%');
    return this._wrap((this.isBytes ? asciiLower(host) : host.toLowerCase()) + pct + zone);
  }
  get port() {
    let port = this._hostinfo()[1];
    if (port !== null) {
      if (/^[0-9]+$/.test(port)) port = BigInt(port);
      else raise('ValueError', `Port could not be cast to integer value as ${repr(this._wrap(port))}`);
      if (!(port >= 0n && port <= 65535n)) raise('ValueError', 'Port out of range 0-65535');
      return Number(port);
    }
    return null;
  }
  attr(name) {
    if (['username', 'password', 'hostname', 'port'].includes(name)) return this[name];
    return raise('AttributeError', `'${this.cls}' object has no attribute '${name}'`);
  }
}
export const ParseResult = (...v) => new UrlResult('ParseResult', v);
export const SplitResult = (...v) => new UrlResult('SplitResult', v);
export const DefragResult = (...v) => new UrlResult('DefragResult', v);

// ── ipaddress (validity only — urlsplit's bracket check) ─────
function parseOctet(s) {
  if (!s) return false;
  if (!/^[0-9]+$/.test(s)) return false;
  if (s.length > 3) return false;
  if (s !== '0' && s[0] === '0') return false;
  return Number(s) <= 255;
}
function isIPv4(s) {
  if (s.includes('/')) return false;
  if (!s) return false;
  const oct = s.split('.');
  return oct.length === 4 && oct.every(parseOctet);
}
function isIPv6(s) {
  if (s.includes('/')) return false;
  const [addr, sep, scope] = partition(s, '%');
  if (sep && (!scope || scope.includes('%'))) return false;
  if (!addr) return false;
  const parts = addr.split(':');
  if (parts.length < 3) return false;
  if (parts[parts.length - 1].includes('.')) {
    if (!isIPv4(parts.pop())) return false;
    parts.push('0', '0');
  }
  if (parts.length > 9) return false;
  let skip = null;
  for (let i = 1; i < parts.length - 1; i += 1) {
    if (!parts[i]) {
      if (skip !== null) return false;
      skip = i;
    }
  }
  let hi;
  let lo;
  if (skip !== null) {
    hi = skip;
    lo = parts.length - skip - 1;
    if (!parts[0]) { hi -= 1; if (hi) return false; }
    if (!parts[parts.length - 1]) { lo -= 1; if (lo) return false; }
    if (8 - (hi + lo) < 1) return false;
  } else {
    if (parts.length !== 8) return false;
    if (!parts[0] || !parts[parts.length - 1]) return false;
    hi = parts.length;
    lo = 0;
  }
  const hex = (h) => /^[0-9A-Fa-f]*$/.test(h) && h.length <= 4 && h.length > 0;
  // _parse_hextet: int('', 16) fails too
  for (let i = 0; i < hi; i += 1) if (!hex(parts[i])) return false;
  for (let i = parts.length - lo; i < parts.length; i += 1) if (!hex(parts[i])) return false;
  return true;
}
function checkBracketedHost(hostname) {
  if (hostname.startsWith('v')) {
    if (!/^v[a-fA-F0-9]+\.[^\n]+$/.test(hostname)) raise('ValueError', 'IPvFuture address is invalid');
  } else {
    if (isIPv4(hostname)) raise('ValueError', 'An IPv4 address cannot be in brackets');
    if (!isIPv6(hostname)) raise('ValueError', `${repr(hostname)} does not appear to be an IPv4 or IPv6 address`);
  }
}
function checkBracketedNetloc(netloc) {
  const hostAndPort = rpartition(netloc, '@')[2];
  const [before, haveOpen, bracketed] = partition(hostAndPort, '[');
  let hostname;
  if (haveOpen) {
    if (before) raise('ValueError', 'Invalid IPv6 URL');
    let port;
    [hostname, , port] = partition(bracketed, ']');
    if (port && !port.startsWith(':')) raise('ValueError', 'Invalid IPv6 URL');
  } else {
    [hostname] = partition(hostAndPort, ':');
  }
  checkBracketedHost(hostname);
}
function checkNetloc(netloc) {
  if (!netloc || isAscii(netloc)) return;
  const n = netloc.replace(/[@:#?]/g, '');
  const n2 = n.normalize('NFKC');
  if (n === n2) return;
  for (const c of '/?#@:') {
    if (n2.includes(c)) raise('ValueError', `netloc '${netloc}' contains invalid characters under NFKC normalization`);
  }
}
function splitNetloc(url, start = 0) {
  let delim = url.length;
  for (const c of '/?#') {
    const w = url.indexOf(c, start);
    if (w >= 0) delim = Math.min(delim, w);
  }
  return [url.slice(start, delim), url.slice(delim)];
}
function splitParams(url) {
  let i;
  if (url.includes('/')) {
    i = url.indexOf(';', url.lastIndexOf('/'));
    if (i < 0) return [url, ''];
  } else i = url.indexOf(';');
  return [url.slice(0, i), url.slice(i + 1)];
}

// ── urlsplit / urlparse / urlunsplit / urlunparse ────────────
export function urlsplit(url0, scheme0 = '', allowFragments = true) {
  const [[u, s], coerce] = coerceArgs([url0, scheme0]);
  if (typeof u !== 'string') raise('AttributeError', `'${typeName(u)}' object has no attribute 'lstrip'`);
  if (typeof s !== 'string') raise('AttributeError', `'${typeName(s)}' object has no attribute 'strip'`);
  let url = lstripC0(u);
  let scheme = stripC0(s);
  url = url.replace(/[\t\r\n]/g, '');
  scheme = scheme.replace(/[\t\r\n]/g, '');
  const allow = truthy(allowFragments);
  let netloc = '';
  let query = '';
  let fragment = '';
  const i = url.indexOf(':');
  if (i > 0 && /^[A-Za-z]/.test(url) && SCHEME_CHARS.test(url.slice(0, i))) {
    scheme = url.slice(0, i).toLowerCase();
    url = url.slice(i + 1);
  }
  if (url.slice(0, 2) === '//') {
    [netloc, url] = splitNetloc(url, 2);
    const o = netloc.includes('[');
    const c = netloc.includes(']');
    if ((o && !c) || (c && !o)) raise('ValueError', 'Invalid IPv6 URL');
    if (o && c) checkBracketedNetloc(netloc);
  }
  if (allow && url.includes('#')) [url, fragment] = [url.slice(0, url.indexOf('#')), url.slice(url.indexOf('#') + 1)];
  if (url.includes('?')) [url, query] = [url.slice(0, url.indexOf('?')), url.slice(url.indexOf('?') + 1)];
  checkNetloc(netloc);
  return coerce(new UrlResult('SplitResult', [scheme, netloc, url, query, fragment]));
}

export function urlparse(url0, scheme0 = '', allowFragments = true) {
  const [[u, s], coerce] = coerceArgs([url0, scheme0]);
  const sr = urlsplit(u, s, allowFragments);
  const [scheme, netloc, path, query, fragment] = sr.values;
  let url = path;
  let params = '';
  if (uses_params.includes(scheme) && url.includes(';')) [url, params] = splitParams(url);
  return coerce(new UrlResult('ParseResult', [scheme, netloc, url, params, query, fragment]));
}

export function urlunsplit(components) {
  const items = iterItems(components);
  const [args, coerce] = coerceArgs(items);
  let [scheme, netloc, url, query, fragment] = unpack({ __pyTuple: [...args, coerce] }, 6);
  if (truthy(netloc)) {
    if (truthy(url) && sub(url, 0, 1) !== '/') url = add('/', url);
    url = add(add('//', netloc), url);
  } else if (sub(url, 0, 2) === '//') {
    url = add('//', url);
  } else if (truthy(scheme) && inList(uses_netloc, scheme) && (!truthy(url) || sub(url, 0, 1) === '/')) {
    url = add('//', url);
  }
  if (truthy(scheme)) url = add(add(scheme, ':'), url);
  if (truthy(query)) url = add(add(url, '?'), query);
  if (truthy(fragment)) url = add(add(url, '#'), fragment);
  return coerce(url);
}

export function urlunparse(components) {
  const items = iterItems(components);
  const [args, coerce] = coerceArgs(items);
  let [scheme, netloc, url, params, query, fragment] = unpack({ __pyTuple: [...args, coerce] }, 7);
  if (truthy(params)) url = `${pyStr(url)};${pyStr(params)}`;
  return coerce(urlunsplit(tuple(scheme, netloc, url, query, fragment)));
}

// ── urljoin / urldefrag ──────────────────────────────────────
export function urljoin(base0, url0, allowFragments = true) {
  if (!truthy(base0)) return url0;
  if (!truthy(url0)) return base0;
  const [[base, url], coerce] = coerceArgs([base0, url0]);
  const [bscheme, bnetloc, bpath, bparams, bquery] = urlparse(base, '', allowFragments).values;
  let [scheme, netloc, path, params, query, fragment] = urlparse(url, bscheme, allowFragments).values;
  if (scheme !== bscheme || !uses_relative.includes(scheme)) return coerce(url);
  if (uses_netloc.includes(scheme)) {
    if (netloc) return coerce(urlunparse(tuple(scheme, netloc, path, params, query, fragment)));
    netloc = bnetloc;
  }
  if (!path && !params) {
    path = bpath;
    params = bparams;
    if (!query) query = bquery;
    return coerce(urlunparse(tuple(scheme, netloc, path, params, query, fragment)));
  }
  const baseParts = bpath.split('/');
  if (baseParts[baseParts.length - 1] !== '') baseParts.pop();
  let segments;
  if (path.slice(0, 1) === '/') segments = path.split('/');
  else {
    segments = baseParts.concat(path.split('/'));
    if (segments.length >= 2) {
      // segments[1:-1] = filter(None, segments[1:-1])
      segments = [segments[0], ...segments.slice(1, -1).filter(Boolean), segments[segments.length - 1]];
    }
  }
  const resolved = [];
  for (const seg of segments) {
    if (seg === '..') { if (resolved.length) resolved.pop(); } else if (seg === '.') continue;
    else resolved.push(seg);
  }
  const last = segments[segments.length - 1];
  if (last === '.' || last === '..') resolved.push('');
  return coerce(urlunparse(tuple(scheme, netloc, resolved.join('/') || '/', params, query, fragment)));
}

export function urldefrag(url0) {
  const [[url], coerce] = coerceArgs([url0]);
  let frag;
  let defrag;
  if (typeof url === 'string' ? url.includes('#') : iterItems(url).includes('#')) {
    const [s, n, p, a, q, f] = urlparse(url).values;
    frag = f;
    defrag = urlunparse(tuple(s, n, p, a, q, ''));
  } else {
    frag = '';
    defrag = url;
  }
  return coerce(new UrlResult('DefragResult', [defrag, frag]));
}

// ── unquote family ───────────────────────────────────────────
const HEX2 = /^[0-9A-Fa-f]{2}$/;
// _unquote_impl → binary string
function unquoteImpl(string) {
  let s;
  if (string instanceof PyBytes) s = string.s;
  else if (typeof string === 'string') {
    if (!string) return '';
    s = encode(string, 'utf-8', 'strict').s;
  } else return raise('AttributeError', `'${typeName(string)}' object has no attribute 'split'`);
  const bits = s.split('%');
  if (bits.length === 1) return s;
  let res = bits[0];
  for (const item of bits.slice(1)) {
    const h = item.slice(0, 2);
    if (HEX2.test(h)) res += String.fromCharCode(parseInt(h, 16)) + item.slice(2);
    else res += '%' + item;
  }
  return res;
}

export function unquote_to_bytes(string) {
  return new PyBytes(unquoteImpl(string));
}

export function unquote(string, encoding = 'utf-8', errors = 'replace') {
  if (string instanceof PyBytes) return decode(new PyBytes(unquoteImpl(string)), encoding, errors);
  if (typeof string !== 'string') {
    if (Array.isArray(string) || isTuple(string) || string instanceof PyDict || string instanceof UrlResult) {
      if (!iterItems(string).includes('%')) {
        return raise('AttributeError', `'${typeName(string)}' object has no attribute 'split'`);
      }
      return raise('TypeError', `expected string or bytes-like object, got '${typeName(string)}'`);
    }
    return raise('TypeError', `argument of type '${typeName(string)}' is not iterable`);
  }
  if (!string.includes('%')) return string;
  if (encoding === null) encoding = 'utf-8';
  if (errors === null) errors = 'replace';
  let out = '';
  const re = /[\x00-\x7f]+/g;
  let prev = 0;
  let m;
  while ((m = re.exec(string)) !== null) {
    out += string.slice(prev, m.index);
    out += decode(new PyBytes(unquoteImpl(m[0])), encoding, errors);
    prev = m.index + m[0].length;
  }
  return out + string.slice(prev);
}

export function unquote_plus(string, encoding = 'utf-8', errors = 'replace') {
  if (string instanceof PyBytes) raise('TypeError', "a bytes-like object is required, not 'str'");
  if (typeof string !== 'string') raise('AttributeError', `'${typeName(string)}' object has no attribute 'replace'`);
  return unquote(string.replace(/\+/g, ' '), encoding, errors);
}

// ── quote family ─────────────────────────────────────────────
const ALWAYS_SAFE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-~';

export function quote_from_bytes(bs, safe = '/') {
  if (!(bs instanceof PyBytes)) raise('TypeError', 'quote_from_bytes() expected bytes');
  if (!bs.s) return '';
  let safeSet;
  if (typeof safe === 'string') safeSet = Array.from(safe).filter((c) => c.codePointAt(0) < 128).join('');
  else if (safe instanceof PyBytes) safeSet = Array.from(safe.s).filter((c) => c.charCodeAt(0) < 128).join('');
  else if (Array.isArray(safe) || isTuple(safe)) {
    safeSet = iterItems(safe).map((c) => {
      if (typeof c !== 'number') raise('TypeError', `'<' not supported between instances of '${typeName(c)}' and 'int'`);
      return c;
    }).filter((c) => c < 128).map((c) => String.fromCharCode(c)).join('');
  } else return raise('TypeError', `'${typeName(safe)}' object is not iterable`);
  const ok = ALWAYS_SAFE + safeSet;
  let out = '';
  for (let i = 0; i < bs.s.length; i += 1) {
    const ch = bs.s[i];
    out += ok.includes(ch) ? ch : '%' + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
  }
  return out;
}

export function quote(string, safe = '/', encoding = null, errors = null) {
  if (typeof string === 'string') {
    if (!string) return string;
    if (encoding === null) encoding = 'utf-8';
    if (errors === null) errors = 'strict';
    string = encode(string, encoding, errors);
  } else {
    if (encoding !== null) raise('TypeError', "quote() doesn't support 'encoding' for bytes");
    if (errors !== null) raise('TypeError', "quote() doesn't support 'errors' for bytes");
  }
  return quote_from_bytes(string, safe);
}

export function quote_plus(string, safe = '', encoding = null, errors = null) {
  if ((typeof string === 'string' && !string.includes(' ')) || (string instanceof PyBytes && !string.s.includes(' '))) {
    return quote(string, safe, encoding, errors);
  }
  let safe2;
  if (typeof safe === 'string') safe2 = safe + ' ';
  else if (safe instanceof PyBytes) safe2 = new PyBytes(safe.s + ' ');
  else safe2 = add(safe, typeof safe === 'string' ? ' ' : new PyBytes(' '));
  return quote(string, safe2, encoding, errors).replace(/ /g, '+');
}
quote.pyName = 'quote';
quote_plus.pyName = 'quote_plus';

// ── urlencode ────────────────────────────────────────────────
export function urlencode(query, doseq = false, safe = '', encoding = null, errors = null, quoteVia = quote_plus) {
  let pairs;
  if (query instanceof PyDict) pairs = query.entries.map(([k, v]) => tuple(k, v));
  else {
    if (!hasLen(query)) raise('TypeError', 'not a valid non-string sequence or mapping object');
    const items = iterItems(query);
    if (items.length && !isTuple(items[0])) raise('TypeError', 'not a valid non-string sequence or mapping object');
    pairs = items;
  }
  const qv = (x, withEnc) => (withEnc ? quoteVia(x, safe, encoding, errors) : quoteVia(x, safe));
  const l = [];
  for (const pair of pairs) {
    let [k, v] = unpack(pair, 2);
    k = k instanceof PyBytes ? qv(k, false) : qv(pyStr(k), true);
    if (!truthy(doseq)) {
      v = v instanceof PyBytes ? qv(v, false) : qv(pyStr(v), true);
      l.push(add(add(k, '='), v));
    } else if (v instanceof PyBytes) {
      l.push(add(add(k, '='), qv(v, false)));
    } else if (typeof v === 'string') {
      l.push(add(add(k, '='), qv(v, true)));
    } else if (!hasLen(v)) {
      l.push(add(add(k, '='), qv(pyStr(v), true)));
    } else {
      for (const elt of iterItems(v)) {
        const e = elt instanceof PyBytes ? qv(elt, false) : qv(pyStr(elt), true);
        l.push(add(add(k, '='), e));
      }
    }
  }
  return l.join('&');
}

// ── parse_qsl / parse_qs ─────────────────────────────────────
export function parse_qsl(qs, keepBlank = false, strict = false, encoding = 'utf-8', errors = 'replace', maxNumFields = null, separator = '&') {
  if (!truthy(separator) || !(typeof separator === 'string' || separator instanceof PyBytes)) {
    raise('ValueError', 'Separator must be of type string or bytes.');
  }
  let isStr;
  let sep;
  let s;
  let unq;
  if (typeof qs === 'string') {
    isStr = true;
    sep = typeof separator === 'string' ? separator : decode(separator, 'ascii', 'strict');
    s = qs;
    unq = (x) => unquote_plus(x, encoding, errors);
  } else {
    if (!truthy(qs)) return [];
    if (!(qs instanceof PyBytes)) raise('TypeError', `memoryview: a bytes-like object is required, not '${typeName(qs)}'`);
    isStr = false;
    sep = separator instanceof PyBytes ? separator.s : encode(separator, 'ascii', 'strict').s;
    s = qs.s;
    unq = (x) => unquote_to_bytes(new PyBytes(x.replace(/\+/g, ' ')));
  }
  if (!s) return [];
  if (maxNumFields !== null && maxNumFields !== undefined) {
    const num = s.split(sep).length;
    if (maxNumFields < num) raise('ValueError', 'Max number of fields exceeded');
  }
  const r = [];
  for (const nv of s.split(sep)) {
    if (nv || truthy(strict)) {
      const [name, hasEq, value] = partition(nv, '=');
      if (!hasEq && truthy(strict)) raise('ValueError', `bad query field: ${repr(isStr ? nv : new PyBytes(nv))}`);
      if (value || truthy(keepBlank)) r.push(tuple(unq(name), unq(value)));
    }
  }
  return r;
}

export function parse_qs(qs, keepBlank = false, strict = false, encoding = 'utf-8', errors = 'replace', maxNumFields = null, separator = '&') {
  const out = new PyDict();
  for (const p of parse_qsl(qs, keepBlank, strict, encoding, errors, maxNumFields, separator)) {
    const [name, value] = p.__pyTuple;
    const cur = out.get(name);
    if (cur !== undefined) cur.push(value);
    else out.set(name, [value]);
  }
  return out;
}
