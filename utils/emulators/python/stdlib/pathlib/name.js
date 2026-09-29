// utils/emulators/python/stdlib/pathlib/name.js
//
// Emulator for the name / stem / suffix / suffixes demo, on _pypath.js.

import { pure, tuple } from './_pypath.js';

export default {
  // p = PurePosixPath(path); (p.name, p.stem, p.suffix, p.suffixes)
  parts: (path) => {
    const p = pure(path);
    return tuple(p.name, p.stem, p.suffix, p.suffixes);
  },
};
