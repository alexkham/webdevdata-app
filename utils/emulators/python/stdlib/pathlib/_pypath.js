// utils/emulators/python/stdlib/pathlib/_pypath.js
//
// Port of CPython 3.13's pathlib for the pathlib demos — shared by the
// module hub and member emulators. Not a content page (leading underscore),
// so the catalog generator never maps it.
//
//   PurePosixPath  Lib/pathlib/_local.py (PurePath) + _abc.py (PurePathBase)
//                  + Lib/posixpath.py (splitroot, join, split): parsing,
//                  '//' and '.' normalisation, parts, parents, name/stem/
//                  suffix, with_*, joinpath and '/', relative_to (walk_up),
//                  is_relative_to, match / full_match (glob.translate +
//                  fnmatch._translate), as_posix, as_uri, repr, == and <.
//   Path           the same pure behaviour plus a small in-memory file
//                  system (VFS) standing in for the empty temp cwd every
//                  demo runs in: write_text/read_text/write_bytes/
//                  read_bytes, exists/is_file/is_dir, iterdir, glob/rglob
//                  (a port of glob._Globber's selectors), walk, mkdir,
//                  rmdir, unlink, touch, rename, replace, stat().st_size.
//                  Errors use the POSIX (Linux) errno texts; the demos only
//                  show the ones that read the same on Windows.
//
// Python values handed back to the demos: str → string, bool → boolean,
// int → number, list → Array, tuple → { __pyTuple }, path → { __pyRaw }
// (via py()).

import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

const err = (type, msg) => new PyException(type, msg);

// ── posixpath ────────────────────────────────────────────────
export function splitroot(p) {
  if (p.slice(0, 1) !== '/') return ['', '', p];
  if (p.slice(1, 2) !== '/' || p.slice(2, 3) === '/') return ['', '/', p.slice(1)];
  // exactly two leading slashes: implementation-defined, kept (POSIX)
  return ['', '//', p.slice(2)];
}

export function posixJoin(a, ...ps) {
  let path = a;
  for (const b of ps) {
    if (b.startsWith('/')) path = b;
    else if (!path || path.endsWith('/')) path += b;
    else path += '/' + b;
  }
  return path;
}

// ── fnmatch._translate / glob.translate → JS RegExp source ───
const RE_SPECIAL = /[\\^$.*+?()[\]{}|\/]/;
const reEsc = (c) => (RE_SPECIAL.test(c) ? '\\' + c : c);
const clsEsc = (c) => (/[\\\]\[\^-]/.test(c) ? '\\' + c : c);

// fnmatch._translate(pat, STAR, QUESTION_MARK) → array of JS regex pieces
function fnTranslate(pat, STAR, QM) {
  const res = [];
  const chars = [...pat];
  const n = chars.length;
  let i = 0;
  while (i < n) {
    const c = chars[i];
    i += 1;
    if (c === '*') {
      if (res.length === 0 || res[res.length - 1] !== STAR) res.push(STAR);
    } else if (c === '?') {
      res.push(QM);
    } else if (c === '[') {
      let j = i;
      if (j < n && chars[j] === '!') j += 1;
      if (j < n && chars[j] === ']') j += 1;
      while (j < n && chars[j] !== ']') j += 1;
      if (j >= n) {
        res.push('\\[');
      } else {
        let chunks;
        const raw = chars.slice(i, j);
        if (!raw.includes('-')) {
          chunks = [raw];
        } else {
          chunks = [];
          let k = chars[i] === '!' ? i + 2 : i + 1;
          for (;;) {
            let f = -1;
            for (let q = k; q < j; q += 1) if (chars[q] === '-') { f = q; break; }
            k = f;
            if (k < 0) break;
            chunks.push(chars.slice(i, k));
            i = k + 1;
            k += 3;
          }
          const chunk = chars.slice(i, j);
          if (chunk.length) chunks.push(chunk);
          else chunks[chunks.length - 1] = [...chunks[chunks.length - 1], '-'];
          for (let q = chunks.length - 1; q > 0; q -= 1) {
            const a = chunks[q - 1];
            const b = chunks[q];
            if (a[a.length - 1].codePointAt(0) > b[0].codePointAt(0)) {
              chunks[q - 1] = [...a.slice(0, -1), ...b.slice(1)];
              chunks.splice(q, 1);
            }
          }
        }
        i = j + 1;
        const flat = chunks.flat();
        if (flat.length === 0) {
          res.push('(?!)');
        } else if (flat.length === 1 && flat[0] === '!' && chunks.length === 1) {
          res.push('[^]');
        } else {
          let neg = false;
          let first = chunks.map((ch) => ch.slice());
          if (first[0][0] === '!') {
            neg = true;
            first[0] = first[0].slice(1);
          }
          const body = first.map((ch) => ch.map(clsEsc).join('')).join('-');
          // a leading ']' after '!' is a literal; clsEsc escapes it
          res.push(neg ? `[^${body}]` : `[${body}]`);
        }
      }
    } else {
      res.push(reEsc(c));
    }
  }
  return res;
}

