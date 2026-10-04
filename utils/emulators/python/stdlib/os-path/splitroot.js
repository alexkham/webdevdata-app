// utils/emulators/python/stdlib/os-path/splitroot.js
//
// Emulator for the os.path.splitroot / splitdrive demo (posixpath and
// ntpath ports; ntpath follows the pure-Python version — the C version
// used on Windows counts UTF-16 units, which only differs for astral
// characters in the first two positions).

import { splitroot as psr, splitdrive as psd, tuple } from './_posixpath.js';
import { splitroot as nsr, splitdrive as nsd } from './_ntpath.js';

export default {
  both: (p) => tuple(tuple(...psr(p)), tuple(...nsr(p))),
  drive: (p) => tuple(tuple(...psd(p)), tuple(...nsd(p))),
};
