// utils/emulators/python/stdlib/glob/_pyglob.js
//
// Port of CPython 3.13's Lib/glob.py for the glob demos, shared by the
// glob hub and member emulators. Not a content page (leading underscore):
// never mapped by the generator.
//
//   glob / iglob / _iglob / _glob0 / _glob1 / _glob2 / _rlistdir /
//   _iterdir / escape / has_magic — line by line, running on the os
//   module's virtual file system (../os/_vfs.js: a POSIX tree with the
//   cwd at /tmp/demo, like the empty temp folder every demo snippet runs
//   in). Directory order is the VFS creation order; the demos sort.
//
//   translate — line by line; the regex text is exactly CPython 3.13's,
//   and matching runs that text through the small regex engine in
//   ../fnmatch/_pyfnmatch.js.
//
// The demos emulate Linux: os.path is posixpath (separator '/', no
// altsep), fnmatch's normcase is the identity, so matching is
// case-sensitive. dir_fd needs real file descriptors: not emulated.
// Absolute paths and '..' would reach outside the demo's temp folder
// (machine-dependent in real Python): they stop with a DemoLimit.

import { VFS, seed, isOSError, pySorted } from '../os/_vfs.js';
import { join as pjoin, split as psplit } from '../os-path/_posixpath.js';
import { _translate, reEscape, filter as fnFilter, reMatches } from '../fnmatch/_pyfnmatch.js';

export { VFS, seed, pySorted, reMatches };

function demoLimit(msg) {
  const e = new Error(msg);
  e.name = 'DemoLimit';
  throw e;
}

function checkInside(p, what) {
  if (typeof p !== 'string') demoLimit(`The demo takes ${what} as a str.`);
  if (p.startsWith('/')) demoLimit(`An absolute ${what} depends on where the snippet runs; the demo works inside its own temp folder.`);
  if (p.split('/').includes('..')) demoLimit(`'..' in the ${what} leaves the snippet's temp folder, which differs on every machine.`);
}

