// utils/emulators/python/stdlib/shutil/_pyshutil.js
//
// Port of CPython 3.13's Lib/shutil.py for the shutil demos, running on the
// in-memory Linux file system of the os pages (os/_vfs.js, imported — the
// cwd is /tmp/demo, every demo starts from an empty folder) and the
// posixpath port (os-path/_posixpath.js).
//
// What is modelled, exactly as CPython does it on Linux:
//   copyfileobj (on in-memory text streams), copyfile / copymode /
//   copystat / copy / copy2 (SameFileError, the 'Directory does not exist'
//   rewrite, permission bits, mtime), ignore_patterns (fnmatch port),
//   copytree (scandir entries, DirEntry objects passed to copy/copy2 and
//   their repr, dirs_exist_ok, the error list of shutil.Error — including
//   the extend() of a SameFileError message, which splits it into
//   characters), rmtree (the fd-based stack walk of _rmtree_safe_fd, every
//   onexc/onerror call with its function name and path), move (rename(2),
//   then the copy + delete fallback), make_archive (_make_zipfile /
//   _make_tarball: walk order, arcnames, the zip that contains itself, the
//   tar that skips itself, abspath return with root_dir), unpack_archive
//   (extension lookup, _unpack_zipfile's skip rules, tarfile.extractall with
//   the fully_trusted / tar / data filters as far as plain files and
//   folders go), the archive / unpack registries and their errors.
//
// Archives are never bytes: an archive file carries a `payload` (kind,
// compression, member list) that namelist() / getnames() read back.
//
// File system additions over os/_vfs.js (subclass, the shared file is not
// touched): permission bits (umask 022: files 0o644, folders 0o755),
// EACCES when a read-only file is opened for writing (as a normal user —
// root may write anyway), a non-integral "now" for new timestamps so they
// never equal a timestamp a demo sets, chmod, and file payloads.
//
// Not a content page (leading underscore): never mapped by the generator.

import { VFS, pySorted } from '../os/_vfs.js';
import {
  join, split, basename, dirname, normpath, abspath as absWith, relpath as relWith, splitext,
} from '../os-path/_posixpath.js';
import { PyException } from '../../../../py-exceptions.js';
import { pyStrRepr, pyReprExact } from '../../../../demo-coerce.js';
import { filter as fnFilter } from './_fnmatch.js';

// ── Exceptions ───────────────────────────────────────────────
const ERRNO = {
  ENOENT:    [2,  'No such file or directory', 'FileNotFoundError'],
  EACCES:    [13, 'Permission denied', 'PermissionError'],
  EBUSY:     [16, 'Device or resource busy', 'OSError'],
  EEXIST:    [17, 'File exists', 'FileExistsError'],
  ENOTDIR:   [20, 'Not a directory', 'NotADirectoryError'],
  EISDIR:    [21, 'Is a directory', 'IsADirectoryError'],
  EINVAL:    [22, 'Invalid argument', 'OSError'],
  ENAMETOOLONG: [36, 'File name too long', 'OSError'],
  ENOTEMPTY: [39, 'Directory not empty', 'OSError'],
};

// ── str → bytes, the way Linux CPython does it ───────────────
// Python escape of one lone surrogate code point: '\ud800'
const surrEsc = (cp) => `'\\u${cp.toString(16).padStart(4, '0')}'`;
const isSurr = (cp) => cp >= 0xd800 && cp <= 0xdfff;

// UnicodeEncodeError of the utf-8 codec for the first run of lone
// surrogates (escapable: the code points surrogateescape turns into bytes,
// only for file names)
function surrogateError(text, escapable) {
  const cps = [...text].map((c) => c.codePointAt(0));
  for (let i = 0; i < cps.length; i += 1) {
    if (!isSurr(cps[i])) continue;
    let j = i;
    while (j + 1 < cps.length && isSurr(cps[j + 1])) j += 1;
    const run = cps.slice(i, j + 1);
    if (!escapable || run.some((cp) => cp < 0xdc80 || cp > 0xdcff)) {
      const what = i === j ? `character ${surrEsc(cps[i])} in position ${i}` : `characters in position ${i}-${j}`;
      return pyErr('UnicodeEncodeError', `'utf-8' codec can't encode ${what}: surrogates not allowed`);
    }
    i = j;
  }
  return null;
}

// OSError ENAMETOOLONG (os/_vfs.js re-raises only the errno codes it
// knows, so this one carries no errnoCode; rename re-labels it)
function tooLongErr(p) {
  const e = oserr('ENAMETOOLONG', p);
  e.tooLong = true;
  e.errnoCode = undefined;
  return e;
}

// len(os.fsencode(s))
function fsLen(s) {
  let n = 0;
  for (const c of s) {
    const cp = c.codePointAt(0);
    n += cp < 0x80 || (cp >= 0xdc80 && cp <= 0xdcff) ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  }
  return n;
}

// os.fsencode + the embedded-NUL check of every path argument
// (PyUnicode_FSConverter): UnicodeEncodeError, then ValueError
export function checkFsPath(p) {
  if (typeof p !== 'string') return;
  const e = surrogateError(p, true);
  if (e) throw e;
  if (p.includes('\u0000')) throw pyErr('ValueError', 'embedded null byte');
}

// TextIOWrapper.write(text) with the UTF-8 encoding (errors='strict')
export function checkTextEncodable(text) {
  const e = surrogateError(text, false);
  if (e) throw e;
}

// A demo 'number' value as the Python literal fillSnippet writes for it
// (String(n)): an int (BigInt) — or a float once JS switches to exponent
// notation (1e+21)
export function pyNumberLiteral(n) {
  const s = String(n);
  if (/[e.]/.test(s) || !Number.isFinite(n)) return { float: true, value: n };
  return { float: false, value: BigInt(s) };
}

