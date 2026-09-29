// utils/emulators/python/stdlib/pathlib/is_absolute.js
//
// Emulator for the is_absolute demo, on _pypath.js.

import { pure, tuple } from './_pypath.js';

export default {
  // p = PurePosixPath(path); (p.is_absolute(), p.root)
  absolute: (path) => {
    const p = pure(path);
    return tuple(p.isAbsolute(), p.root);
  },
};
