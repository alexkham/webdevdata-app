// utils/emulators/python/stdlib/pathlib/joinpath.js
//
// Emulator for the / operator and joinpath() demo, on _pypath.js.

import { pure, py } from './_pypath.js';

export default {
  // PurePosixPath(base) / child
  slash: (base, child) => py(pure(base).div(child)),

  // PurePosixPath(base).joinpath(a, b)
  joinpath: (base, a, b) => py(pure(base).joinpath(a, b)),
};