// glob.translate(pat, recursive=…, include_hidden=True, seps='/')
function globTranslate(pat, recursive) {
  const anySep = '\\/';
  const notSep = '[^\\/]';
  const oneLast = `${notSep}+`;
  const oneSeg = `${oneLast}${anySep}`;
  const anySegs = `(?:[^]+${anySep})?`;
  const anyLast = '[^]*';
  const results = [];
  const parts = pat.split('/');
  const last = parts.length - 1;
  parts.forEach((part, idx) => {
    if (part === '*') {
      results.push(idx < last ? oneSeg : oneLast);
    } else if (recursive && part === '**') {
      if (idx < last) {
        if (parts[idx + 1] !== '**') results.push(anySegs);
      } else {
        results.push(anyLast);
      }
    } else {
      if (part) results.push(...fnTranslate(part, `${notSep}*`, notSep));
      if (idx < last) results.push(anySep);
    }
  });
  return results.join('');
}

const compiled = new Map();
function compilePattern(pat, caseSensitive, recursive) {
  const key = `${caseSensitive}|${recursive}|${pat}`;
  if (!compiled.has(key)) {
    compiled.set(key, new RegExp(`^(?:${globTranslate(pat, recursive)})$`, caseSensitive ? 'u' : 'iu'));
  }
  return compiled.get(key);
}

// ── PurePosixPath ────────────────────────────────────────────
function argToStr(a) {
  if (a instanceof PurePosixPath) return a;
  if (typeof a === 'string') return a;
  const t = a === null ? 'NoneType' : typeof a === 'number' ? (Number.isInteger(a) ? 'int' : 'float') : typeof a === 'boolean' ? 'bool' : Array.isArray(a) ? 'list' : 'object';
  throw err('TypeError', `argument should be a str or an os.PathLike object where __fspath__ returns a str, not ${pyStrRepr(t)}`);
}

export class PurePosixPath {
  // cls: the Python class name shown by repr (PurePosixPath / PosixPath)
  constructor(args = [], cls = 'PurePosixPath', vfs = null) {
    this.cls = cls;
    this.vfs = vfs;
    const raw = [];
    for (const a of args) {
      const v = argToStr(a);
      if (v instanceof PurePosixPath) raw.push(...v.rawPaths);
      else raw.push(v);
    }
    this.rawPaths = raw;
    const rawPath = raw.length === 0 ? '' : raw.length === 1 ? raw[0] : posixJoin(...raw);
    [this.drive, this.root, this.tail] = PurePosixPath.parse(rawPath);
  }

  static parse(path) {
    if (!path) return ['', '', []];
    const [drv, root, rel] = splitroot(path);
    return [drv, root, rel.split('/').filter((x) => x && x !== '.')];
  }

