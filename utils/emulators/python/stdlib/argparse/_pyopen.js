// utils/emulators/python/stdlib/argparse/_pyopen.js
//
// The file system the argparse demos see, and the built-in open() that
// argparse.FileType calls — ported from Modules/_io/_iomodule.c
// (_io_open_impl) and Modules/_io/fileio.c (CPython 3.13).
//
// The demo folder is the empty temp directory a template runs in, plus
// the files the template itself wrote: `files` maps a name to its text
// (what the template wrote with encoding='utf-8'). open() resolves names
// the way Linux does (the target where Windows differs): any characters
// are allowed, trailing dots and spaces are kept, NUL is an ordinary name,
// the folder itself or a folder above it is a directory ([Errno 21]), a
// path below a file is [Errno 20], a trailing slash after a file name
// makes it a directory lookup. Names whose outcome is not the same on
// Linux and macOS, or depends on the machine — absolute paths, files
// outside the demo folder ('../x'), case or Unicode-normalisation
// variants of a file that exists, names over 255 bytes — stop with a
// DemoLimit instead of guessing.
//
// The objects open() returns model what argparse code touches: .name,
// .mode, .encoding, .closed, close(), read() of text, repr() and
// type(f).__name__ (TextIOWrapper, BufferedReader, BufferedWriter,
// BufferedRandom, FileIO).

import { PyException, raise, pyRepr, pyTypeName, cps, StringIO } from './_pyvalue.js';

export const files = new Map(); // name → text

// os differences that only show in messages of direct calls (inside
// parse_args they all become "invalid FileType(...) value")
export const osInfo = { windows: false };

// an input the port deliberately does not reproduce: SnippetDemo shows the
// message with a neutral label instead of a traceback look
export function demoLimit(what) {
  const e = new Error(`not emulated: ${what}`);
  e.name = 'DemoLimit';
  throw e;
}

// ── which entry a name refers to ─────────────────────────────
const fold = (s) => s.normalize('NFD').toLowerCase();
const utf8Length = (s) => new TextEncoder().encode(s).length;

// What a name refers to, resolved the way Linux (and macOS) resolve it in
// the demo folder (which holds only the template's files, no sub-folders):
//   { key, missing }        a file name in the demo folder
//   { key, missing, slash } the same name written with a trailing '/'
//   { dir: true }           the folder itself or a folder above it
//   { enoent: true }        a path through a sub-folder that does not exist
//   { enotdir: true }       a path that goes on below a file
// Windows answers several of these differently (reserved characters,
// trailing dots and spaces, device names, a trailing slash, the folder
// itself); the Linux result is the one shown.
function resolve(name) {
  const where = `the file name ${pyRepr(name)}`;
  if (name === '') return { key: '', missing: true };
  if (name.startsWith('/')) demoLimit(`${where}: absolute paths point outside the demo folder`);
  const comps = name.split('/');
  for (const p of comps) {
    if (utf8Length(p) > 255) demoLimit(`${where}: names longer than 255 bytes are rejected differently on each OS`);
  }
  const caseCheck = (p) => {
    for (const k of files.keys()) {
      if (k !== p && fold(k) === fold(p)) demoLimit(`${where}: Windows and macOS match file names case-insensitively, so it opens ${pyRepr(k)} there and fails on Linux`);
    }
  };
  let depth = 0; // 0 = the demo folder, < 0 = a folder above it
  let i = 0;
  // every component but the last must be a folder
  for (; i < comps.length - 1; i++) {
    const p = comps[i];
    if (p === '' || p === '.') continue;
    if (p === '..') { depth -= 1; continue; }
    if (depth < 0) demoLimit(`${where}: '..' leaves the demo folder`);
    caseCheck(p);
    if (!files.has(p)) return { enoent: true };
    // a file followed by more path (even only '/' or '/.') is not a folder
    return { enotdir: true };
  }
  const last = comps[comps.length - 1];
  // ('' only after '.'/'..' parts: resolveName() splits off the trailing
  // slash of a name, so 'x/' never gets here)
  if (last === '' || last === '.' || last === '..') return { dir: true };
  if (depth < 0) demoLimit(`${where}: '..' leaves the demo folder`);
  caseCheck(last);
  return { key: last, missing: !files.has(last) };
}

// the name with a trailing slash ('notes.txt/', 'sub//') splits off before resolve()
function resolveName(name) {
  const m = /^(.*?[^/])(\/+)$/s.exec(name);
  if (!m || name.startsWith('/')) return resolve(name);
  const base = resolve(m[1]);
  if (base.dir || base.enoent || base.enotdir) return base;
  return { ...base, slash: true };
}

const osError = (type, errno, text, name) => raise(type, `[Errno ${errno}] ${text}: ${pyRepr(name)}`);

// ── io classes ───────────────────────────────────────────────
function checkOpen(f) {
  if (f.closed) raise('ValueError', 'I/O operation on closed file.');
}

