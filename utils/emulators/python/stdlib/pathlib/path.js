// utils/emulators/python/stdlib/pathlib/path.js
//
// Emulator for the Path class demo: joining with / and a write/read round
// trip in the (virtual) empty working directory. On _pypath.js.

import { makePath, VFS, tuple } from './_pypath.js';

export default {
  // (Path(base) / child).as_posix()
  join: (base, child) => {
    const Path = makePath(new VFS());
    return Path(base).div(child).asPosix();
  },

  // p = Path(name); p.write_text(text, encoding='utf-8'); (p.name, p.exists(), p.read_text(encoding='utf-8'))
  files: (name, text) => {
    const Path = makePath(new VFS());
    const p = Path(name);
    p.writeText(text);
    return tuple(p.name, p.exists(), p.readText());
  },
};
