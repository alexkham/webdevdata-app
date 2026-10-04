// utils/emulators/python/stdlib/os-path/_ntpath.js
//
// The few ntpath functions the os.path demos show next to posixpath, ported
// from CPython 3.13's Lib/ntpath.py (str arguments): splitroot (the Python
// fallback, equal to the C version Windows uses), splitdrive and isabs.
// Slicing is by code point, like Python.

export function splitroot(p) {
  const cp = [...p];
  const normp = cp.map((c) => (c === '/' ? '\\' : c));
  const S = '\\';
  const sl = (a, b) => cp.slice(a, b).join('');
  const nsl = (a, b) => normp.slice(a, b).join('');
  const find = (sub, start) => {
    for (let i = start; i < normp.length; i += 1) if (normp[i] === sub) return i;
    return -1;
  };
  if (nsl(0, 1) === S) {
    if (nsl(1, 2) === S) {
      // UNC drives, e.g. \\server\share or \\?\UNC\server\share
      // Device drives, e.g. \\.\device or \\?\device
      const start = nsl(0, 8).toUpperCase() === '\\\\?\\UNC\\' ? 8 : 2;
      const index = find(S, start);
      if (index === -1) return [p, '', ''];
      const index2 = find(S, index + 1);
      if (index2 === -1) return [p, '', ''];
      return [sl(0, index2), sl(index2, index2 + 1), sl(index2 + 1)];
    }
    // relative path with root, e.g. \Windows
    return ['', sl(0, 1), sl(1)];
  }
  if (nsl(1, 2) === ':') {
    if (nsl(2, 3) === S) return [sl(0, 2), sl(2, 3), sl(3)]; // X:\Windows
    return [sl(0, 2), '', sl(2)]; // X:Windows
  }
  return ['', '', p];
}

export function splitdrive(p) {
  const [drive, root, tail] = splitroot(p);
  return [drive, root + tail];
}

const SEPS = '\\/';
const isSep = (c) => c === '\\' || c === '/';

export function join(path, ...paths) {
  let [resultDrive, resultRoot, resultPath] = splitroot(path);
  for (const p of paths) {
    const [pDrive, pRoot, pPath] = splitroot(p);
    if (pRoot) {
      // second path is absolute
      if (pDrive || !resultDrive) resultDrive = pDrive;
      resultRoot = pRoot;
      resultPath = pPath;
      continue;
    } else if (pDrive && pDrive !== resultDrive) {
      if (pDrive.toLowerCase() !== resultDrive.toLowerCase()) {
        // different drives: ignore the first path entirely
        resultDrive = pDrive;
        resultRoot = pRoot;
        resultPath = pPath;
        continue;
      }
      resultDrive = pDrive; // same drive in different case
    }
    if (resultPath && !SEPS.includes(resultPath[resultPath.length - 1])) resultPath += '\\';
    resultPath += pPath;
  }
  // add a separator between a UNC drive and a non-absolute path
  if (resultPath && !resultRoot && resultDrive && !':\\/'.includes(resultDrive[resultDrive.length - 1])) {
    return resultDrive + '\\' + resultPath;
  }
  return resultDrive + resultRoot + resultPath;
}

export function split(p) {
  const [d, r, rest] = splitroot(p);
  let i = rest.length;
  while (i && !isSep(rest[i - 1])) i -= 1;
  const head = rest.slice(0, i);
  const tail = rest.slice(i);
  return [d + r + head.replace(/[\\/]+$/, ''), tail];
}

export function normpath(path) {
  const [drive, root, rest] = splitroot(path.replace(/\//g, '\\'));
  const prefix = drive + root;
  const comps = rest.split('\\');
  let i = 0;
  while (i < comps.length) {
    if (!comps[i] || comps[i] === '.') comps.splice(i, 1);
    else if (comps[i] === '..') {
      if (i > 0 && comps[i - 1] !== '..') {
        comps.splice(i - 1, 2);
        i -= 1;
      } else if (i === 0 && root) comps.splice(i, 1);
      else i += 1;
    } else i += 1;
  }
  if (!prefix && comps.length === 0) comps.push('.');
  return prefix + comps.join('\\');
}

// 3.13: absolute = UNC/device path, or a drive with a root.
// (3.12 and earlier also counted a single leading slash as absolute.)
export function isabs(s) {
  const h = [...s].slice(0, 3).map((c) => (c === '/' ? '\\' : c));
  return (h[1] === ':' && h[2] === '\\') || (h[0] === '\\' && h[1] === '\\');
}