class PyFileIO {
  constructor(name, flags) {
    this.name = name;
    this.flags = flags;
    this.closed = false;
  }
  get pyTypeName() { return 'FileIO'; }
  // Modules/_io/fileio.c mode_string()
  get mode() {
    const { created, appending, readable, writable } = this.flags;
    if (created) return readable ? 'xb+' : 'xb';
    if (appending) return readable ? 'ab+' : 'ab';
    if (readable) return writable ? 'rb+' : 'rb';
    return 'wb';
  }
  close() { this.closed = true; }
  read() { checkOpen(this); demoLimit('reading bytes'); }
  __repr__() { return this.closed ? '<_io.FileIO [closed]>' : `<_io.FileIO name=${pyRepr(this.name)} mode=${pyRepr(this.mode)} closefd=True>`; }
}

class PyBuffered {
  constructor(raw, typeName) {
    this.raw = raw;
    this.typeName = typeName;
  }
  get pyTypeName() { return this.typeName; }
  get name() { return this.raw.name; }
  get mode() { return this.raw.mode; }
  get closed() { return this.raw.closed; }
  close() { this.raw.close(); }
  read() { checkOpen(this); demoLimit('reading bytes'); }
  __repr__() { return `<_io.${this.typeName} name=${pyRepr(this.name)}>`; }
}

// encodings the demo folder can decode: its files are UTF-8 text
const UTF8_NAMES = new Set(['utf_8', 'utf8', 'u8', 'utf', 'cp65001', 'utf8_ucs2', 'utf8_ucs4']);
const ASCII_SUPERSETS = new Set(['ascii', 'us_ascii', '646', 'latin_1', 'latin1', 'latin', 'l1', 'iso8859_1', 'iso_8859_1', '8859', 'cp819']);
// encodings.normalize_encoding, lower-cased as the codec registry does
function normalizeEncoding(name) {
  let out = '';
  let punct = false;
  for (const c of cps(name)) {
    if (/[\p{L}\p{N}]/u.test(c) || c === '.') {
      if (punct && out) out += '_';
      if (c.codePointAt(0) < 128) out += c;
      punct = false;
    } else punct = true;
  }
  return out.toLowerCase();
}

class PyTextIOWrapper {
  constructor(buffer, mode, encoding, errors, { readable }) {
    this.buffer = buffer;
    this.mode = mode;
    this._encoding = encoding;
    this.errors = errors;
    this.readable = readable;
    this._consumed = false;
  }
  get pyTypeName() { return 'TextIOWrapper'; }
  get name() { return this.buffer.name; }
  get closed() { return this.buffer.closed; }
  // encoding=None means the locale's encoding, which differs per machine
  get encoding() {
    if (this._encoding === null) demoLimit('without encoding=, open() uses the locale encoding of the machine it runs on');
    return this._encoding;
  }
  close() { this.buffer.close(); }
  // the rest of the file, with universal newlines ('\r\n' and '\r' → '\n')
  read() {
    checkOpen(this);
    if (!this.readable) raise('io.UnsupportedOperation', 'not readable');
    const text = this._startAtEnd || this._consumed ? '' : (files.get(this.buffer.key) ?? '');
    const ascii = /^[\0-\x7f]*$/.test(text);
    // every locale encoding reads ASCII the same way
    if (!(this._encoding === null && ascii)) {
      const enc = normalizeEncoding(this.encoding);
      if (!UTF8_NAMES.has(enc) && !(ASCII_SUPERSETS.has(enc) && ascii)) {
        demoLimit(`reading the demo's UTF-8 files as ${pyRepr(this.encoding)}`);
      }
    }
    this._consumed = true;
    return text.replace(/\r\n?/g, '\n');
  }
  __repr__() { return `<_io.TextIOWrapper name=${pyRepr(this.name)} mode=${pyRepr(this.mode)} encoding=${pyRepr(this.encoding)}>`; }
}

// ── open() ───────────────────────────────────────────────────
const isInt = (v) => typeof v === 'bigint' || typeof v === 'boolean';

