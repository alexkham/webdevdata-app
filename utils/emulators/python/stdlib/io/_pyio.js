// utils/emulators/python/stdlib/io/_pyio.js
//
// Port of the parts of CPython 3.13's C io module (Modules/_io/) that the io
// and tempfile demos run: StringIO (stringio.c), BytesIO and its getbuffer()
// view (bytesio.c), IncrementalNewlineDecoder and the line-ending search
// (textio.c), the IOBase mixins StringIO inherits (iobase.c: readlines,
// writelines, isatty, flush, fileno, iteration, with), the mode/buffering
// resolution of open() and FileIO's mode string (_iomodule.c, fileio.c), and
// a UTF-8-only TextIOWrapper over a BytesIO for the newline demos.
//
// Each method checks its arguments and the closed state in the C order, so
// the error a demo shows is the one CPython raises — including the detail
// that StringIO says "I/O operation on closed file" (no period) while
// BytesIO and the IOBase mixins say "I/O operation on closed file.".
//
// Python value model: None → null · bool → boolean · int → bigint ·
// float → PyFloat · str → string (positions count code points) ·
// bytes → PyBytes · bytearray → PyByteArray · list → Array ·
// tuple → { __pyTuple: [...] }.
//
// Not a content page (leading underscore): never mapped by the generator.

import { pyStrRepr, pyFloatRepr, pyReprExact } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { fromLiteral } from '../../../../py-num.js';

export const exc = (type, msg = '') => new PyException(type, msg);
// an input the browser demo deliberately does not reproduce
export const demoLimit = (msg) => exc('DemoLimit', msg);

// The demo keeps buffers small; CPython would try to allocate (and, for
// absurd sizes, raise MemoryError — how far it gets depends on the machine).
export const MAX_BUFFER = 1 << 24;

// ── value model ───────────────────────────────────────────────

export class PyFloat {
  constructor(f) { this.f = f; }
  get __pyRaw() { return pyFloatRepr(this.f); }
}

const hex2 = (n) => n.toString(16).padStart(2, '0');
// repr(bytes); bytearray's repr (array = true) picks the quote the same way
// but always escapes a single quote
export function bytesRepr(b, array = false) {
  let sq = false;
  let dq = false;
  for (const x of b) {
    if (x === 0x27) sq = true;
    else if (x === 0x22) dq = true;
  }
  const q = sq && !dq ? '"' : "'";
  let out = '';
  for (const x of b) {
    if (x === 0x5c) out += '\\\\';
    else if (x === q.charCodeAt(0) || (array && x === 0x27)) out += '\\' + String.fromCharCode(x);
    else if (x === 0x09) out += '\\t';
    else if (x === 0x0a) out += '\\n';
    else if (x === 0x0d) out += '\\r';
    else if (x >= 0x20 && x < 0x7f) out += String.fromCharCode(x);
    else out += '\\x' + hex2(x);
  }
  return 'b' + q + out + q;
}

export class PyBytes {
  constructor(b) { this.b = b instanceof Uint8Array ? b : Uint8Array.from(b); }
  get __pyRaw() { return bytesRepr(this.b); }
}
export class PyByteArray {
  constructor(b) { this.b = b instanceof Uint8Array ? b : Uint8Array.from(b); }
  get __pyRaw() { return `bytearray(${bytesRepr(this.b, true)})`; }
}
export const tuple = (...items) => ({ __pyTuple: items });

// bytearray(n) for an int n (zero bytes)
export function newByteArray(n) {
  if (typeof n !== 'bigint' && typeof n !== 'boolean') throw exc('TypeError', `cannot convert '${typeName(n)}' object to bytearray`);
  const k = typeof n === 'boolean' ? (n ? 1n : 0n) : n;
  if (k > SSIZE_MAX || k < SSIZE_MIN) throw exc('OverflowError', "cannot fit 'int' into an index-sized integer");
  if (k < 0n) throw exc('ValueError', 'negative count');
  if (k > BigInt(MAX_BUFFER)) throw demoLimit(`The demo keeps buffers under ${MAX_BUFFER} bytes.`);
  return new PyByteArray(new Uint8Array(Number(k)));
}
// a dict whose keys are not all str (None, '' …) — repr built directly
export const pyDict = (pairs) => ({ __pyRaw: '{' + pairs.map(([k, v]) => `${pyReprExact(k)}: ${pyReprExact(v)}`).join(', ') + '}' });

export function typeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'bigint') return 'int';
  if (typeof v === 'string') return 'str';
  if (v instanceof PyFloat) return 'float';
  if (v instanceof PyBytes) return 'bytes';
  if (v instanceof PyByteArray) return 'bytearray';
  if (v instanceof MemoryView) return 'memoryview';
  if (Array.isArray(v)) return 'list';
  if (v.__pyTuple) return 'tuple';
  if (v.pyType) return v.pyType;
  return 'object';
}

