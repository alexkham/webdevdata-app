// utils/emulators/python/stdlib/glob/escape.js
//
// Emulator for the glob.escape demo tabs, on the CPython port in
// _pyglob.js (POSIX: no drive part) and the os module's virtual file
// system for the tabs that create files.

import { VFS, glob, escape, pySorted } from './_pyglob.js';
import { join, basename } from '../os-path/_posixpath.js';

const tuple = (...items) => ({ __pyTuple: items });

function demoFs(name) {
  if (typeof name === 'string' && (name.startsWith('/') || name.split('/').includes('..'))) {
    const e = new Error("The demo stays inside the snippet's own temp folder: no absolute paths or '..'.");
    e.name = 'DemoLimit';
    throw e;
  }
  return new VFS();
}

export default {
  // glob.escape(name)
  escape: (name) => escape(name),

  // open(name, 'w', encoding='utf-8').close(); glob.glob(name), glob.glob(glob.escape(name))
  find: (name) => {
    const fs = demoFs(name);
    fs.writeFile(name, 0);
    return tuple(glob(fs, name), glob(fs, escape(name)));
  },

  // os.makedirs(folder); create a.pdf and b.txt in it;
  // sorted(os.path.basename(p) for p in glob.glob(os.path.join(glob.escape(folder), '*.pdf')))
  folder: (folder) => {
    const fs = demoFs(folder);
    fs.makedirs(folder);
    for (const n of ['a.pdf', 'b.txt']) fs.writeFile(join(folder, n), 0);
    return pySorted(glob(fs, join(escape(folder), '*.pdf')).map(basename));
  },
};
