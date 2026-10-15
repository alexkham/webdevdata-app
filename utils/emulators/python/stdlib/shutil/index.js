// utils/emulators/python/stdlib/shutil/index.js
//
// Emulator for the shutil module hub demo: copytree with ignore_patterns,
// make_archive with root_dir, and move — all on the shutil port in
// _pyshutil.js (Lib/shutil.py over the Linux file system of os/_vfs.js).

import { Shutil, seedEmpty, walkFiles } from './_pyshutil.js';
import { pySorted } from '../os/_vfs.js';
import { basename } from '../os-path/_posixpath.js';

export default {
  // shutil.copytree('project', 'backup', ignore=shutil.ignore_patterns(*patterns));
  // every file under backup/, sorted
  backup: (files, patterns) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    sh.copytree('project', 'backup', { ignore: Shutil.ignorePatterns(patterns) });
    return walkFiles(sh.fs, 'backup');
  },

  // name = shutil.make_archive('release', fmt, root_dir='project');
  // (basename(name), sorted namelist() / getnames())
  archive: (files, fmt) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    const name = sh.makeArchive('release', fmt, 'project');
    const members = name.endsWith('.zip') ? pySorted(sh.namelist(name)) : sh.getnames(name);
    return { __pyTuple: [basename(name), members] };
  },

  // shutil.move(src, dst); every file below '.', sorted
  move: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    sh.move(src, dst);
    return walkFiles(sh.fs, '.');
  },
};