// The Python value of a number typed into a 'number' field, as the demo code
// shows it: int (bigint) or float (PyFloat); inf is a NameError.
export function pyNum(n) {
  const v = fromLiteral(n);
  return v.int !== undefined ? v.int : new PyFloat(v.float);
}

// ── argument converters (Argument Clinic semantics) ───────────

const SSIZE_MAX = (1n << 63n) - 1n;
const SSIZE_MIN = -(1n << 63n);
const INT_MAX = (1n << 31n) - 1n;
const INT_MIN = -(1n << 31n);

const indexOf = (v) => {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'boolean') return v ? 1n : 0n;
  return null;
};

// Py_ssize_t via __index__ (PyNumber_AsSsize_t(..., OverflowError))
export function toSsize(v) {
  const i = indexOf(v);
  if (i === null) throw exc('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);
  if (i > SSIZE_MAX || i < SSIZE_MIN) throw exc('OverflowError', 'Python int too large to convert to C ssize_t');
  return i;
}
// Py_ssize_t(accept={int, NoneType}) — _Py_convert_optional_to_ssize_t
export function optSsize(v, dflt) {
  if (v === undefined || v === null) return dflt;
  const i = indexOf(v);
  if (i === null) throw exc('TypeError', `argument should be integer or None, not '${typeName(v)}'`);
  if (i > SSIZE_MAX || i < SSIZE_MIN) throw exc('OverflowError', "cannot fit 'int' into an index-sized integer");
  return i;
}
// C int (PyLong_AsInt)
export function toCInt(v) {
  const i = indexOf(v);
  if (i === null) throw exc('TypeError', `'${typeName(v)}' object cannot be interpreted as an integer`);
  if (i > INT_MAX || i < INT_MIN) throw exc('OverflowError', 'Python int too large to convert to C int');
  return i;
}

// ── str helpers ───────────────────────────────────────────────

export const codePoints = (s) => Array.from(s, (ch) => ch.codePointAt(0));
export const fromCodePoints = (cps, a = 0, b = cps.length) => {
  let out = '';
  for (let i = a; i < b; i += 1) out += String.fromCodePoint(cps[i]);
  return out;
};
const isSurrogate = (cp) => cp >= 0xd800 && cp <= 0xdfff;
const escapeCp = (cp) => (cp <= 0xff ? '\\x' + hex2(cp) : cp <= 0xffff ? '\\u' + cp.toString(16).padStart(4, '0') : '\\U' + cp.toString(16).padStart(8, '0'));

// str.encode() — UTF-8, strict
export function utf8Encode(s) {
  const out = [];
  let i = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (isSurrogate(cp)) {
      throw exc('UnicodeEncodeError', `'utf-8' codec can't encode character '${escapeCp(cp)}' in position ${i}: surrogates not allowed`);
    }
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    i += 1;
  }
  return new PyBytes(Uint8Array.from(out));
}

// UTF-8 → code points for already-valid data (the demos only decode what
// str.encode() produced); anything else is outside what the demo reproduces
function utf8DecodeCps(b) {
  const cps = [];
  for (let i = 0; i < b.length;) {
    const x = b[i];
    let cp;
    let n;
    if (x < 0x80) { cp = x; n = 1; } else if (x >= 0xc2 && x < 0xe0) { cp = x & 31; n = 2; } else if (x >= 0xe0 && x < 0xf0) { cp = x & 15; n = 3; } else if (x >= 0xf0 && x < 0xf5) { cp = x & 7; n = 4; } else n = 0;
    if (n === 0 || i + n > b.length) throw demoLimit('This demo only decodes valid UTF-8.');
    for (let k = 1; k < n; k += 1) {
      if ((b[i + k] & 0xc0) !== 0x80) throw demoLimit('This demo only decodes valid UTF-8.');
      cp = (cp << 6) | (b[i + k] & 63);
    }
    if ((n === 3 && (cp < 0x800 || isSurrogate(cp))) || (n === 4 && (cp < 0x10000 || cp > 0x10ffff))) throw demoLimit('This demo only decodes valid UTF-8.');
    cps.push(cp);
    i += n;
  }
  return cps;
}

