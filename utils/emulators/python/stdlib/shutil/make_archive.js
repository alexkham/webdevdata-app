// utils/emulators/python/stdlib/shutil/make_archive.js
//
// Emulator for the shutil.make_archive demo: _make_zipfile / _make_tarball
// ported in _pyshutil.js over the Linux file system of os/_vfs.js. The
// archive is never bytes — its member list is what namelist() / getnames()
// read back (zip: sorted here, as in the snippet; tar: TarFile.add order).

import { Shutil, seedEmpty } from './_pyshutil.js';
import { pySorted } from '../os/_vfs.js';

function members(sh, name) {
  return name.endsWith('.zip') ? pySorted(sh.namelist(name)) : sh.getnames(name);
}

export default {
  // site/index.html + site/css/main.css; make_archive('out', 'zip', root_dir, base_dir)
  dirs: (root, base) => {
    const sh = new Shutil();
    sh.fs.makedirs('site/css');
    sh.fs.writeText('site/index.html', '');
    sh.fs.writeText('site/css/main.css', '');
    const name = sh.makeArchive('out', 'zip', root, base);
    return pySorted(sh.namelist(name));
  },

  // make_archive('dist/app', fmt, base_dir='project'); (name, members)
  formats: (files, fmt) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    const name = sh.makeArchive('dist/app', fmt, null, 'project');
    return { __pyTuple: [name, members(sh, name)] };
  },
};
