// utils/emulators/python/stdlib/os-path/split.js
//
// Emulator for the os.path.split demo (posixpath / ntpath ports).

import { split as psplit, tuple } from './_posixpath.js';
import { split as nsplit } from './_ntpath.js';

export default {
  split: (p) => tuple(...psplit(p)),
  both: (p) => tuple(tuple(...psplit(p)), tuple(...nsplit(p))),
};