// newline argument of StringIO / TextIOWrapper: None, '', '\n', '\r', '\r\n'
function parseNewline(newline, who) {
  if (newline === null) return null;
  if (typeof newline !== 'string') {
    throw exc('TypeError', who === 'StringIO' ? `newline must be str or None, not ${typeName(newline)}` : `${who}() argument 'newline' must be str or None, not ${typeName(newline)}`);
  }
  const cps = codePoints(newline);
  const bad = cps.findIndex(isSurrogate);
  if (bad !== -1) throw exc('UnicodeEncodeError', `'utf-8' codec can't encode character '${escapeCp(cps[bad])}' in position ${bad}: surrogates not allowed`);
  let nl = newline;
  if (newline.includes('\0')) {
    // StringIO() and reconfigure() read the value as a C string: it ends at
    // the first NUL; the TextIOWrapper() constructor rejects it
    if (who === 'TextIOWrapper') throw exc('ValueError', 'embedded null character');
    nl = newline.slice(0, newline.indexOf('\0'));
  }
  if (!['', '\n', '\r', '\r\n'].includes(nl)) {
    // TextIOWrapper puts the raw value in the message; a traceback's last
    // line loses trailing line breaks, so the demo shows it without them
    throw exc('ValueError', who === 'StringIO' ? `illegal newline value: ${pyStrRepr(newline)}` : `illegal newline value: ${nl}`.replace(/\n+$/, ''));
  }
  return nl;
}

// ── IncrementalNewlineDecoder (textio.c) ──────────────────────

const SEEN_CR = 1;
const SEEN_LF = 2;
const SEEN_CRLF = 4;
const NEWLINES = {
  [SEEN_CR]: '\r',
  [SEEN_LF]: '\n',
  [SEEN_CRLF]: '\r\n',
  [SEEN_CR | SEEN_LF]: tuple('\r', '\n'),
  [SEEN_CR | SEEN_CRLF]: tuple('\r', '\r\n'),
  [SEEN_LF | SEEN_CRLF]: tuple('\n', '\r\n'),
  [SEEN_CR | SEEN_LF | SEEN_CRLF]: tuple('\r', '\n', '\r\n'),
};

// truth value of a Python object (bool converter)
export function truthy(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'bigint') return v !== 0n;
  if (typeof v === 'string') return v.length > 0;
  if (v instanceof PyFloat) return v.f !== 0;
  if (v instanceof PyBytes || v instanceof PyByteArray) return v.b.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v.__pyTuple) return v.__pyTuple.length > 0;
  return true;
}

export class IncrementalNewlineDecoder {
  // decoder: only None (str input) is reproduced here
  constructor(decoder, translate, errors = 'strict') {
    if (decoder !== null) throw demoLimit('This demo reproduces decoder=None only (str input).');
    this.translate = truthy(translate);
    this.errors = errors;
    this.pendingcr = false;
    this.seennl = 0;
  }

  // works on code-point arrays; returns a code-point array
  decodeCps(cps, final) {
    let out = cps;
    if (this.pendingcr && (final || out.length > 0)) {
      out = [0x0d, ...out];
      this.pendingcr = false;
    }
    // retain a last \r even when not translating: readline() then sees \r\n in one piece
    if (!final && out.length > 0 && out[out.length - 1] === 0x0d) {
      out = out.slice(0, -1);
      this.pendingcr = true;
    }
    if (out.length === 0) return out;
    let seen = 0;
    const res = this.translate ? [] : out;
    for (let i = 0; i < out.length; i += 1) {
      const c = out[i];
      if (c === 0x0a) {
        seen |= SEEN_LF;
        if (this.translate) res.push(c);
      } else if (c === 0x0d) {
        if (out[i + 1] === 0x0a) { seen |= SEEN_CRLF; i += 1; } else seen |= SEEN_CR;
        if (this.translate) res.push(0x0a);
      } else if (this.translate) res.push(c);
    }
    this.seennl |= seen;
    return res;
  }

  decode(input, final = false) {
    if (typeof input !== 'string') throw exc('TypeError', `decoder should return a string result, not '${typeName(input)}'`);
    return fromCodePoints(this.decodeCps(codePoints(input), truthy(final)));
  }

  get newlines() { return NEWLINES[this.seennl] === undefined ? null : NEWLINES[this.seennl]; }

  getstate() { return tuple(new PyBytes([]), this.pendingcr ? 1n : 0n); }

  setstate(state) {
    if (!state || !state.__pyTuple) throw exc('TypeError', 'state argument must be a tuple');
    const items = state.__pyTuple;
    if (items.length !== 2) throw exc('TypeError', `setstate(): illegal state argument`);
    const flag = indexOf(items[1]);
    if (flag === null) throw exc('TypeError', `'${typeName(items[1])}' object cannot be interpreted as an integer`);
    this.pendingcr = (BigInt.asUintN(64, flag) & 1n) === 1n;
    return null;
  }

  reset() {
    this.seennl = 0;
    this.pendingcr = false;
    return null;
  }
}

// _PyIO_find_line_ending over code points [start, end). Returns the line
// length, or -1 when no line ending lies inside the window.
function findLineEnding(translated, universal, readnl, buf, start, end) {
  if (translated) {
    for (let i = start; i < end; i += 1) if (buf[i] === 0x0a) return i - start + 1;
    return -1;
  }
  if (universal) {
    for (let i = start; i < end; i += 1) {
      const c = buf[i];
      if (c === 0x0a) return i - start + 1;
      if (c === 0x0d) return i + 1 < end && buf[i + 1] === 0x0a ? i - start + 2 : i - start + 1;
    }
    return -1;
  }
  if (readnl.length === 1) {
    const ch = readnl.charCodeAt(0);
    for (let i = start; i < end; i += 1) if (buf[i] === ch) return i - start + 1;
    return -1;
  }
  // '\r\n' must lie completely inside the window
  for (let i = start; i + 1 < end; i += 1) if (buf[i] === 0x0d && buf[i + 1] === 0x0a) return i - start + 2;
  return -1;
}

