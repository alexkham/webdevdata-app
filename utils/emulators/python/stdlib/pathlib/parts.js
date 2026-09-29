// utils/emulators/python/stdlib/pathlib/parts.js
//
// Emulator for the parts / parent / parents / anchor demo, on _pypath.js.

import { pure, py, tuple } from './_pypath.js';

export default {
  // PurePosixPath(path).parts
  parts: (path) => tuple(...pure(path).parts),

  // p = PurePosixPath(path); (p.parent, list(p.parents))
  parents: (path) => {
    const p = pure(path);
    return py(tuple(p.parent, p.parents));
  },

  // p = PurePosixPath(path); (p.drive, p.root, p.anchor)
  anchor: (path) => {
    const p = pure(path);
    return tuple(p.drive, p.root, p.anchor);
  },
};
