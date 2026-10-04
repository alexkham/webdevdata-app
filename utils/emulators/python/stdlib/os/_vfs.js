// utils/emulators/python/stdlib/os/_vfs.js
//
// A small in-memory file system for the os / os.path demos. Every demo
// runs in a fresh, empty temp folder (its cwd) and creates the files it
// talks about itself; this models exactly that: a POSIX tree with the
// cwd at /tmp/demo, directories and regular files (no symlinks).
//
// The operations follow Linux semantics and Lib/os.py's pure-Python parts
// (makedirs, removedirs, renames, walk) — errors are raised as the Python
// exception the Linux kernel's errno maps to (FileNotFoundError,
// FileExistsError, NotADirectoryError, IsADirectoryError, OSError) with
// CPython's "[Errno N] text: 'path'" message. The demos themselves only
// display type(e).__name__, which is what Windows and Linux agree on for
// the cases they show.
//
// Not a content page (leading underscore): never mapped by the generator.

import { pyStrRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';
import { join as pjoin, split as psplit } from '../os-path/_posixpath.js';

const ERRNO = {
  ENOENT:    [2,  'No such file or directory', 'FileNotFoundError'],
  EEXIST:    [17, 'File exists', 'FileExistsError'],
  ENOTDIR:   [20, 'Not a directory', 'NotADirectoryError'],
  EISDIR:    [21, 'Is a directory', 'IsADirectoryError'],
  EBUSY:     [16, 'Device or resource busy', 'OSError'],
  EINVAL:    [22, 'Invalid argument', 'OSError'],
  ENOTEMPTY: [39, 'Directory not empty', 'OSError'],
};

export function osError(code, p, p2) {
  const [n, text, type] = ERRNO[code];
  const names = p2 === undefined ? `: ${pyStrRepr(p)}` : `: ${pyStrRepr(p)} -> ${pyStrRepr(p2)}`;
  const e = new PyException(type, `[Errno ${n}] ${text}${names}`);
  e.errnoCode = code;
  return e;
}

// FileExistsError is an OSError subclass etc. — what `except OSError` sees
export const isOSError = (e) => e instanceof PyException && ['OSError', 'FileNotFoundError', 'FileExistsError', 'NotADirectoryError', 'IsADirectoryError', 'PermissionError'].includes(e.name);

// Python str sort order (code points) for sorted(...)
export function pySorted(arr) {
  return [...arr].sort((a, b) => {
    const A = [...a];
    const B = [...b];
    for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
      const x = A[i].codePointAt(0);
      const y = B[i].codePointAt(0);
      if (x !== y) return x - y;
    }
    return A.length - B.length;
  });
}

export class VFS {
  constructor() {
    this.root = this.node('dir', null);
    const tmp = this.addChild(this.root, 'tmp', this.node('dir'));
    this.cwd = this.addChild(tmp, 'demo', this.node('dir'));
    this.clock = 0;
  }

  node(type) {
    return type === 'dir'
      ? { type, children: new Map(), parent: null, mtime: 0, atime: 0 }
      : { type, size: 0, parent: null, mtime: 0, atime: 0 };
  }

  addChild(dir, name, n) {
    n.parent = dir;
    dir.children.set(name, n);
    return n;
  }

  // Resolve the parent directory of p's last component (Linux lookup).
  // Returns { dir, name, slash } — name '' for '/', '.' / '..' kept as-is.
  locate(p, errP = p) {
    if (p === '') throw osError('ENOENT', errP);
    let dir = p.startsWith('/') ? this.root : this.cwd;
    const slash = /[^/]\/+$/.test(p);
    const comps = p.split('/').filter((c) => c !== '');
    if (comps.length === 0) return { dir: this.root, name: '.', slash: false };
    for (const c of comps.slice(0, -1)) {
      if (c === '.') continue;
      if (c === '..') { dir = dir.parent || dir; continue; }
      const nx = dir.children.get(c);
      if (!nx) throw osError('ENOENT', errP);
      if (nx.type !== 'dir') throw osError('ENOTDIR', errP);
      dir = nx;
    }
    return { dir, name: comps[comps.length - 1], slash };
  }