const I64_MAX = (1n << 63n) - 1n;
const I64_MIN = -(1n << 63n);

// a Py_ssize_t argument such as read(n): TypeError for a float,
// OverflowError outside the 64-bit range
export function indexArg(n) {
  const lit = pyNumberLiteral(n);
  if (lit.float) throw pyErr('TypeError', "argument should be integer or None, not 'float'");
  if (lit.value > I64_MAX || lit.value < I64_MIN) throw pyErr('OverflowError', "cannot fit 'int' into an index-sized integer");
  return Number(lit.value);
}

// os.utime(p, (t, t)) with t from a demo number: OverflowError outside
// time_t; the value ext4 actually stores (seconds are clamped to
// 1901-12-13 … 2446-05-10, checked on Linux); and whether st_mtime == t
export function utimeStamp(n) {
  const lit = pyNumberLiteral(n);
  const big = lit.float ? (Math.abs(n) >= 2 ** 63 ? null : BigInt(Math.trunc(n))) : lit.value;
  if (big === null || big > I64_MAX || big < I64_MIN) throw pyErr('OverflowError', 'timestamp out of range for platform time_t');
  const lo = -(2n ** 31n);
  const hi = 2n ** 34n - 2n ** 31n - 1n;
  const stored = big < lo ? lo : big > hi ? hi : big;
  return { stored: Number(stored), equal: !lit.float && stored === big };
}

// OSError(errno, strerror, filename) — str() is "[Errno N] text: 'name'"
export function oserr(code, filename, filename2) {
  const [n, text, type] = ERRNO[code];
  const e = new PyException(type, '');
  e.errnoCode = code;
  e.errno = n;
  e.strerror = text;
  e.filename = filename;
  e.filename2 = filename2;
  e.message = osMessage(e);
  return e;
}

function osMessage(e) {
  const fn = e.filename;
  if (fn === undefined || fn === null) return `[Errno ${e.errno}] ${e.strerror}`;
  const r = (x) => (typeof x === 'string' ? pyStrRepr(x) : pyReprExact(x));
  if (e.filename2 !== undefined && e.filename2 !== null) return `[Errno ${e.errno}] ${e.strerror}: ${r(fn)} -> ${r(e.filename2)}`;
  return `[Errno ${e.errno}] ${e.strerror}: ${r(fn)}`;
}

// err.filename = path (rmtree does this before calling onexc)
function setFilename(e, p) {
  e.filename = p;
  e.filename2 = undefined;
  e.message = osMessage(e);
}

// Python class hierarchy of every exception the port raises
const BASES = {
  OSError: 'Exception', FileNotFoundError: 'OSError', FileExistsError: 'OSError',
  NotADirectoryError: 'OSError', IsADirectoryError: 'OSError', PermissionError: 'OSError',
  Error: 'OSError', SameFileError: 'Error', SpecialFileError: 'OSError', ExecError: 'OSError',
  ReadError: 'OSError', RegistryError: 'Exception', TypeError: 'Exception', ValueError: 'Exception',
  KeyError: 'LookupError', LookupError: 'Exception', RecursionError: 'RuntimeError',
  RuntimeError: 'Exception', AttributeError: 'Exception', NotImplementedError: 'RuntimeError',
  UnicodeEncodeError: 'UnicodeError', UnicodeError: 'ValueError',
  OverflowError: 'ArithmeticError', ArithmeticError: 'Exception',
};
export const SHUTIL_EXC = new Set(['Error', 'SameFileError', 'SpecialFileError', 'ExecError', 'ReadError', 'RegistryError']);

// type(e).__name__
export function typeName(e) {
  if (!(e instanceof PyException)) return null;
  return e.pyType || e.name;
}

// isinstance(e, cls)
export function isinst(e, cls) {
  let t = typeName(e);
  while (t) {
    if (t === cls) return true;
    t = BASES[t];
  }
  return cls === 'Exception' || cls === 'BaseException' ? t !== null : false;
}

export function shErr(cls, message, args) {
  const e = new PyException(`shutil.${cls}`, message);
  e.pyType = cls;
  e.args = args || [message];
  return e;
}

function pyErr(cls, message) {
  const e = new PyException(cls, message);
  e.args = [message];
  return e;
}

// ── DirEntry (what copytree hands to copy / copy2) ───────────
class DirEntry {
  constructor(fs, dirPath, name, node) {
    this.fs = fs;
    this.name = name;
    this.path = join(dirPath, name);
    this.node = node;
    this.statNode = undefined; // DirEntry.stat() result is cached
  }

  isDir() { return this.node.type === 'dir'; }

  stat() {
    if (this.statNode === undefined) this.statNode = this.fs.get(this.path);
    return this.statNode;
  }

  get __pyRaw() { return `<DirEntry ${pyStrRepr(this.name)}>`; }
}

const fspath = (p) => (p instanceof DirEntry ? p.path : p);
// repr(p) / str(p) for messages
const reprOf = (p) => (p instanceof DirEntry ? p.__pyRaw : pyStrRepr(p));
const strOf = (p) => (p instanceof DirEntry ? p.__pyRaw : p);

// ── The file system ──────────────────────────────────────────
// "now" for the demos' new files: never an integer, so it never equals a
// timestamp the snippet sets with os.utime(...)
const NOW = 1790000000.5;
const S_IWUSR = 0o200;
const S_IRUSR = 0o400;