  withSegments(...segs) {
    return new PurePosixPath(segs, this.cls, this.vfs);
  }

  fromParts(drv, root, tail) {
    const p = new PurePosixPath([], this.cls, this.vfs);
    p.drive = drv;
    p.root = root;
    p.tail = tail;
    p.rawPaths = [p.str];
    return p;
  }

  get str() {
    return (this.drive || this.root ? this.drive + this.root + this.tail.join('/') : this.tail.join('/')) || '.';
  }
  toString() { return this.str; }
  asPosix() { return this.str; }
  get repr() { return `${this.cls}(${pyStrRepr(this.asPosix())})`; }
  get anchor() { return this.drive + this.root; }
  get parts() {
    return this.drive || this.root ? [this.drive + this.root, ...this.tail] : [...this.tail];
  }
  get parent() {
    if (this.tail.length === 0) return this;
    return this.fromParts(this.drive, this.root, this.tail.slice(0, -1));
  }
  // list of all parents (tuple(p.parents) / list(p.parents))
  get parents() {
    const out = [];
    for (let k = this.tail.length - 1; k >= 0; k -= 1) out.push(this.fromParts(this.drive, this.root, this.tail.slice(0, k)));
    return out;
  }
  // p.parents[idx] — negative indexes allowed since 3.10
  parentAt(idx) {
    const n = this.tail.length;
    if (idx >= n || idx < -n) throw err('IndexError', String(idx));
    if (idx < 0) idx += n;
    return this.fromParts(this.drive, this.root, this.tail.slice(0, this.tail.length - idx - 1));
  }
  get name() { return this.tail.length ? this.tail[this.tail.length - 1] : ''; }
  get suffix() {
    const name = this.name;
    const i = name.lastIndexOf('.');
    return i > 0 && i < name.length - 1 ? name.slice(i) : '';
  }
  get suffixes() {
    let name = this.name;
    if (name.endsWith('.')) return [];
    name = name.replace(/^\.+/, '');
    return name.split('.').slice(1).map((s) => '.' + s);
  }
  get stem() {
    const name = this.name;
    const i = name.lastIndexOf('.');
    return i > 0 && i < name.length - 1 ? name.slice(0, i) : name;
  }

  withName(name) {
    if (!name || name.includes('/') || name === '.') throw err('ValueError', `Invalid name ${pyStrRepr(name)}`);
    if (this.tail.length === 0) throw err('ValueError', `${this.repr} has an empty name`);
    const tail = this.tail.slice();
    tail[tail.length - 1] = name;
    return this.fromParts(this.drive, this.root, tail);
  }
  withStem(stem) {
    const suffix = this.suffix;
    if (!suffix) return this.withName(stem);
    if (!stem) throw err('ValueError', `${this.repr} has a non-empty suffix`);
    return this.withName(stem + suffix);
  }
  withSuffix(suffix) {
    const stem = this.stem;
    if (!stem) throw err('ValueError', `${this.repr} has an empty name`);
    if (suffix && !(suffix.startsWith('.') && suffix.length > 1)) throw err('ValueError', `Invalid suffix ${pyStrRepr(suffix)}`);
    return this.withName(stem + suffix);
  }

  joinpath(...segs) { return this.withSegments(this, ...segs); }
  div(key) { return this.withSegments(this, key); }
  rdiv(key) { return this.withSegments(key, this); }