  // the node at p, or throws (ENOENT / ENOTDIR)
  get(p, errP = p) {
    const { dir, name, slash } = this.locate(p, errP);
    let n;
    if (name === '.') n = dir;
    else if (name === '..') n = dir.parent || dir;
    else n = dir.children.get(name);
    if (!n) throw osError('ENOENT', errP);
    if (slash && n.type !== 'dir') throw osError('ENOTDIR', errP);
    return n;
  }

  tryGet(p) {
    try {
      return this.get(p);
    } catch (e) {
      return null;
    }
  }

  exists(p) { return this.tryGet(p) !== null; }
  isdir(p) { const n = this.tryGet(p); return n !== null && n.type === 'dir'; }
  isfile(p) { const n = this.tryGet(p); return n !== null && n.type === 'file'; }

  tick() {
    this.clock += 1;
    return this.clock;
  }

  // open(p, 'w' / 'wb'), write `size` bytes (text: `content`) and close
  writeFile(p, size = 0, content = '') {
    const { dir, name, slash } = this.locate(p);
    const existing = name === '.' || name === '..' ? dir : dir.children.get(name);
    if (existing && existing.type === 'dir') throw osError('EISDIR', p);
    if (slash) throw osError('EISDIR', p);
    const t = this.tick();
    if (existing) {
      existing.size = size;
      existing.content = content;
      existing.mtime = t;
      return existing;
    }
    const f = this.addChild(dir, name, this.node('file'));
    f.size = size;
    f.content = content;
    f.mtime = t;
    f.atime = t;
    return f;
  }

  mkdir(p) {
    const { dir, name } = this.locate(p);
    if (name === '.' || name === '..' || dir.children.has(name)) throw osError('EEXIST', p);
    this.addChild(dir, name, this.node('dir'));
  }

  // Lib/os.py makedirs
  makedirs(name, existOk = false) {
    let [head, tail] = psplit(name);
    if (!tail) [head, tail] = psplit(head);
    if (head && tail && !this.exists(head)) {
      try {
        this.makedirs(head, existOk);
      } catch (e) {
        if (!(e instanceof PyException && e.name === 'FileExistsError')) throw e;
      }
      if (tail === '.') return;
    }
    try {
      this.mkdir(name);
    } catch (e) {
      if (!isOSError(e)) throw e;
      if (!existOk || !this.isdir(name)) throw e;
    }
  }

  rmdir(p) {
    const n = this.get(p);
    const { name } = this.locate(p);
    if (n.type !== 'dir') throw osError('ENOTDIR', p);
    if (name === '.') throw osError('EINVAL', p);
    if (n.children.size || name === '..' || n === this.root) throw osError('ENOTEMPTY', p);
    n.parent.children.delete([...n.parent.children].find(([, v]) => v === n)[0]);
  }

  // Lib/os.py removedirs
  removedirs(name) {
    this.rmdir(name);
    let [head, tail] = psplit(name);
    if (!tail) [head, tail] = psplit(head);
    while (head && tail) {
      try {
        this.rmdir(head);
      } catch (e) {
        if (isOSError(e)) break;
        throw e;
      }
      [head, tail] = psplit(head);
    }
  }

  remove(p) {
    const { slash } = this.locate(p);
    const n = this.get(p);
    if (n.type === 'dir') throw osError(slash ? 'EISDIR' : 'EISDIR', p);
    n.parent.children.delete([...n.parent.children].find(([, v]) => v === n)[0]);
  }

