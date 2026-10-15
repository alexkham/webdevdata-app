// utils/emulators/python/stdlib/shutil/copytree.js
//
// Emulator for the shutil.copytree demo, on the shutil port in
// _pyshutil.js (Lib/shutil.py over the Linux file system of os/_vfs.js).

import { Shutil, seedEmpty, seedNamed, walkFiles, typeName, isinst } from './_pyshutil.js';
import { pySorted } from '../os/_vfs.js';
import { cmpStr } from '../os-path/_posixpath.js';

function cmpList(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    const c = cmpStr(a[i], b[i]);
    if (c) return c;
  }
  return a.length - b.length;
}

export default {
  // shutil.copytree(src, dst); files under dst — or the OSError class name
  tree: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    try {
      sh.copytree(src, dst);
      return walkFiles(sh.fs, dst);
    } catch (e) {
      if (isinst(e, 'OSError')) return typeName(e);
      throw e;
    }
  },

  // files hold their own path; copytree('new', 'site', dirs_exist_ok=True);
  // sorted (posix path, text) of every file under site/
  merge: (files) => {
    const sh = new Shutil();
    seedNamed(sh.fs, files);
    sh.copytree('new', 'site', { dirsExistOk: true });
    return walkFiles(sh.fs, 'site').map((p) => ({ __pyTuple: [p, sh.fs.readText(p)] }));
  },

  // ignore=spy records (path, sorted(names)) then applies ignore_patterns;
  // sorted(calls)
  ignore: (files, patterns) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    const calls = [];
    const inner = Shutil.ignorePatterns(patterns);
    const spy = (path, names) => {
      calls.push([path, pySorted(names)]);
      return inner(path, names);
    };
    sh.copytree('src', 'dst', { ignore: spy });
    calls.sort((a, b) => cmpStr(a[0], b[0]) || cmpList(a[1], b[1]));
    return calls.map((c) => ({ __pyTuple: c }));
  },
};
