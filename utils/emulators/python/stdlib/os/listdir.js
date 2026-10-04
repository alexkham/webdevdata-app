// utils/emulators/python/stdlib/os/listdir.js
//
// Emulator for the os.listdir / os.scandir demo, on the virtual file
// system in _vfs.js (every template creates its own files first).

import { VFS, seed, pySorted, isOSError } from './_vfs.js';
import { join } from '../os-path/_posixpath.js';
import { cmpStr } from '../os-path/_posixpath.js';

function fresh(files) {
  const fs = new VFS();
  seed(fs, files);
  return fs;
}

export default {
  // sorted(os.listdir(folder)), or the OSError class name
  listdir: (files, folder) => {
    const fs = fresh(files);
    try {
      return pySorted(fs.listdir(folder));
    } catch (e) {
      if (isOSError(e)) return e.name;
      throw e;
    }
  },

  // with os.scandir(folder) as it: sorted((e.name, e.is_dir()) for e in it)
  scandir: (files, folder) => {
    const fs = fresh(files);
    const entries = fs.scandir(folder).map((e) => [e.name, e.isDir]);
    // names are unique, so tuples sort by name
    entries.sort((a, b) => cmpStr(a[0], b[0]));
    return entries.map(([n, d]) => ({ __pyTuple: [n, d] }));
  },

  // sorted(n for n in os.listdir(folder) if os.path.isfile(os.path.join(folder, n)))
  files: (files, folder) => {
    const fs = fresh(files);
    return pySorted(fs.listdir(folder).filter((n) => fs.isfile(join(folder, n))));
  },
};