export class ShFS extends VFS {
  node(type) {
    const n = super.node(type);
    n.mode = type === 'dir' ? 0o755 : 0o644;
    n.mtime = NOW;
    n.atime = NOW;
    if (type !== 'dir') {
      n.content = '';
      n.payload = null;
    }
    return n;
  }

  tick() {
    this.clock += 1;
    return NOW + this.clock / 1024;
  }

  get(p, errP = p) {
    try {
      return super.get(p, errP);
    } catch (e) {
      throw this.re(e, errP);
    }
  }

  // os/_vfs.js's lookup plus what Linux checks on the way: the str → bytes
  // conversion (UnicodeEncodeError, embedded NUL → ValueError) and
  // ENAMETOOLONG for a path of 4096+ bytes or a component over 255 bytes
  // (each component when the walk reaches it, so a missing folder earlier
  // in the path is still ENOENT; checkLast=false leaves the last one to the
  // caller — open(p, 'w') reports a trailing slash as EISDIR first)
  locate(p, errP = p, checkLast = true) {
    checkFsPath(p);
    const tooLong = () => tooLongErr(errP);
    if (p !== '' && fsLen(p) >= 4096) throw tooLong();
    if (p === '') throw oserr('ENOENT', errP);
    let dir = p.startsWith('/') ? this.root : this.cwd;
    const slash = /[^/]\/+$/.test(p);
    const comps = p.split('/').filter((c) => c !== '');
    if (comps.length === 0) return { dir: this.root, name: '.', slash: false };
    for (const c of comps.slice(0, -1)) {
      if (c === '.') continue;
      if (c === '..') { dir = dir.parent || dir; continue; }
      if (fsLen(c) > 255) throw tooLong();
      const nx = dir.children.get(c);
      if (!nx) throw oserr('ENOENT', errP);
      if (nx.type !== 'dir') throw oserr('ENOTDIR', errP);
      dir = nx;
    }
    const name = comps[comps.length - 1];
    if (checkLast && fsLen(name) > 255) throw tooLong();
    return { dir, name, slash };
  }

  // a VFS error → ours (same errno and file name)
  re(e, p) {
    if (e instanceof PyException && e.errnoCode && e.errno === undefined) return oserr(e.errnoCode, p);
    return e;
  }

  wrap(fn, p, p2) {
    try {
      return fn();
    } catch (e) {
      if (e instanceof PyException && e.errnoCode && e.errno === undefined) throw oserr(e.errnoCode, p, p2);
      throw e;
    }
  }

  pathOf(node) {
    const parts = [];
    for (let n = node; n.parent; n = n.parent) {
      parts.unshift([...n.parent.children].find(([, v]) => v === n)[0]);
    }
    return '/' + parts.join('/');
  }

  getcwd() { return this.pathOf(this.cwd); }

  abspath(p) { return absWith(p, this.getcwd()); }

  relpath(p, start) { return relWith(p, start, this.getcwd()); }

  // os.stat (no symlinks in this file system: lstat is the same)
  stat(p) { return this.get(p); }

  chmod(p, mode) { this.get(p).mode = mode & 0o7777; }

  // os.utime: on Linux its OSError carries no file name (posixmodule.c
  // calls posix_error(), not path_error())
  utime(p, atime, mtime) {
    let n;
    try {
      n = this.get(p);
    } catch (e) {
      if (e.errno !== undefined) setFilename(e, null);
      throw e;
    }
    n.atime = atime;
    n.mtime = mtime;
  }

  mkdir(p) { this.wrap(() => super.mkdir(p), p); }

  makedirs(p, existOk = false) { this.wrap(() => super.makedirs(p, existOk), p); }

  rmdir(p) { this.wrap(() => super.rmdir(p), p); }

  remove(p) { this.wrap(() => super.remove(p), p); }

  unlink(p) { this.remove(p); }

  listdir(p = '.') { return this.wrap(() => super.listdir(p), p); }

  rename(src, dst) {
    try {
      this.wrap(() => super.rename(src, dst), src, dst);
    } catch (e) {
      if (e.tooLong) throw oserr('ENAMETOOLONG', src, dst);
      throw e;
    }
  }

  // open(p, 'rb')
  openRead(p) {
    const n = this.get(p);
    if (n.type === 'dir') throw oserr('EISDIR', p);
    if (!(n.mode & S_IRUSR)) throw oserr('EACCES', p);
    return n;
  }

  // open(p, 'wb'): O_WRONLY | O_CREAT | O_TRUNC
  // (with O_CREAT a trailing slash is EISDIR whatever the name is — even
  // one too long for ENAMETOOLONG)
  openWrite(p) {
    const { dir, name, slash } = this.locate(p, p, false);
    if (slash) throw oserr('EISDIR', p);
    if (fsLen(name) > 255) throw tooLongErr(p);
    const existing = name === '.' ? dir : name === '..' ? dir.parent || dir : dir.children.get(name);
    if (existing) {
      if (existing.type === 'dir') throw oserr('EISDIR', p);
      if (!(existing.mode & S_IWUSR)) throw oserr('EACCES', p);
      existing.content = '';
      existing.size = 0;
      existing.payload = null;
      existing.opaque = false;
      existing.mtime = this.tick();
      return existing;
    }
    if (slash) throw oserr('EISDIR', p);
    const f = this.addChild(dir, name, this.node('file'));
    f.mtime = this.tick();
    f.atime = f.mtime;
    return f;
  }

  // open(p, 'w').write(text)
  writeText(p, text) {
    const f = this.openWrite(p);
    checkTextEncodable(text);
    f.content = text;
    f.size = new TextEncoder().encode(text).length;
    return f;
  }