const MAGIC = /[*?[]/;
export const hasMagic = (s) => MAGIC.test(s);
const isHidden = (path) => path[0] === '.';
const isRecursive = (pattern) => pattern === '**';

function joinRel(dirname, basename) {
  // It is common if dirname or basename is empty
  if (!dirname || !basename) return dirname || basename;
  return pjoin(dirname, basename);
}

function lexists(fs, pathname) {
  return fs.exists(pathname);
}

function isdir(fs, pathname) {
  return fs.isdir(pathname);
}

// If dironly is false, yields all file names inside a directory.
// If dironly is true, yields only directory names.
function iterdir(fs, dirname, dironly) {
  const arg = dirname || '.';
  let entries;
  try {
    entries = fs.scandir(arg);
  } catch (e) {
    if (isOSError(e)) return [];
    throw e;
  }
  return entries.filter((en) => !dironly || en.isDir).map((en) => en.name);
}

function glob1(fs, dirname, pattern, dironly, includeHidden) {
  let names = iterdir(fs, dirname, dironly);
  if (!(includeHidden || isHidden(pattern))) names = names.filter((x) => !isHidden(x));
  return fnFilter(names, pattern);
}

function glob0(fs, dirname, basename) {
  if (basename) {
    if (lexists(fs, joinRel(dirname, basename))) return [basename];
  } else if (isdir(fs, dirname)) {
    // 'q*x/' should match only directories.
    return [basename];
  }
  return [];
}

function* rlistdir(fs, dirname, dironly, includeHidden) {
  const names = iterdir(fs, dirname, dironly);
  for (const x of names) {
    if (includeHidden || !isHidden(x)) {
      yield x;
      const path = dirname ? joinRel(dirname, x) : x;
      for (const y of rlistdir(fs, path, dironly, includeHidden)) yield joinRel(x, y);
    }
  }
}

function* glob2(fs, dirname, pattern, dironly, includeHidden) {
  if (!dirname || isdir(fs, dirname)) yield '';
  yield* rlistdir(fs, dirname, dironly, includeHidden);
}

function* iglobInner(fs, pathname, rootDir, recursive, dironly, includeHidden) {
  const [dirname, basename] = psplit(pathname);
  if (!hasMagic(pathname)) {
    if (basename) {
      if (lexists(fs, joinRel(rootDir, pathname))) yield pathname;
    } else if (isdir(fs, joinRel(rootDir, dirname))) {
      // Patterns ending with a slash should match only directories
      yield pathname;
    }
    return;
  }
  if (!dirname) {
    if (recursive && isRecursive(basename)) yield* glob2(fs, rootDir, basename, dironly, includeHidden);
    else yield* glob1(fs, rootDir, basename, dironly, includeHidden);
    return;
  }
  let dirs;
  if (dirname !== pathname && hasMagic(dirname)) dirs = iglobInner(fs, dirname, rootDir, recursive, true, includeHidden);
  else dirs = [dirname];
  let globInDir;
  if (hasMagic(basename)) {
    globInDir = recursive && isRecursive(basename)
      ? (d) => glob2(fs, d, basename, dironly, includeHidden)
      : (d) => glob1(fs, d, basename, dironly, includeHidden);
  } else globInDir = (d) => glob0(fs, d, basename);
  for (const d of dirs) {
    for (const name of globInDir(joinRel(rootDir, d))) yield pjoin(d, name);
  }
}

// glob.iglob(pathname, *, root_dir=None, dir_fd=None, recursive=False,
// include_hidden=False) — a generator over the VFS
export function* iglob(fs, pathname, { rootDir = null, recursive = false, includeHidden = false } = {}) {
  checkInside(pathname, 'pattern');
  if (rootDir !== null) checkInside(rootDir, 'root_dir');
  const root = rootDir === null ? '' : rootDir;
  const it = iglobInner(fs, pathname, root, !!recursive, false, !!includeHidden);
  if (!pathname || (recursive && isRecursive(pathname.slice(0, 2)))) {
    const first = it.next();
    if (first.done) return;
    if (first.value) yield first.value; // skip empty string
  }
  yield* it;
}

export function glob(fs, pathname, opts = {}) {
  return [...iglob(fs, pathname, opts)];
}

// glob.escape: wrap every * ? [ in brackets (no drive on POSIX)
export function escape(pathname) {
  if (typeof pathname !== 'string') demoLimit('The demo takes the path as a str.');
  return pathname.replace(/([*?[])/g, '[$1]');
}

// glob.translate(pat, *, recursive=False, include_hidden=False, seps=None)
// (seps as a str of separator characters; empty/None → os.sep, '/')
export function translate(pat, { recursive = false, includeHidden = false, seps = null } = {}) {
  if (typeof pat !== 'string') demoLimit('The demo takes the pattern as a str.');
  if (seps !== null && typeof seps !== 'string') demoLimit('The demo takes seps as a str of separator characters.');
  if (!seps) seps = '/'; // Linux: os.path.sep, no altsep
  const sepList = Array.from(seps);
  const escapedSeps = sepList.map(reEscape).join('');
  const anySep = sepList.length > 1 ? `[${escapedSeps}]` : escapedSeps;
  const notSep = `[^${escapedSeps}]`;
  let oneLastSegment;
  let oneSegment;
  let anySegments;
  let anyLastSegments;
  if (includeHidden) {
    oneLastSegment = `${notSep}+`;
    oneSegment = `${oneLastSegment}${anySep}`;
    anySegments = `(?:.+${anySep})?`;
    anyLastSegments = '.*';
  } else {
    oneLastSegment = `[^${escapedSeps}.]${notSep}*`;
    oneSegment = `${oneLastSegment}${anySep}`;
    anySegments = `(?:${oneSegment})*`;
    anyLastSegments = `${anySegments}(?:${oneLastSegment})?`;
  }
  const results = [];
  // re.split(any_sep, pat): any one of the separator characters
  const parts = [''];
  for (const c of pat) {
    if (sepList.includes(c)) parts.push('');
    else parts[parts.length - 1] += c;
  }
  const lastPartIdx = parts.length - 1;
  parts.forEach((part, idx) => {
    if (part === '*') {
      results.push(idx < lastPartIdx ? oneSegment : oneLastSegment);
    } else if (recursive && part === '**') {
      if (idx < lastPartIdx) {
        if (parts[idx + 1] !== '**') results.push(anySegments);
      } else results.push(anyLastSegments);
    } else {
      if (part) {
        if (!includeHidden && '*?'.includes(part[0])) results.push('(?!\\.)');
        results.push(..._translate(part, `${notSep}*`, notSep));
      }
      if (idx < lastPartIdx) results.push(anySep);
    }
  });
  return `(?s:${results.join('')})\\Z`;
}

// demo helper: a fresh VFS with the files the template creates
export function tree(files) {
  for (const f of files) checkInside(f, 'file name');
  const fs = new VFS();
  seed(fs, files);
  return fs;
}

// sorted(p.replace(os.sep, '/') for p in ...) — on POSIX the replace is a no-op
export const sortedPaths = (paths) => pySorted(paths);
