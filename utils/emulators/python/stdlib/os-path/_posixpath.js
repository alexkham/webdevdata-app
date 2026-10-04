// utils/emulators/python/stdlib/os-path/_posixpath.js
//
// Port of CPython 3.13's Lib/posixpath.py (+ genericpath._splitext and
// genericpath.commonprefix) for the os.path demos — the pure string
// functions, str arguments only. Not a content page (leading underscore),
// so the catalog generator never maps it.
//
// The demos import posixpath explicitly so their output is the same on
// every OS (os.path IS posixpath on Linux and macOS, ntpath on Windows).
//
// Strings: the separators are ASCII, so searching/splitting UTF-16 strings
// gives the same result as on code points. Ordering (commonprefix,
// commonpath use min/max) is compared by code point, like Python.

import { PyException } from '../../../../py-exceptions.js';

const SEP = '/';

// Python str ordering: by code point (JS < compares UTF-16 code units)
export function cmpStr(a, b) {
  const A = [...a];
  const B = [...b];
  const n = Math.min(A.length, B.length);
  for (let i = 0; i < n; i += 1) {
    const x = A[i].codePointAt(0);
    const y = B[i].codePointAt(0);
    if (x !== y) return x < y ? -1 : 1;
  }
  return A.length === B.length ? 0 : A.length < B.length ? -1 : 1;
}

// list-of-str ordering (lexicographic, like Python list comparison)
function cmpList(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const c = cmpStr(a[i], b[i]);
    if (c) return c;
  }
  return a.length === b.length ? 0 : a.length < b.length ? -1 : 1;
}

const isAllSep = (s) => /^\/+$/.test(s);
const rstripSep = (s) => s.replace(/\/+$/, '');

export function normcase(s) {
  return s;
}

export function isabs(s) {
  return s.startsWith(SEP);
}

export function join(a, ...p) {
  let path = a;
  for (const b of p) {
    if (b.startsWith(SEP) || !path) path = b;
    else if (path.endsWith(SEP)) path += b;
    else path += SEP + b;
  }
  return path;
}

export function split(p) {
  const i = p.lastIndexOf(SEP) + 1;
  let head = p.slice(0, i);
  const tail = p.slice(i);
  if (head && !isAllSep(head)) head = rstripSep(head);
  return [head, tail];
}

// genericpath._splitext(p, '/', None, '.')
export function splitext(p) {
  const sepIndex = p.lastIndexOf(SEP);
  const dotIndex = p.lastIndexOf('.');
  if (dotIndex > sepIndex) {
    // skip all leading dots
    let filenameIndex = sepIndex + 1;
    while (filenameIndex < dotIndex) {
      if (p[filenameIndex] !== '.') return [p.slice(0, dotIndex), p.slice(dotIndex)];
      filenameIndex += 1;
    }
  }
  return [p, ''];
}

export function splitdrive(p) {
  return ['', p];
}

export function splitroot(p) {
  if (p.slice(0, 1) !== SEP) return ['', '', p];
  if (p.slice(1, 2) !== SEP || p.slice(2, 3) === SEP) return ['', SEP, p.slice(1)];
  // exactly two leading slashes: implementation-defined per POSIX, kept
  return ['', p.slice(0, 2), p.slice(2)];
}

export function basename(p) {
  return p.slice(p.lastIndexOf(SEP) + 1);
}

export function dirname(p) {
  return split(p)[0];
}

export function normpath(path) {
  if (!path) return '.';
  const [, initialSlashes, rest] = splitroot(path);
  const newComps = [];
  for (const comp of rest.split(SEP)) {
    if (!comp || comp === '.') continue;
    if (comp !== '..' || (!initialSlashes && newComps.length === 0) || (newComps.length && newComps[newComps.length - 1] === '..')) {
      newComps.push(comp);
    } else if (newComps.length) {
      newComps.pop();
    }
  }
  return initialSlashes + newComps.join(SEP) || '.';
}

// abspath with an explicit current directory (posixpath.abspath uses
// os.getcwd(); the demos pass the stand-in they show in the code)
export function abspath(path, cwd) {
  if (!path.startsWith(SEP)) path = join(cwd, path);
  return normpath(path);
}

// genericpath.commonprefix for a list of str (character-wise)
export function commonprefix(m) {
  if (m.length === 0) return '';
  let s1 = m[0];
  let s2 = m[0];
  for (const s of m) {
    if (cmpStr(s, s1) < 0) s1 = s;
    if (cmpStr(s, s2) > 0) s2 = s;
  }
  const a = [...s1];
  const b = [...s2];
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a.slice(0, i).join('');
  }
  return s1;
}

// commonprefix over lists of components (what relpath uses)
function commonprefixLists(m) {
  let s1 = m[0];
  let s2 = m[0];
  for (const s of m) {
    if (cmpList(s, s1) < 0) s1 = s;
    if (cmpList(s, s2) > 0) s2 = s;
  }
  for (let i = 0; i < s1.length; i += 1) {
    if (s1[i] !== s2[i]) return s1.slice(0, i);
  }
  return s1;
}

export function relpath(path, start = null, cwd = '/') {
  if (!path) throw new PyException('ValueError', 'no path specified');
  if (start === null) start = '.';
  const startTail = abspath(start, cwd).replace(/^\/+/, '');
  const pathTail = abspath(path, cwd).replace(/^\/+/, '');
  const startList = startTail ? startTail.split(SEP) : [];
  const pathList = pathTail ? pathTail.split(SEP) : [];
  const i = commonprefixLists([startList, pathList]).length;
  const rel = [...Array(startList.length - i).fill('..'), ...pathList.slice(i)];
  if (rel.length === 0) return '.';
  return rel.join(SEP);
}

export function commonpath(paths) {
  if (paths.length === 0) throw new PyException('ValueError', 'commonpath() arg is an empty sequence');
  const abs = new Set(paths.map((p) => p.startsWith(SEP)));
  if (abs.size !== 1) throw new PyException('ValueError', "Can't mix absolute and relative paths");
  const isAbs = [...abs][0];
  const splitPaths = paths.map((p) => p.split(SEP).filter((c) => c && c !== '.'));
  let s1 = splitPaths[0];
  let s2 = splitPaths[0];
  for (const s of splitPaths) {
    if (cmpList(s, s1) < 0) s1 = s;
    if (cmpList(s, s2) > 0) s2 = s;
  }
  let common = s1;
  for (let i = 0; i < s1.length; i += 1) {
    if (s1[i] !== s2[i]) {
      common = s1.slice(0, i);
      break;
    }
  }
  return (isAbs ? SEP : '') + common.join(SEP);
}

// Python values for the demo output
export const tuple = (...items) => ({ __pyTuple: items });
