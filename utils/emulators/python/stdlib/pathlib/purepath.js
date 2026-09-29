// utils/emulators/python/stdlib/pathlib/purepath.js
//
// Emulator for the PurePath / PurePosixPath demo, on _pypath.js.

import { pure, py, tuple } from './_pypath.js';

export default {
  // p = PurePosixPath(text); (p, p.parts)
  normalise: (text) => {
    const p = pure(text);
    return py(tuple(p, tuple(...p.parts)));
  },

  // PurePosixPath(a, b)
  segments: (a, b) => py(pure(a, b)),

  // PurePosixPath(a) == PurePosixPath(b)
  compare: (a, b) => pure(a).equals(pure(b)),
};
