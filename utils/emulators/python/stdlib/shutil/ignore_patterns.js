// utils/emulators/python/stdlib/shutil/ignore_patterns.js
//
// Emulator for the shutil.ignore_patterns demo: the fnmatch port in
// _fnmatch.js (POSIX: case-sensitive) and copytree from _pyshutil.js.

import { Shutil, seedEmpty, walkFiles } from './_pyshutil.js';
import { pySorted } from '../os/_vfs.js';

export default {
  // sorted(shutil.ignore_patterns(*patterns)('src', names))
  filter: (names, patterns) => pySorted([...Shutil.ignorePatterns(patterns)('src', names)]),

  // copytree('src', 'dst', ignore=ignore_patterns(*patterns)); files under dst
  tree: (files, patterns) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    sh.copytree('src', 'dst', { ignore: Shutil.ignorePatterns(patterns) });
    return walkFiles(sh.fs, 'dst');
  },
};