  // open(p).read(): universal newlines turn '\r\n' and '\r' into '\n'
  readText(p) {
    const n = this.openRead(p);
    return n.content.replace(/\r\n?/g, '\n');
  }

  // os.scandir(p) → DirEntry list
  scandirEntries(p) {
    const fp = fspath(p);
    const n = this.get(fp);
    if (n.type !== 'dir') throw oserr('ENOTDIR', fp);
    return [...n.children].map(([name, c]) => new DirEntry(this, fp, name, c));
  }
}

// copy the data of node s into node d (the write side of copyfileobj)
function copyData(s, d) {
  d.content = s.content;
  d.size = s.size;
  d.payload = s.payload;
  d.opaque = s.opaque || false;
}

// ── Seeding helpers used by the demo emulators ───────────────
// for f in files: os.makedirs(os.path.dirname(f) or '.', exist_ok=True); open(f, 'w').close()
export function seedEmpty(fs, files) {
  for (const f of files) {
    fs.makedirs(dirname(f) || '.', true);
    fs.writeText(f, '');
  }
}

// ... with open(f, 'w') as fh: fh.write(f)
export function seedNamed(fs, files) {
  for (const f of files) {
    fs.makedirs(dirname(f) || '.', true);
    fs.writeText(f, f);
  }
}

// sorted(os.path.join(r, n) for r, ds, fs in os.walk(top) for n in fs)
export function walkFiles(fs, top = '.') {
  const out = [];
  for (const [root, , files] of fs.walk(top)) for (const n of files) out.push(join(root, n));
  return pySorted(out);
}

// ... for n in ds + fs
export function walkAll(fs, top = '.') {
  const out = [];
  for (const [root, dirs, files] of fs.walk(top)) for (const n of [...dirs, ...files]) out.push(join(root, n));
  return pySorted(out);
}

// ── copyfileobj on in-memory text streams ────────────────────
// A StringIO-like source: read(n) returns up to n code points from the
// current position; n < 0 reads the rest.
export class TextStream {
  constructor(text = '') {
    this.chars = [...text];
    this.pos = 0;
  }

  read(n = -1) {
    n = indexArg(n);
    const end = n < 0 ? this.chars.length : Math.min(this.chars.length, this.pos + n);
    const out = this.chars.slice(this.pos, end).join('');
    this.pos = Math.max(this.pos, end);
    return out;
  }
}

export const COPY_BUFSIZE = 64 * 1024; // Linux / macOS (1 MiB on Windows)

// shutil.copyfileobj(fsrc, fdst, length=0) — fdst is a function (write)
export function copyfileobj(fsrc, write, length = 0) {
  if (!length) length = COPY_BUFSIZE;
  for (;;) {
    const buf = fsrc.read(length);
    if (!buf) break;
    write(buf);
  }
}

// ── The shutil functions ─────────────────────────────────────
export class Shutil {
  constructor(fs = new ShFS()) {
    this.fs = fs;
    this.archiveFormats = new Map([
      ['tar',   { fn: 'tar', extra: [['compress', null]], desc: 'uncompressed tar file', supportsRootDir: true }],
      ['gztar', { fn: 'tar', extra: [['compress', 'gzip']], desc: "gzip'ed tar-file", supportsRootDir: true }],
      ['zip',   { fn: 'zip', extra: [], desc: 'ZIP file', supportsRootDir: true }],
      ['bztar', { fn: 'tar', extra: [['compress', 'bzip2']], desc: "bzip2'ed tar-file", supportsRootDir: true }],
      ['xztar', { fn: 'tar', extra: [['compress', 'xz']], desc: "xz'ed tar-file", supportsRootDir: true }],
    ]);
    this.unpackFormats = new Map([
      ['tar',   { exts: ['.tar'], fn: 'tar', extra: [], desc: 'uncompressed tar file' }],
      ['zip',   { exts: ['.zip'], fn: 'zip', extra: [], desc: 'ZIP file' }],
      ['gztar', { exts: ['.tar.gz', '.tgz'], fn: 'tar', extra: [], desc: "gzip'ed tar-file" }],
      ['bztar', { exts: ['.tar.bz2', '.tbz2'], fn: 'tar', extra: [], desc: "bzip2'ed tar-file" }],
      ['xztar', { exts: ['.tar.xz', '.txz'], fn: 'tar', extra: [], desc: "xz'ed tar-file" }],
    ]);
    this.depth = 0;
  }

  // os.path.samefile / samestat — any OSError means "not the same"
  _samefile(src, dst) {
    const fs = this.fs;
    try {
      const a = src instanceof DirEntry ? src.stat() : fs.stat(src);
      const b = fs.stat(dst);
      return a === b;
    } catch (e) {
      if (isinst(e, 'OSError')) return false;
      throw e;
    }
  }

  copyfile(src, dst) {
    const fs = this.fs;
    if (this._samefile(src, dst)) {
      throw shErr('SameFileError', `${reprOf(src)} and ${reprOf(dst)} are the same file`);
    }
    // the named-pipe check stats both paths (this file system has no FIFOs);
    // only OSError is swallowed, so an embedded NUL in dst raises here
    for (const fn of [src, dst]) {
      if (fn instanceof DirEntry) continue;
      try {
        fs.stat(fn);
      } catch (e) {
        if (!isinst(e, 'OSError')) throw e;
      }
    }
    const s = fs.openRead(fspath(src));
    try {
      const d = fs.openWrite(dst);
      copyData(s, d);
    } catch (e) {
      // Issue 43219, raise a less confusing exception
      if (typeName(e) === 'IsADirectoryError') {
        if (!fs.exists(dst)) throw pyErr('FileNotFoundError', `Directory does not exist: ${dst}`);
      }
      throw e;
    }
    return dst;
  }

