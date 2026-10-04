// utils/emulators/python/stdlib/os-path/splitext.js
//
// Emulator for the os.path.splitext demo (genericpath._splitext port).

import { splitext, tuple } from './_posixpath.js';

export default {
  split: (p) => tuple(...splitext(p)),
  change: (p, ext) => splitext(p)[0] + ext,
};