// ── IOBase mixins (iobase.c) ──────────────────────────────────

const CLOSED_DOT = 'I/O operation on closed file.';

function iobaseCheckClosed(f) {
  if (f.closed) throw exc('ValueError', CLOSED_DOT);
}

// iter(f): the IOBase __iter__ check, then __next__ until it signals EOF
export function* iterLines(f) {
  iobaseCheckClosed(f);
  for (;;) {
    const line = f.next();
    if (line === undefined) return;
    yield line;
  }
}

// IOBase.readlines(hint=-1)
function iobaseReadlines(f, hint) {
  const h = optSsize(hint, -1n);
  const result = [];
  if (h <= 0n) {
    for (const line of iterLines(f)) result.push(line);
    return result;
  }
  let length = 0n;
  for (const line of iterLines(f)) {
    result.push(line);
    const n = BigInt(typeof line === 'string' ? codePoints(line).length : line.b.length);
    if (n > h - length) break;
    length += n;
  }
  return result;
}

// iter() of a Python iterable argument (writelines)
function pyIter(v) {
  if (Array.isArray(v)) return v;
  if (v && v.__pyTuple) return v.__pyTuple;
  if (typeof v === 'string') return Array.from(v);
  if (v instanceof PyBytes || v instanceof PyByteArray) return Array.from(v.b, (x) => BigInt(x));
  throw exc('TypeError', `'${typeName(v)}' object is not iterable`);
}

// ── StringIO (stringio.c) ─────────────────────────────────────

const CLOSED_NODOT = 'I/O operation on closed file';

export class StringIO {
  constructor(initialValue = '', newline = '\n') {
    const nl = parseNewline(newline, 'StringIO');
    if (initialValue !== null && typeof initialValue !== 'string') {
      throw exc('TypeError', `initial_value must be str or None, not ${typeName(initialValue)}`);
    }
    this.pyType = 'StringIO';
    this.readnl = nl;
    this.readuniversal = nl === null || nl === '';
    this.readtranslate = nl === null;
    this.writenl = nl !== null && nl[0] === '\r' ? nl : null;
    this.decoder = this.readuniversal ? new IncrementalNewlineDecoder(null, this.readtranslate) : null;
    this.buf = [];
    this.pos = 0n;
    this._closed = false;
    if (initialValue) this.writeStr(codePoints(initialValue));
    this.pos = 0n;
  }

  get size() { return this.buf.length; }

  checkClosed() {
    if (this._closed) throw exc('ValueError', CLOSED_NODOT);
  }

  writeStr(cps) {
    let decoded = this.decoder ? this.decoder.decodeCps(cps, true) : cps;
    if (this.writenl) {
      const nl = codePoints(this.writenl);
      const t = [];
      for (const c of decoded) {
        if (c === 0x0a) t.push(...nl);
        else t.push(c);
      }
      decoded = t;
    }
    const len = BigInt(decoded.length);
    if (this.pos > SSIZE_MAX - len) throw exc('OverflowError', 'new position too large');
    const end = this.pos + len;
    if (end + 1n > SSIZE_MAX) throw exc('OverflowError', 'new buffer size too large');
    if (end > BigInt(MAX_BUFFER)) throw demoLimit(`The demo keeps buffers under ${MAX_BUFFER} characters.`);
    const p = Number(this.pos);
    while (this.buf.length < p) this.buf.push(0); // overseek: pad with NULs
    for (let i = 0; i < decoded.length; i += 1) this.buf[p + i] = decoded[i];
    this.pos = end;
  }

  readLine(limit) {
    if (this.pos >= BigInt(this.size)) return '';
    const start = Number(this.pos);
    const avail = this.size - start;
    const lim = limit < 0n || limit > BigInt(avail) ? avail : Number(limit);
    let len = findLineEnding(this.readtranslate, this.readuniversal, this.readnl, this.buf, start, start + lim);
    if (len < 0) len = lim;
    this.pos += BigInt(len);
    return fromCodePoints(this.buf, start, start + len);
  }

  read(size) {
    let n = optSsize(size, -1n);
    this.checkClosed();
    const avail = BigInt(this.size) - this.pos;
    if (n < 0n || n > avail) n = avail < 0n ? 0n : avail;
    const start = Number(this.pos);
    this.pos += n;
    return n === 0n ? '' : fromCodePoints(this.buf, start, start + Number(n));
  }

