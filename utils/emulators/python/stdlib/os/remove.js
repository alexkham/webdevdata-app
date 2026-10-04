// utils/emulators/python/stdlib/os/remove.js
//
// Emulator for the remove / replace / renames demo, on the virtual file
// system in _vfs.js (Linux rename(2) rules; Lib/os.py renames).

import { VFS, seed, pySorted, isOSError } from './_vfs.js';
import { join, split } from '../os-path/_posixpath.js';

export default {
  // os.remove(target); sorted(os.listdir('.')) — or the OSError class name
  remove: (files, target) => {
    const fs = new VFS();
    seed(fs, files);
    try {
      fs.remove(target);
      return pySorted(fs.listdir('.'));
    } catch (e) {
      if (isOSError(e)) return e.name;
      throw e;
    }
  },

  // files hold their own name; os.replace(src, dst); (sorted(listdir('.')), open(dst).read())
  replace: (files, src, dst) => {
    const fs = new VFS();
    for (const f of files) {
      fs.makedirs(split(f)[0] || '.', true);
      fs.writeFile(f, new TextEncoder().encode(f).length, f);
    }
    fs.rename(src, dst);
    const content = fs.readText(dst);
    return { __pyTuple: [pySorted(fs.listdir('.')), content] };
  },

  // os.renames(old, new); every folder and file below '.', as './…'
  renames: (old, nw) => {
    const fs = new VFS();
    fs.makedirs(split(old)[0] || '.', true);
    fs.writeFile(old, 0);
    fs.renames(old, nw);
    const all = [];
    for (const [root, dirs, files] of fs.walk('.')) {
      for (const n of [...dirs, ...files]) all.push(join(root, n));
    }
    return pySorted(all);
  },
};