  equals(o) { return o instanceof PurePosixPath && this.str === o.str; }
  // PurePath.__lt__: compares str(path).split('/')
  lessThan(o) {
    const a = this.str.split('/');
    const b = o.str.split('/');
    for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
      if (a[i] !== b[i]) return cmpStr(a[i], b[i]) < 0;
    }
    return a.length < b.length;
  }

  relativeTo(other, { walkUp = false } = {}) {
    if (!(other instanceof PurePosixPath)) other = this.withSegments(other);
    const chain = [other, ...other.parents];
    const mine = this.parents;
    let step = 0;
    let path = null;
    for (; step < chain.length; step += 1) {
      path = chain[step];
      if (path.equals(this) || mine.some((q) => q.equals(path))) break;
      if (!walkUp) throw err('ValueError', `${pyStrRepr(this.str)} is not in the subpath of ${pyStrRepr(other.str)}`);
      if (path.name === '..') throw err('ValueError', `'..' segment in ${pyStrRepr(other.str)} cannot be walked`);
    }
    if (step === chain.length) throw err('ValueError', `${pyStrRepr(this.str)} and ${pyStrRepr(other.str)} have different anchors`);
    const parts = [...Array(step).fill('..'), ...this.tail.slice(path.tail.length)];
    return this.fromParts('', '', parts);
  }
  isRelativeTo(other) {
    if (!(other instanceof PurePosixPath)) other = this.withSegments(other);
    return other.equals(this) || this.parents.some((q) => q.equals(other));
  }
  isAbsolute() { return this.rawPaths.some((p) => p.startsWith('/')); }
  isReserved() { return false; }

  asUri() {
    if (!this.isAbsolute()) throw err('ValueError', "relative path can't be expressed as a file URI");
    return 'file://' + quoteFromBytes(this.str);
  }

  // PurePathBase.match: relative patterns match from the right
  match(pattern, { caseSensitive = true } = {}) {
    const pat = pattern instanceof PurePosixPath ? pattern : this.withSegments(pattern);
    const pathParts = this.parts.reverse();
    const patParts = pat.parts.reverse();
    if (patParts.length === 0) throw err('ValueError', 'empty pattern');
    if (pathParts.length < patParts.length) return false;
    if (pathParts.length > patParts.length && pat.anchor) return false;
    for (let i = 0; i < patParts.length; i += 1) {
      if (!compilePattern(patParts[i], caseSensitive, false).test(pathParts[i])) return false;
    }
    return true;
  }
  // full_match (3.13): the whole path against a glob with '**'
  fullMatch(pattern, { caseSensitive = true } = {}) {
    const pat = pattern instanceof PurePosixPath ? pattern : this.withSegments(pattern);
    const patStr = pat.str === '.' ? '' : pat.str;
    const me = this.str === '.' ? '' : this.str;
    return compilePattern(patStr, caseSensitive, true).test(me);
  }

  // ── concrete (VFS) side ────────────────────────────────────
  get fs() {
    if (!this.vfs) throw err('AttributeError', `${pyStrRepr(this.cls)} object has no attribute for I/O`);
    return this.vfs;
  }
  exists() { return this.fs.lookup(this.str, true) !== null; }
  isFile() { const n = this.fs.lookup(this.str, true); return n !== null && n.type === 'file'; }
  isDir() { const n = this.fs.lookup(this.str, true); return n !== null && n.type === 'dir'; }
  isSymlink() { return false; }
  writeText(data) {
    if (typeof data !== 'string') throw err('TypeError', `data must be str, not ${pyTypeName(data)}`);
    this.fs.writeFile(this.str, data, 'text');
    return [...data].length;
  }
  writeBytes(data) {
    this.fs.writeFile(this.str, data, 'bytes');
    return [...data].length;
  }
  // text mode, newline=None: universal newlines on read
  readText() { return this.fs.readFile(this.str).content.replace(/\r\n?/g, '\n'); }
  touch({ existOk = true } = {}) { this.fs.touch(this.str, existOk); }
  mkdir({ parents = false, existOk = false } = {}) {
    try {
      this.fs.mkdir(this.str);
    } catch (e) {
      if (e.name === 'FileNotFoundError') {
        if (!parents || this.parent.equals(this)) throw e;
        this.parent.mkdir({ parents: true, existOk: true });
        this.mkdir({ parents: false, existOk });
        return;
      }
      if (!existOk || !this.isDir()) throw e;
    }
  }
  rmdir() { this.fs.rmdir(this.str); }
  unlink({ missingOk = false } = {}) {
    try {
      this.fs.unlink(this.str);
    } catch (e) {
      if (!(missingOk && e.name === 'FileNotFoundError')) throw e;
    }
  }
  rename(target) {
    const t = target instanceof PurePosixPath ? target : this.withSegments(target);
    this.fs.rename(this.str, t.str, false);
    return this.withSegments(target);
  }
  replace(target) {
    const t = target instanceof PurePosixPath ? target : this.withSegments(target);
    this.fs.rename(this.str, t.str, true);
    return this.withSegments(target);
  }
  size() { return this.fs.stat(this.str).size; }

  // Path.iterdir: entry.path of os.scandir(str(self)); './' dropped for '.'
  iterdir() {
    const root = this.str;
    const names = this.fs.listdir(root);
    return names.map((n) => this.fromString(root === '.' ? n : addSlash(root) + n));
  }
  fromString(s) {
    const p = this.withSegments(s);
    return p;
  }

  // Path.glob — port of Path.glob + glob._Globber selectors over the VFS
  glob(pattern, { caseSensitive = true } = {}) {
    const pat = pattern instanceof PurePosixPath ? pattern : this.withSegments(pattern);
    if (pat.anchor) throw err('NotImplementedError', 'Non-relative patterns are unsupported');
    const parts = pat.tail.slice();
    if (parts.length === 0) throw err('ValueError', `Unacceptable pattern: ${pat.repr}`);
    const raw = pat.rawPaths.length === 1 ? pat.rawPaths[0] : posixJoin(...pat.rawPaths);
    if (raw[raw.length - 1] === '/') parts.push('');
    const g = new Globber(this.fs, caseSensitive);
    const select = g.selector(parts.slice().reverse());
    const root = this.str;
    let paths = [...select(root, false)];
    if (root === '.') paths = paths.map((s) => s.slice(2));
    if (parts[parts.length - 1] === '') paths = paths.map((s) => s.slice(0, -1));
    else if (parts[parts.length - 1] === '**') {
      const al = this.anchor.length;
      paths = paths.map((s) => (s.length > al && s[s.length - 1] === '/' ? s.slice(0, -1) : s));
    }
    return paths.map((s) => this.fromString(s));
  }
  rglob(pattern, opts) {
    const pat = pattern instanceof PurePosixPath ? pattern : this.withSegments(pattern);
    return this.glob(this.withSegments('**', pat), opts);
  }
  // Path.walk (top-down): [dirpath, dirnames, filenames] triples
  walk() {
    const out = [];
    const rootStr = this.str;
    const visit = (dirStr) => {
      let names;
      try {
        names = this.fs.listdir(dirStr);
      } catch (e) {
        return;
      }
      const dirs = [];
      const files = [];
      for (const n of names) {
        const child = dirStr === '.' ? `./${n}` : addSlash(dirStr) + n;
        (this.fs.lookup(child, false).type === 'dir' ? dirs : files).push(n);
      }
      const shown = rootStr === '.' ? dirStr.slice(2) : dirStr;
      out.push([this.fromString(shown), dirs, files]);
      for (const d of dirs) visit(dirStr === '.' ? `./${d}` : addSlash(dirStr) + d);
    };
    visit(rootStr);
    return out;
  }
}