  readline(size) {
    const n = optSsize(size, -1n);
    this.checkClosed();
    return this.readLine(n);
  }

  readlines(hint) { return iobaseReadlines(this, hint); }

  write(s) {
    if (typeof s !== 'string') throw exc('TypeError', `string argument expected, got '${typeName(s)}'`);
    this.checkClosed();
    const cps = codePoints(s);
    if (cps.length > 0) this.writeStr(cps);
    return BigInt(cps.length);
  }

  writelines(lines) {
    iobaseCheckClosed(this);
    for (const line of pyIter(lines)) this.write(line);
    return null;
  }

  seek(pos, whence = 0n) {
    const p = toSsize(pos);
    const w = toCInt(whence);
    this.checkClosed();
    if (w !== 0n && w !== 1n && w !== 2n) throw exc('ValueError', `Invalid whence (${w}, should be 0, 1 or 2)`);
    if (p < 0n && w === 0n) throw exc('ValueError', `Negative seek position ${p}`);
    if (w !== 0n && p !== 0n) throw exc('OSError', "Can't do nonzero cur-relative seeks");
    if (w === 0n) this.pos = p;
    else if (w === 2n) this.pos = BigInt(this.size);
    return this.pos;
  }

  tell() {
    this.checkClosed();
    return this.pos;
  }

  truncate(size) {
    const n = optSsize(size, this.pos);
    this.checkClosed();
    if (n < 0n) throw exc('ValueError', `Negative size value ${n}`);
    if (n < BigInt(this.size)) this.buf.length = Number(n);
    return n;
  }

  getvalue() {
    this.checkClosed();
    return fromCodePoints(this.buf);
  }

  close() {
    this._closed = true;
    this.buf = [];
    this.decoder = null;
    this.readnl = null;
    this.writenl = null;
    return null;
  }

  get closed() { return this._closed; }

  readable() { this.checkClosed(); return true; }
  writable() { this.checkClosed(); return true; }
  seekable() { this.checkClosed(); return true; }

  get newlines() {
    this.checkClosed();
    return this.decoder ? this.decoder.newlines : null;
  }

  get line_buffering() {
    this.checkClosed();
    return false;
  }

  get encoding() { return null; }
  get errors() { return null; }

  isatty() { iobaseCheckClosed(this); return false; }
  // IOBase.flush looks at IOBase's own closed flag, which StringIO.close()
  // never sets: flush() is a no-op even after close()
  flush() { return null; }
  fileno() { throw exc('io.UnsupportedOperation', 'fileno'); }
  detach() { throw exc('io.UnsupportedOperation', 'detach'); }

  // __next__: one readline(), undefined at EOF (StopIteration)
  next() {
    this.checkClosed();
    const line = this.readLine(-1n);
    return line === '' ? undefined : line;
  }

  enter() { iobaseCheckClosed(this); return this; }
  exit() { this.close(); return false; }
}

// ── BytesIO (bytesio.c) ───────────────────────────────────────

// bytes-like argument → its bytes (PyObject_GetBuffer, PyBUF_CONTIG_RO)
function bytesLike(v) {
  if (v instanceof PyBytes || v instanceof PyByteArray) return v.b;
  if (v instanceof MemoryView) return v.bytes();
  return null;
}

export class BytesIO {
  constructor(initialBytes = null) {
    this.pyType = 'BytesIO';
    this.buf = new Uint8Array(0); // null once closed
    this.size = 0;
    this.pos = 0n;
    this.exports = 0;
    if (initialBytes !== null && initialBytes !== undefined) {
      if (initialBytes instanceof PyBytes) {
        this.buf = Uint8Array.from(initialBytes.b);
        this.size = this.buf.length;
      } else {
        this.write(initialBytes);
        this.pos = 0n;
      }
    }
  }

  checkClosed() {
    if (this.buf === null) throw exc('ValueError', CLOSED_DOT);
  }

  checkExports() {
    if (this.exports > 0) throw exc('BufferError', 'Existing exports of data: object cannot be re-sized');
  }

  content(a = 0, b = this.size) { return new PyBytes(this.buf.slice(a, b)); }

  scanEol(len) {
    if (this.pos >= BigInt(this.size)) return 0;
    const start = Number(this.pos);
    const maxlen = this.size - start;
    let n = len < 0n || len > BigInt(maxlen) ? maxlen : Number(len);
    if (n) {
      const i = this.buf.subarray(start, start + n).indexOf(0x0a);
      if (i !== -1) n = i + 1;
    }
    return n;
  }

  readBytes(n) {
    const start = Number(this.pos);
    this.pos += BigInt(n);
    return this.content(start, start + n);
  }

