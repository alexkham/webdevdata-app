// utils/emulators/python/stdlib/os-path/isabs.js
//
// Emulator for the os.path.isabs demo: posixpath.isabs and ntpath.isabs
// (3.13 rules — a single leading slash is not absolute on Windows).

import { isabs as pisabs, tuple } from './_posixpath.js';
import { isabs as nisabs } from './_ntpath.js';

export default {
  table: (paths) => paths.map((p) => tuple(p, pisabs(p), nisabs(p))),
};