function addSlash(p) {
  return !p || p[p.length - 1] === '/' ? p : p + '/';
}

// Python str ordering: by code point
function cmpStr(a, b) {
  const x = [...a];
  const y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i += 1) {
    const d = x[i].codePointAt(0) - y[i].codePointAt(0);
    if (d) return d;
  }
  return x.length - y.length;
}
export const sortPy = (arr, key = (x) => x) => arr.slice().sort((a, b) => cmpStr(key(a), key(b)));

function pyTypeName(v) {
  if (v === null || v === undefined) return 'NoneType';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  if (typeof v === 'boolean') return 'bool';
  if (Array.isArray(v)) return 'list';
  return typeof v === 'string' ? 'str' : 'object';
}

// urllib.parse.quote_from_bytes(os.fsencode(path)) with safe='/'
function quoteFromBytes(s) {
  const bytes = new TextEncoder().encode(s);
  let out = '';
  for (const b of bytes) {
    const c = String.fromCharCode(b);
    if (b < 128 && /[A-Za-z0-9_.\-~\/]/.test(c)) out += c;
    else out += '%' + b.toString(16).toUpperCase().padStart(2, '0');
  }
  return out;
}

// ── glob._Globber selectors (string paths, VFS scandir) ──────
const MAGIC = /[*?[]/;
const SPECIAL = ['', '.', '..'];
class Globber {
  constructor(fs, caseSensitive) {
    this.fs = fs;
    this.caseSensitive = caseSensitive;
  }
  compile(pat) { return compilePattern(pat, this.caseSensitive, true); }
  scandir(path) {
    // os.scandir('') is FileNotFoundError; the selectors swallow OSError
    const names = this.fs.listdir(path === '' ? '.' : path);
    return names.map((n) => {
      const p = path === '' ? n : addSlash(path) + n; // entry.path = join(path, name)
      return { name: n, path: p, isDir: () => { const nd = this.fs.lookup(p, true); return nd !== null && nd.type === 'dir'; } };
    });
  }
  selector(parts) {
    if (parts.length === 0) return (path, exists) => this.selectExists(path, exists);
    const part = parts.pop();
    if (part === '**') return this.recursiveSelector(part, parts);
    if (SPECIAL.includes(part)) return this.specialSelector(part, parts);
    if (!MAGIC.test(part)) return this.literalSelector(part, parts);
    return this.wildcardSelector(part, parts);
  }
  specialSelector(part, parts) {
    const next = this.selector(parts);
    return (path, exists) => next(addSlash(path) + part, exists);
  }
  literalSelector(part, parts) {
    while (parts.length && !MAGIC.test(parts[parts.length - 1])) part += '/' + parts.pop();
    const next = this.selector(parts);
    return (path) => next(addSlash(path) + part, false);
  }
  wildcardSelector(part, parts) {
    const match = part === '*' ? null : this.compile(part);
    const dirOnly = parts.length > 0;
    const next = dirOnly ? this.selector(parts) : null;
    const self = this;
    return function* selectWildcard(path) {
      let entries;
      try { entries = self.scandir(path); } catch (e) { return; }
      for (const entry of entries) {
        if (match === null || match.test(entry.name)) {
          if (dirOnly) {
            if (!entry.isDir()) continue;
            yield* next(entry.path, true);
          } else {
            yield entry.path;
          }
        }
      }
    };
  }
  recursiveSelector(part, parts) {
    while (parts.length && parts[parts.length - 1] === '**') parts.pop();
    while (parts.length && !SPECIAL.includes(parts[parts.length - 1])) part += '/' + parts.pop();
    const match = part === '**' ? null : this.compile(part);
    const dirOnly = parts.length > 0;
    const next = this.selector(parts);
    const self = this;
    const test = (s, pos) => {
      // re.match(str, pos): anchored at pos, the pattern must consume the rest
      return match.test(s.slice(pos));
    };
    function* step(stack, pos) {
      const path = stack.pop();
      let entries;
      try { entries = self.scandir(path); } catch (e) { return; }
      for (const entry of entries) {
        const isDir = entry.isDir();
        if (isDir || !dirOnly) {
          if (match === null || test(entry.path, pos)) {
            if (dirOnly) yield* next(entry.path, true);
            else yield entry.path;
          }
          if (isDir) stack.push(entry.path);
        }
      }
    }
    return function* selectRecursive(path, exists) {
      path = addSlash(path);
      const pos = path.length;
      if (match === null || test(path, pos)) yield* next(path, exists);
      const stack = [path];
      while (stack.length) yield* step(stack, pos);
    };
  }
  *selectExists(path, exists) {
    if (exists) { yield path; return; }
    if (this.fs.lookup(path === '' ? '.' : path, false, true) !== null) yield path;
  }
}

// ── in-memory file system ────────────────────────────────────
// The demo's cwd is an empty directory /tmp/demo. Names are case-sensitive
// (Linux). Directory listing order is creation order (os.scandir order is
// arbitrary; the demos sort).
const osErr = (type, errno, text, a, b) => {
  const msg = `[Errno ${errno}] ${text}: ${pyStrRepr(a)}${b !== undefined ? ` -> ${pyStrRepr(b)}` : ''}`;
  return err(type, msg);
};
const ENOENT = (a, b) => osErr('FileNotFoundError', 2, 'No such file or directory', a, b);
const EEXIST = (a, b) => osErr('FileExistsError', 17, 'File exists', a, b);
const ENOTDIR = (a, b) => osErr('NotADirectoryError', 20, 'Not a directory', a, b);
const EISDIR = (a, b) => osErr('IsADirectoryError', 21, 'Is a directory', a, b);
const ENOTEMPTY = (a, b) => osErr('OSError', 39, 'Directory not empty', a, b);
const EINVAL = (a, b) => osErr('OSError', 22, 'Invalid argument', a, b);

export class VFS {
  constructor() {
    this.root = { type: 'dir', children: new Map() };
    const tmp = this.mkNode(this.root, 'tmp');
    this.cwd = this.mkNode(tmp, 'demo');
  }
  mkNode(parent, name) {
    const n = { type: 'dir', children: new Map(), parent };
    parent.children.set(name, n);
    return n;
  }
  // walk the components of p; returns { node, parent, name } — node null
  // when the last component is missing. Throws ENOENT / ENOTDIR for a
  // missing or non-directory intermediate component.
  resolve(p, errPath = p) {
    let node = p.startsWith('/') ? this.root : this.cwd;
    const comps = p.split('/');
    const trailingSlash = p.length > 1 && p.endsWith('/');
    const names = comps.filter((c) => c !== '');
    if (names.length === 0) return { node, parent: node.parent || node, name: '.', trailingSlash };
    for (let i = 0; i < names.length - 1; i += 1) {
      const c = names[i];
      if (node.type !== 'dir') throw ENOTDIR(errPath);
      if (c === '.') continue;
      if (c === '..') { node = node.parent || node; continue; }
      const nx = node.children.get(c);
      if (!nx) throw ENOENT(errPath);
      node = nx;
    }
    if (node.type !== 'dir') throw ENOTDIR(errPath);
    const last = names[names.length - 1];
    if (last === '.') return { node, parent: node.parent || node, name: '.', trailingSlash, dot: true };
    if (last === '..') { const up = node.parent || node; return { node: up, parent: up.parent || up, name: '..', trailingSlash, dot: true }; }
    const found = node.children.get(last) || null;
    if (found && trailingSlash && found.type !== 'dir') throw ENOTDIR(errPath);
    return { node: found, parent: node, name: last, trailingSlash };
  }
  // node or null (stat-style: any OSError → null)
  lookup(p) {
    try {
      return this.resolve(p).node;
    } catch (e) {
      return null;
    }
  }
  writeFile(p, content, kind) {
    const r = this.resolve(p);
    if (r.node && r.node.type === 'dir') throw EISDIR(p);
    if (!r.node && r.trailingSlash) throw EISDIR(p);
    if (r.node) { r.node.content = content; r.node.kind = kind; return; }
    r.parent.children.set(r.name, { type: 'file', content, kind, parent: r.parent });
  }
  readFile(p) {
    const r = this.resolve(p);
    if (!r.node) throw ENOENT(p);
    if (r.node.type === 'dir') throw EISDIR(p);
    return r.node;
  }
  touch(p, existOk) {
    const r = this.resolve(p);
    if (r.node) {
      if (!existOk) throw EEXIST(p);
      return;
    }
    if (r.trailingSlash) throw EISDIR(p);
    r.parent.children.set(r.name, { type: 'file', content: '', kind: 'text', parent: r.parent });
  }
  mkdir(p) {
    const r = this.resolve(p);
    if (r.node) throw EEXIST(p);
    this.mkNode(r.parent, r.name);
  }
  rmdir(p) {
    const r = this.resolve(p);
    if (!r.node) throw ENOENT(p);
    if (r.node.type !== 'dir') throw ENOTDIR(p);
    if (r.dot) throw EINVAL(p);
    if (r.node.children.size) throw ENOTEMPTY(p);
    r.parent.children.delete(r.name);
  }
  unlink(p) {
    const r = this.resolve(p);
    if (!r.node) throw ENOENT(p);
    if (r.node.type === 'dir') throw EISDIR(p);
    r.parent.children.delete(r.name);
  }
  listdir(p) {
    const r = this.resolve(p);
    if (!r.node) throw ENOENT(p);
    if (r.node.type !== 'dir') throw ENOTDIR(p);
    return [...r.node.children.keys()];
  }
  stat(p) {
    const r = this.resolve(p);
    if (!r.node) throw ENOENT(p);
    if (r.node.type === 'dir') return { size: 4096, isDir: true };
    const c = r.node.content;
    const size = r.node.kind === 'bytes' ? c.length : new TextEncoder().encode(c).length;
    return { size, isDir: false };
  }
  // os.rename (POSIX: silently replaces a file) / os.replace
  rename(src, dst) {
    let rs;
    let rd;
    try { rs = this.resolve(src); } catch (e) { throw retarget(e, src, dst); }
    if (!rs.node) throw ENOENT(src, dst);
    try { rd = this.resolve(dst); } catch (e) { throw retarget(e, src, dst); }
    if (rd.node === rs.node) return;
    // moving a directory into itself
    for (let q = rd.parent; q; q = q.parent) if (q === rs.node) throw EINVAL(src, dst);
    if (rd.node) {
      if (rs.node.type === 'dir' && rd.node.type !== 'dir') throw ENOTDIR(src, dst);
      if (rs.node.type !== 'dir' && rd.node.type === 'dir') throw EISDIR(src, dst);
      if (rd.node.type === 'dir' && rd.node.children.size) throw ENOTEMPTY(src, dst);
    }
    rs.parent.children.delete(rs.name);
    rs.node.parent = rd.parent;
    rd.parent.children.set(rd.name, rs.node);
  }
}

function retarget(e, src, dst) {
  const m = /^\[Errno (\d+)\] ([^:]+):/.exec(e.message);
  return m ? osErr(e.name, Number(m[1]), m[2], src, dst) : e;
}

// ── helpers for the demo emulators ───────────────────────────
export const pure = (...args) => new PurePosixPath(args, 'PurePosixPath');
// Path(...) as a Linux reader sees it: a PosixPath on a fresh VFS
export function makePath(vfs) {
  return (...args) => new PurePosixPath(args, 'PosixPath', vfs);
}

// JS value → demo return value (paths → their repr)
export function py(v) {
  if (v instanceof PurePosixPath) return { __pyRaw: v.repr };
  if (Array.isArray(v)) return v.map(py);
  if (v && typeof v === 'object' && v.__pyTuple) return { __pyTuple: v.__pyTuple.map(py) };
  return v;
}
export const tuple = (...items) => ({ __pyTuple: items });

// for f in files: Path(f).parent.mkdir(parents=True, exist_ok=True); Path(f).touch()
export function seedFiles(Path, files) {
  for (const f of files) {
    Path(f).parent.mkdir({ parents: true, existOk: true });
    Path(f).touch();
  }
}