  copymode(src, dst) {
    const fs = this.fs;
    const st = src instanceof DirEntry ? src.stat() : fs.stat(fspath(src));
    fs.chmod(dst, st.mode);
  }

  copystat(src, dst) {
    const fs = this.fs;
    const st = src instanceof DirEntry ? src.stat() : fs.stat(fspath(src));
    fs.utime(fspath(dst), st.atime, st.mtime);
    fs.chmod(fspath(dst), st.mode);
  }

  copy(src, dst) {
    if (this.fs.isdir(dst)) dst = join(dst, basename(fspath(src)));
    this.copyfile(src, dst);
    this.copymode(src, dst);
    return dst;
  }

  copy2(src, dst) {
    if (this.fs.isdir(dst)) dst = join(dst, basename(fspath(src)));
    this.copyfile(src, dst);
    this.copystat(src, dst);
    return dst;
  }

  // shutil.ignore_patterns(*patterns) → callable(path, names) → set
  static ignorePatterns(patterns) {
    return (path, names) => {
      const ignored = new Set();
      for (const pat of patterns) for (const n of fnFilter(names, pat)) ignored.add(n);
      return ignored;
    };
  }

  // copy_function: 'copy2' | 'copy' | 'copyfile' (or a JS function (src, dst))
  _copyFn(cf) {
    if (cf === 'copy2') return (s, d) => this.copy2(s, d);
    if (cf === 'copy') return (s, d) => this.copy(s, d);
    if (cf === 'copyfile') return (s, d) => this.copyfile(s, d);
    return cf;
  }

  copytree(src, dst, { ignore = null, copyFunction = 'copy2', dirsExistOk = false } = {}) {
    this.depth += 1;
    try {
      if (this.depth > 60) throw pyErr('RecursionError', 'maximum recursion depth exceeded');
      const entries = this.fs.scandirEntries(src);
      return this._copytree(entries, src, dst, ignore, copyFunction, dirsExistOk);
    } finally {
      this.depth -= 1;
    }
  }