  // rename(2) on Linux: replaces an existing file / empty directory
  // (kernel order: both parent lookups, then '.'/'..' as a last component
  // is EBUSY, then the source must exist, then the type checks)
  rename(src, dst) {
    const both = (fn) => {
      try {
        return fn();
      } catch (e) {
        if (e.errnoCode) throw osError(e.errnoCode, src, dst);
        throw e;
      }
    };
    const srcLoc = both(() => this.locate(src));
    const dl = both(() => this.locate(dst));
    const special = (n) => n === '.' || n === '..';
    if (special(srcLoc.name) || special(dl.name)) throw osError('EBUSY', src, dst);
    const s = srcLoc.dir.children.get(srcLoc.name);
    if (!s) throw osError('ENOENT', src, dst);
    if ((srcLoc.slash || dl.slash) && s.type !== 'dir') throw osError('ENOTDIR', src, dst);
    const d = dl.dir.children.get(dl.name) || null;
    if (s.type === 'dir') {
      // moving a folder inside itself
      for (let x = dl.dir; x; x = x.parent) if (x === s) throw osError('EINVAL', src, dst);
    }
    // the target is an ancestor of the source
    if (d) for (let x = srcLoc.dir; x; x = x.parent) if (x === d) throw osError('ENOTEMPTY', src, dst);
    if (d === s) return;
    if (d) {
      if (s.type === 'file' && d.type === 'dir') throw osError('EISDIR', src, dst);
      if (s.type === 'dir' && d.type !== 'dir') throw osError('ENOTDIR', src, dst);
      if (d.type === 'dir' && d.children.size) throw osError('ENOTEMPTY', src, dst);
    }
    s.parent.children.delete([...s.parent.children].find(([, v]) => v === s)[0]);
    dl.dir.children.delete(dl.name);
    this.addChild(dl.dir, dl.name, s);
  }

  // Lib/os.py renames
  renames(old, nw) {
    let [head, tail] = psplit(nw);
    if (head && tail && !this.exists(head)) this.makedirs(head);
    this.rename(old, nw);
    [head, tail] = psplit(old);
    if (head && tail) {
      try {
        this.removedirs(head);
      } catch (e) {
        if (!isOSError(e)) throw e;
      }
    }
  }

  listdir(p = '.') {
    const n = this.get(p);
    if (n.type !== 'dir') throw osError('ENOTDIR', p);
    return [...n.children.keys()];
  }

  // os.scandir entries: { name, path, isDir, isFile }
  scandir(p = '.') {
    const n = this.get(p);
    if (n.type !== 'dir') throw osError('ENOTDIR', p);
    return [...n.children].map(([name, c]) => ({
      name,
      path: pjoin(p, name),
      isDir: c.type === 'dir',
      isFile: c.type === 'file',
    }));
  }

  // os.walk(top, topdown): yields [root, dirs, files]; with topdown the
  // caller may mutate dirs (sort / prune) before the walk descends —
  // exactly like Lib/os.py, which visits the dirs list after the yield.
  * walk(top, topdown = true) {
    let entries;
    try {
      entries = this.scandir(top);
    } catch (e) {
      if (isOSError(e)) return; // onerror=None: errors are ignored
      throw e;
    }
    const dirs = entries.filter((e) => e.isDir).map((e) => e.name);
    const files = entries.filter((e) => !e.isDir).map((e) => e.name);
    if (topdown) {
      yield [top, dirs, files];
      for (const d of [...dirs]) yield* this.walk(pjoin(top, d), true);
    } else {
      for (const d of dirs) yield* this.walk(pjoin(top, d), false);
      yield [top, dirs, files];
    }
  }

  stat(p) {
    return this.get(p);
  }

  // open(p).read() for a file written with writeFile
  readText(p) {
    const n = this.get(p);
    if (n.type === 'dir') throw osError('EISDIR', p);
    n.atime = this.tick();
    return n.content;
  }

  utime(p, atime, mtime) {
    const n = this.get(p);
    n.atime = atime;
    n.mtime = mtime;
  }
}

// The lines every demo template starts with:
//   for f in files:
//       os.makedirs(os.path.dirname(f) or '.', exist_ok=True)
//       open(f, 'w').close()
// (os.path.dirname is ntpath.dirname on Windows; for the '/'-separated
// names the demos use it gives the same folder.)
export function seed(vfs, files) {
  for (const f of files) {
    vfs.makedirs(psplit(f)[0] || '.', true);
    vfs.writeFile(f, 0);
  }
}