// open(file, mode='r', buffering=-1, encoding=None, errors=None)
export function pyOpen(file, mode = 'r', buffering = -1n, encoding = null, errors = null) {
  // argument conversion (Argument Clinic)
  // (_PyArg_BadArgument names None as "None", other objects by type)
  if (typeof mode !== 'string') raise('TypeError', `open() argument 'mode' must be str, not ${mode === null ? 'None' : pyTypeName(mode)}`);
  if (mode.includes('\0')) raise('ValueError', 'embedded null character');
  if (!isInt(buffering)) raise('TypeError', `'${pyTypeName(buffering)}' object cannot be interpreted as an integer`);
  const buf = typeof buffering === 'boolean' ? BigInt(buffering) : buffering;
  if (buf > 2147483647n || buf < -2147483648n) raise('OverflowError', 'Python int too large to convert to C int');
  for (const [arg, v] of [['encoding', encoding], ['errors', errors]]) {
    if (v !== null && typeof v !== 'string') raise('TypeError', `open() argument '${arg}' must be str or None, not ${pyTypeName(v)}`);
    if (typeof v === 'string' && v.includes('\0')) raise('ValueError', 'embedded null character');
  }
  if (typeof file !== 'string') demoLimit(`opening ${pyTypeName(file)} objects`);

  // decode mode: each of x r w a + t b at most once
  const flags = { creating: false, reading: false, writing: false, appending: false, updating: false, text: false, binary: false };
  const KEY = { x: 'creating', r: 'reading', w: 'writing', a: 'appending', '+': 'updating', t: 'text', b: 'binary' };
  const chars = cps(mode);
  chars.forEach((c, i) => {
    if (!KEY[c] || chars.indexOf(c, i + 1) !== -1) raise('ValueError', `invalid mode: '${mode}'`);
    flags[KEY[c]] = true;
  });
  const { creating, reading, writing, appending, updating, text, binary } = flags;
  if (text && binary) raise('ValueError', "can't have text and binary mode at once");
  if (creating + reading + writing + appending > 1) raise('ValueError', 'must have exactly one of create/read/write/append mode');
  if (binary && encoding !== null) raise('ValueError', "binary mode doesn't take an encoding argument");
  if (binary && errors !== null) raise('ValueError', "binary mode doesn't take an errors argument");
  if (binary && buf === 1n) demoLimit('the RuntimeWarning for buffering=1 in binary mode names a file and line of the Python installation');

  // FileIO(file, rawmode): the path, then the mode
  if (file.includes('\0')) raise('ValueError', osInfo.windows ? 'embedded null character' : 'embedded null byte');
  if (!(creating || reading || writing || appending)) raise('ValueError', 'Must have exactly one of create/read/write/append mode and at most one plus');
  const target = resolveName(file);
  // (errno values and texts as Linux reports them; open() with O_CREAT —
  // modes w, x, a — on a name ending in '/' fails with EISDIR)
  if (target.enoent) osError('FileNotFoundError', 2, 'No such file or directory', file);
  if (target.enotdir) osError('NotADirectoryError', 20, 'Not a directory', file);
  if (target.dir) {
    if (creating) osError('FileExistsError', 17, 'File exists', file);
    osError('IsADirectoryError', 21, 'Is a directory', file);
  }
  if (target.slash) {
    if (creating || writing || appending) osError('IsADirectoryError', 21, 'Is a directory', file);
    if (target.missing) osError('FileNotFoundError', 2, 'No such file or directory', file);
    osError('NotADirectoryError', 20, 'Not a directory', file);
  }
  if (target.missing && (reading || target.key === '')) osError('FileNotFoundError', 2, 'No such file or directory', file);
  if (creating && !target.missing) osError('FileExistsError', 17, 'File exists', file);
  if (writing || creating) files.set(target.key, '');
  else if (appending && target.missing) files.set(target.key, '');
  const raw = new PyFileIO(file, { created: creating, appending, readable: reading || updating, writable: !reading || updating });
  raw.key = target.key;

  if (buf === 0n) {
    if (!binary) raise('ValueError', "can't have unbuffered text I/O");
    return raw;
  }
  const kind = updating ? 'BufferedRandom' : (writing || creating || appending) ? 'BufferedWriter' : 'BufferedReader';
  const buffer = new PyBuffered(raw, kind);
  buffer.key = target.key;
  if (binary) return buffer;
  if (encoding !== null) {
    const enc = normalizeEncoding(encoding);
    if (!UTF8_NAMES.has(enc) && !ASCII_SUPERSETS.has(enc)) demoLimit(`the encoding ${pyRepr(encoding)}`);
  }
  const wrapper = new PyTextIOWrapper(buffer, mode, encoding, errors, { readable: reading || updating });
  // 'a+' starts at the end, 'w+' / 'x+' at the start of an empty file
  wrapper._startAtEnd = appending;
  return wrapper;
}

// ── sys.stdin ────────────────────────────────────────────────
// What the reader's terminal is connected to differs per machine: the
// name and mode are fixed, everything else stops with a DemoLimit.
class PyStdinBuffer {
  get pyTypeName() { return 'BufferedReader'; }
  get name() { return '<stdin>'; }
  get mode() { return 'rb'; }
  get closed() { return false; }
  read() { demoLimit('reading standard input: the browser demo has none'); }
  close() { demoLimit('closing sys.stdin'); }
  __repr__() { return "<_io.BufferedReader name='<stdin>'>"; }
}

class PyStdin {
  constructor() { this.buffer = new PyStdinBuffer(); }
  get pyTypeName() { return 'TextIOWrapper'; }
  get name() { return '<stdin>'; }
  get mode() { return 'r'; }
  get closed() { return false; }
  get encoding() { return demoLimit("sys.stdin's encoding: it depends on the terminal and the OS"); }
  read() { demoLimit('reading standard input: the browser demo has none'); }
  close() { demoLimit('closing sys.stdin'); }
  __repr__() { return demoLimit("the repr of sys.stdin: its encoding depends on the terminal and the OS"); }
}
export const stdin = new PyStdin();

// stream.buffer — an io.StringIO (what redirect_stdout installs) has none
export function bufferOf(stream) {
  if (stream instanceof StringIO) raise('AttributeError', "'_io.StringIO' object has no attribute 'buffer'");
  return stream.buffer;
}

export { PyException };
