// utils/emulators/python/stdlib/os-path/normpath.js
//
// Emulator for the os.path.normpath demo (posixpath / ntpath ports).

import { normpath as pnorm, tuple } from './_posixpath.js';
import { normpath as nnorm } from './_ntpath.js';

export default {
  norm: (p) => pnorm(p),
  both: (p) => tuple(pnorm(p), nnorm(p)),
};
