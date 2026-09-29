// utils/emulators/python/stdlib/pathlib/mkdir.js
//
// Emulator for the mkdir / rmdir / unlink / touch demo, on the virtual file
// system in _pypath.js.

import { makePath, VFS, sortPy, tuple } from './_pypath.js';

export default {
  // p.mkdir(parents=True, exist_ok=True) twice; (p.is_dir(), everything under '.')
  nested: (path) => {
    const Path = makePath(new VFS());
    const p = Path(path);
    p.mkdir({ parents: true, existOk: true });
    p.mkdir({ parents: true, existOk: true });
    return tuple(p.isDir(), sortPy(Path('.').rglob('*').map((q) => q.asPosix())));
  },

  // Path('existing').mkdir(); then a plain mkdir() of path → 'created' or
  // the name of the OSError subclass it raised
  plain: (path) => {
    const Path = makePath(new VFS());
    Path('existing').mkdir();
    try {
      Path(path).mkdir();
    } catch (e) {
      if (['FileNotFoundError', 'FileExistsError', 'NotADirectoryError', 'OSError', 'PermissionError'].includes(e.name)) return e.name;
      throw e;
    }
    return 'created';
  },

  // make folder/name, then remove it again: unlink() the file, rmdir() the folder
  cleanup: (folder, name) => {
    const Path = makePath(new VFS());
    const d = Path(folder);
    d.mkdir();
    const f = d.div(name);
    f.touch();
    const before = f.exists();
    f.unlink();
    d.rmdir();
    return tuple(before, f.exists(), d.exists());
  },
};
