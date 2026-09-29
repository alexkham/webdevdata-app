// utils/emulators/python/stdlib/pathlib/glob.js
//
// Emulator for the glob / rglob / walk demo, on the virtual file system and
// the glob._Globber port in _pypath.js.

import { makePath, VFS, seedFiles, sortPy, tuple } from './_pypath.js';

function tree(files) {
  const Path = makePath(new VFS());
  seedFiles(Path, files);
  return Path;
}

export default {
  glob: (files, pattern) => sortPy(tree(files)('.').glob(pattern).map((p) => p.asPosix())),
  rglob: (files, pattern) => sortPy(tree(files)('.').rglob(pattern).map((p) => p.asPosix())),

  // sorted((d.as_posix(), sorted(dirs), sorted(names)) for d, dirs, names in Path('.').walk())
  walk: (files) => {
    const rows = tree(files)('.').walk().map(([d, dirs, names]) => [d.asPosix(), sortPy(dirs), sortPy(names)]);
    return sortPy(rows, (r) => r[0]).map((r) => tuple(...r));
  },
};