  writeBytes(b) {
    this.checkClosed();
    this.checkExports();
    const data = bytesLike(b);
    if (data === null) throw exc('TypeError', `a bytes-like object is required, not '${typeName(b)}'`);
    const len = data.length;
    if (len === 0) return 0;
    const end = this.pos + BigInt(len);
    if (end > SSIZE_MAX) throw exc('OverflowError', 'new buffer size too large');
    if (end > BigInt(MAX_BUFFER)) throw demoLimit(`The demo keeps buffers under ${MAX_BUFFER} bytes.`);
    const e = Number(end);
    const p = Number(this.pos);
    if (e > this.buf.length) {
      const nb = new Uint8Array(e);
      nb.set(this.buf.subarray(0, Math.min(this.size, e)));
      this.buf = nb;
    }
    if (p > this.size) this.buf.fill(0, this.size, p); // overseek: pad with NULs
    this.buf.set(data, p);
    this.pos = end;
    if (this.size < e) this.size = e;
    return len;
  }

  read(size) {
    let n = optSsize(size, -1n);
    this.checkClosed();
    const avail = BigInt(this.size) - this.pos;
    if (n < 0n || n > avail) n = avail < 0n ? 0n : avail;
    return this.readBytes(Number(n));
  }

  read1(size) { return this.read(size); }

  readline(size) {
    const n = optSsize(size, -1n);
    this.checkClosed();
    return this.readBytes(this.scanEol(n));
  }

  readlines(arg = null) {
    this.checkClosed();
    let maxsize;
    if (typeof arg === 'bigint' || typeof arg === 'boolean') maxsize = toSsize(arg);
    else if (arg === null) maxsize = -1n;
    else throw exc('TypeError', `integer argument expected, got '${typeName(arg)}'`);
    const result = [];
    let size = 0n;
    for (;;) {
      const n = this.scanEol(-1n);
      if (n === 0) break;
      result.push(this.readBytes(n));
      size += BigInt(n);
      if (maxsize > 0n && size >= maxsize) break;
    }
    return result;
  }

  readinto(buffer) {
    const writable = buffer instanceof PyByteArray || (buffer instanceof MemoryView && !buffer.readonly);
    if (!writable) throw exc('TypeError', `readinto() argument must be read-write bytes-like object, not ${typeName(buffer)}`);
    this.checkClosed();
    const target = buffer instanceof PyByteArray ? buffer.b : buffer;
    const cap = buffer instanceof PyByteArray ? target.length : buffer.length;
    const avail = BigInt(this.size) - this.pos;
    let len = BigInt(cap);
    if (len > avail) len = avail < 0n ? 0n : avail;
    const start = Number(this.pos);
    const n = Number(len);
    if (buffer instanceof PyByteArray) target.set(this.buf.subarray(start, start + n), 0);
    else buffer.writeAt(0, this.buf.subarray(start, start + n));
    this.pos += len;
    return len;
  }

  write(b) { return BigInt(this.writeBytes(b)); }

  writelines(lines) {
    this.checkClosed();
    for (const item of pyIter(lines)) this.writeBytes(item);
    return null;
  }

  seek(pos, whence = 0n) {
    let p = toSsize(pos);
    const w = toCInt(whence);
    this.checkClosed();
    if (p < 0n && w === 0n) throw exc('ValueError', `negative seek value ${p}`);
    if (w === 1n) {
      if (p > SSIZE_MAX - this.pos) throw exc('OverflowError', 'new position too large');
      p += this.pos;
    } else if (w === 2n) {
      if (p > SSIZE_MAX - BigInt(this.size)) throw exc('OverflowError', 'new position too large');
      p += BigInt(this.size);
    } else if (w !== 0n) {
      throw exc('ValueError', `invalid whence (${w}, should be 0, 1 or 2)`);
    }
    if (p < 0n) p = 0n;
    this.pos = p;
    return this.pos;
  }

  tell() {
    this.checkClosed();
    return this.pos;
  }

  truncate(size) {
    const n = optSsize(size, this.pos);
    this.checkClosed();
    this.checkExports();
    if (n < 0n) throw exc('ValueError', `negative size value ${n}`);
    if (n < BigInt(this.size)) this.size = Number(n);
    return n;
  }

  getvalue() {
    this.checkClosed();
    return this.content();
  }

  getbuffer() {
    this.checkClosed();
    return new MemoryView(this);
  }

  close() {
    this.checkExports();
    this.buf = null;
    return null;
  }

  get closed() { return this.buf === null; }

  readable() { this.checkClosed(); return true; }
  writable() { this.checkClosed(); return true; }
  seekable() { this.checkClosed(); return true; }
  flush() { this.checkClosed(); return null; }
  isatty() { this.checkClosed(); return false; }
  fileno() { throw exc('io.UnsupportedOperation', 'fileno'); }
  detach() { throw exc('io.UnsupportedOperation', 'detach'); }

  next() {
    this.checkClosed();
    const n = this.scanEol(-1n);
    return n === 0 ? undefined : this.readBytes(n);
  }

