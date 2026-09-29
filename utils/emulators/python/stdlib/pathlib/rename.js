// utils/emulators/python/stdlib/pathlib/rename.js
//
// Emulator for the rename / replace demo, on the virtual file system in
// _pypath.js.

import { makePath, VFS, tuple } from './_pypath.js';

export default {
  // Path('draft.txt').write_text('v1'); new = Path('draft.txt').rename(target)
  // (new.as_posix(), Path('draft.txt').exists(), new.read_text())
  rename: (target) => {
    const Path = makePath(new VFS());
    Path('draft.txt').writeText('v1');
    const moved = Path('draft.txt').rename(target);
    return tuple(moved.asPosix(), Path('draft.txt').exists(), moved.readText());
  },
};