  _copytree(entries, src, dst, ignore, copyFunction, dirsExistOk) {
    const fs = this.fs;
    const ignored = ignore ? ignore(fspath(src), entries.map((x) => x.name)) : new Set();
    fs.makedirs(dst, dirsExistOk);
    const errors = [];
    const useSrcEntry = copyFunction === 'copy2' || copyFunction === 'copy';
    const copyFn = this._copyFn(copyFunction);
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const srcname = join(fspath(src), entry.name);
      const dstname = join(dst, entry.name);
      const srcobj = useSrcEntry ? entry : srcname;
      try {
        if (entry.isDir()) {
          this.copytree(srcobj, dstname, { ignore, copyFunction, dirsExistOk });
        } else {
          copyFn(srcobj, dstname);
        }
      } catch (e) {
        if (isinst(e, 'Error')) {
          const a = e.args[0];
          // errors.extend(err.args[0]) — a SameFileError's message is a str
          if (typeof a === 'string') errors.push(...[...a]);
          else errors.push(...a);
        } else if (isinst(e, 'OSError')) {
          errors.push({ __pyTuple: [srcname, dstname, e.message] });
        } else {
          throw e;
        }
      }
    }
    try {
      this.copystat(src, dst);
    } catch (e) {
      if (!isinst(e, 'OSError')) throw e;
      errors.push({ __pyTuple: [src instanceof DirEntry ? { __pyRaw: src.__pyRaw } : src, dst, e.message] });
    }
    if (errors.length) {
      const list = errors.map((x) => (x instanceof DirEntry ? { __pyRaw: x.__pyRaw } : x));
      throw shErr('Error', pyReprExact(list), [list]);
    }
    return dst;
  }

  // shutil.rmtree — the fd-based version used on Linux (_rmtree_safe_fd).
  // handler: 'raise' | 'ignore' | function (funcName, path, exc)
  rmtree(path, handler = 'raise') {
    const fs = this.fs;
    let onexc;
    if (handler === 'ignore') onexc = () => {};
    else if (handler === 'raise') onexc = (f, p, e) => { throw e; };
    else onexc = handler;

    // stack items: [func, dirfd (node | null), path, entry (DirEntry | null)]
    const stack = [['lstat', null, path, null]];
    const lookup = (dirfd, name) => {
      if (dirfd === null) return fs.get(name);
      const n = dirfd.children.get(name);
      if (!n) throw oserr('ENOENT', name);
      return n;
    };
    const step = () => {
      let [func, dirfd, p, entry] = stack.pop();
      const name = entry === null ? p : entry.name;
      try {
        if (func === 'close') return;
        if (func === 'rmdir') {
          if (dirfd === null) fs.rmdir(name);
          else {
            const n = dirfd.children.get(name);
            if (!n) throw oserr('ENOENT', name);
            if (n.type !== 'dir') throw oserr('ENOTDIR', name);
            if (n.children.size) throw oserr('ENOTEMPTY', name);
            dirfd.children.delete(name);
          }
          return;
        }
        const origSt = entry === null ? lookup(dirfd, name) : entry.node;
        func = 'open';
        const topfd = lookup(dirfd, name);
        func = 'islink';
        try {
          if (origSt !== topfd) throw pyErr('OSError', 'Cannot call rmtree on a symbolic link');
          stack.push(['rmdir', dirfd, p, entry]);
        } finally {
          stack.push(['close', topfd, p, entry]);
        }
        func = 'scandir';
        if (topfd.type !== 'dir') throw oserr('ENOTDIR', null);
        const entries = [...topfd.children];
        for (const [ename, enode] of entries) {
          const fullname = join(p, ename);
          if (enode.type === 'dir') {
            stack.push(['lstat', topfd, fullname, { name: ename, node: enode }]);
            continue;
          }
          try {
            if (topfd.children.get(ename) !== enode) continue; // FileNotFoundError
            topfd.children.delete(ename);
          } catch (e) {
            if (!isinst(e, 'OSError')) throw e;
            onexc('unlink', fullname, e);
          }
        }
      } catch (e0) {
        const e = e0;
        if (typeName(e) === 'FileNotFoundError') {
          if (entry === null || func === 'close') {
            setFilename(e, p);
            onexc(func, p, e);
          }
        } else if (isinst(e, 'OSError')) {
          if (e.errno !== undefined) setFilename(e, p);
          onexc(func, p, e);
        } else {
          throw e;
        }
      }
    };
    while (stack.length) step();
  }

  move(src, dst, copyFunction = 'copy2') {
    const fs = this.fs;
    let realDst = dst;
    if (fs.isdir(dst)) {
      if (this._samefile(src, dst)) {
        fs.rename(src, dst);
        return null;
      }
      // _basename: ignore a trailing slash
      realDst = join(dst, basename(src.replace(/\/+$/, '')));
      if (fs.exists(realDst)) throw shErr('Error', `Destination path '${realDst}' already exists`);
    }
    try {
      fs.rename(src, realDst);
    } catch (e) {
      if (!isinst(e, 'OSError')) throw e;
      if (fs.isdir(src)) {
        if (this._destinsrc(src, dst)) {
          throw shErr('Error', `Cannot move a directory '${src}' into itself '${dst}'.`);
        }
        this.copytree(src, realDst, { copyFunction });
        this.rmtree(src);
      } else {
        this._copyFn(copyFunction)(src, realDst);
        fs.unlink(src);
      }
    }
    return realDst;
  }

  _destinsrc(src, dst) {
    let s = this.fs.abspath(src);
    let d = this.fs.abspath(dst);
    if (!s.endsWith('/')) s += '/';
    if (!d.endsWith('/')) d += '/';
    return d.startsWith(s);
  }

  // ── archiving ──────────────────────────────────────────────
  getArchiveFormats() {
    return pySorted([...this.archiveFormats.keys()]).map((n) => ({ __pyTuple: [n, this.archiveFormats.get(n).desc] }));
  }

  getUnpackFormats() {
    return pySorted([...this.unpackFormats.keys()]).map((n) => {
      const f = this.unpackFormats.get(n);
      return { __pyTuple: [n, f.exts, f.desc] };
    });
  }

  // register_unpack_format's _check_unpack_options (extensions: list or
  // str — a str is iterated character by character, as in CPython)
  // fn: a JS (filename, extractDir, kwargs) => value standing in for the
  // snippet's Python unpacker
  registerUnpackFormat(name, extensions, description = '', fn = null) {
    const existing = new Map();
    for (const [n, info] of this.unpackFormats) for (const ext of iterOf(info.exts)) existing.set(ext, n);
    for (const ext of iterOf(extensions)) {
      if (existing.has(ext)) {
        throw shErr('RegistryError', `${ext} is already registered for "${existing.get(ext)}"`);
      }
    }
    this.unpackFormats.set(name, { exts: extensions, fn: 'custom', custom: fn, extra: [], desc: description });
  }

  unregisterUnpackFormat(name) {
    if (!this.unpackFormats.has(name)) throw pyErr('KeyError', pyStrRepr(name));
    this.unpackFormats.delete(name);
  }

  // register_archive_format(name, function, extra_args=None, description='')
  // — function: a JS (baseName, baseDir, kwargs) => value standing in for
  // the snippet's Python archiver; supportsRootDir mirrors the attribute
  registerArchiveFormat(name, description = '', fn = null, extra = [], supportsRootDir = false) {
    this.archiveFormats.set(name, { fn: 'custom', custom: fn, extra, desc: description, supportsRootDir });
  }

  unregisterArchiveFormat(name) {
    if (!this.archiveFormats.has(name)) throw pyErr('KeyError', pyStrRepr(name));
    this.archiveFormats.delete(name);
  }

  makeArchive(baseName, format, rootDir = null, baseDir = null) {
    const fs = this.fs;
    const info = this.archiveFormats.get(format);
    if (!info) throw pyErr('ValueError', `unknown archive format '${format}'`);
    // kwargs = {'dry_run': …, 'logger': …, 'owner': …, 'group': …} + extra_args
    const kwargs = { dry_run: 0, logger: null, owner: null, group: null };
    for (const [k, v] of info.extra) kwargs[k] = v;
    if (baseDir === null) baseDir = '.';
    if (rootDir !== null) {
      const st = fs.stat(rootDir);
      if (st.type !== 'dir') throw oserr('ENOTDIR', rootDir);
    }
    if (info.fn === 'custom') {
      if (!info.custom) throw pyErr('NotImplementedError', 'custom archivers are not emulated');
      if (rootDir !== null) {
        if (info.supportsRootDir) kwargs.root_dir = rootDir;
        else throw pyErr('NotImplementedError', 'os.chdir into root_dir is not emulated');
      }
      return info.custom(baseName, baseDir, kwargs);
    }
    if (info.fn === 'zip') return this._makeZipfile(baseName, baseDir, rootDir);
    return this._makeTarball(baseName, baseDir, kwargs.compress, rootDir);
  }

  _makeTarball(baseName, baseDir, compress, rootDir) {
    const fs = this.fs;
    const ext = { null: '', gzip: 'gz', bzip2: 'bz2', xz: 'xz' }[String(compress)];
    const compressExt = compress ? '.' + ext : '';
    let archiveName = baseName + '.tar' + compressExt;
    const archiveDir = dirname(archiveName);
    if (archiveDir && !fs.exists(archiveDir)) fs.makedirs(archiveDir);
    const f = fs.openWrite(archiveName);
    const payload = { kind: 'tar', comp: ext, members: [] };
    f.payload = payload;
    const selfName = fs.abspath(archiveName);
    const arcname = baseDir;
    let top = baseDir;
    if (rootDir !== null) top = join(rootDir, baseDir);
    // TarFile.add(name, arcname) — directories recurse over sorted(listdir)
    const add = (name, arc) => {
      if (fs.abspath(name) === selfName) return;
      const node = fs.get(name); // os.lstat
      const stored = arc.replace(/^\/+/, '');
      if (node.type === 'dir') {
        payload.members.push({ name: stored.replace(/\/+$/, '') || stored, type: 'dir', mode: node.mode, mtime: node.mtime });
        for (const c of pySorted(fs.listdir(name))) add(join(name, c), join(arc, c));
      } else {
        fs.openRead(name);
        payload.members.push({
          name: stored, type: 'file', mode: node.mode, mtime: node.mtime,
          content: node.content, size: node.size, payload: node === f ? null : node.payload, opaque: node === f || node.opaque,
        });
      }
    };
    add(top, arcname);
    if (rootDir !== null) archiveName = fs.abspath(archiveName);
    return archiveName;
  }

  _makeZipfile(baseName, baseDir, rootDir) {
    const fs = this.fs;
    let zipFilename = baseName + '.zip';
    const archiveDir = dirname(baseName);
    if (archiveDir && !fs.exists(archiveDir)) fs.makedirs(archiveDir);
    const f = fs.openWrite(zipFilename);
    const payload = { kind: 'zip', members: [] };
    f.payload = payload;
    // ZipFile.write(path, arcname): ZipInfo.from_file normalizes the name
    const write = (path, arc) => {
      const node = fs.get(path);
      // strict_timestamps: the DOS date field starts in 1980 (local time;
      // the demos never get near the edges)
      const year = new Date(node.mtime * 1000).getUTCFullYear();
      if (year < 1980) throw pyErr('ValueError', 'ZIP does not support timestamps before 1980');
      if (year > 2107) throw pyErr('ValueError', 'ZIP does not support timestamps after 2107');
      let a = normpath(arc).replace(/^\/+/, '');
      if (node.type === 'dir') a += '/';
      // the member header stores the name as ASCII or else strict UTF-8
      // (a surrogate-escaped file name cannot go into a zip)
      if (node.type === 'dir') {
        checkTextEncodable(a);
        payload.members.push({ name: a, type: 'dir' });
      } else {
        fs.openRead(path);
        checkTextEncodable(a);
        payload.members.push({
          name: a, type: 'file', mode: node.mode, mtime: node.mtime,
          content: node.content, size: node.size, payload: node === f ? null : node.payload, opaque: node === f || node.opaque,
        });
      }
    };
    let arcname = normpath(baseDir);
    let top = baseDir;
    if (rootDir !== null) top = join(rootDir, baseDir);
    top = normpath(top);
    if (arcname !== '.') write(top, arcname);
    for (const [dirpath, dirnames, filenames] of fs.walk(top)) {
      let arcdirpath = dirpath;
      if (rootDir !== null) arcdirpath = fs.relpath(arcdirpath, rootDir);
      arcdirpath = normpath(arcdirpath);
      for (const name of pySorted(dirnames)) write(join(dirpath, name), join(arcdirpath, name));
      for (const name of filenames) {
        const path = normpath(join(dirpath, name));
        if (fs.isfile(path)) write(path, join(arcdirpath, name));
      }
    }
    if (rootDir !== null) zipFilename = fs.abspath(zipFilename);
    return zipFilename;
  }

  // zipfile.ZipFile(name).namelist() / tarfile.open(name).getnames()
  namelist(name) {
    const n = this.fs.openRead(name);
    if (!n.payload || n.payload.kind !== 'zip') throw pyErr('zipfile.BadZipFile', 'File is not a zip file');
    return n.payload.members.map((m) => m.name);
  }

  getnames(name) {
    const n = this.fs.openRead(name);
    if (!n.payload || n.payload.kind !== 'tar') throw pyErr('tarfile.ReadError', 'file could not be opened successfully');
    return n.payload.members.map((m) => m.name);
  }

  // filter: null (fully_trusted) | 'data' | 'tar' | 'fully_trusted'
  unpackArchive(filename, extractDir = null, format = null, filter = null) {
    if (extractDir === null) extractDir = this.fs.getcwd();
    const filterKw = filter === null ? [] : [['filter', filter]];
    let info;
    if (format !== null) {
      info = this.unpackFormats.get(format);
      if (!info) throw pyErr('ValueError', `Unknown unpack format '${format}'`);
    } else {
      let found = null;
      for (const [n, inf] of this.unpackFormats) {
        if (found) break;
        for (const ext of iterOf(inf.exts)) if (filename.endsWith(ext)) { found = n; break; }
      }
      if (found === null) throw shErr('ReadError', `Unknown archive format '${filename}'`);
      info = this.unpackFormats.get(found);
    }
    if (info.fn === 'zip') {
      if (filterKw.length) throw pyErr('TypeError', "_unpack_zipfile() got an unexpected keyword argument 'filter'");
      this._unpackZipfile(filename, extractDir);
    } else if (info.fn === 'tar') {
      this._unpackTarfile(filename, extractDir, filter);
    } else if (info.custom) {
      const kwargs = Object.fromEntries([...info.extra, ...filterKw]);
      info.custom(filename, extractDir, kwargs);
    } else {
      throw pyErr('NotImplementedError', 'custom unpackers are not emulated');
    }
  }

  // posixpath.realpath(p, strict=os.path.ALLOW_MISSING) without symlinks:
  // components are checked with lstat; only FileNotFoundError is ignored
  _realpathAllowMissing(p) {
    let path = '';
    let rest = p;
    if (rest.startsWith('/')) {
      rest = rest.slice(1);
      path = '/';
    }
    for (const name of rest.split('/')) {
      if (!name || name === '.') continue;
      if (name === '..') {
        if (path) {
          let nm;
          [path, nm] = split(path);
          if (nm === '..') path = join(path, '..', '..');
        } else {
          path = '..';
        }
        continue;
      }
      const newpath = join(path, name);
      try {
        this.fs.get(newpath);
      } catch (e) {
        if (typeName(e) !== 'FileNotFoundError') throw e;
      }
      path = newpath;
    }
    return this.fs.abspath(path);
  }

  // zipfile.is_zipfile: open(filename, 'rb') — only OSError means False
  // (an embedded NUL or an unencodable name raises)
  _isZipfile(filename) {
    let n;
    try {
      n = this.fs.openRead(filename);
    } catch (e) {
      if (isinst(e, 'OSError')) return false;
      throw e;
    }
    return Boolean(n.payload && n.payload.kind === 'zip');
  }

  _ensureDirectory(path) {
    const d = dirname(path);
    if (!this.fs.isdir(d)) this.fs.makedirs(d);
  }

  _unpackZipfile(filename, extractDir) {
    const fs = this.fs;
    if (!this._isZipfile(filename)) throw shErr('ReadError', `${filename} is not a zip file`);
    const archive = fs.get(filename);
    const { members } = archive.payload;
    for (const m of members) {
      const name = m.name;
      if (name.startsWith('/') || name.includes('..')) continue;
      const targetpath = join(extractDir, ...name.split('/'));
      if (!targetpath) continue;
      this._ensureDirectory(targetpath);
      if (!name.endsWith('/')) {
        // overwriting the archive that is being read: CPython then reads
        // members from a truncated file — not modelled
        if (fs.tryGet(targetpath) === archive) this.unmodelled = true;
        const d = fs.openWrite(targetpath);
        copyData(m, d);
      }
    }
  }

  _unpackTarfile(filename, extractDir, filter) {
    const fs = this.fs;
    const n = fs.get(filename);
    const archive = n;
    if (n.type === 'dir') throw oserr('EISDIR', filename);
    fs.openRead(filename);
    if (!n.payload || n.payload.kind !== 'tar') {
      throw shErr('ReadError', `${filename} is not a compressed or uncompressed tar file`);
    }
    if (filter !== null && !['data', 'tar', 'fully_trusted'].includes(filter)) {
      throw pyErr('ValueError', `filter ${pyStrRepr(filter)} not found`);
    }
    const directories = [];
    for (const m of n.payload.members) {
      let mode = m.mode;
      let name = m.name;
      if (filter === 'data' || filter === 'tar') {
        // tarfile._get_filtered_attrs (with the 2025 security fix: realpath
        // with strict=ALLOW_MISSING — a file in the middle of a path raises)
        const dest = this._realpathAllowMissing(extractDir);
        if (name.startsWith('/')) name = name.replace(/^\/+/, '');
        const target = this._realpathAllowMissing(join(dest, name));
        if (target !== dest && !target.startsWith(dest === '/' ? '/' : dest + '/')) {
          const e = pyErr('tarfile.OutsideDestinationError', `${pyStrRepr(m.name)} would be extracted to ${pyStrRepr(target)}, which is outside the destination`);
          throw e;
        }
        mode &= 0o755;
        if (filter === 'data') {
          if (m.type === 'file') {
            if (!(mode & 0o100)) mode &= ~0o111;
            mode |= 0o600;
          } else {
            mode = null;
          }
        }
      }
      // TarFile._extract_member
      let targetpath = join(extractDir, name).replace(/\/+$/, '');
      const upperdirs = dirname(targetpath);
      if (upperdirs && !fs.exists(upperdirs)) fs.makedirs(upperdirs);
      if (m.type === 'dir') {
        try {
          fs.mkdir(targetpath);
          // os.mkdir(path) with the data filter, else os.mkdir(path, 0o700)
          fs.get(targetpath).mode = mode === null ? 0o755 : 0o700;
        } catch (e) {
          if (!(typeName(e) === 'FileExistsError' && fs.isdir(targetpath))) throw e;
        }
        directories.push([targetpath, mode, m.mtime, m.name]);
      } else {
        // overwriting the archive that is being read: CPython then reads
        // members from a truncated file — not modelled
        if (fs.tryGet(targetpath) === archive) this.unmodelled = true;
        const d = fs.openWrite(targetpath);
        copyData(m, d);
        if (mode !== null) fs.chmod(targetpath, mode);
        fs.utime(targetpath, m.mtime, m.mtime);
      }
    }
    // directory attributes last, deepest first
    directories.sort((a, b) => (a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0));
    for (const [p, mode, mtime] of directories) {
      if (mode !== null) fs.chmod(p, mode);
      fs.utime(p, mtime, mtime);
    }
  }
}

function iterOf(x) {
  return typeof x === 'string' ? [...x] : x;
}

export { DirEntry, NOW, splitext, split };