  enter() { iobaseCheckClosed(this); return this; }
  exit() { this.close(); return false; }
}

// memoryview over a BytesIO's contents (format 'B', one dimension). While
// it is alive the BytesIO cannot be resized or closed.
export class MemoryView {
  constructor(src) {
    this.src = src;
    this.length = src.size;
    this.released = false;
    this.readonly = false;
    src.exports += 1;
  }

  check() {
    if (this.released) throw exc('ValueError', 'operation forbidden on released memoryview object');
  }

  bytes() {
    this.check();
    return this.src.buf.slice(0, this.length);
  }

  index(i) {
    const k = indexOf(i);
    if (k === null) throw exc('TypeError', 'memoryview: invalid slice key');
    if (k > SSIZE_MAX || k < SSIZE_MIN) throw exc('IndexError', "cannot fit 'int' into an index-sized integer");
    const j = k < 0n ? k + BigInt(this.length) : k;
    if (j < 0n || j >= BigInt(this.length)) throw exc('IndexError', 'index out of bounds on dimension 1');
    return Number(j);
  }

  getitem(i) {
    this.check();
    return BigInt(this.src.buf[this.index(i)]);
  }

  setitem(i, v) {
    this.check();
    const j = this.index(i);
    const x = indexOf(v);
    if (x === null) throw exc('TypeError', `memoryview: invalid type for format 'B'`);
    if (x < 0n || x > 255n) throw exc('ValueError', `memoryview: invalid value for format 'B'`);
    this.src.buf[j] = Number(x);
    return null;
  }

  writeAt(offset, data) {
    this.check();
    this.src.buf.set(data, offset);
  }

  tobytes() { return new PyBytes(this.bytes()); }

  get len() { this.check(); return BigInt(this.length); }

  release() {
    if (!this.released) {
      this.released = true;
      this.src.exports -= 1;
    }
    return null;
  }
}

// ── TextIOWrapper over a BytesIO, UTF-8 only ──────────────────
// Enough of textio.c for the newline demos: reading lines (universal,
// translated or a fixed terminator), writing with newline translation,
// flush() and reconfigure(newline=...). os.linesep writing (newline=None)
// is platform-dependent and not reproduced.

const UTF8_NAMES = ['utf_8', 'utf8', 'u8', 'utf'];

export class TextIOWrapper {
  constructor(buffer, encoding = null, errors = null, newline = null) {
    if (typeof encoding !== 'string' || !UTF8_NAMES.includes(encoding.toLowerCase().replace(/[-\s]/g, '_'))) {
      throw demoLimit("This demo reproduces encoding='utf-8' only (the default encoding depends on the locale).");
    }
    this.pyType = 'TextIOWrapper';
    this.buffer = buffer;
    this.setNewline(parseNewline(newline, 'TextIOWrapper'));
    this.pending = [];   // code points written, not yet flushed
    this.decoded = null; // code points of everything read, decoded once
    this.dpos = 0;
  }

  setNewline(nl) {
    this.readnl = nl;
    this.readuniversal = nl === null || nl === '';
    this.readtranslate = nl === null;
    this.writetranslate = nl !== '';
    this.writenl = nl === null ? null : nl;
  }

  checkClosed() {
    if (this.buffer.closed) throw exc('ValueError', CLOSED_DOT);
  }

  ensureDecoded() {
    if (this.decoded !== null) return;
    this.flush();
    const raw = this.buffer.read();
    const cps = utf8DecodeCps(raw.b);
    if (this.readuniversal) {
      this.decoder = new IncrementalNewlineDecoder(null, this.readtranslate);
      this.decoded = this.decoder.decodeCps(cps, true);
    } else this.decoded = cps;
  }

  readline(size) {
    const n = optSsize(size, -1n);
    this.checkClosed();
    this.ensureDecoded();
    const start = this.dpos;
    const avail = this.decoded.length - start;
    if (avail <= 0) return '';
    const lim = n < 0n || n > BigInt(avail) ? avail : Number(n);
    let len = findLineEnding(this.readtranslate, this.readuniversal, this.readnl, this.decoded, start, start + lim);
    if (len < 0) len = lim;
    this.dpos += len;
    return fromCodePoints(this.decoded, start, start + len);
  }

  read(size) {
    const n = optSsize(size, -1n);
    this.checkClosed();
    this.ensureDecoded();
    const start = this.dpos;
    const avail = this.decoded.length - start;
    const k = n < 0n || n > BigInt(avail) ? avail : Number(n);
    this.dpos += k;
    return fromCodePoints(this.decoded, start, start + k);
  }

  next() {
    const line = this.readline();
    return line === '' ? undefined : line;
  }

  get closed() { return this.buffer.closed; }

  readlines(hint) { return iobaseReadlines(this, hint); }

