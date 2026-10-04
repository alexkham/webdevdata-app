// utils/emulators/python/stdlib/os/walk.js
//
// Emulator for the os.walk demo, on the virtual file system in _vfs.js.
// VFS.walk mirrors Lib/os.py: topdown yields a folder before descending
// into the (possibly edited) dirs list.

import { VFS, seed, pySorted } from './_vfs.js';
import { join } from '../os-path/_posixpath.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // for root, dirs, files in os.walk('.'): dirs.sort(); tree.append((root, dirs, sorted(files)))
  tree: (files) => {
    const fs = new VFS();
    seed(fs, files);
    const tree = [];
    for (const [root, dirs, names] of fs.walk('.')) {
      const sorted = pySorted(dirs);
      dirs.splice(0, dirs.length, ...sorted);
      tree.push(tuple(root, dirs, pySorted(names)));
    }
    return tree;
  },

  // dirs[:] = sorted(d for d in dirs if d != skip); found += [join(root, f) for f in sorted(files)]
  prune: (files, skip) => {
    const fs = new VFS();
    seed(fs, files);
    const found = [];
    for (const [root, dirs, names] of fs.walk('.')) {
      const kept = pySorted(dirs.filter((d) => d !== skip));
      dirs.splice(0, dirs.length, ...kept);
      for (const f of pySorted(names)) found.push(join(root, f));
    }
    return found;
  },
};
