// utils/emulators/python/stdlib/pathlib/read_text.js
//
// Emulator for the read_text / write_text demo, on the virtual file system
// in _pypath.js (every demo starts in an empty directory).

import { makePath, VFS, tuple } from './_pypath.js';

export default {
  // p = Path('notes.txt'); n = p.write_text(text, encoding='utf-8'); (n, p.read_text(encoding='utf-8'))
  roundtrip: (text) => {
    const Path = makePath(new VFS());
    const p = Path('notes.txt');
    const n = p.writeText(text);
    return tuple(n, p.readText());
  },

  // Path(name).read_text(encoding='utf-8') in an empty directory
  missing: (name) => {
    const Path = makePath(new VFS());
    return Path(name).readText();
  },
};