  write(s) {
    if (typeof s !== 'string') throw exc('TypeError', `write() argument must be str, not ${typeName(s)}`);
    this.checkClosed();
    const cps = codePoints(s);
    if (this.writetranslate && this.writenl === null && cps.includes(0x0a)) {
      throw demoLimit('With newline=None, write() translates \\n to os.linesep, which depends on the OS; pass newline explicitly.');
    }
    const out = [];
    for (const c of cps) {
      if (c === 0x0a && this.writetranslate && this.writenl !== '\n') out.push(...codePoints(this.writenl));
      else out.push(c);
    }
    // each write() is encoded on its own, after newline translation
    this.pending.push(utf8Encode(fromCodePoints(out)));
    return BigInt(cps.length);
  }

  flush() {
    this.checkClosed();
    for (const chunk of this.pending) this.buffer.write(chunk);
    this.pending = [];
    return null;
  }

  detach() {
    this.flush();
    const b = this.buffer;
    this.buffer = null;
    return b;
  }

  reconfigure({ newline } = {}) {
    if (newline !== undefined) {
      if (this.decoded !== null) throw exc('io.UnsupportedOperation', 'It is not possible to set the encoding or newline of stream after the first read');
      const nl = parseNewline(newline, 'reconfigure');
      this.flush();
      this.setNewline(nl);
    } else this.flush();
    return null;
  }

  close() {
    if (!this.buffer.closed) {
      this.flush();
      this.buffer.close();
    }
    return null;
  }
}

// ── open(): mode → class (Modules/_io/_iomodule.c, fileio.c) ─────
// Resolves what open(path, mode, buffering) builds for an existing (or
// missing) regular file: the class, its .mode and the three capability
// answers — or the exception CPython raises, in the same order.

function errnoError(type, n, text, path) {
  return exc(type, `[Errno ${n}] ${text}: ${pyStrRepr(path)}`);
}

export function openFile(path, mode, buffering, exists) {
  if (typeof mode !== 'string') throw exc('TypeError', `open() argument 'mode' must be str, not ${typeName(mode)}`);
  const cps = codePoints(mode);
  const bad = cps.findIndex(isSurrogate);
  if (bad !== -1) throw exc('UnicodeEncodeError', `'utf-8' codec can't encode character '${escapeCp(cps[bad])}' in position ${bad}: surrogates not allowed`);
  if (mode.includes('\0')) throw exc('ValueError', 'embedded null character');
  const buf = Number(toCInt(buffering));

  const flags = { x: false, r: false, w: false, a: false, '+': false, t: false, b: false };
  for (let i = 0; i < mode.length; i += 1) {
    const c = mode[i];
    if (!(c in flags) || mode.indexOf(c, i + 1) !== -1) throw exc('ValueError', `invalid mode: '${mode}'`);
    flags[c] = true;
  }
  const { x: creating, r: reading, w: writing, a: appending, '+': updating, t: text, b: binary } = flags;
  if (text && binary) throw exc('ValueError', "can't have text and binary mode at once");
  if (creating + reading + writing + appending > 1) throw exc('ValueError', 'must have exactly one of create/read/write/append mode');

  // FileIO(path, rawmode)
  if (!(creating || reading || writing || appending)) {
    throw exc('ValueError', 'Must have exactly one of create/read/write/append mode and at most one plus');
  }
  if (creating && exists) throw errnoError('FileExistsError', 17, 'File exists', path);
  if (reading && !exists) throw errnoError('FileNotFoundError', 2, 'No such file or directory', path);
  const readable = reading || updating;
  const writable = !reading || updating;
  let rawMode;
  if (creating) rawMode = readable ? 'xb+' : 'xb';
  else if (appending) rawMode = readable ? 'ab+' : 'ab';
  else if (readable) rawMode = writable ? 'rb+' : 'rb';
  else rawMode = 'wb';

  if (buf === 0) {
    if (!binary) throw exc('ValueError', "can't have unbuffered text I/O");
    return { cls: 'FileIO', mode: rawMode, readable, writable, seekable: true };
  }
  let cls;
  if (updating) cls = 'BufferedRandom';
  else if (creating || writing || appending) cls = 'BufferedWriter';
  else cls = 'BufferedReader';
  if (binary) return { cls, mode: rawMode, readable, writable, seekable: true };
  return { cls: 'TextIOWrapper', mode, readable, writable, seekable: true };
}

// ── print(*args, sep=' ', end='\n', file=f) for str arguments ─
export function printTo(f, args, sep = ' ', end = '\n') {
  for (const s of [sep, end]) {
    if (s !== null && typeof s !== 'string') throw exc('TypeError', `${s === sep ? 'sep' : 'end'} must be None or a string, not ${typeName(s)}`);
  }
  const S = sep === null ? ' ' : sep;
  const E = end === null ? '\n' : end;
  args.forEach((a, i) => {
    if (i > 0) f.write(S);
    f.write(a);
  });
  f.write(E);
  return null;
}
